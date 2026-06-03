import { Link } from "react-router-dom";

/**
 * Layar tunggu yang tampil ketika konsultasi berstatus REQUESTED + PAID.
 * Pasien menunggu dokter menerima konsultasi.
 */
export default function WaitingScreen({ consultationId }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
      {/* Pulsing ring animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-20" />
        <div className="animation-delay-150 absolute inset-2 animate-ping rounded-full bg-teal-300 opacity-20" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 shadow-xl">
          <span className="text-4xl">⏳</span>
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-slate-800">Menunggu Dokter</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Permintaan konsultasi kamu sudah dibayar. Dokter sedang memproses
        permintaanmu — halaman ini akan otomatis terbuka saat dokter menerima.
      </p>

      {/* Animated dots */}
      <div className="mt-6 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-teal-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Konsultasi #{consultationId} · Auto-refresh setiap 10 detik
      </p>

      <Link
        to="/my-consultations"
        className="mt-8 text-xs font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700"
      >
        ← Kembali ke Daftar Konsultasi
      </Link>
    </div>
  );
}
