import Link from 'next/link';
import { BadgeCheck, ArrowLeft, ShoppingCart } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getUserFromCookie } from '@/lib/auth';

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ tunggu Promise
  const user = await getUserFromCookie();

  // Ambil detail akun dari database
  const account = await prisma.account.findUnique({
    where: { id: parseInt(id) },   // ✅ gunakan id hasil await
    include: {
      seller: {
        select: { id: true, username: true, rating: true },
      },
    },
  });

  if (!account) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-400">
        Akun tidak ditemukan.
      </div>
    );
  }

  const isOwner = user && (user as any).id === account.sellerId;

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6">
      <Link href="/accounts" className="flex items-center gap-1 text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Marketplace
      </Link>

      <div className="bg-gray-800 rounded-xl p-6">
        {/* Badge Game & Verifikasi */}
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded text-sm ${
            account.game === 'ML' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'
          }`}>
            {account.game}
          </span>
          {account.verifiedByAi && (
            <span className="flex items-center gap-1 text-green-400">
              <BadgeCheck className="w-5 h-5" /> Verified by AI
            </span>
          )}
          {account.status === 'sold' && (
            <span className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded text-sm">Terjual</span>
          )}
        </div>

        {/* Info Akun */}
        <h2 className="text-3xl font-bold mb-1">Rank {account.accountRank || 'Tidak diketahui'}</h2>
        <p className="text-gray-300 mb-4">{account.description || 'Tidak ada deskripsi.'}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-400 text-sm">Level</p>
            <p className="font-bold text-lg">{account.accountLevel || '?'}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-400 text-sm">Hero/Skin</p>
            <p className="font-bold text-lg">{account.heroesSkins || '?'}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-400 text-sm">ID Game</p>
            <p className="font-bold text-lg">{account.gameId}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded text-center">
            <p className="text-gray-400 text-sm">Penjual</p>
            <p className="font-bold text-lg">{account.seller.username} ⭐{account.seller.rating.toFixed(1)}</p>
          </div>
        </div>

        {/* Harga & Tombol Beli */}
        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
          <div>
            <p className="text-gray-400 text-sm">
              {account.tradeOnly ? 'Hanya untuk trade' : 'Harga'}
            </p>
            {account.price ? (
              <p className="text-2xl font-bold text-green-400">Rp {account.price.toLocaleString()}</p>
            ) : (
              <p className="text-2xl font-bold text-blue-400">Trade</p>
            )}
          </div>

          {/* Tombol Beli / Status */}
          {!user ? (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold">
              Login untuk Membeli
            </Link>
          ) : isOwner ? (
            <span className="bg-gray-600 text-gray-300 px-6 py-2 rounded font-bold cursor-not-allowed">
              Ini Akun Kamu
            </span>
          ) : account.status === 'sold' ? (
            <span className="bg-gray-600 text-gray-300 px-6 py-2 rounded font-bold cursor-not-allowed">
              Sudah Terjual
            </span>
          ) : (
            <Link
              href={`/buy/${account.id}`}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Beli Sekarang
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}