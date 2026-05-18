import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: ambil semua chat yang melibatkan userId tertentu
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const userId = parseInt(params.userId);

  const chats = await prisma.chat.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      sender: { select: { username: true } },
      receiver: { select: { username: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(chats);
}

// POST: kirim pesan sebagai user (admin bertindak sebagai userId)
export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const admin = await getUserFromCookie();
  if (!admin || (admin as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const userId = parseInt(params.userId);
  const { receiverId, message } = await req.json();

  const chat = await prisma.chat.create({
    data: {
      senderId: userId,
      receiverId: parseInt(receiverId),
      message,
    },
  });
  return NextResponse.json(chat, { status: 201 });
}