import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: 'Login dulu ya' }, { status: 401 });
  }

  const { accountId, gameId, screenshots } = await req.json();

  // ===== SIMULASI AI =====
  // 1. Cek ID game: anggap valid kalau panjangnya > 5 karakter
  const gameIdActive = gameId && gameId.length > 5;

  // 2. Cek akun Google: anggap terhubung kalau ada minimal 2 screenshot
  const googleVerified = screenshots && screenshots.length >= 2;

  const verifiedByAi = gameIdActive && googleVerified;

  // Update database
  const updated = await prisma.account.update({
    where: { id: accountId },
    data: {
      gameIdActive,
      googleVerified,
      verifiedByAi,
      aiVerifiedAt: new Date(),
      status: verifiedByAi ? 'active' : 'rejected',
      rejectionReason: !verifiedByAi
        ? 'ID game tidak valid atau akun Google tidak terhubung.'
        : null,
    },
  });

  return NextResponse.json({
    success: verifiedByAi,
    gameIdActive,
    googleVerified,
    verifiedByAi,
    status: updated.status,
  });
}