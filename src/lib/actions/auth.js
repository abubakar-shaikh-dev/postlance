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
  let targetRole = role;

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // Check if user already has this role
      const userRoles = existingUser.roles || [existingUser.role];
      if (userRoles.includes(role)) {
        return {
          errors: { email: ['Email is already registered with this role'] },
          message: 'An account with this email and role already exists. Please sign in instead.',
        };
      }

      // Verify password matches existing account before adding role
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (!passwordMatch) {
        return {
          errors: { password: ['Password does not match your existing account'] },
          message: 'This email is registered with a different role. Please enter your existing password to add this role to your account.',
        };
      }

      // Add the new role to the existing user
      const userRolesPlain = userRoles.map(r => String(r));
      const updatedRoles = [...new Set([...userRolesPlain, role])];
      existingUser.roles = updatedRoles;
      existingUser.role = role; // Switch to the newly registered role
      existingUser.updatedAt = new Date();
      await existingUser.save();

      await createSession(existingUser._id.toString(), role, {
        reliabilityScore: existingUser.reliabilityScore || 0,
        roles: updatedRoles,
      });
      revalidatePath('/');
    } else {
      // Brand new user
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        roles: [role],
      });

      const user = await User.findOne({ email });
      await createSession(user._id.toString(), user.role, {
        reliabilityScore: user.reliabilityScore || 0,
        roles: user.roles ? user.roles.map(r => String(r)) : [user.role],
      });
      revalidatePath('/');
    }
  } catch (error) {
    console.error('Signup error details:', error);
    return { message: `Error: ${error.message}` };
  }

  redirect(targetRole === 'student' ? '/student/dashboard' : '/client/dashboard');
}

export async function login(data) {
  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    };
  }

  const { email, password, role: selectedRole } = validated.data;
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

    const userRoles = user.roles ? user.roles.map(r => String(r)) : [user.role];

    // If a specific role was selected and user has it, use that role
    if (selectedRole && userRoles.includes(selectedRole)) {
      loginRole = selectedRole;
      user.role = selectedRole;
      user.updatedAt = new Date();
      await user.save();
    } else if (selectedRole && !userRoles.includes(selectedRole)) {
      return {
        message: `Your account is not registered as a ${selectedRole}. You can register for this role on the sign-up page.`,
      };
    } else {
      loginRole = user.role;
    }

    await createSession(user._id.toString(), loginRole, {
      reliabilityScore: user.reliabilityScore || 0,
      roles: userRoles,
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Login error details:', error);
    return { message: `Error: ${error.message}` };
  }

  redirect(loginRole === 'student' ? '/student/dashboard' : '/client/dashboard');
}

export async function switchRole(newRole) {
  const { verifySession } = await import('@/lib/dal');
  const session = await verifySession();

  try {
    await connectDB();
    const user = await User.findById(session.userId);
    if (!user) {
      return { message: 'User not found.' };
    }

    const userRoles = user.roles ? user.roles.map(r => String(r)) : [user.role];
    if (!userRoles.includes(newRole)) {
      return { message: `Your account does not have the ${newRole} role.` };
    }

    user.role = newRole;
    user.updatedAt = new Date();
    await user.save();

    await createSession(user._id.toString(), newRole, {
      reliabilityScore: user.reliabilityScore || 0,
      roles: userRoles,
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Switch role error:', error);
    return { message: 'Failed to switch role.' };
  }

  redirect(newRole === 'student' ? '/student/dashboard' : '/client/dashboard');
}

export async function logout() {
  await deleteSession();
  revalidatePath('/');
  redirect('/');
}
