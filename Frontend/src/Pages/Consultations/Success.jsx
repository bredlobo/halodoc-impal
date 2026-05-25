import { Link, useSearchParams } from "react-router-dom";

export default function ConsultationSuccess() {
  const [searchParams] = useSearchParams();
  // Midtrans appends: ?order_id=CONS-{id}-{timestamp}&status_code=200&...
  const orderId = searchParams.get("order_id") || "";
  const match = orderId.match(/^CONS-(\d+)-/);
  const consultationId = match ? match[1] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold tracking-widest text-green-700 uppercase">
            Pembayaran Berhasil
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Konsultasimu Terdaftar!
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
            Pembayaran berhasil diproses. Dokter akan segera bergabung di ruang konsultasi.
          </p>
        </div>
      </section>

      {/* ── Success Card ─────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">Pembayaran Dikonfirmasi</h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              Terima kasih telah menggunakan layanan kami. Dokter akan segera menghubungimu dan kamu
              akan diarahkan ke ruang konsultasi.
            </p>

            {/* Steps */}
            <div className="mt-8 grid gap-3 text-left">
              {[
                { icon: "✓", label: "Pembayaran diterima" },
                { icon: "📋", label: "Dokter mendapat notifikasi" },
                { icon: "💬", label: "Sesi konsultasi akan segera dimulai" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{step.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/my-consultations"
                id="go-to-my-consultations"
                className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
              >
                📋 Lihat Status Konsultasi
              </Link>
              {consultationId && (
                <Link
                  to={`/consultations/${consultationId}/chat`}
                  id="go-to-chat"
                  className="rounded-xl border border-teal-200 bg-white px-6 py-3 text-sm font-bold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  💬 Buka Ruang Chat
                </Link>
              )}
              <Link
                to="/"
                id="go-to-home"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
