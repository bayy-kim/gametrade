'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';

export default function PostPage() {
  const router = useRouter();

  const [game, setGame] = useState('ML');
  const [gameId, setGameId] = useState('');
  const [serverId, setServerId] = useState('');
  const [rank, setRank] = useState('');
  const [price, setPrice] = useState('');
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  // Simulasi verifikasi AI (sementara)
  const handleVerify = () => {
    if (!gameId.trim()) {
      setMessage('ID game wajib diisi!');
      return;
    }
    setVerifying(true);
    setVerified('checking');
    setMessage('');

    setTimeout(() => {
      // Untuk simulasi: lolos jika ID lebih dari 5 karakter & ada screenshot
      if (gameId.length > 5 && screenshots.length > 0) {
        setVerified('ok');
        setMessage('✅ Akun lolos verifikasi!');
      } else {
        setVerified('fail');
        setMessage('❌ Gagal verifikasi. Cek ID game dan upload screenshot.');
      }
      setVerifying(false);
    }, 2000);
  };

  // Kirim data ke API
  const handleSubmit = async () => {
    setPosting(true);
    setMessage('');

    const body = {
      game,
      gameId,
      serverId: game === 'ML' ? serverId : undefined,
      accountRank: rank,
      price: price || null,
      tradeOnly: !price,
      screenshots: screenshots.map(() => 'dummy-url'), // nanti ganti setelah upload gambar beneran
    };

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage('🎉 Akun berhasil diposting!');
        setTimeout(() => {
          router.push('/accounts');
          router.refresh();
        }, 1000);
      } else {
        const data = await res.json();
        setMessage(`❌ ${data.error || 'Gagal posting akun'}`);
      }
    } catch (error) {
      setMessage('❌ Terjadi kesalahan jaringan');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Posting Akun Baru</h2>

      {message && (
        <div className={`mb-4 p-3 rounded text-center text-sm ${
          message.startsWith('✅') || message.startsWith('🎉') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        {/* Game */}
        <div>
          <label className="block mb-1">Game</label>
          <select value={game} onChange={(e) => setGame(e.target.value)} className="w-full bg-gray-700 rounded p-2">
            <option value="ML">Mobile Legends</option>
            <option value="FF">Free Fire</option>
          </select>
        </div>

        {/* ID Game */}
        <div>
          <label className="block mb-1">ID Game</label>
          <input
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full bg-gray-700 rounded p-2"
            placeholder="Masukkan ID game"
          />
        </div>

        {/* Server ID (khusus ML) */}
        {game === 'ML' && (
          <div>
            <label className="block mb-1">Server ID</label>
            <input
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              className="w-full bg-gray-700 rounded p-2"
              placeholder="Server ID (contoh: 1234)"
            />
          </div>
        )}

        {/* Rank */}
        <div>
          <label className="block mb-1">Rank</label>
          <input
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="w-full bg-gray-700 rounded p-2"
            placeholder="Contoh: Mythic, Heroic"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block mb-1">Harga (Rp) - kosongkan jika hanya untuk trade</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            className="w-full bg-gray-700 rounded p-2"
            placeholder="Contoh: 500000"
          />
        </div>

        {/* Upload Screenshot (min. 2) */}
        <div>
          <label className="block mb-1">Upload Screenshot (min. 2)</label>
          <input
            type="file"
            multiple
            onChange={(e) => setScreenshots(Array.from(e.target.files || []))}
            className="w-full bg-gray-700 rounded p-2"
          />
        </div>

        {/* Tombol Verifikasi AI */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-4 py-2 rounded flex items-center gap-2"
          >
            {verifying ? '🔄 Memverifikasi...' : '🛡️ Verifikasi AI'}
          </button>
          <span className="text-sm">
            {verified === 'checking' && '⏳ Menghubungkan ke AI...'}
            {verified === 'ok' && '✅ Lolos!'}
            {verified === 'fail' && '❌ Gagal'}
          </span>
        </div>

        {/* Tombol Posting */}
        <button
          onClick={handleSubmit}
          disabled={verified !== 'ok' || posting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-2 rounded font-bold transition"
        >
          {posting ? '⏳ Memosting...' : 'Posting Akun'}
        </button>
      </div>
    </div>
  );
}