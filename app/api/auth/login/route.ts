import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signToken } from '@/lib/auth';

const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
  }
  const token = signToken({ id: user.id, username: user.username, role: user.role });
  const response = NextResponse.json({ ok: true });
  response.cookies.set('token', token, {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',      // <- tambahkan ini
  secure: true,         // <- karena localhost tidak HTTPS
  maxAge: 60 * 60 * 24 * 7, // 7 hari
});
}