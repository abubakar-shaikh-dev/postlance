'use server';

import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { verifySession } from '@/lib/dal';
import { profileSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data) {
  const session = await verifySession();

  const validated = profileSchema.safeParse({
    name: data.name,
    bio: data.bio || undefined,
    skills: data.skills || [],
    education: data.education || undefined,
    university: data.university || undefined,
    portfolioLinks: data.portfolioLinks || [],
    phone: data.phone != null ? String(data.phone).trim() : undefined,
  });

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  try {
    await connectDB();
    await User.findByIdAndUpdate(session.userId, {
      ...validated.data,
      updatedAt: new Date(),
    });

    revalidatePath('/student/profile');
    revalidatePath('/student/profile/edit');
    revalidatePath('/student/dashboard');
    revalidatePath('/client/profile');
    revalidatePath('/client/profile/edit');
    revalidatePath('/client/dashboard');
    return { success: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Profile update error:', error);
    return { message: 'Failed to update profile.' };
  }
}

export async function getProfile() {
  const session = await verifySession();
  await connectDB();
  const user = await User.findById(session.userId).select('-password');
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}
