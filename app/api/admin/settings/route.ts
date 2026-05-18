import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getUserFromCookie();
  if (!user || (user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const settings = await prisma.settings.findMany();
  const map: any = {};
  settings.forEach(s => map[s.key] = s.value);
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  const user = await getUserFromCookie();
  if (!user || (user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  // body: { key: value, ... }
  for (const [key, value] of Object.entries(body)) {
    await prisma.settings.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  return NextResponse.json({ success: true });
}