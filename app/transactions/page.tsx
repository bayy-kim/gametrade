import { getUserFromCookie } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function TransactionsPage() {
  const user = await getUserFromCookie();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-400">
        Silakan login untuk melihat riwayat transaksi.
      </div>
    );
  }

  // Ambil transaksi yang melibatkan user sebagai pembeli atau penjual
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { buyerId: (user as any).id },
        { sellerId: (user as any).id },
      ],
    },
    include: {
      account: { select: { game: true, gameId: true } },
      buyer: { select: { username: true } },
      seller: { select: { username: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Riwayat Transaksi</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-400">Belum ada transaksi.</p>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Kode</th>
                <th className="p-3">Tipe</th>
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
                  <td className="p-3 text-blue-400">{trx.transactionCode}</td>
                  <td className="p-3">{trx.type === 'buy_sell' ? 'Beli' : 'Tukar'}</td>
                  <td className="p-3">{trx.account?.game}</td>
                  <td className="p-3">{trx.buyer?.username}</td>
                  <td className="p-3">{trx.seller?.username}</td>
                  <td className="p-3">
                    {trx.amount ? `Rp ${trx.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="p-3">
                    // Di bagian status, ubah pengecekan warnanya:
                        <span className={`px-2 py-0.5 rounded text-xs ${
                        trx.status === 'completed' ? 'bg-green-900 text-green-300' :
                        trx.status === 'escrow_hold' ? 'bg-blue-900 text-blue-300' :
                        trx.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-red-900 text-red-300'
                        }`}>
                        {trx.status === 'completed' ? 'Selesai' :
                        trx.status === 'escrow_hold' ? 'Escrow' :
                        trx.status === 'pending' ? 'Pending' : trx.status}
                        </span>
                  </td>
                  <td className="p-3 text-gray-400 text-sm">
                    {new Date(trx.createdAt).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}