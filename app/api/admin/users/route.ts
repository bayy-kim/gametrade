import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
      rating: true,
      createdAt: true,
      _count: { select: { accounts: true, transactions: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}