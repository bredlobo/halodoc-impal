import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "../../hooks/useConsultations";
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

  const [verifyDone, setVerifyDone] = useState(false);

  // Verify payment status from Midtrans API right away
  const { data: verifyData, isLoading: verifying, isError: verifyFailed } =
    useVerifyPayment(consultationId);

  // After verify completes, refresh my-consultations cache
  useEffect(() => {
    if (!verifying && verifyData && !verifyDone) {
      setVerifyDone(true);
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["consultation", consultationId] });
    }
  }, [verifying, verifyData, verifyDone, consultationId, queryClient]);

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
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.55] text-text-secondary">
            Pembayaran berhasil diproses. Dokter akan segera bergabung di ruang konsultasi.
          </p>
        </div>
      </section>

      {/* ── Success Card ─────────────────────────────────────────────── */}
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="rounded-[21px] bg-background p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-light">
              <CheckCircle2 size={48} strokeWidth={1.5} className="text-success" />
            </div>

            <h2 className="text-[18px] font-semibold text-text-primary">Pembayaran Dikonfirmasi</h2>
            <p className="mt-3 text-[14px] leading-[1.55] text-text-secondary">
              Terima kasih telah menggunakan layanan kami. Dokter akan segera menghubungi Anda.
            </p>

            {/* Payment status indicator */}
            {verifying && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-warning-light px-4 py-2.5">
                <Loader2 size={16} className="animate-spin text-warning" />
                <span className="text-[13px] font-semibold text-warning">
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
                <div key={i} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
                  <step.Icon size={18} strokeWidth={1.75} className="text-primary" />
                  <span className="text-[14px] font-medium text-text-primary">{step.label}</span>
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
