import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

// GET /api/accounts - ambil semua akun yang status 'active'
export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      where: { status: 'active' },
      include: {
        seller: {
          select: { username: true, rating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// POST /api/accounts - posting akun baru (harus login)
export async function POST(req: Request) {
  const user = await getUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
  }

  const body = await req.json();
  const {
    game,
    gameId,
    serverId,
    accountLevel,
    accountRank,
    heroesSkins,
    description,
    price,
    tradeOnly,
    screenshots,
  } = body;

  // Validasi sederhana
  if (!game || !gameId) {
    return NextResponse.json({ error: 'Game dan ID game wajib diisi' }, { status: 400 });
  }

  try {
    const account = await prisma.account.create({
      data: {
        game,
        gameId,
        serverId: serverId || null,
        accountLevel: accountLevel || null,
        accountRank: accountRank || null,
        heroesSkins: heroesSkins || null,
        description: description || null,
        price: price ? parseFloat(price) : null,
        tradeOnly: tradeOnly || false,
        screenshots: JSON.stringify(screenshots || []),
        sellerId: (user as any).id,
        status: 'pending',
      },
    });
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan akun' }, { status: 500 });
  }
}