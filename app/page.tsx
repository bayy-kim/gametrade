import Link from 'next/link';
import { Shield, Search, MessageCircle, ArrowRight } from 'lucide-react';
import { getUserFromCookie } from '@/lib/auth';

export default async function HomePage() {
  const user = await getUserFromCookie();

  // ========== TAMPILAN SETELAH LOGIN (DASHBOARD) ==========
  if (user) {
    const u = user as any;
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[80vh] px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Selamat datang,{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {u.username}
          </span>
          !
        </h1>
        <p className="text-gray-300 max-w-xl mb-8">
          Mau jual, tukar, atau cari akun game impian? Semua aman dengan verifikasi AI & escrow.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/accounts"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <Search className="w-5 h-5" /> Cari Akun
          </Link>
          <Link
            href="/post"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" /> Jual / Tukar Akun
          </Link>
          {(user as any).role === 'admin' && (
  <Link
    href="/admin"
    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
  >
    🛡️ Admin Panel
  </Link>
)}
        </div>
      </div>
    );
  }

  // ========== TAMPILAN SEBELUM LOGIN (LANDING PAGE) ==========
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      {/* Bagian Atas: Hero Section */}
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
  GameTrade
</h1>
<p className="text-gray-300 max-w-xl mb-2 text-lg">
  Marketplace jual beli & tukar akun game pertama dengan{' '}
  <strong className="text-white">verifikasi AI</strong>.
</p>
{/* Bagian teks tambahan */}
<p className="text-gray-500 max-w-md mb-8 text-sm italic">
  "Jaga transaksimu, jaga akunmu. Kami hadir untuk membuat setiap tukar guling lebih aman dan terpercaya."
</p>
        <p className="text-gray-400 max-w-md mb-8 text-sm">
          Setiap akun dicek keasliannya sebelum tayang. Transaksi aman dengan sistem escrow.
          Biaya admin hanya Rp5.000.
        </p>

        {/* Tombol Login & Register - lebih rapat */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Daftar
          </Link>
        </div>
      </div>

      {/* Bagian Bawah: Fitur / Penjelasan Web */}
      <div className="py-16 w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          Mengapa <span className="text-blue-400">GameTrade</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <Shield className="w-10 h-10 text-blue-400 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-1">Verifikasi AI</h3>
            <p className="text-sm text-gray-400">
              Akun dicek ID & Google-nya otomatis. Hanya akun asli yang bisa dijual.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <Search className="w-10 h-10 text-purple-400 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-1">ML & Free Fire</h3>
            <p className="text-sm text-gray-400">
              Fokus ke dua game terpopuler. Cari rank, skin, atau level impianmu.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <MessageCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <h3 className="font-bold text-lg mb-1">Escrow Aman</h3>
            <p className="text-sm text-gray-400">
              Uang ditahan sistem sampai kamu konfirmasi. Tidak ada lagi penipuan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}