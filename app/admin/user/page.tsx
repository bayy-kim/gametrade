'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const toggleBan = async (userId: number, currentBan: boolean) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBanned: !currentBan }),
    });
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentBan } : u));
  };

  if (loading) return <p>Memuat...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pengguna</h1>
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Post</th>
              <th className="p-3">Transaksi</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-gray-700">
                <td className="p-3">
                  <Link href={`/admin/chat/${u.id}`} className="text-blue-400 hover:underline">
                    {u.username}
                  </Link>
                </td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.rating?.toFixed(1)}</td>
                <td className="p-3">{u._count.accounts}</td>
                <td className="p-3">{u._count.transactions}</td>
                <td className="p-3">
                  <span className={u.isBanned ? 'text-red-400' : 'text-green-400'}>
                    {u.isBanned ? 'Banned' : 'Aktif'}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleBan(u.id, u.isBanned)}
                    className={`px-3 py-1 rounded text-sm ${u.isBanned ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}