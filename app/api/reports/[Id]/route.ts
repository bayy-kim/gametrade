import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { status } = await req.json(); // 'investigating' | 'resolved' | 'closed'

  try {
    const report = await prisma.report.update({
      where: { id: parseInt(params.id) },
      data: { status },
    });
    return NextResponse.json({ success: true, report });
  } catch {
    return NextResponse.json({ error: 'Gagal update laporan' }, { status: 500 });
  }
}