import { getUserFromCookie } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Star, ShoppingBag, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const payload = await getUserFromCookie();

  if (!payload) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-6 text-center text-gray-400">
        Silakan login untuk melihat profil.
      </div>
    );
  }

  // Ambil data user lengkap dari database
  const user = await prisma.user.findUnique({
    where: { id: (payload as any).id },
    include: {
      _count: {
        select: {
          accounts: true,
          transactions: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-6 text-center text-gray-400">
        Data user tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-bold mb-6">Profil Saya</h2>

      {/* Info Utama */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user.username}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" /> {user.rating ? user.rating.toFixed(1) : '0.0'} ({user.totalReviews} review)
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <ShoppingBag className="w-4 h-4" /> {user._count.transactions} transaksi
          </div>
        </div>
      </div>

      {/* Menu Cepat */}
      <div className="bg-gray-800 rounded-xl p-4 space-y-3 mb-6">
        <Link
          href="/transactions"
          className="flex items-center gap-2 text-left hover:bg-gray-700 p-2 rounded"
        >
          <ShoppingBag className="w-4 h-4" /> Riwayat Transaksi
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-2 text-left hover:bg-gray-700 p-2 rounded"
        >
          <MessageCircle className="w-4 h-4" /> Pesan
        </Link>
        <Link
          href="/my-posts"
          className="flex items-center gap-2 text-left hover:bg-gray-700 p-2 rounded"
        >
          <ShoppingBag className="w-4 h-4" /> Postingan Saya
        </Link>
      </div>

      {/* Tombol Logout */}
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-bold"
        >
          Logout
        </button>
      </form>
    </div>
  );
}