import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (user as any).id;

  const [totalPosts, totalTransactions, recentPosts, recentTransactions] = await Promise.all([
    prisma.account.count({ where: { sellerId: userId } }),
    prisma.transaction.count({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
    }),
    prisma.account.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        account: { select: { game: true } },
        buyer: { select: { username: true } },
        seller: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    totalPosts,
    totalTransactions,
    recentPosts,
    recentTransactions,
  });
}