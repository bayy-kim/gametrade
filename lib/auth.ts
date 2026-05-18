import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia123';

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;

  // Cek apakah user dibanned
  const user = await prisma.user.findUnique({
    where: { id: (payload as any).id },
    select: { isBanned: true },
  });
  if (!user || user.isBanned) return null;

  return payload;
}