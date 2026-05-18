'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Music, Camera, Hash, Edit3, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    avatarUrl: '',
    whatsapp: '',
    emailPublic: '',
    tiktok: '',
    instagram: '',
    twitter: '',
  });
  const [saving, setSaving] = useState(false);
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
        setForm({
          bio: data.user.bio || '',
          avatarUrl: data.user.avatarUrl || '',
          whatsapp: data.user.whatsapp || '',
          emailPublic: data.user.emailPublic || '',
          tiktok: data.user.tiktok || '',
          instagram: data.user.instagram || '',
          twitter: data.user.twitter || '',
        });
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Gagal');
      const data = await res.json();
      setUser(data.user);
      setEditing(false);
      setMessage('✅ Profil berhasil diperbarui!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto p-6 text-center">Memuat...</div>;
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {message && (
        <div className={`mb-4 p-3 rounded text-center ${message.startsWith('✅') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{message}</div>
      )}

      {/* Header Profil */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-400">{user.email}</p>
              <p className="text-yellow-400 text-sm">⭐ {user.rating?.toFixed(1) || '0.0'} ({user.totalReviews} review)</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="text-gray-400 hover:text-white"
          >
            {editing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </button>
        </div>

        {!editing ? (
          /* ========== MODE LIHAT ========== */
          <div className="mt-6 space-y-3">
            {user.bio && <p className="text-gray-300 italic">“{user.bio}”</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {user.emailPublic && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" /> {user.emailPublic}
                </div>
              )}
              {user.whatsapp && (
                <a href={`https://wa.me/${user.whatsapp.replace(/\D/g,'')}`} target="_blank" className="flex items-center gap-2 text-green-400 hover:underline">
                  <Phone className="w-4 h-4" /> WhatsApp
                </a>
              )}
              {user.tiktok && (
                <a href={`https://tiktok.com/@${user.tiktok}`} target="_blank" className="flex items-center gap-2 text-pink-400 hover:underline">
                  <Music className="w-4 h-4" /> @{user.tiktok}
                </a>
              )}
              {user.instagram && (
                <a href={`https://instagram.com/${user.instagram}`} target="_blank" className="flex items-center gap-2 text-purple-400 hover:underline">
                  <Camera className="w-4 h-4" /> @{user.instagram}
                </a>
              )}
              {user.twitter && (
              <a href={`https://twitter.com/${user.twitter}`} target="_blank" className="flex items-center gap-2 text-blue-400 hover:underline">
                <Hash className="w-4 h-4" /> @{user.twitter}
             </a>
              )}
            </div>
          </div>
        ) : (
          /* ========== MODE EDIT ========== */
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-gray-400">Bio</label>
              <input
                type="text"
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-gray-700 rounded p-2 mt-1"
                placeholder="Tulis bio singkat..."
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Avatar URL</label>
              <input
                type="text"
                value={form.avatarUrl}
                onChange={e => setForm({ ...form, avatarUrl: e.target.value })}
                className="w-full bg-gray-700 rounded p-2 mt-1"
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Email Publik</label>
                <input
                  type="email"
                  value={form.emailPublic}
                  onChange={e => setForm({ ...form, emailPublic: e.target.value })}
                  className="w-full bg-gray-700 rounded p-2 mt-1"
                  placeholder="email@domain.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">WhatsApp</label>
                <input
                  type="text"
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full bg-gray-700 rounded p-2 mt-1"
                  placeholder="62812..."
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">TikTok</label>
                <input
                  type="text"
                  value={form.tiktok}
                  onChange={e => setForm({ ...form, tiktok: e.target.value })}
                  className="w-full bg-gray-700 rounded p-2 mt-1"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Instagram</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={e => setForm({ ...form, instagram: e.target.value })}
                  className="w-full bg-gray-700 rounded p-2 mt-1"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Twitter/X</label>
                <input
                  type="text"
                  value={form.twitter}
                  onChange={e => setForm({ ...form, twitter: e.target.value })}
                  className="w-full bg-gray-700 rounded p-2 mt-1"
                  placeholder="username"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        )}
      </div>

      {/* Tombol Logout */}
      <form action="/api/auth/logout" method="POST">
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-bold">
          Logout
        </button>
      </form>
    </div>
  );
}