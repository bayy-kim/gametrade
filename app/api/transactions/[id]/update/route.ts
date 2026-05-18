import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { action } = await req.json(); // 'send_account' atau 'confirm_delivery'

  const transaction = await prisma.transaction.findUnique({
    where: { id: parseInt(id) },
    include: { account: true },
  });

  if (!transaction)
    return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });

  const userId = (user as any).id;
  let newStatus = '';

  if (action === 'send_account') {
    // Hanya penjual yang bisa menyerahkan akun
    if (transaction.sellerId !== userId)
      return NextResponse.json({ error: 'Hanya penjual yang bisa melakukan ini' }, { status: 403 });
    if (transaction.status !== 'escrow_hold')
      return NextResponse.json({ error: 'Status harus escrow_hold' }, { status: 400 });
    newStatus = 'account_sent';
  } else if (action === 'confirm_delivery') {
    // Hanya pembeli yang bisa konfirmasi
    if (transaction.buyerId !== userId)
      return NextResponse.json({ error: 'Hanya pembeli yang bisa melakukan ini' }, { status: 403 });
    if (transaction.status !== 'account_sent')
      return NextResponse.json({ error: 'Penjual belum menyerahkan akun' }, { status: 400 });
    newStatus = 'completed';
  } else {
    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
  }

  // Update status transaksi
  const updatedTransaction = await prisma.transaction.update({
    where: { id: parseInt(id) },
    data: { status: newStatus },
  });

  // Jika status completed, tandai akun sebagai sold
  if (newStatus === 'completed') {
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { status: 'sold' },
    });
  }

  return NextResponse.json({ success: true, transaction: updatedTransaction });
}