import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params; // ✅ Ambil id dari Promise
  const body = await req.json(); // { isBanned: boolean }

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isBanned: body.isBanned },
  });
  return NextResponse.json({ success: true });
}