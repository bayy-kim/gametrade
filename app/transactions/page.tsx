'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);
        return fetch('/api/transactions');
      })
      .then(res => res?.json())
      .then(data => {
        if (data) setTransactions(data);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleAction = async (transactionId: number, action: string) => {
    setMessage('');
    try {
      const res = await fetch(`/api/transactions/${transactionId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Aksi berhasil!');
        // Refresh daftar transaksi
        const refreshRes = await fetch('/api/transactions');
        setTransactions(await refreshRes.json());
      } else {
        setMessage(`❌ ${data.error || 'Gagal'}`);
      }
    } catch {
      setMessage('❌ Kesalahan jaringan');
    }
  };

  const statusLabels: Record<string, string> = {
    pending: 'Menunggu Pembayaran',
    escrow_hold: 'Uang Ditahan',
    account_sent: 'Akun Diserahkan',
    completed: 'Selesai',
    disputed: 'Sengketa',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-900 text-yellow-300',
    escrow_hold: 'bg-blue-900 text-blue-300',
    account_sent: 'bg-purple-900 text-purple-300',
    completed: 'bg-green-900 text-green-300',
    disputed: 'bg-red-900 text-red-300',
  };

  if (loading) return <div className="max-w-4xl mx-auto p-6 text-center">Memuat...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Riwayat Transaksi</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-center ${message.startsWith('✅') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {message}
        </div>
      )}

      {transactions.length === 0 ? (
        <p className="text-gray-400">Belum ada transaksi.</p>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Kode</th>
                <th className="p-3">Game</th>
                <th className="p-3">Pembeli</th>
                <th className="p-3">Penjual</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx: any) => (
                <tr key={trx.id} className="border-t border-gray-700">
                  <td className="p-3 text-blue-400 text-sm">{trx.transactionCode}</td>
                  <td className="p-3">{trx.account?.game}</td>
                  <td className="p-3">{trx.buyer?.username}</td>
                  <td className="p-3">{trx.seller?.username}</td>
                  <td className="p-3">{trx.amount ? `Rp ${trx.amount.toLocaleString()}` : '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[trx.status] || 'bg-gray-700'}`}>
                      {statusLabels[trx.status] || trx.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {/* Tombol untuk penjual: Serahkan Akun */}
                    {trx.status === 'escrow_hold' && user?.id === trx.sellerId && (
                      <button
                        onClick={() => handleAction(trx.id, 'send_account')}
                        className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs"
                      >
                        Serahkan Akun
                      </button>
                    )}
                    {/* Tombol untuk pembeli: Konfirmasi */}
                    {trx.status === 'account_sent' && user?.id === trx.buyerId && (
                      <button
                        onClick={() => handleAction(trx.id, 'confirm_delivery')}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                      >
                        Konfirmasi Terima
                      </button>
                    )}
                    {trx.status === 'completed' && (
                      <span className="text-green-400 text-xs">✅ Selesai</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}