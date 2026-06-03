<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationPayment.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useMidtrans, useConsultationDetail, usePayConsultation } from "../../../hooks";
import { STATUS_BADGE_STYLES, PAYMENT_BADGE_STYLES } from "../../../constants/statusConfig";
=======
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useMidtrans } from "../../hooks/useMidtrans";
import { useConsultationDetail, usePayConsultation } from "../../hooks/useConsultations";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

const STATUS_STYLES = {
  REQUESTED: "bg-warning-light text-warning",
  ONGOING: "bg-warning-light text-warning",
  COMPLETED: "bg-success-light text-success",
  CANCELLED: "bg-error-light text-error",
};

const PAYMENT_STYLES = {
  PENDING: "bg-warning-light text-warning",
  PAID: "bg-success-light text-success",
  REFUNDED: "bg-surface text-text-secondary",
};
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/ConsultationPayment.jsx

function StatusBadge({ value, styleMap }) {
  const cls = styleMap[value] ?? "bg-surface text-text-secondary";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="mx-auto max-w-xl px-4">
        <div className="animate-pulse space-y-4 rounded-xl bg-background p-8">
          <div className="mx-auto h-6 w-48 rounded bg-border" />
          <div className="h-40 rounded-xl bg-surface" />
          <div className="h-12 rounded-xl bg-border" />
        </div>
      </div>
    </div>
  );
}

export default function ConsultationPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoaded, pay } = useMidtrans();

  const { data: consultation, isLoading, isError, error, refetch } =
    useConsultationDetail(id);

  const paymentMutation = usePayConsultation(id, {
    onSuccess: (res) => {
      if (res?.data?.midtransToken) {
        pay(
          res.data.midtransToken,
          (result) => {
            console.log("Success:", result);
            navigate("/consultations/success");
          },
          (result) => {
            console.log("Pending:", result);
            alert("Pembayaran pending. Silakan selesaikan pembayaran.");
          },
          (result) => {
            console.log("Error:", result);
            alert("Pembayaran gagal. Silakan coba lagi.");
          },
          () => {
            console.log("Popup ditutup.");
          },
        );
      }
    },
    onError: (err) => {
      console.error("Payment API Error", err);
      alert("Gagal memulai pembayaran. Silakan coba lagi.");
    },
  });

  if (isLoading) return <PaymentSkeleton />;

  if (isError) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="mx-auto max-w-xl px-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-error-light py-20 text-center">
            <AlertTriangle size={40} strokeWidth={1.75} className="mb-4 text-error" />
            <h3 className="text-[16px] font-semibold text-text-primary">Gagal memuat detail pembayaran</h3>
            <p className="mt-1 max-w-sm text-[14px] text-text-secondary">
              {error?.message || "Terjadi kesalahan. Coba lagi."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const consData = consultation?.data || consultation;
  const isPaid = consData?.paymentStatus === "PAID";

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-primary-light px-3 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
            Konsultasi Online
          </span>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.25] tracking-[-0.01em] text-text-primary">
            Konfirmasi Pembayaran
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.55] text-text-secondary">
            Periksa ringkasan pesanan konsultasi dan selesaikan pembayaran untuk terhubung dengan dokter.
          </p>
        </div>
      </section>

      {/* ── Payment Card ─────────────────────────────────────────────── */}
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[550px] px-4 sm:px-6">
          <div className="overflow-hidden rounded-[21px] bg-background shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
            {/* Card Header */}
            <div className="border-b border-border bg-surface px-6 py-4">
              <h2 className="text-[14px] font-semibold uppercase tracking-wider text-text-secondary">
                Ringkasan Pesanan
              </h2>
            </div>

            {/* Order Details */}
            <div className="divide-y divide-border px-6">
              <div className="flex items-center justify-between py-4">
                <span className="text-[14px] text-text-secondary">ID Konsultasi</span>
                <span className="font-semibold text-text-primary">CONS-{consData?.id}</span>
              </div>

              <div className="flex items-center justify-between py-4">
<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationPayment.jsx
                <span className="text-sm text-slate-500">Status Konsultasi</span>
                <StatusBadge value={consData?.status} styleMap={STATUS_BADGE_STYLES} />
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">Status Pembayaran</span>
                <StatusBadge value={consData?.paymentStatus} styleMap={PAYMENT_BADGE_STYLES} />
=======
                <span className="text-[14px] text-text-secondary">Status Konsultasi</span>
                <StatusBadge value={consData?.status} styleMap={STATUS_STYLES} />
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-[14px] text-text-secondary">Status Pembayaran</span>
                <StatusBadge value={consData?.paymentStatus} styleMap={PAYMENT_STYLES} />
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/ConsultationPayment.jsx
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-[16px] font-semibold text-text-primary">Total Biaya</span>
                <span className="text-[24px] font-bold text-primary">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(consData?.fee ?? 0)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-border px-6 py-5">
              <button
                id="pay-button"
                onClick={() => paymentMutation.mutate()}
                disabled={!isLoaded || paymentMutation.isPending || isPaid}
                className={`w-full rounded-xl py-[13px] text-[14px] font-semibold leading-[1] tracking-[0.01em] transition-all duration-150 ${
                  isPaid
                    ? "bg-success text-white cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-hover disabled:bg-border disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                }`}
              >
                {paymentMutation.isPending
                  ? "Memproses..."
                  : isPaid
                  ? "Sudah Dibayar"
                  : "Bayar dengan Midtrans"}
              </button>
              <p className="mt-3 text-center text-[11px] text-text-secondary">
                Pembayaran aman diproses oleh Midtrans
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
<<<<<<< HEAD:Frontend/src/Pages/Consultations/pages/ConsultationPayment.jsx
            <a
              href="/consultations"
              className="text-sm font-semibold text-teal-600 hover:underline"
            >
              ← Kembali ke Daftar Dokter
=======
            <a href="/consultations" className="text-[14px] font-semibold text-primary hover:underline">
              Kembali ke Daftar Dokter
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/ConsultationPayment.jsx
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
