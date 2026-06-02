import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMyConsultations } from "../../hooks/useConsultations";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../lib/socket";

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(amount ?? 0);
}

/* ─── Status config ──────────────────────────────────────────────────── */
const STATUS = {
  REQUESTED: {
    label: "Menunggu Dokter",
    emoji: "⏳",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    dot: "bg-blue-400 animate-pulse",
    desc: "Dokter belum menerima permintaanmu",
  },
  ONGOING: {
    label: "Sedang Berlangsung",
    emoji: "💬",
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
    dot: "bg-green-400 animate-pulse",
    desc: "Klik untuk masuk ke ruang chat",
  },
  COMPLETED: {
    label: "Selesai",
    emoji: "✅",
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
    desc: "Konsultasi telah selesai",
  },
  CANCELLED: {
    label: "Dibatalkan",
    emoji: "❌",
    bg: "bg-red-50",
    text: "text-red-600",
    ring: "ring-red-200",
    dot: "bg-red-400",
    desc: "Konsultasi dibatalkan",
  },
};

const PAYMENT = {
  PENDING: { label: "Belum Bayar", color: "text-amber-600", bg: "bg-amber-50" },
  PAID:    { label: "Sudah Bayar", color: "text-green-600", bg: "bg-green-50" },
  REFUNDED:{ label: "Dikembalikan", color: "text-slate-500", bg: "bg-slate-50" },
};

/* ─── Consultation Card ──────────────────────────────────────────────── */
function ConsultationCard({ consultation, navigate }) {
  const s = STATUS[consultation.status] || STATUS.CANCELLED;
  const p = PAYMENT[consultation.paymentStatus] || PAYMENT.PENDING;

  const canChat = consultation.status === "ONGOING";
  const needsPayment = consultation.paymentStatus === "PENDING";

  return (
    <div className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${canChat ? "ring-2 ring-green-300" : "ring-1 ring-slate-100"}`}>
      {/* Status strip */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${s.dot.includes("animate") ? "animate-pulse" : ""} ${s.dot.replace("animate-pulse", "")}`} />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${s.bg} ${s.text} ${s.ring}`}>
                {s.label}
              </span>
              <p className="mt-0.5 text-[11px] text-slate-400">{s.desc}</p>
            </div>
          </div>

          {/* Payment badge */}
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${p.color} ${p.bg}`}>
            {p.label}
          </span>
        </div>

        {/* Info row */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Konsultasi</p>
            <p className="mt-0.5 font-bold text-slate-800 text-sm">#{consultation.id}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Biaya</p>
            <p className="mt-0.5 font-bold text-teal-700 text-sm">{formatCurrency(consultation.fee)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2 col-span-2 sm:col-span-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Dibuat</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-600">{formatDate(consultation.createdAt)}</p>
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

          {consultation.status === "REQUESTED" && consultation.paymentStatus === "PAID" && (
            <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2.5 text-center text-sm font-semibold text-blue-600">
              ⏳ Menunggu Dokter Accept
            </div>
          )}

          {(consultation.status === "COMPLETED" || consultation.status === "CANCELLED") && (
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

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                              */
/* ══════════════════════════════════════════════════════════════════════ */
export default function MyConsultations() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: raw, isLoading, isError, error, refetch } = useMyConsultations();
  const consultations = Array.isArray(raw?.data) ? raw.data
                      : Array.isArray(raw)        ? raw
                      : [];

  /* Sort: ONGOING first, then REQUESTED, then rest by date */
  const sorted = [...consultations].sort((a, b) => {
    const order = { ONGOING: 0, REQUESTED: 1, COMPLETED: 2, CANCELLED: 3 };
    const oa = order[a.status] ?? 9;
    const ob = order[b.status] ?? 9;
    if (oa !== ob) return oa - ob;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  /* Real-time: listen for consultation_accepted event */
  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleAccepted = () => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
    };

    socket.on("consultation_accepted", handleAccepted);
    socket.on("consultation_started", handleAccepted);
    return () => {
      socket.off("consultation_accepted", handleAccepted);
      socket.off("consultation_started", handleAccepted);
    };
  }, [token, queryClient]);

  /* Poll every 10 seconds if there's a REQUESTED & PAID consultation */
  useEffect(() => {
    const hasPendingAccept = consultations.some(
      (c) => c.status === "REQUESTED" && c.paymentStatus === "PAID"
    );
    if (!hasPendingAccept) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
    }, 10000);

    return () => clearInterval(interval);
  }, [consultations, queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold text-slate-800">
                Konsultasi Saya
              </h1>
              <p className="text-xs text-slate-400">
                {consultations.length} konsultasi ditemukan
              </p>
            </div>
            <Link
              to="/consultations"
              id="new-consultation-btn"
              className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:from-teal-600 hover:to-cyan-600"
            >
              + Konsultasi Baru
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <span className="mb-3 block text-4xl">⚠️</span>
            <p className="font-bold text-red-700">Gagal memuat konsultasi</p>
            <p className="mt-1 text-sm text-red-500">{error?.message}</p>
            <button
              onClick={refetch}
              className="mt-4 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <span className="mb-4 text-6xl">🩺</span>
            <h3 className="text-base font-bold text-slate-700">Belum ada konsultasi</h3>
            <p className="mt-1 text-sm text-slate-400">
              Mulai berkonsultasi dengan dokter terpercaya kami
            </p>
            <Link
              to="/consultations"
              className="mt-6 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600"
            >
              Cari Dokter
            </Link>
          </div>
        )}

        {!isLoading && !isError && sorted.length > 0 && (
          <div className="space-y-4">
            {/* Ongoing banner */}
            {sorted.some((c) => c.status === "ONGOING") && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <p className="text-sm font-semibold text-green-700">
                  Kamu memiliki sesi konsultasi yang sedang berlangsung!
                </p>
              </div>
            )}

            {sorted.map((c) => (
              <ConsultationCard key={c.id} consultation={c} navigate={navigate} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
