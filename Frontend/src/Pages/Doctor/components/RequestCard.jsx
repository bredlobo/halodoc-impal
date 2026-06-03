import { useState, useEffect } from "react";
import { formatCountdown, timeAgo } from "../../Consultations/helpers/formatters";

/**
 * Kartu permintaan konsultasi masuk untuk dokter.
 * Menampilkan info pasien, countdown, dan tombol terima/tolak.
 */
export default function RequestCard({ consultation, onAccept, onDecline, isLoading }) {
  const patient = consultation.patient;
  const initials =
    patient?.fullName
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "P";

  const [countdown, setCountdown] = useState(
    formatCountdown(consultation.createdAt)
  );

  useEffect(() => {
    if (countdown.remaining <= 0) return;
    const timer = setInterval(() => {
      setCountdown(formatCountdown(consultation.createdAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [consultation.createdAt]);

  const isExpired = countdown.remaining <= 0;
  const isUrgent = countdown.remaining <= 60 && countdown.remaining > 0;

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 ${
        isExpired
          ? "border-slate-200 opacity-60"
          : isUrgent
          ? "border-red-200 ring-2 ring-red-100"
          : "border-slate-200 hover:shadow-md"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-base font-extrabold text-white shadow">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-extrabold text-slate-800">
              {patient?.fullName || `Pasien #${consultation.patientId}`}
            </h3>
            {/* Countdown badge */}
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isExpired
                  ? "bg-slate-100 text-slate-400"
                  : isUrgent
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {isExpired ? "Kadaluarsa" : `⏱ ${countdown.label}`}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {patient?.email} · {timeAgo(consultation.createdAt)}
          </p>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Biaya
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-teal-600">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(consultation.fee)}
          </p>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Status
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-blue-600">
            Menunggu
          </p>
        </div>
        <div className="flex-1 rounded-xl bg-slate-50 px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Konsultasi
          </p>
          <p className="mt-0.5 text-sm font-extrabold text-slate-700">
            #{consultation.id}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {!isExpired && (
        <div className="mt-4 flex gap-3">
          <button
            id={`decline-btn-${consultation.id}`}
            onClick={() => onDecline(consultation.id)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            ✕ Tolak
          </button>
          <button
            id={`accept-btn-${consultation.id}`}
            onClick={() => onAccept(consultation.id)}
            disabled={isLoading}
            className="flex-[2] rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Memproses...
              </span>
            ) : (
              "✓ Terima Konsultasi"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
