'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, CheckCircle, Loader2 } from 'lucide-react';

export default function BuyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'confirm' | 'pay' | 'waiting' | 'done'>('confirm');
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/accounts/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setAccount(data);
      })
      .catch(() => setError('Gagal mengambil data'))
      .finally(() => setLoading(false));
  }, [id]);

  // Step 1: Konfirmasi pembelian → buat transaksi (escrow)
  const handleConfirmBuy = async () => {
    setMessage('');
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: parseInt(id) }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactionId(data.transaction.id);
        setStep('pay');
        setMessage('✅ Uang ditahan sistem. Silakan lakukan pembayaran.');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Kesalahan jaringan');
    }
  };

  // Step 2: Simulasi pembayaran
  const handleSimulatePayment = () => {
    setStep('waiting');
    setMessage('⏳ Menunggu penjual mengirim akun...');
  };

  // Step 3: Konfirmasi terima akun → uang dilepas
  const handleConfirmReceived = async () => {
    if (!transactionId) return;
    setMessage('');
    try {
      const res = await fetch('/api/transactions/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('done');
        setMessage('🎉 Pembelian selesai! Akun sudah jadi milikmu.');
        setTimeout(() => router.push('/transactions'), 2000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Kesalahan jaringan');
    }
  };

  if (loading) return <div className="text-center p-6 text-gray-400"><Loader2 className="animate-spin mx-auto w-8 h-8" /></div>;
  if (error) return <div className="text-center p-6 text-red-400">{error}</div>;
  if (!account) return <div className="text-center p-6 text-gray-400">Akun tidak ditemukan.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <Link href={`/accounts/${id}`} className="flex items-center gap-1 text-gray-400 hover:text-white mb-4">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Akun
      </Link>

      <h2 className="text-3xl font-bold mb-6">Pembelian Akun</h2>

      {message && (
        <div className={`mb-4 p-3 rounded text-sm text-center ${
          message.startsWith('✅') || message.startsWith('🎉') ? 'bg-green-900 text-green-300' :
          message.startsWith('⏳') ? 'bg-yellow-900 text-yellow-300' :
          'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Info Akun */}
      <div className="bg-gray-800 rounded-xl p-6 space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">Game</span>
          <span className="font-bold">{account.game}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Rank</span>
          <span className="font-bold">{account.accountRank || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Penjual</span>
          <span className="font-bold">{account.seller?.username}</span>
        </div>
        <hr className="border-gray-700" />
        <div className="flex justify-between">
          <span className="text-gray-400">Harga Akun</span>
          <span className="font-bold text-green-400">Rp {account.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Biaya Admin</span>
          <span className="font-bold">Rp 5.000</span>
        </div>
        <div className="flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold text-green-400">Rp {(account.price + 5000).toLocaleString()}</span>
        </div>
      </div>

      {/* Tombol berdasarkan step */}
      {step === 'confirm' && (
        <button onClick={handleConfirmBuy} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-bold flex justify-center items-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Konfirmasi Pembelian (Escrow)
        </button>
      )}

      {step === 'pay' && (
        <button onClick={handleSimulatePayment} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold">
          💰 Bayar Sekarang (Simulasi)
        </button>
      )}

      {step === 'waiting' && (
        <div className="space-y-4">
          <div className="bg-yellow-900 text-yellow-300 p-4 rounded text-center">
            ⏳ Menunggu penjual mengirim akun...
          </div>
          <button onClick={handleConfirmReceived} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold flex justify-center items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Konfirmasi Akun Diterima (Uang Dilepas)
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-green-900 text-green-300 p-4 rounded text-center">
          🎉 Transaksi selesai! Uang telah dilepas ke penjual.
        </div>
      )}
    </div>
  );
}