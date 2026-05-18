'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login gagal.');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  // Variants TANPA properti transition
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      // transition untuk stagger diletakkan di prop component nanti
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // transition diletakkan di sini sebagai prop, bukan di dalam variants
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        onSubmit={handleLogin}
        className="bg-gray-800 rounded-xl p-6 space-y-4"
      >
        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Setiap item diberi transition di level komponen */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <label className="block mb-1">Username atau Email</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Username atau email"
            required
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </motion.div>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-4 text-gray-400"
      >
        Belum punya akun?{' '}
        <Link href="/login" className="text-blue-400 hover:underline">
          Daftar
        </Link>
      </motion.p>
    </div>
  );
}