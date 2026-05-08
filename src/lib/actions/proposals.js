'use server';

import { connectDB } from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import Project from '@/lib/models/Project';
import User from '@/lib/models/User'; // Required for populate('studentId')
import { verifySession } from '@/lib/dal';
import { proposalSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { notifyProposalAccepted, notifyProposalDeclined, notifyNewProposal } from '@/lib/whatsapp';

export async function submitProposal(data) {
  const session = await verifySession();

  if (session.role !== 'student') {
    return { message: 'Only students can submit proposals.' };
  }

  const validated = proposalSchema.safeParse({
    coverLetter: data.coverLetter,
    proposedBudget: data.proposedBudget,
    estimatedDuration: data.estimatedDuration || undefined,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  try {
    await connectDB();

    const existing = await Proposal.findOne({
      projectId: data.projectId,
      studentId: session.userId,
    });
    if (existing) {
      return { message: 'You have already applied to this project.' };
    }

    const project = await Project.findById(data.projectId);
    if (!project || project.status !== 'open') {
      return { message: 'This project is no longer accepting proposals.' };
    }

    // Block proposals on projects whose deadline has already passed
    if (new Date(project.deadline) < new Date()) {
      return { message: 'This project\'s deadline has passed.' };
    }

    await Proposal.create({
      projectId: data.projectId,
      studentId: session.userId,
      ...validated.data,
    });

    revalidatePath(`/projects/${data.projectId}`);

    // Fire-and-forget: notify the project owner via WhatsApp
    const [client, student] = await Promise.all([
      User.findById(project.clientId).select('phone name'),
      User.findById(session.userId).select('name'),
    ]);
    if (client?.phone) {
      notifyNewProposal(client.phone, client.name, project.title);
    }

    return { success: true, message: 'Proposal submitted successfully!' };
  } catch (error) {
    console.error('Submit proposal error:', error);
    // Handle MongoDB duplicate key error (student already applied)
    if (error.code === 11000) {
      return { message: 'You have already applied to this project.' };
    }
    return { message: 'Failed to submit proposal.' };
  }
}

export async function getProposalsForProject(projectId) {
  const session = await verifySession();

  await connectDB();
  const project = await Project.findById(projectId);
  if (!project || project.clientId.toString() !== session.userId) {
    return [];
  }

  const proposals = await Proposal.find({ projectId })
    .populate('studentId', 'name email skills reliabilityScore avatar bio')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(proposals));
}

export async function getStudentProposals() {
  const session = await verifySession();

  await connectDB();
  const proposals = await Proposal.find({ studentId: session.userId })
    .populate('projectId', 'title budget status')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(proposals));
}

export async function reviewProposal(proposalId, status) {
  const session = await verifySession();

  await connectDB();
  const proposal = await Proposal.findById(proposalId).populate('projectId');

  if (!proposal) return { message: 'Proposal not found.' };
  if (proposal.projectId.clientId.toString() !== session.userId) {
    return { message: 'Not authorized.' };
  }
  if (proposal.projectId.status !== 'open') {
    return { message: 'This project is no longer open.' };
  }
  if (proposal.status !== 'pending') {
    return { message: 'This proposal has already been reviewed.' };
  }

  proposal.status = status;
  proposal.updatedAt = new Date();
  await proposal.save();

  if (status === 'accepted') {
    // Move project to in_progress and record the agreed terms
    proposal.projectId.status = 'in_progress';
    proposal.projectId.hiredStudentId = proposal.studentId;
    proposal.projectId.agreedAmount = proposal.proposedBudget;
    proposal.projectId.paidAmount = 0;
    proposal.projectId.updatedAt = new Date();
    await proposal.projectId.save();

    // Auto-reject all other pending proposals for this project
    await Proposal.updateMany(
      {
        projectId: proposal.projectId._id,
        _id: { $ne: proposal._id },
        status: 'pending',
      },
      { $set: { status: 'rejected', updatedAt: new Date() } }
    );
  }

  revalidatePath(`/projects/${proposal.projectId._id}`);
  revalidatePath(`/projects/${proposal.projectId._id}/evaluations`);
  revalidatePath('/client/dashboard');
  revalidatePath('/client/wallet');
  revalidatePath('/student/dashboard');
  revalidatePath('/student/wallet');
  revalidatePath('/projects');

  // Fire-and-forget: notify the student via WhatsApp
  const studentUser = await User.findById(proposal.studentId).select('phone name');
  if (studentUser?.phone) {
    const projectTitle = proposal.projectId.title;
    if (status === 'accepted') {
      notifyProposalAccepted(studentUser.phone, studentUser.name, projectTitle);
    } else {
      notifyProposalDeclined(studentUser.phone, studentUser.name, projectTitle);
    }
  }

  const statusLabel = status === 'accepted' ? 'accepted' : 'declined';
  return { success: true, message: `Proposal ${statusLabel} successfully.` };
}
