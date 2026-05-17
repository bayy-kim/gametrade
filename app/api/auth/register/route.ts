import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });

    const token = signToken({ id: user.id, username: user.username, role: user.role });
    const response = NextResponse.json({ ok: true });

    // Perbaikan kunci: secure: true + sameSite
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      secure: true,        // <-- WAJIB untuk HTTPS Vercel
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Email/username sudah dipakai' },
      { status: 400 }
    );
  }
}