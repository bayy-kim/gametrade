import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/transactions - Buat transaksi baru
export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Login dulu' }, { status: 401 });

  const { accountId } = await req.json();
  if (!accountId) return NextResponse.json({ error: 'ID akun wajib' }, { status: 400 });

  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
  if (account.status === 'sold') return NextResponse.json({ error: 'Akun sudah terjual' }, { status: 400 });
  if (account.sellerId === (user as any).id) return NextResponse.json({ error: 'Tidak bisa membeli akun sendiri' }, { status: 400 });

  const transactionCode = 'TRX-' + Date.now();

  const transaction = await prisma.transaction.create({
    data: {
      transactionCode,
      type: 'buy_sell',
      buyerId: (user as any).id,
      sellerId: account.sellerId,
      accountId: account.id,
      amount: account.price || 0,
      adminFee: 5000,
      status: 'pending', // ⬅️ Tidak langsung completed
    },
  });

  return NextResponse.json({ success: true, transaction }, { status: 201 });
}

// GET /api/transactions - Lihat daftar transaksi user
export async function GET() {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { buyerId: (user as any).id },
        { sellerId: (user as any).id },
      ],
    },
    include: {
      account: { select: { game: true, gameId: true } },
      buyer: { select: { username: true } },
      seller: { select: { username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(transactions);
}