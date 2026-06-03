import { useNavigate, useParams } from "react-router-dom";
import { useMidtrans } from "../hooks/useMidtrans";
import { useConsultationDetail, usePayConsultation } from "../hooks/useConsultations";
import { STATUS_BADGE_STYLES, PAYMENT_BADGE_STYLES } from "../constants/statusConfig";

function StatusBadge({ value, styleMap }) {
  const cls = styleMap[value] ?? "bg-slate-50 text-slate-700 ring-slate-100";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${cls}`}>
      {value}
    </span>
  );
}

function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-xl px-4">
        <div className="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
          <div className="h-6 w-48 rounded bg-slate-200 mx-auto" />
          <div className="h-40 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-200" />
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
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-xl px-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-20 text-center">
            <span className="mb-4 text-5xl">⚠️</span>
            <h3 className="text-base font-bold text-slate-800">Gagal memuat detail pembayaran</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {error?.message || "Terjadi kesalahan. Coba lagi."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
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
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold tracking-widest text-teal-700 uppercase">
            Konsultasi Online
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Konfirmasi Pembayaran
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
            Periksa ringkasan pesanan konsultasimu dan selesaikan pembayaran untuk terhubung dengan dokter.
          </p>
        </div>
      </section>

      {/* ── Payment Card ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Ringkasan Pesanan
              </h2>
            </div>

            {/* Order Details */}
            <div className="divide-y divide-slate-100 px-6">
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">ID Konsultasi</span>
                <span className="font-semibold text-slate-800">CONS-{consData?.id}</span>
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">Status Konsultasi</span>
                <StatusBadge value={consData?.status} styleMap={STATUS_BADGE_STYLES} />
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-slate-500">Status Pembayaran</span>
                <StatusBadge value={consData?.paymentStatus} styleMap={PAYMENT_BADGE_STYLES} />
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="text-base font-bold text-slate-800">Total Biaya</span>
                <span className="text-2xl font-extrabold text-teal-600">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(consData?.fee ?? 0)}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-slate-100 px-6 py-5">
              <button
                id="pay-button"
                onClick={() => paymentMutation.mutate()}
                disabled={!isLoaded || paymentMutation.isPending || isPaid}
                className={`w-full rounded-xl py-4 text-sm font-bold transition-all duration-200 shadow-sm ${
                  isPaid
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                }`}
              >
                {paymentMutation.isPending
                  ? "Memproses..."
                  : isPaid
                  ? "✓ Sudah Dibayar"
                  : "Bayar dengan Midtrans"}
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Pembayaran aman diproses oleh Midtrans
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <a
              href="/consultations"
              className="text-sm font-semibold text-teal-600 hover:underline"
            >
              ← Kembali ke Daftar Dokter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
