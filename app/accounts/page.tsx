import AccountCard from '@/components/AccountCard';
import prisma from '@/lib/prisma';

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    where: { status: 'active' },
    include: {
      seller: {
        select: { username: true, rating: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Marketplace Akun</h2>
      {accounts.length === 0 ? (
        <p className="text-gray-400">Belum ada akun yang dijual.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map((acc: any) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>
      )}
    </div>
  );
}