import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  const user = await getUserFromCookie();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  // Hanya izinkan update field yang diinginkan
  const allowedFields = [
    'bio', 'avatarUrl', 'whatsapp', 'emailPublic',
    'tiktok', 'instagram', 'twitter'
  ];

  const data: any = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: (user as any).id },
      data,
    });
    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Gagal update profil' }, { status: 500 });
  }
}