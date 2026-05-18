'use client';
import { useEffect, useState } from 'react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchReports();
  };

  const statusColors: any = {
    open: 'bg-red-900 text-red-300',
    investigating: 'bg-yellow-900 text-yellow-300',
    resolved: 'bg-green-900 text-green-300',
    closed: 'bg-gray-700 text-gray-300',
  };

  if (loading) return <p className="p-4 text-gray-400">Memuat...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Laporan Pengguna</h1>
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Pelapor</th>
              <th className="p-3">Terlapor</th>
              <th className="p-3">Alasan</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r: any) => (
              <tr key={r.id} className="border-t border-gray-700">
                <td className="p-3">{r.reporter?.username}</td>
                <td className="p-3">{r.reportedUser?.username}</td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${statusColors[r.status] || ''}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3 text-sm">{new Date(r.createdAt).toLocaleDateString('id-ID')}</td>
                <td className="p-3">
                  {r.status === 'open' && (
                    <button
                      onClick={() => updateStatus(r.id, 'investigating')}
                      className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs mr-1"
                    >
                      Investigasi
                    </button>
                  )}
                  {(r.status === 'open' || r.status === 'investigating') && (
                    <button
                      onClick={() => updateStatus(r.id, 'resolved')}
                      className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                    >
                      Selesai
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}