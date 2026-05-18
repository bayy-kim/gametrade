export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(
  req: Request,
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


// POST /api/accounts/[id] — untuk update akun (opsional)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const updated = await prisma.account.update({
      where: { id: parseInt(id) },
      data: body, // hati-hati: di production harus divalidasi dulu
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update akun' }, { status: 500 });
  }
}

// DELETE /api/accounts/[id] — untuk hapus akun
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.account.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus akun' }, { status: 500 });
  }
}