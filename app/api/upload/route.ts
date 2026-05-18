import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('avatar') as File;

  if (!file) {
    return NextResponse.json({ error: 'Tidak ada file' }, { status: 400 });
  }

  // Upload ke Vercel Blob
  const blob = await put(file.name, file, { access: 'public' });

  return NextResponse.json({ url: blob.url });
}