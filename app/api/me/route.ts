import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function GET() {
  const userPayload = await getUserFromCookie();
  if (!userPayload) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // Ambil data user LENGKAP dari database, termasuk field baru
  const user = await prisma.user.findUnique({
    where: { id: (userPayload as any).id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      rating: true,
      totalReviews: true,
      bio: true,
      avatarUrl: true,
      whatsapp: true,
      emailPublic: true,
      tiktok: true,
      instagram: true,
      twitter: true,
    },
  });

  return NextResponse.json({ user });
}