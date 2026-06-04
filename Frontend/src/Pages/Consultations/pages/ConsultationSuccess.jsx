import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyPayment } from "../../../hooks/useConsultations";
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

  // Verify payment status from Midtrans API right away
  const { data: verifyData, isLoading: verifying } =
    useVerifyPayment(consultationId);

  // After verify completes, refresh my-consultations cache
  useEffect(() => {
    if (!verifying && verifyData && !verifyDoneRef.current) {
      verifyDoneRef.current = true;
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
      queryClient.invalidateQueries({ queryKey: ["consultation", consultationId] });
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
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.55] text-text-secondary">
            Pembayaran berhasil diproses. Dokter akan segera bergabung di ruang konsultasi.
          </p>
        </div>
      </section>

      {/* ── Success Card ─────────────────────────────────────────────── */}
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <div className="rounded-[24px] bg-background p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/40">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-light text-success shadow-[0_0_0_8px_rgba(34,197,94,0.04)]">
              <CheckCircle2 size={40} strokeWidth={1.5} />
            </div>

            <h2 className="text-[20px] font-bold tracking-[-0.01em] text-text-primary">Pembayaran Dikonfirmasi</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              Terima kasih. Pembayaran Anda telah kami terima dan sesi Anda siap dimulai.
            </p>

            {/* Payment status indicator */}
            {verifying && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-warning-light px-4 py-2.5">
                <Loader2 size={16} className="animate-spin text-warning" />
                <span className="text-[13px] font-semibold text-warning">
                  Memverifikasi transaksi...
                </span>
              </div>
            )}
            {!verifying && isPaid && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-success-light px-4 py-2.5">
                <Check size={16} strokeWidth={2.5} className="text-success" />
                <span className="text-[13px] font-semibold text-success">
                  Status: Terverifikasi (LUNAS)
                </span>
              </div>
            )}

            {/* Minimalist Vertical Steps Timeline */}
            <div className="mt-8 border-l-2 border-border/60 pl-6 ml-4 space-y-6 text-left relative">
              {[
                { label: "Pembayaran Diterima", desc: "Dana berhasil diamankan oleh sistem." },
                { label: "Notifikasi Terkirim", desc: "Dokter sedang bersiap membuka konsultasi." },
                { label: "Sesi Siap", desc: "Silakan masuk ke ruang chat konsultasi." }
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[33px] top-1 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-success text-white ring-4 ring-background">
                    <Check size={8} strokeWidth={3} />
                  </div>
                  <h4 className="text-[13px] font-semibold leading-none text-text-primary">{step.label}</h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-normal">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <Link
                to="/history"
                id="go-to-my-consultations"
                className="flex h-11 w-full sm:w-[130px] items-center justify-center rounded-xl bg-primary px-4 text-[13px] font-semibold text-white transition-all hover:bg-primary-hover text-center"
              >
                Cek Status
              </Link>
              {consultationId && (
                <Link
                  to={`/consultations/${consultationId}/chat`}
                  id="go-to-chat"
                  className="flex h-11 w-full sm:w-[130px] items-center justify-center rounded-xl border border-border bg-background px-4 text-[13px] font-semibold text-text-primary transition-colors hover:bg-surface text-center"
                >
                  Buka Chat
                </Link>
              )}
              <Link
                to="/"
                id="go-to-home"
                className="flex h-11 w-full sm:w-[130px] items-center justify-center rounded-xl bg-surface px-4 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-border hover:text-text-primary text-center"
              >
                Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
