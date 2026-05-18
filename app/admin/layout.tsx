import Link from 'next/link';
import { Shield } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sementara bypass proteksi untuk memastikan layout bisa tampil
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-950 p-6 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-white">GameTrade Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/reports" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white">
  <Shield className="w-5 h-5" /> Laporan
</Link>
          <Link href="/admin" className="text-gray-300 hover:text-white">Dashboard</Link>
          <Link href="/admin/design" className="text-gray-300 hover:text-white">Desain</Link>
          <Link href="/admin/users" className="text-gray-300 hover:text-white">Pengguna</Link>
          <Link href="/admin/transactions" className="text-gray-300 hover:text-white">Transaksi</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-900">{children}</main>
    </div>
  );
}