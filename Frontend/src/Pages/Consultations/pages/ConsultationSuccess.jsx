import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "../../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, ClipboardList, MessageSquare, Check, Bell } from "lucide-react";

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
    <div className="min-h-screen bg-surface">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-success-light px-3 py-1 text-[11px] font-semibold tracking-widest text-success uppercase">
            Pembayaran Berhasil
          </span>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.25] tracking-[-0.01em] text-text-primary">
            Konsultasi Terdaftar
          </h1>
<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationSuccess.jsx
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
            Pembayaran berhasil diproses. Dokter akan segera bergabung di ruang
            konsultasi.
=======
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.55] text-text-secondary">
            Pembayaran berhasil diproses. Dokter akan segera bergabung di ruang konsultasi.
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/Success.jsx
          </p>
        </div>
      </section>

      {/* ── Success Card ─────────────────────────────────────────────── */}
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="rounded-[21px] bg-background p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
            {/* Icon */}
<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationSuccess.jsx
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
=======
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-light">
              <CheckCircle2 size={48} strokeWidth={1.5} className="text-success" />
            </div>

            <h2 className="text-[18px] font-semibold text-text-primary">Pembayaran Dikonfirmasi</h2>
            <p className="mt-3 text-[14px] leading-[1.55] text-text-secondary">
              Terima kasih telah menggunakan layanan kami. Dokter akan segera menghubungi Anda.
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/Success.jsx
            </p>

            {/* Payment status indicator */}
            {verifying && (
<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationSuccess.jsx
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
=======
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-warning-light px-4 py-2.5">
                <Loader2 size={16} className="animate-spin text-warning" />
                <span className="text-[13px] font-semibold text-warning">
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/Success.jsx
                  Mengonfirmasi status pembayaran...
                </span>
              </div>
            )}
            {!verifying && isPaid && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-success-light px-4 py-2.5">
                <Check size={16} strokeWidth={2.5} className="text-success" />
                <span className="text-[13px] font-semibold text-success">
                  Status pembayaran: LUNAS
                </span>
              </div>
            )}

            {/* Steps */}
            <div className="mt-8 grid gap-3 text-left">
              {[
                { Icon: Check, label: "Pembayaran diterima" },
                { Icon: Bell, label: "Dokter mendapat notifikasi" },
                { Icon: MessageSquare, label: "Sesi konsultasi akan segera dimulai" },
              ].map((step, i) => (
<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationSuccess.jsx
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span className="text-lg">{step.icon}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {step.label}
                  </span>
=======
                <div key={i} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
                  <step.Icon size={18} strokeWidth={1.75} className="text-primary" />
                  <span className="text-[14px] font-medium text-text-primary">{step.label}</span>
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/Success.jsx
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/history"
                id="go-to-my-consultations"
                className="rounded-xl bg-primary px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-primary-hover"
              >
                Lihat Status Konsultasi
              </Link>
              {consultationId && (
                <Link
                  to={`/consultations/${consultationId}/chat`}
                  id="go-to-chat"
                  className="rounded-xl border border-border bg-background px-6 py-3 text-[14px] font-semibold text-text-primary transition-colors hover:bg-primary-light hover:text-primary"
                >
                  Buka Ruang Chat
                </Link>
              )}
              <Link
                to="/"
                id="go-to-home"
                className="rounded-xl bg-surface px-6 py-3 text-[14px] font-semibold text-text-secondary transition-colors hover:bg-border hover:text-text-primary"
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
