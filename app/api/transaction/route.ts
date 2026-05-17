import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Login dulu' }, { status: 401 });

  const { accountId } = await req.json();
  if (!accountId) return NextResponse.json({ error: 'ID akun wajib' }, { status: 400 });

  // Cek akun
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
  if (account.status === 'sold') return NextResponse.json({ error: 'Akun sudah terjual' }, { status: 400 });
  if (account.sellerId === (user as any).id) return NextResponse.json({ error: 'Tidak bisa membeli akun sendiri' }, { status: 400 });

  const transactionCode = 'TRX-' + Date.now();
  const amount = account.price || 0;
  const adminFee = 5000;

  // Buat transaksi dengan status escrow_hold (uang ditahan)
  const transaction = await prisma.transaction.create({
    data: {
      transactionCode,
      type: 'buy_sell',
      buyerId: (user as any).id,
      sellerId: account.sellerId,
      accountId: account.id,
      amount,
      adminFee,
      status: 'escrow_hold', // <-- UANG DITAHAN SISTEM
    },
  });

  // Tahan akun (status jadi pending, tidak dijual ke orang lain)
  await prisma.account.update({
    where: { id: accountId },
    data: { status: 'pending' },
  });

  return NextResponse.json({ success: true, transaction }, { status: 201 });
}