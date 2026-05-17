import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Login dulu' }, { status: 401 });

  const { transactionId } = await req.json();

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { account: true },
  });

  if (!transaction) return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  if (transaction.buyerId !== (user as any).id) return NextResponse.json({ error: 'Bukan pembeli' }, { status: 403 });
  if (transaction.status !== 'escrow_hold') return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });

  // Update transaksi selesai
  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'completed' },
  });

  // Tandai akun sebagai terjual
  await prisma.account.update({
    where: { id: transaction.accountId },
    data: { status: 'sold' },
  });

  return NextResponse.json({ success: true, message: 'Uang dilepas ke penjual' });
}