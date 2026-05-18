import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { usernameOrEmail, password } = await req.json();

  if (!usernameOrEmail || !password) {
    return NextResponse.json(
      { error: 'Username/email dan password wajib diisi' },
      { status: 400 }
    );
  }

  // Cari user berdasarkan username ATAU email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: usernameOrEmail },
        { username: usernameOrEmail },
      ],
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: 'Username/email atau password salah' },
      { status: 401 }
    );
  }

  const token = signToken({ id: user.id, username: user.username, role: user.role });

  const response = NextResponse.json({ ok: true });

  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}