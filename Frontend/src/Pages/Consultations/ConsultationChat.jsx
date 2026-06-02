import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  useConsultationDetail,
  useSendMessage,
  useChatHistory,
} from "../../hooks/useConsultations";
import { useConsultationChat } from "../../hooks/useConsultationChat";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../lib/socket";

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─── Chat Bubble ────────────────────────────────────────────────────── */
function ChatBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isMine
            ? "rounded-br-sm bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
            : "rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`mt-1 text-[10px] text-right ${
            isMine ? "text-teal-100" : "text-slate-400"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

/* ─── Waiting Screen (REQUESTED + PAID) ─────────────────────────────── */
function WaitingScreen({ consultationId, onStatusChange }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
      {/* Pulsing ring animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-20" />
        <div className="absolute inset-2 animate-ping rounded-full bg-teal-300 opacity-20 animation-delay-150" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 shadow-xl">
          <span className="text-4xl">⏳</span>
        </div>
      </div>

      <h2 className="text-xl font-extrabold text-slate-800">
        Menunggu Dokter
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Permintaan konsultasi kamu sudah dibayar. Dokter sedang memproses
        permintaanmu — halaman ini akan otomatis terbuka saat dokter menerima.
      </p>

      {/* Animated dots */}
      <div className="mt-6 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-teal-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Konsultasi #{consultationId} · Auto-refresh setiap 10 detik
      </p>

      <Link
        to="/my-consultations"
        className="mt-8 text-xs font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700"
      >
        ← Kembali ke Daftar Konsultasi
      </Link>
    </div>
  );
}

