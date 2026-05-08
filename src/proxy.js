import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = secretKey ? new TextEncoder().encode(secretKey) : null;

const protectedPrefixes = ['/student', '/client'];
const publicRoutes = ['/', '/login', '/register'];

async function decryptSession(token) {
  if (!token || !encodedKey) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  const isProtected = protectedPrefixes.some((p) => path.startsWith(p));
  const isPublic = publicRoutes.includes(path);

  const cookie = request.cookies.get('session')?.value;
  const session = await decryptSession(cookie);

  if (isProtected && !session?.userId) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && session?.userId && path !== '/') {
    const role = session.role;
    if (role === 'student') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/client/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
