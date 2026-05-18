'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Package, Star, ArrowRight, PlusCircle, Search, MessageCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data user
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);
        // Ambil statistik
        return fetch('/api/dashboard/stats');
      })
      .then(res => res?.json())
      .then(data => {
        if (data) setStats(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-400">
        Memuat dashboard...
      </div>
    );
  }

  if (!user) {
    return null; // akan redirect ke login
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Selamat datang,{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {user.username}
          </span>
          !
        </h1>
        <p className="text-gray-400 mt-1">Inilah ringkasan aktivitas akunmu.</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-3 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Postingan</p>
              <p className="text-2xl font-bold">{stats?.totalPosts ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-900 p-3 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Transaksi</p>
              <p className="text-2xl font-bold">{stats?.totalTransactions ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-900 p-3 rounded-lg">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rating</p>
              <p className="text-2xl font-bold">{user.rating ? user.rating.toFixed(1) : '0.0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="bg-purple-900 p-3 rounded-lg">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Review</p>
              <p className="text-2xl font-bold">{user.totalReviews ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Cepat */}
      <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/post" className="bg-gray-800 hover:bg-gray-700 rounded-xl p-5 transition group">
          <PlusCircle className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition" />
          <h3 className="font-bold text-lg">Jual / Tukar Akun</h3>
          <p className="text-gray-400 text-sm mt-1">Posting akun ML atau FF untuk dijual atau ditukar.</p>
        </Link>

        <Link href="/accounts" className="bg-gray-800 hover:bg-gray-700 rounded-xl p-5 transition group">
          <Search className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition" />
          <h3 className="font-bold text-lg">Cari Akun</h3>
          <p className="text-gray-400 text-sm mt-1">Jelajahi marketplace dan temukan akun impianmu.</p>
        </Link>

        <Link href="/my-posts" className="bg-gray-800 hover:bg-gray-700 rounded-xl p-5 transition group">
          <Package className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition" />
          <h3 className="font-bold text-lg">Postingan Saya</h3>
          <p className="text-gray-400 text-sm mt-1">Kelola akun-akun yang sudah kamu posting.</p>
        </Link>
      </div>

      {/* Transaksi Terbaru */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
        <Link href="/transactions" className="text-blue-400 hover:underline text-sm flex items-center gap-1">
          Lihat semua <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="bg-gray-800 rounded-xl p-5">
        {stats?.recentTransactions?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentTransactions.map((trx: any) => (
              <div key={trx.id} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0">
                <div>
                  <p className="font-bold">{trx.transactionCode}</p>
                  <p className="text-sm text-gray-400">
                    {trx.type === 'buy_sell' ? 'Pembelian' : 'Tukar'} • {trx.account?.game || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className={trx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
                    {trx.status === 'completed' ? 'Selesai' : trx.status}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(trx.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">Belum ada transaksi.</p>
        )}
      </div>
    </div>
  );
}