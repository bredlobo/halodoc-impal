import { Link } from "react-router-dom";
import { formatDate, formatCurrency } from "../helpers/formatters";
import { CONSULTATION_STATUS, PAYMENT_STATUS } from "../../../constants/statusConfig";

/**
 * Kartu konsultasi di halaman MyConsultations (riwayat konsultasi pasien).
 * Menampilkan status, info biaya, dan tombol aksi (chat/bayar/riwayat).
 */
export default function ConsultationCard({ consultation }) {
  const s =
    CONSULTATION_STATUS[consultation.status] || CONSULTATION_STATUS.CANCELLED;
  const p =
    PAYMENT_STATUS[consultation.paymentStatus] || PAYMENT_STATUS.PENDING;

  const canChat = consultation.status === "ONGOING";
  const needsPayment = consultation.paymentStatus === "PENDING";

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        canChat ? "ring-2 ring-green-300" : "ring-1 ring-slate-100"
      }`}
    >
      {/* Status strip */}
      <div
        className={`absolute top-0 left-0 h-full w-1 rounded-l-2xl ${
          s.dot.includes("animate") ? "animate-pulse" : ""
        } ${s.dot.replace("animate-pulse", "")}`}
      />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${s.bg} ${s.text} ${s.ring}`}
              >
                {s.label}
              </span>
              <p className="mt-0.5 text-[11px] text-slate-400">{s.desc}</p>
            </div>
          </div>

          {/* Payment badge */}
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${p.color} ${p.bg}`}
          >
            {p.label}
          </span>
        </div>

        {/* Info row */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Konsultasi
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">
              #{consultation.id}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Biaya
            </p>
            <p className="mt-0.5 text-sm font-bold text-teal-700">
              {formatCurrency(consultation.fee)}
            </p>
          </div>
          <div className="col-span-2 rounded-xl bg-slate-50 px-3 py-2 sm:col-span-1">
            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Dibuat
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-600">
              {formatDate(consultation.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {needsPayment && consultation.status !== "CANCELLED" && (
            <Link
              to={`/consultations/${consultation.id}/payment`}
              id={`pay-btn-${consultation.id}`}
              className="flex-1 rounded-xl bg-amber-500 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-amber-600"
            >
              💳 Bayar Sekarang
            </Link>
          )}

          {canChat && (
            <Link
              to={`/consultations/${consultation.id}/chat`}
              id={`chat-btn-${consultation.id}`}
              className="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-2.5 text-center text-sm font-bold text-white shadow-md hover:from-teal-600 hover:to-cyan-600"
            >
              💬 Masuk Chat
            </Link>
          )}

          {consultation.status === "REQUESTED" &&
            consultation.paymentStatus === "PAID" && (
              <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-center text-sm font-semibold text-blue-600">
                ⏳ Menunggu Dokter Accept
              </div>
            )}

          {(consultation.status === "COMPLETED" ||
            consultation.status === "CANCELLED") && (
            <Link
              to={`/consultations/${consultation.id}/chat`}
              id={`history-btn-${consultation.id}`}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              📋 Lihat Riwayat
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
