'use server';

import { connectDB } from '@/lib/db';
import Invitation from '@/lib/models/Invitation';
import Proposal from '@/lib/models/Proposal';
import Project from '@/lib/models/Project';
import User from '@/lib/models/User';
import { verifySession } from '@/lib/dal';
import { revalidatePath } from 'next/cache';
import { notifyInvitationReceived } from '@/lib/sms';

export async function inviteStudent({ studentId, projectId, message }) {
  const session = await verifySession();
  if (session.role !== 'client') {
    return { success: false, message: 'Only clients can send invitations.' };
  }

  await connectDB();

  const project = await Project.findById(projectId);
  if (!project || project.clientId.toString() !== session.userId) {
    return { success: false, message: 'Project not found.' };
  }
  if (project.status !== 'open') {
    return { success: false, message: 'Project is no longer accepting proposals.' };
  }

  const student = await User.findById(studentId);
  if (!student || student.role !== 'student') {
    return { success: false, message: 'Student not found.' };
  }

  const existing = await Invitation.findOne({ projectId, studentId });
  if (existing) {
    return { success: false, message: 'Student already invited to this project.' };
  }

  await Invitation.create({
    projectId,
    clientId: session.userId,
    studentId,
    message: message || '',
  });

  revalidatePath('/find-talent');
  revalidatePath('/student/invitations');
  revalidatePath('/student/dashboard');

  // Fire-and-forget: notify the student via WhatsApp
  const client = await User.findById(session.userId).select('name');
  if (student.phone) {
    await notifyInvitationReceived(student.phone, student.name, client?.name || 'A client', project.title);
  }

  return { success: true, message: `Invitation sent to ${student.name}.` };
}

export async function getStudentInvitations() {
  const session = await verifySession();
  if (session.role !== 'student') return [];

  await connectDB();

  const invitations = await Invitation.find({ studentId: session.userId })
    .populate('projectId', 'title budget status deadline skillsRequired')
    .populate('clientId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(invitations));
}

export async function respondToInvitation(invitationId, status) {
  const session = await verifySession();
  if (session.role !== 'student') {
    return { success: false, message: 'Only students can respond.' };
  }

  await connectDB();

  const invitation = await Invitation.findById(invitationId);
  if (!invitation) {
    return { success: false, message: 'Invitation not found.' };
  }
  if (invitation.studentId.toString() !== session.userId) {
    return { success: false, message: 'Not authorized.' };
  }
  if (invitation.status !== 'pending') {
    return { success: false, message: 'Already responded.' };
  }

  invitation.status = status;
  invitation.updatedAt = new Date();
  await invitation.save();

  if (status === 'accepted') {
    // Check if student already applied
    const existing = await Proposal.findOne({
      projectId: invitation.projectId,
      studentId: session.userId,
    });
    if (!existing) {
      const project = await Project.findById(invitation.projectId);
      if (project && project.status === 'open') {
        await Proposal.create({
          projectId: invitation.projectId,
          studentId: session.userId,
          coverLetter: invitation.message
            ? `Invited by client: ${invitation.message}`
            : 'Invited by client to apply.',
          proposedBudget: project.budget,
          estimatedDuration: '',
        });
      }
    }
  }

  revalidatePath('/student/invitations');
  revalidatePath('/student/dashboard');

  return {
    success: true,
    message: status === 'accepted' ? 'Invitation accepted. Proposal submitted.' : 'Invitation declined.',
  };
}

export async function getInvitationCount() {
  const session = await verifySession();
  if (session.role !== 'student') return 0;

  await connectDB();
  return Invitation.countDocuments({ studentId: session.userId, status: 'pending' });
}

export async function getClientOpenProjects() {
  const session = await verifySession();
  if (session.role !== 'client') return [];

  await connectDB();
  const projects = await Project.find({ clientId: session.userId, status: 'open' })
    .select('title budget deadline')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export async function getStudentsForDiscovery(search = '', skill = '') {
  const session = await verifySession();
  if (!session) return [];

  await connectDB();

  const query = { role: 'student' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { bio: { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  if (skill) {
    query.skills = { $in: [new RegExp(skill, 'i')] };
  }

  const students = await User.find(query)
    .select('name email bio skills education reliabilityScore avatar createdAt')
    .sort({ reliabilityScore: -1 })
    .lean();

  return JSON.parse(JSON.stringify(students));
}
