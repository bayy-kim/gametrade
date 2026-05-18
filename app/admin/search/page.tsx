'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SearchUsersPage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Cari Pengguna</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Username atau email..."
          className="bg-gray-800 border border-gray-700 rounded px-4 py-2 flex-1 text-white"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-bold"
          disabled={loading}
        >
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </div>

      {users.length > 0 && (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="border-t border-gray-700">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">
                    <span className={u.isBanned ? 'text-red-400' : 'text-green-400'}>
                      {u.isBanned ? 'Banned' : 'Aktif'}
                    </span>
                  </td>
                  <td className="p-3">⭐ {u.rating?.toFixed(1)}</td>
                  <td className="p-3">
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {users.length === 0 && query && !loading && (
        <p className="text-gray-400 text-center mt-4">Tidak ada pengguna ditemukan.</p>
      )}
    </div>
  );
}