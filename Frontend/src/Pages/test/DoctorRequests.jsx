import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMyConsultations, useRespondToConsultation } from "../../hooks/useConsultations";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../lib/socket";
import {
  ArrowLeft, RefreshCw, LogOut, Clock, Check, X,
  Loader2, AlertTriangle, PartyPopper,
} from "lucide-react";

/* ─── JWT Decode ─────────────────────────────────────────────────────── */
function decodeTokenRole(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).role || null;
  } catch {
    return null;
  }
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}d yang lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  return `${Math.floor(diff / 3600)} jam yang lalu`;
}

function formatCountdown(createdAt) {
  const expiredAt = new Date(createdAt).getTime() + 5 * 60 * 1000;
  const remaining = Math.max(0, Math.floor((expiredAt - Date.now()) / 1000));
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  return { remaining, label: `${m}:${s.toString().padStart(2, "0")}` };
}

/* ─── Request Card ───────────────────────────────────────────────────── */
function RequestCard({ consultation, onAccept, onDecline, isLoading }) {
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
      className={`rounded-xl bg-background p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 ${
        isExpired
          ? "opacity-60"
          : isUrgent
          ? "ring-2 ring-error/30"
          : "hover:shadow-md"
      }`}
    >
      {/* Card header */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-[16px] font-bold text-primary">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[14px] font-semibold text-text-primary">
              {patient?.fullName || `Pasien #${consultation.patientId}`}
            </h3>
            {/* Countdown badge */}
            <span
              className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                isExpired
                  ? "bg-surface text-text-secondary"
                  : isUrgent
                  ? "bg-error-light text-error animate-pulse"
                  : "bg-warning-light text-warning"
              }`}
            >
              <Clock size={12} strokeWidth={2} />
              {isExpired ? "Kadaluarsa" : countdown.label}
            </span>
          </div>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            {patient?.email} · {timeAgo(consultation.createdAt)}
          </p>
        </div>
      </div>

      {/* Info row */}
      <div className="mt-4 flex gap-3">
        <div className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Biaya
          </p>
          <p className="mt-0.5 text-[14px] font-bold text-primary">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(consultation.fee)}
          </p>
        </div>
        <div className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Status
          </p>
          <p className="mt-0.5 text-[14px] font-bold text-warning">
            Menunggu
          </p>
        </div>
        <div className="flex-1 rounded-xl bg-surface px-3 py-2.5 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
            Konsultasi
          </p>
          <p className="mt-0.5 text-[14px] font-bold text-text-primary">
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
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-error/20 bg-error-light py-2.5 text-[14px] font-semibold text-error transition hover:bg-error/10 disabled:opacity-60"
          >
            <X size={14} strokeWidth={2} />
            Tolak
          </button>
          <button
            id={`accept-btn-${consultation.id}`}
            onClick={() => onAccept(consultation.id)}
            disabled={isLoading}
            className="flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Memproses...
              </span>
            ) : (
              <>
                <Check size={14} strokeWidth={2.5} />
                Terima Konsultasi
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                              */
/* ══════════════════════════════════════════════════════════════════════ */
export default function DoctorRequests() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);

  const role = user?.role || decodeTokenRole(token);

  /* Fetch all consultations */
  const { data: raw, isLoading, isError, error, refetch } = useMyConsultations();
  const allConsultations = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  const requests = allConsultations.filter((c) => c.status === "REQUESTED");

  /* Single respond mutation — consultationId passed at call time */
  const respondMutation = useRespondToConsultation({
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
      setProcessingId(null);
      if (variables.action === "ACCEPT") {
        showToast("Konsultasi diterima! Pasien sekarang bisa chat.", "success");
        setTimeout(() => navigate("/doctor/dashboard"), 1500);
      } else {
        showToast("Permintaan ditolak.", "info");
      }
    },
    onError: (err) => {
      setProcessingId(null);
      showToast(err?.message || "Gagal merespons permintaan.", "error");
    },
  });

  function showToast(msg, type = "info") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* Auth guard */
  useEffect(() => {
    if (!user && !token) {
      navigate("/auth", { replace: true });
      return;
    }
    if (role && role !== "DOCTOR") navigate("/", { replace: true });
  }, [user, token, role, navigate]);

  /* Real-time: refresh when new requests arrive */
  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleNew = () => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
      showToast("Permintaan baru masuk!", "success");
    };

    socket.on("new_consultation_request", handleNew);
    return () => socket.off("new_consultation_request", handleNew);
  }, [token, queryClient]);

  const handleAccept = (id) => {
    setProcessingId(id);
    respondMutation.mutate({ consultationId: id, action: "ACCEPT" });
  };

  const handleDecline = (id) => {
    setProcessingId(id);
    respondMutation.mutate({ consultationId: id, action: "DECLINE" });
  };

  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <Loader2 size={28} strokeWidth={2} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-success text-white"
              : toast.type === "error"
              ? "bg-error text-white"
              : "bg-text-primary text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background px-5 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="back-to-dashboard"
              onClick={() => navigate("/doctor/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-text-secondary transition hover:bg-surface"
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[14px] font-semibold leading-none text-text-primary">
                Permintaan Konsultasi
              </h1>
              <p className="mt-0.5 text-[13px] text-text-secondary">
                {requests.length} permintaan menunggu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-[13px] font-semibold text-text-secondary transition hover:bg-surface"
            >
              <RefreshCw size={14} strokeWidth={2} />
              Refresh
            </button>
            <button
              id="doctor-requests-logout"
              onClick={() => { logout(); navigate("/auth"); }}
              className="flex items-center gap-1.5 rounded-xl border border-error/20 bg-error-light px-3 py-1.5 text-[13px] font-semibold text-error transition hover:bg-error/10"
            >
              <LogOut size={14} strokeWidth={2} />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-xl bg-border"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center rounded-xl bg-error-light p-8 text-center">
            <AlertTriangle size={32} strokeWidth={1.75} className="mb-3 text-error" />
            <p className="font-semibold text-error">Gagal memuat permintaan</p>
            <p className="mt-1 text-[14px] text-text-secondary">{error?.message}</p>
            <button
              onClick={refetch}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-primary-hover"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background py-20 text-center">
            <PartyPopper size={48} strokeWidth={1.5} className="mb-4 text-text-secondary opacity-40" />
            <h3 className="text-[16px] font-semibold text-text-primary">
              Tidak ada permintaan
            </h3>
            <p className="mt-1 text-[14px] text-text-secondary">
              Belum ada pasien yang mengajukan konsultasi saat ini.
            </p>
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-primary-hover"
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}

        {/* Request cards */}
        {!isLoading && !isError && requests.length > 0 && (
          <div className="space-y-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <p className="text-[13px] font-semibold text-text-secondary">
                Memperbarui secara real-time
              </p>
            </div>

            {requests.map((c) => (
              <RequestCard
                key={c.id}
                consultation={c}
                onAccept={handleAccept}
                onDecline={handleDecline}
                isLoading={processingId === c.id && respondMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
