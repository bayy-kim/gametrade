import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST – buat laporan baru (dari pengguna)
export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { reportedUserId, reason } = await req.json();
  if (!reportedUserId || !reason) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
  }

  try {
    const report = await prisma.report.create({
      data: {
        reporterId: (user as any).id,
        reportedUserId,
        reason,
      },
    });
    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal membuat laporan' }, { status: 500 });
  }
}

// GET – ambil semua laporan (admin)
export async function GET() {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, username: true } },
      reportedUser: { select: { id: true, username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reports);
}