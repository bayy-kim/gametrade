import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const account = await prisma.account.findUnique({
      where: { id: parseInt(id) },
      include: {
        seller: {
          select: { id: true, username: true, rating: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil akun' }, { status: 500 });
  }
}