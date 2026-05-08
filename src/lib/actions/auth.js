'use server';

import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import { signupSchema, loginSchema } from '@/lib/validations';
import { createSession, deleteSession } from '@/lib/session';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signup(data) {
  const validated = signupSchema.safeParse(data);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  const { name, email, password, role } = validated.data;

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        errors: { email: ['Email is already registered'] },
        message: 'An account with this email already exists.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role });

    const user = await User.findOne({ email });
    await createSession(user._id.toString(), user.role, {
      reliabilityScore: user.reliabilityScore || 0,
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Signup error:', error);
    return { message: 'An error occurred during signup. Please try again.' };
  }

  redirect(role === 'student' ? '/student/dashboard' : '/client/dashboard');
}

export async function login(data) {
  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  const { email, password } = validated.data;
  let loginRole;

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { message: 'Invalid email or password.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Use the same generic message to avoid revealing whether the email exists
      return { message: 'Invalid email or password.' };
    }

    loginRole = user.role;
    await createSession(user._id.toString(), user.role, {
      reliabilityScore: user.reliabilityScore || 0,
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'An error occurred during login. Please try again.' };
  }

  redirect(loginRole === 'student' ? '/student/dashboard' : '/client/dashboard');
}

export async function logout() {
  await deleteSession();
  revalidatePath('/');
  redirect('/');
}
