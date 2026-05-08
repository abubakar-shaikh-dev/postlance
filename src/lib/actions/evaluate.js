'use server';

import { connectDB } from '@/lib/db';
import Proposal from '@/lib/models/Proposal';
import Project from '@/lib/models/Project';
import User from '@/lib/models/User';
import { verifySession } from '@/lib/dal';
import { evaluateProposal } from '@/lib/ai';
import { revalidatePath } from 'next/cache';

export async function evaluateProposals(data) {
  const session = await verifySession();

  await connectDB();

  const projectId = data.projectId || data;
  const project = await Project.findById(projectId);
  if (!project || project.clientId.toString() !== session.userId) {
    return { message: 'Not authorized' };
  }

  const proposals = await Proposal.find({ projectId, status: 'pending' });

  for (const proposal of proposals) {
    const student = await User.findById(proposal.studentId);
    if (!student) continue;

    const evaluation = await evaluateProposal({
      studentProfile: student,
      project,
      proposal,
    });

    await Proposal.findByIdAndUpdate(proposal._id, {
      aiScore: evaluation.overallScore,
      aiEvaluation: evaluation,
      updatedAt: new Date(),
    });
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/projects/${projectId}/evaluations`);

  return { success: true, message: `Evaluated ${proposals.length} proposals` };
}

export async function getEvaluations(projectId) {
  const session = await verifySession();

  await connectDB();
  const project = await Project.findById(projectId);
  if (!project || project.clientId.toString() !== session.userId) {
    return [];
  }

  const proposals = await Proposal.find({ projectId })
    .populate('studentId', 'name skills reliabilityScore avatar bio education')
    .sort({ 'aiEvaluation.overallScore': -1 })
    .lean();

  return JSON.parse(JSON.stringify(proposals));
}
