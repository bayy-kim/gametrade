import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';

export default function AccountCard({ account }: any) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 hover:ring-2 hover:ring-blue-500 transition">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs px-2 py-1 rounded ${account.game === 'ML' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>
          {account.game}
        </span>
        {account.verified && (
          <span className="flex items-center gap-1 text-green-400 text-xs">
            <BadgeCheck className="w-4 h-4" /> Verified
          </span>
        )}
      </div>
      <h3 className="font-bold text-xl">{account.rank}</h3>
      <p className="text-gray-400 text-sm">Level {account.level} • {account.skins} skin</p>
      <p className="text-lg font-bold mt-2">Rp {account.price.toLocaleString()}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-gray-500 text-sm">
          {account.seller?.username} ⭐{account.seller?.rating ?? 0}
        </span>
        <Link href={`/accounts/${account.id}`} className="bg-blue-600 px-3 py-1 rounded text-sm">Detail</Link>
      </div>
    </div>
  );
}