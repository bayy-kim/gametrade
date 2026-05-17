'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function BuyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/accounts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setAccount(data);
      })
      .catch(() => setError('Gagal mengambil data'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    setBuying(true);
    setMessage('');
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: parseInt(id) }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('🎉 Pembelian berhasil! Akun sudah menjadi milikmu.');
        setTimeout(() => {
          router.push('/transactions');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Gagal membeli'}`);
      }
    } catch {
      setMessage('❌ Kesalahan jaringan');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="max-w-xl mx-auto p-6 text-center text-gray-400">Memuat...</div>;
  if (error) return <div className="max-w-xl mx-auto p-6 text-center text-red-400">{error}</div>;
  if (!account) return <div className="max-w-xl mx-auto p-6 text-center text-gray-400">Akun tidak ditemukan.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <Link href={`/accounts/${id}`} className="flex items-center gap-1 text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Akun
      </Link>

      <h2 className="text-3xl font-bold mb-6">Konfirmasi Pembelian</h2>

      {message && (
        <div className={`mb-4 p-3 rounded text-center text-sm ${
          message.startsWith('🎉') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-400">Game</span>
          <span className="font-bold">{account.game}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">ID Game</span>
          <span className="font-bold">{account.gameId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Rank</span>
          <span className="font-bold">{account.accountRank || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Penjual</span>
          <span className="font-bold">{account.seller?.username}</span>
        </div>
        <div className="flex justify-between border-t border-gray-700 pt-4">
          <span className="text-gray-400">Harga Akun</span>
          <span className="font-bold text-green-400">Rp {account.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Biaya Admin</span>
          <span className="font-bold">Rp 5.000</span>
        </div>
        <div className="flex justify-between border-t border-gray-700 pt-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-lg font-bold text-green-400">
            Rp {(account.price + 5000).toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleBuy}
          disabled={buying}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded font-bold text-lg flex items-center justify-center gap-2"
        >
          {buying ? 'Memproses...' : <><ShoppingCart className="w-5 h-5" /> Konfirmasi Pembelian</>}
        </button>
      </div>
    </div>
  );
}