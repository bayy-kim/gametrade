import { getUserFromCookie } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function TransactionsPage() {
  const user = await getUserFromCookie();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-400">
        Silakan login untuk melihat riwayat postingan.
      </div>
    );
  }

  // Ambil langsung dari database
  const accounts = await prisma.account.findMany({
    where: { sellerId: (user as any).id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Riwayat Postingan Saya</h2>
      {accounts.length === 0 ? (
        <p className="text-gray-400">Belum ada akun yang diposting.</p>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3">Game</th>
                <th className="p-3">ID Game</th>
                <th className="p-3">Rank</th>
                <th className="p-3">Harga</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc: any) => (
                <tr key={acc.id} className="border-t border-gray-700">
                  <td className="p-3">{acc.game}</td>
                  <td className="p-3">{acc.gameId}</td>
                  <td className="p-3">{acc.accountRank || '-'}</td>
                  <td className="p-3">
                    {acc.price ? `Rp ${acc.price.toLocaleString()}` : 'Trade'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        acc.status === 'active'
                          ? 'bg-green-900 text-green-300'
                          : acc.status === 'pending'
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {acc.status === 'active'
                        ? 'Aktif'
                        : acc.status === 'pending'
                        ? 'Pending'
                        : 'Ditolak'}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400 text-sm">
                    {new Date(acc.createdAt).toLocaleDateString('id-ID')}
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