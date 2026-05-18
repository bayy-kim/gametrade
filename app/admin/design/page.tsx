'use client';
import { useEffect, useState } from 'react';

export default function DesignPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    alert('Pengaturan disimpan!');
  };

  if (loading) return <p>Memuat...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Desain & Animasi</h1>
      <div className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block mb-1">Animasi Aktif?</label>
          <select
            value={settings.animation_enabled || 'true'}
            onChange={(e) => setSettings({ ...settings, animation_enabled: e.target.value })}
            className="bg-gray-700 p-2 rounded w-full"
          >
            <option value="true">Ya</option>
            <option value="false">Tidak</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Teks Hero (Homepage)</label>
          <textarea
            value={settings.hero_text || ''}
            onChange={(e) => setSettings({ ...settings, hero_text: e.target.value })}
            className="bg-gray-700 p-2 rounded w-full h-24"
            placeholder="Marketplace jual beli & tukar akun game..."
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  );
}