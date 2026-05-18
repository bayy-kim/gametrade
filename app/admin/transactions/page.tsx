'use client';
import { useEffect, useState } from 'react';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Semua Transaksi</h1>
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Kode</th>
              <th className="p-3">Game</th>
              <th className="p-3">Pembeli</th>
              <th className="p-3">Penjual</th>
              <th className="p-3">Jumlah</th>
              <th className="p-3">Status</th>
              <th className="p-3">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx: any) => (
              <tr key={trx.id} className="border-t border-gray-700">
                <td className="p-3">{trx.transactionCode}</td>
                <td className="p-3">{trx.account?.game}</td>
                <td className="p-3">{trx.buyer?.username}</td>
                <td className="p-3">{trx.seller?.username}</td>
                <td className="p-3">Rp {trx.amount?.toLocaleString()}</td>
                <td className="p-3">{trx.status}</td>
                <td className="p-3">{new Date(trx.createdAt).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}