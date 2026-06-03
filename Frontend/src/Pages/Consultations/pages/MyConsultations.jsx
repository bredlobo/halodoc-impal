import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useMyConsultations } from "../../../hooks/useConsultations";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../../lib/socket";
import {
  Clock, MessageSquare, Check, X, Plus, Loader2,
  AlertTriangle, Stethoscope, CreditCard, ClipboardList, ArrowRight,
} from "lucide-react";

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
    Icon: Clock,
    bg: "bg-warning-light",
    text: "text-warning",
    dotColor: "bg-warning",
    desc: "Dokter belum menerima permintaan",
  },
  ONGOING: {
    label: "Sedang Berlangsung",
    Icon: MessageSquare,
    bg: "bg-success-light",
    text: "text-success",
    dotColor: "bg-success animate-pulse",
    desc: "Klik untuk masuk ke ruang chat",
  },
  COMPLETED: {
    label: "Selesai",
    Icon: Check,
    bg: "bg-surface",
    text: "text-text-secondary",
    dotColor: "bg-text-secondary",
    desc: "Konsultasi telah selesai",
  },
  CANCELLED: {
    label: "Dibatalkan",
    Icon: X,
    bg: "bg-error-light",
    text: "text-error",
    dotColor: "bg-error",
    desc: "Konsultasi dibatalkan",
  },
};

const PAYMENT = {
  PENDING: { label: "Belum Bayar", text: "text-warning", bg: "bg-warning-light" },
  PAID:    { label: "Sudah Bayar", text: "text-success", bg: "bg-success-light" },
  REFUNDED:{ label: "Dikembalikan", text: "text-text-secondary", bg: "bg-surface" },
};

/* ─── Consultation Card ──────────────────────────────────────────────── */
function ConsultationCard({ consultation }) {
  const s = STATUS[consultation.status] || STATUS.CANCELLED;
  const p = PAYMENT[consultation.paymentStatus] || PAYMENT.PENDING;

  const canChat = consultation.status === "ONGOING";
  const needsPayment = consultation.paymentStatus === "PENDING";

  return (
    <div className={`group relative rounded-xl bg-background p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:shadow-md ${canChat ? "ring-2 ring-success/30" : ""}`}>
      {/* Status strip */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${s.dotColor.replace("animate-pulse", "")}`} />

      <div className="pl-2">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <s.Icon size={20} strokeWidth={1.75} className={s.text} />
            <div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.bg} ${s.text}`}>
                {s.label}
              </span>
              <p className="mt-0.5 text-[11px] text-text-secondary">{s.desc}</p>
            </div>
          </div>

          {/* Payment badge */}
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${p.text} ${p.bg}`}>
            {p.label}
          </span>
        </div>

        {/* Info row */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-surface px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Konsultasi</p>
            <p className="mt-0.5 text-[14px] font-semibold text-text-primary">#{consultation.id}</p>
          </div>
          <div className="rounded-xl bg-surface px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Biaya</p>
            <p className="mt-0.5 text-[14px] font-semibold text-primary">{formatCurrency(consultation.fee)}</p>
          </div>
          <div className="col-span-2 rounded-xl bg-surface px-3 py-2 sm:col-span-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">Dibuat</p>
            <p className="mt-0.5 text-[13px] font-medium text-text-secondary">{formatDate(consultation.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {needsPayment && consultation.status !== "CANCELLED" && (
            <Link
              to={`/consultations/${consultation.id}/payment`}
              id={`pay-btn-${consultation.id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-warning py-2.5 text-center text-[14px] font-semibold text-white transition hover:bg-[#D97706]"
            >
              <CreditCard size={14} strokeWidth={2} />
              Bayar Sekarang
            </Link>
          )}

          {canChat && (
            <Link
              to={`/consultations/${consultation.id}/chat`}
              id={`chat-btn-${consultation.id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-center text-[14px] font-semibold text-white transition hover:bg-primary-hover"
            >
              <MessageSquare size={14} strokeWidth={2} />
              Masuk Chat
            </Link>
          )}

          {consultation.status === "REQUESTED" && consultation.paymentStatus === "PAID" && (
            <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-warning-light py-2.5 text-center text-[14px] font-semibold text-warning">
              <Clock size={14} strokeWidth={2} />
              Menunggu Dokter Accept
            </div>
          )}

          {(consultation.status === "COMPLETED" || consultation.status === "CANCELLED") && (
            <Link
              to={`/consultations/${consultation.id}/chat`}
              id={`history-btn-${consultation.id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface py-2.5 text-center text-[14px] font-semibold text-text-secondary transition hover:bg-primary-light hover:text-primary"
            >
              <ClipboardList size={14} strokeWidth={2} />
              Lihat Riwayat
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
  const { token } = useAuth();
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
    <div className="min-h-screen bg-surface">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[18px] font-semibold text-text-primary">
                Konsultasi Saya
              </h1>
              <p className="text-[13px] text-text-secondary">
                {consultations.length} konsultasi ditemukan
              </p>
            </div>
            <Link
              to="/consultations"
              id="new-consultation-btn"
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
            >
              <Plus size={16} strokeWidth={2} />
              Konsultasi Baru
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-xl bg-border" />
            ))}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center rounded-xl bg-error-light p-8 text-center">
            <AlertTriangle size={32} strokeWidth={1.75} className="mb-3 text-error" />
            <p className="font-semibold text-error">Gagal memuat konsultasi</p>
            <p className="mt-1 text-[14px] text-text-secondary">{error?.message}</p>
            <button
              onClick={refetch}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-primary-hover"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!isLoading && !isError && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background py-20 text-center">
            <Stethoscope size={48} strokeWidth={1.5} className="mb-4 text-text-secondary opacity-40" />
            <h3 className="text-[16px] font-semibold text-text-primary">Belum ada konsultasi</h3>
            <p className="mt-1 text-[14px] text-text-secondary">
              Mulai berkonsultasi dengan dokter terpercaya kami
            </p>
            <Link
              to="/consultations"
              className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-primary-hover"
            >
              Cari Dokter
            </Link>
          </div>
        )}

        {!isLoading && !isError && sorted.length > 0 && (
          <div className="space-y-4">
            {/* Ongoing banner */}
            {sorted.some((c) => c.status === "ONGOING") && (
              <div className="flex items-center gap-2 rounded-xl bg-success-light px-4 py-2.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
                <p className="text-[14px] font-semibold text-success">
                  Anda memiliki sesi konsultasi yang sedang berlangsung
                </p>
              </div>
            )}

            {sorted.map((c) => (
              <ConsultationCard key={c.id} consultation={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