/* ─── Completed/Cancelled Screen ────────────────────────────────────── */
function StatusScreen({ status, consultationId }) {
  const isCompleted = status === "COMPLETED";
  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <span className="mb-4 text-7xl">{isCompleted ? "✅" : "❌"}</span>
      <h2 className="text-xl font-bold text-slate-800">
        {isCompleted ? "Konsultasi Selesai" : "Konsultasi Dibatalkan"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {isCompleted
          ? "Sesi konsultasi ini telah berakhir."
          : "Konsultasi ini telah dibatalkan."}
      </p>
      <Link
        to="/my-consultations"
        className="mt-6 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Kembali ke Konsultasi Saya
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN CHAT PAGE                                                         */
/* ══════════════════════════════════════════════════════════════════════ */
export default function ConsultationChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  /* ── Data fetching ────────────────────────────────────────────────── */
  const { data: consultRaw, isLoading: loadingConsult } =
    useConsultationDetail(id);
  const { data: historyRaw, isLoading: loadingHistory } = useChatHistory(id);

  const consult = consultRaw?.data || consultRaw;
  const history = Array.isArray(historyRaw?.data)
    ? historyRaw.data
    : Array.isArray(historyRaw)
    ? historyRaw
    : [];

  /* ── Socket: real-time messages (only when ONGOING) ──────────────── */
  const { messages, isConnected, connectionError } = useConsultationChat(
    consult?.status === "ONGOING" ? id : null,
    history
  );

  /* ── Send message mutation ────────────────────────────────────────── */
  const sendMutation = useSendMessage(id);

  /* ── Redirect: no payment → payment page ─────────────────────────── */
  useEffect(() => {
    if (!loadingConsult && consult && consult.paymentStatus === "PENDING") {
      navigate(`/consultations/${id}/payment`, { replace: true });
    }
  }, [consult, loadingConsult, id, navigate]);

  /* ── Poll status when REQUESTED + PAID (waiting for doctor) ─────── */
  useEffect(() => {
    if (!consult) return;
    if (consult.status !== "REQUESTED" || consult.paymentStatus !== "PAID") return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["consultation", id] });
    }, 10000);

    return () => clearInterval(interval);
  }, [consult, id, queryClient]);

  /* ── Socket: listen for consultation_accepted event ─────────────── */
  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleAccepted = (data) => {
      // Refresh the consultation data when doctor accepts
      queryClient.invalidateQueries({ queryKey: ["consultation", id] });
      queryClient.invalidateQueries({ queryKey: ["chat", id] });
    };

    socket.on("consultation_accepted", handleAccepted);
    socket.on("consultation_started", handleAccepted);
    return () => {
      socket.off("consultation_accepted", handleAccepted);
      socket.off("consultation_started", handleAccepted);
    };
  }, [token, id, queryClient]);

  /* ── Auto-scroll ──────────────────────────────────────────────────── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate({ content: trimmed });
  };

  /* ── Loading ──────────────────────────────────────────────────────── */
  if (loadingConsult || loadingHistory) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-teal-500"
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
          <p className="text-sm text-slate-500">Memuat sesi konsultasi...</p>
        </div>
      </div>
    );
  }

  /* ── Waiting for doctor to accept ────────────────────────────────── */
  if (consult?.status === "REQUESTED" && consult?.paymentStatus === "PAID") {
    return (
      <div className="flex h-screen flex-col bg-slate-50">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => navigate("/my-consultations")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            ←
          </button>
          <p className="text-sm font-bold text-slate-800">
            Konsultasi #{id}
          </p>
          <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 ring-1 ring-blue-200">
            Menunggu
          </span>
        </header>
        <WaitingScreen consultationId={id} />
      </div>
    );
  }

  /* ── Completed / Cancelled ────────────────────────────────────────── */
  if (
    consult &&
    (consult.status === "COMPLETED" || consult.status === "CANCELLED")
  ) {
    return (
      <div className="flex h-screen flex-col bg-slate-50">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => navigate("/my-consultations")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            ←
          </button>
          <p className="text-sm font-bold text-slate-800">Konsultasi #{id}</p>
          <span
            className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
              consult.status === "COMPLETED"
                ? "bg-green-50 text-green-700 ring-green-200"
                : "bg-red-50 text-red-600 ring-red-200"
            }`}
          >
            {consult.status}
          </span>
        </header>

        {/* Still allow reading history for completed/cancelled */}
        {history.length > 0 ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {history.map((msg, i) => (
                <ChatBubble
                  key={msg.id ?? i}
                  message={msg}
                  isMine={msg.senderId === user?.id}
                />
              ))}
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-400">
              Riwayat chat — konsultasi telah{" "}
              {consult.status === "COMPLETED" ? "selesai" : "dibatalkan"}
            </div>
          </div>
        ) : (
          <StatusScreen status={consult.status} consultationId={id} />
        )}
      </div>
    );
  }

  /* ── ONGOING: Main Chat UI ────────────────────────────────────────── */
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          id="chat-back-btn"
          onClick={() => navigate("/my-consultations")}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
        >
          ←
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-sm font-bold text-white shadow">
          Dr
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">
            Konsultasi #{id}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-green-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Sedang Berlangsung
            </span>
            {/* Socket status */}
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isConnected ? "animate-pulse bg-green-400" : "bg-slate-300"
                }`}
              />
              {connectionError
                ? "Koneksi gagal"
                : isConnected
                ? "Live"
                : "Menghubungkan..."}
            </span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-3 text-5xl">💬</span>
            <p className="text-sm font-medium text-slate-600">Belum ada pesan</p>
            <p className="mt-1 text-xs text-slate-400">
              Mulai percakapan dengan dokter kamu
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1];
          const showDate =
            !prevMsg ||
            formatDate(msg.timestamp) !== formatDate(prevMsg?.timestamp);
          return (
            <div key={msg.id ?? i}>
              {showDate && (
                <div className="my-4 flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-[10px] font-medium text-slate-400">
                    {formatDate(msg.timestamp)}
                  </span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>
              )}
              <ChatBubble
                message={msg}
                isMine={msg.senderId === user?.id}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      {/* Input bar */}
      <footer className="border-t border-slate-200 bg-white px-4 py-3">
        {connectionError && (
          <p className="mb-2 text-center text-xs text-red-500">
            ⚠ {connectionError} — pesan mungkin tidak terkirim secara real-time
          </p>
        )}
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <textarea
            id="chat-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ketik pesan... (Enter untuk kirim)"
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
          />
          <button
            id="send-message-btn"
            type="submit"
            disabled={!input.trim() || sendMutation.isPending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
          >
            {sendMutation.isPending ? (
              <svg
                className="h-4 w-4 animate-spin"
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
            ) : (
              <svg
                className="h-4 w-4 translate-x-0.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}
