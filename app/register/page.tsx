'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal mendaftar.');
      } else {
        router.push('/'); // redirect ke homepage setelah sukses
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Daftar Akun</h2>
      <form onSubmit={handleRegister} className="bg-gray-800 rounded-xl p-6 space-y-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <div>
          <label className="block mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Konfirmasi Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-gray-700 rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </button>
      </form>
      <p className="text-center mt-4 text-gray-400">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}