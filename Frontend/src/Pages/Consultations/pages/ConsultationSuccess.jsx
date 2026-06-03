import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "../../../hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function ConsultationSuccess() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Midtrans appends: ?order_id=CONS-{id}-{timestamp}&status_code=200&transaction_status=settlement
  const orderId = searchParams.get("order_id") || "";
  const transactionStatus = searchParams.get("transaction_status") || "";
  const match = orderId.match(/^CONS-(\d+)-/);
  const consultationId = match ? match[1] : null;

  const verifyDoneRef = useRef(false);

  const { data: verifyData, isLoading: verifying } =
    useVerifyPayment(consultationId);

  // Setelah verifikasi selesai, refresh cache konsultasi
  useEffect(() => {
    if (!verifying && verifyData && !verifyDoneRef.current) {
      verifyDoneRef.current = true;
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
      queryClient.invalidateQueries({
        queryKey: ["consultation", consultationId],
      });
    }
  }, [verifying, verifyData, consultationId, queryClient]);

  const isPaid =
    verifyData?.data?.paymentStatus === "PAID" ||
    transactionStatus === "settlement" ||
    transactionStatus === "capture";

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
            Pembayaran berhasil diproses. Dokter akan segera bergabung di ruang
            konsultasi.
          </p>
        </div>
      </section>

      {/* ── Success Card ─────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900">
              Pembayaran Dikonfirmasi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Terima kasih telah menggunakan layanan kami. Dokter akan segera
              menghubungimu.
            </p>

            {/* Payment status indicator */}
            {verifying && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5">
                <svg
                  className="h-4 w-4 animate-spin text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span className="text-xs font-semibold text-blue-700">
                  Mengonfirmasi status pembayaran...
                </span>
              </div>
            )}
            {!verifying && isPaid && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-2.5">
                <span className="text-green-600">✓</span>
                <span className="text-xs font-semibold text-green-700">
                  Status pembayaran: LUNAS
                </span>
              </div>
            )}

            {/* Steps */}
            <div className="mt-8 grid gap-3 text-left">
              {[
                { icon: "✓", label: "Pembayaran diterima" },
                { icon: "📋", label: "Dokter mendapat notifikasi" },
                { icon: "💬", label: "Sesi konsultasi akan segera dimulai" },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/history"
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
