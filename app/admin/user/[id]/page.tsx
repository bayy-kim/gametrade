'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${id}/detail`)
      .then(res => res.json())
      .then(data => setUser(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-400">Memuat data pengguna...</p>;
  if (!user) return <p className="text-red-400">Data tidak ditemukan.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Detail Pengguna: {user.username}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="font-bold mb-4">Informasi Akun</h2>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.isBanned ? 'Banned' : 'Aktif'}</p>
          <p><strong>Rating:</strong> ⭐ {user.rating?.toFixed(1)} ({user.totalReviews} review)</p>
          <p><strong>Bio:</strong> {user.bio || '-'}</p>
          <p><strong>WhatsApp:</strong> {user.whatsapp || '-'}</p>
          <p><strong>Email Publik:</strong> {user.emailPublic || '-'}</p>
          <p><strong>TikTok:</strong> {user.tiktok || '-'}</p>
          <p><strong>Instagram:</strong> {user.instagram || '-'}</p>
          <p><strong>Twitter/X:</strong> {user.twitter || '-'}</p>
          <p className="text-sm text-gray-400 mt-2">
            Bergabung: {new Date(user.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="font-bold mb-4">Aksi</h2>
          <Link href={`/admin/chat/${user.id}`} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded block text-center mb-2">
            Chat sebagai {user.username}
          </Link>
          <Link href={`/admin/users`} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded block text-center">
            Kembali ke Daftar
          </Link>
        </div>
      </div>

      {/* Akun Game yang Dijual */}
      <div className="bg-gray-800 p-6 rounded-xl mb-6">
        <h2 className="font-bold mb-4">Akun Game yang Diposting</h2>
        {user.accounts?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3">Game</th>
                  <th className="p-3">ID Game</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {user.accounts.map((acc: any) => (
                  <tr key={acc.id} className="border-t border-gray-700">
                    <td className="p-3">{acc.game}</td>
                    <td className="p-3">{acc.gameId}</td>
                    <td className="p-3">{acc.status}</td>
                    <td className="p-3">{new Date(acc.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">Belum ada akun yang diposting.</p>
        )}
      </div>

      {/* Riwayat Transaksi */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="font-bold mb-4">Riwayat Transaksi</h2>
        {user.transactions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Tipe</th>
                  <th className="p-3">Game</th>
                  <th className="p-3">Pembeli</th>
                  <th className="p-3">Penjual</th>
                  <th className="p-3">Jumlah</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((trx: any) => (
                  <tr key={trx.id} className="border-t border-gray-700">
                    <td className="p-3 text-sm">{trx.transactionCode}</td>
                    <td className="p-3">{trx.type === 'buy_sell' ? 'Beli' : 'Tukar'}</td>
                    <td className="p-3">{trx.account?.game}</td>
                    <td className="p-3">{trx.buyer?.username}</td>
                    <td className="p-3">{trx.seller?.username}</td>
                    <td className="p-3">Rp {trx.amount?.toLocaleString()}</td>
                    <td className="p-3">{trx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">Belum ada transaksi.</p>
        )}
      </div>
    </div>
  );
}