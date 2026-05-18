import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({ where: { id: parseInt(id) } });
  if (!transaction) return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  if (transaction.buyerId !== (user as any).id) return NextResponse.json({ error: 'Bukan pembeli' }, { status: 403 });
  if (transaction.status !== 'pending') return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });

  // Ubah status ke escrow_hold (uang ditahan)
  const updated = await prisma.transaction.update({
    where: { id: parseInt(id) },
    data: { status: 'escrow_hold' },
  });

  return NextResponse.json({ success: true, transaction: updated });
}