'use server';

import { connectDB } from '@/lib/db';
import Wallet from '@/lib/models/Wallet';
import Project from '@/lib/models/Project';
import User from '@/lib/models/User';
import { verifySession } from '@/lib/dal';
import { revalidatePath } from 'next/cache';
import { notifyPaymentReceived, notifyWalletToppedUp } from '@/lib/whatsapp';

async function getOrCreateWallet(userId) {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
  }
  return wallet;
}

export async function getWallet() {
  const session = await verifySession();
  await connectDB();

  const wallet = await getOrCreateWallet(session.userId);
  return JSON.parse(JSON.stringify(wallet));
}

export async function topUpWallet(amount) {
  const session = await verifySession();
  if (session.role !== 'client') {
    return { success: false, message: 'Only clients can top up.' };
  }

  const parsed = Number(amount);
  if (!parsed || parsed <= 0) {
    return { success: false, message: 'Enter a valid amount.' };
  }

  await connectDB();

  const wallet = await getOrCreateWallet(session.userId);
  wallet.balance += parsed;
  wallet.transactions.push({
    type: 'credit',
    amount: parsed,
    description: 'Wallet top-up (mock)',
  });
  wallet.updatedAt = new Date();
  await wallet.save();

  revalidatePath('/client/wallet');

  // Fire-and-forget: confirm top-up via WhatsApp
  const client = await User.findById(session.userId).select('phone name');
  if (client?.phone) {
    await notifyWalletToppedUp(client.phone, client.name, parsed);
  }

  return { success: true, message: `₹${parsed} added to wallet.` };
}

export async function sendMoney({ studentId, amount, projectId }) {
  const session = await verifySession();
  if (session.role !== 'client') {
    return { success: false, message: 'Only clients can send money.' };
  }

  const parsed = Math.round(Number(amount));
  if (!parsed || parsed <= 0) {
    return { success: false, message: 'Enter a valid amount.' };
  }

  await connectDB();

  // Validate project exists and belongs to this client
  const project = await Project.findById(projectId);
  if (!project) {
    return { success: false, message: 'Project not found.' };
  }
  if (project.clientId.toString() !== session.userId) {
    return { success: false, message: 'Not your project.' };
  }
  if (!project.agreedAmount) {
    return { success: false, message: 'No agreed amount set for this project. Hire a student first.' };
  }
  if (project.hiredStudentId?.toString() !== studentId) {
    return { success: false, message: 'That student is not hired for this project.' };
  }
  if (project.status !== 'in_progress') {
    return { success: false, message: 'Can only pay for projects that are in progress.' };
  }

  // Validate payment doesn't exceed agreed amount
  const remaining = project.agreedAmount - (project.paidAmount || 0);
  if (parsed > remaining) {
    return { success: false, message: `Amount exceeds remaining ₹${remaining.toLocaleString()}.` };
  }

  // Validate wallet balance — use atomic $inc to prevent race conditions
  const clientWallet = await getOrCreateWallet(session.userId);
  if (clientWallet.balance < parsed) {
    return { success: false, message: 'Insufficient wallet balance. Top up first.' };
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    return { success: false, message: 'Student not found.' };
  }

  const client = await User.findById(session.userId);
  const clientName = client?.name || 'Client';

  // Phase 1: Atomically debit client wallet
  const debitResult = await Wallet.findOneAndUpdate(
    { userId: session.userId, balance: { $gte: parsed } },
    {
      $inc: { balance: -parsed },
      $push: {
        transactions: {
          type: 'debit',
          amount: parsed,
          description: `Payment for "${project.title}" to ${student.name}`,
          relatedUserId: studentId,
          projectId,
          createdAt: new Date(),
        },
      },
      $set: { updatedAt: new Date() },
    },
    { new: true }
  );

  if (!debitResult) {
    return { success: false, message: 'Insufficient wallet balance. Top up first.' };
  }

  // Phase 2: Credit student wallet
  try {
    await Wallet.findOneAndUpdate(
      { userId: studentId },
      {
        $inc: { balance: parsed },
        $push: {
          transactions: {
            type: 'credit',
            amount: parsed,
            description: `Payment from ${clientName} for "${project.title}"`,
            relatedUserId: session.userId,
            projectId,
            createdAt: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );
  } catch (err) {
    // Rollback: refund client
    console.error('Failed to credit student wallet, rolling back:', err);
    await Wallet.findOneAndUpdate(
      { userId: session.userId },
      {
        $inc: { balance: parsed },
        $push: {
          transactions: {
            type: 'credit',
            amount: parsed,
            description: `Refund — failed payment for "${project.title}"`,
            relatedUserId: studentId,
            projectId,
            createdAt: new Date(),
          },
        },
        $set: { updatedAt: new Date() },
      }
    );
    return { success: false, message: 'Payment failed. Your balance has been restored.' };
  }

  // Phase 3: Update project paid amount (atomic $inc)
  const newPaidAmount = (project.paidAmount || 0) + parsed;
  const isFullyPaid = newPaidAmount >= project.agreedAmount && project.status === 'in_progress';

  await Project.findByIdAndUpdate(projectId, {
    $set: {
      paidAmount: newPaidAmount,
      updatedAt: new Date(),
      ...(isFullyPaid ? { status: 'completed' } : {}),
    },
  });

  revalidatePath('/client/wallet');
  revalidatePath('/student/wallet');
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/client/dashboard');
  revalidatePath('/student/dashboard');

  const finalRemaining = project.agreedAmount - newPaidAmount;

  // Fire-and-forget: notify the student via WhatsApp
  if (student.phone) {
    await notifyPaymentReceived(student.phone, student.name, parsed, project.title);
  }

  return {
    success: true,
    message: `₹${parsed.toLocaleString()} sent to ${student.name}.${finalRemaining <= 0 ? ' Project marked as completed.' : ` ₹${finalRemaining.toLocaleString()} remaining.`}`,
  };
}

export async function withdrawMoney(amount) {
  const session = await verifySession();
  if (session.role !== 'student') {
    return { success: false, message: 'Only students can withdraw.' };
  }

  const parsed = Number(amount);
  if (!parsed || parsed <= 0) {
    return { success: false, message: 'Enter a valid amount.' };
  }

  await connectDB();

  const wallet = await getOrCreateWallet(session.userId);
  if (wallet.balance < parsed) {
    return { success: false, message: 'Insufficient balance.' };
  }

  wallet.balance -= parsed;
  wallet.transactions.push({
    type: 'debit',
    amount: parsed,
    description: 'Withdrawal (mock)',
  });
  wallet.updatedAt = new Date();
  await wallet.save();

  revalidatePath('/student/wallet');
  return { success: true, message: `₹${parsed} withdrawn successfully.` };
}

export async function getClientProjectsForPayment() {
  const session = await verifySession();
  if (session.role !== 'client') return [];

  await connectDB();

  const projects = await Project.find({
    clientId: session.userId,
    status: { $in: ['in_progress', 'completed'] },
    hiredStudentId: { $ne: null },
    agreedAmount: { $ne: null },
  })
    .populate('hiredStudentId', 'name email')
    .sort({ updatedAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export async function getStudents() {
  const session = await verifySession();
  if (session.role !== 'client') return [];

  await connectDB();
  const students = await User.find({ role: 'student' })
    .select('name email')
    .sort({ name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(students));
}
