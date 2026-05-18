'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Fungsi untuk mengambil data user
  const fetchUser = () => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .finally(() => setLoading(false));
  };

  fetchUser();
  const handleLoginSuccess = () => {
    setLoading(true);
    fetchUser();
  };
  window.addEventListener('login-success', handleLoginSuccess);
  return () => {
    window.removeEventListener('login-success', handleLoginSuccess);
  };
}, []);

 const handleLogout = async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  setUser(null);
  window.location.assign('/');
};


  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        GameTrade
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/accounts" className="hover:text-blue-400">Market</Link>
        {loading ? (
          <span className="text-gray-400 text-sm">Memuat...</span>
        ) : user ? (
          <>
            <Link href="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            <Link href="/post" className="hover:text-green-400">+ Jual/Tukar</Link>
            <Link href="/chat"><MessageCircle className="w-5 h-5" /></Link>
            <Link href="/profile" className="flex items-center gap-1 hover:text-blue-400">
              <User className="w-5 h-5" />
              <span>{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="text-red-400"><LogOut className="w-5 h-5" /></button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-blue-400 px-2">Login</Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
}