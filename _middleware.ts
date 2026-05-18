import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = token ? verifyToken(token) : null;

  // Halaman yang hanya bisa diakses kalau belum login
  const guestPaths = ['/login', '/register'];
  if (user && guestPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Halaman yang wajib login
  const protectedPaths = ['/post', '/profile', '/chat', '/transactions', '/dashboard', '/my-posts', '/admin'];
  if (!user && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/post', '/profile', '/chat', '/transactions'],
};