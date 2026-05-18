import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isBanned: true,
      rating: true,
      totalReviews: true,
      createdAt: true,
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(users);
}