'use server';

import { connectDB } from '@/lib/db';
import Project from '@/lib/models/Project';
import Proposal from '@/lib/models/Proposal';
import User from '@/lib/models/User'; // Required for populate('clientId')
import { verifySession } from '@/lib/dal';
import { projectSchema, editProjectSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { notifyProjectStatusChanged } from '@/lib/sms';

export async function createProject(data) {
  const session = await verifySession();

  if (session.role !== 'client') {
    return { message: 'Only clients can create projects.' };
  }

  const validated = projectSchema.safeParse({
    title: data.title,
    description: data.description,
    skillsRequired: data.skillsRequired || [],
    budget: data.budget,
    deadline: data.deadline,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  let projectId;

  try {
    await connectDB();
    const project = await Project.create({
      clientId: session.userId,
      ...validated.data,
    });
    projectId = project._id.toString();
    revalidatePath('/client/dashboard');
    revalidatePath('/projects');
  } catch (error) {
    console.error('Create project error:', error);
    return { message: 'Failed to create project.' };
  }

  redirect(`/projects/${projectId}`);
}

export async function getProjects(filters = {}) {
  await connectDB();
  const query = {};

  if (filters.status) {
    query.status = filters.status;
    // When browsing open projects, exclude those past their deadline
    if (filters.status === 'open') {
      query.deadline = { $gte: new Date() };
    }
  }
  if (filters.skills?.length) {
    query.skillsRequired = { $in: filters.skills };
  }
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const projects = await Project.find(query)
    .populate('clientId', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectById(projectId) {
  await connectDB();
  const project = await Project.findById(projectId)
    .populate('clientId', 'name avatar')
    .lean();

  if (!project) return null;
  return JSON.parse(JSON.stringify(project));
}

export async function updateProjectStatus(projectId, newStatus) {
  const session = await verifySession();

  await connectDB();
  const project = await Project.findById(projectId);

  if (!project) throw new Error('Project not found');
  if (project.clientId.toString() !== session.userId) {
    throw new Error('Not authorized');
  }

  // Guard: prevent cancelling projects where money has already been paid
  if (newStatus === 'cancelled' && (project.paidAmount || 0) > 0) {
    throw new Error(
      `Cannot cancel this project. ₹${project.paidAmount.toLocaleString()} has already been paid to the student. Please contact support if you need a refund.`
    );
  }

  // Guard: only allow completing projects that are fully paid
  if (newStatus === 'completed' && project.agreedAmount != null) {
    const remaining = project.agreedAmount - (project.paidAmount || 0);
    if (remaining > 0) {
      throw new Error(
        `Cannot mark as completed. ₹${remaining.toLocaleString()} is still unpaid. Send the remaining payment from your wallet first.`
      );
    }
  }

  project.status = newStatus;
  project.updatedAt = new Date();
  await project.save();

  // If the project is no longer open, auto-reject any pending proposals
  if (newStatus !== 'open') {
    await Proposal.updateMany(
      {
        projectId: project._id,
        status: 'pending',
      },
      { $set: { status: 'rejected', updatedAt: new Date() } }
    );
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/client/dashboard');
  revalidatePath('/student/dashboard');
  revalidatePath('/projects');
  revalidatePath('/client/wallet');

  // Notify hired student if project status changed and there is a hired student
  if (project.hiredStudentId) {
    const student = await User.findById(project.hiredStudentId).select('phone name');
    if (student?.phone) {
      const label = { open: 'Open', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' };
      await notifyProjectStatusChanged(student.phone, student.name, project.title, label[newStatus] || newStatus);
    }
  }
}

export async function updateProject(projectId, data) {
  const session = await verifySession();
  
  if (session.role !== 'client') {
    return { message: 'Only clients can update projects.' };
  }

  const validated = editProjectSchema.safeParse({
    title: data.title,
    description: data.description,
    skillsRequired: data.skillsRequired || [],
    budget: data.budget,
    deadline: data.deadline,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  let updatedProjectId;

  try {
    await connectDB();
    const project = await Project.findById(projectId);
    
    if (!project) return { message: 'Project not found' };
    if (project.clientId.toString() !== session.userId) {
      return { message: 'Not authorized' };
    }
    
    if (project.status !== 'open') {
      return { message: 'Only open projects can be edited.' };
    }

    Object.assign(project, validated.data);
    project.updatedAt = new Date();
    await project.save();

    updatedProjectId = project._id.toString();
    revalidatePath(`/projects/${projectId}`);
    revalidatePath('/client/dashboard');
    revalidatePath('/projects');
  } catch (error) {
    console.error('Update project error:', error);
    return { message: 'Failed to update project.' };
  }
  
  redirect(`/projects/${updatedProjectId}`);
}

export async function deleteProject(projectId) {
  const session = await verifySession();

  if (session.role !== 'client') {
    throw new Error('Only clients can delete projects.');
  }

  let deleted = false;
  
  try {
    await connectDB();
    const project = await Project.findById(projectId);
    
    if (!project) throw new Error('Project not found');
    if (project.clientId.toString() !== session.userId) {
      throw new Error('Not authorized');
    }
    
    if (project.status === 'in_progress' || project.status === 'completed') {
       throw new Error(`Cannot delete a project that is ${project.status}`);
    }

    await Project.findByIdAndDelete(projectId);
    
    // Also remove related proposals
    await Proposal.deleteMany({ projectId });
    
    deleted = true;
  } catch (error) {
    console.error('Delete project error:', error);
    throw new Error(error.message || 'Failed to delete project.');
  }
  
  if (deleted) {
    revalidatePath('/client/dashboard');
    revalidatePath('/projects');
    redirect('/client/dashboard');
  }
}
