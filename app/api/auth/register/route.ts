import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signToken } from '@/lib/auth';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { username, email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, email, password: hash },
    });
    const token = signToken({ id: user.id, username: user.username, role: user.role });
    const response = NextResponse.json({ ok: true });
    response.cookies.set('token', token, { httpOnly: true, path: '/' });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Email/username sudah dipakai' }, { status: 400 });
  }
}