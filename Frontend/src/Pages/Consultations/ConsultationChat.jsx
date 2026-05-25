import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useConsultationDetail, useSendMessage, useChatHistory } from "../../hooks/useConsultations";
import { useConsultationChat } from "../../hooks/useConsultationChat";

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

/* ─── Sub-components ─────────────────────────────────────────────────── */
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
        <p className={`mt-1 text-[10px] ${isMine ? "text-teal-100" : "text-slate-400"} text-right`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    REQUESTED: "bg-blue-50 text-blue-600 ring-blue-100",
    ONGOING:   "bg-amber-50 text-amber-600 ring-amber-100",
    COMPLETED: "bg-green-50 text-green-600 ring-green-100",
    CANCELLED: "bg-red-50 text-red-600 ring-red-100",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[status] || "bg-slate-50 text-slate-600 ring-slate-100"}`}>
      {status}
    </span>
  );
}

function ConnectionBadge({ isConnected, error }) {
  if (error) return (
    <span className="flex items-center gap-1 text-xs text-red-500">
      <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Koneksi gagal
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-xs text-slate-400">
      <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-slate-300"}`} />
      {isConnected ? "Terhubung" : "Menghubungkan..."}
    </span>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function ConsultationChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // ── REST: consultation details + initial chat history ──────────────
  const { data: consultRaw, isLoading: loadingConsult } = useConsultationDetail(id);
  const { data: historyRaw, isLoading: loadingHistory } = useChatHistory(id);

  const consult   = consultRaw?.data || consultRaw;
  const history   = Array.isArray(historyRaw?.data) ? historyRaw.data
                  : Array.isArray(historyRaw)        ? historyRaw
                  : [];

  // ── Socket: real-time incoming messages ────────────────────────────
  const { messages, isConnected, connectionError } = useConsultationChat(
    consult?.status === "ONGOING" ? id : null,
    history,
  );

  // ── REST: send message mutation ────────────────────────────────────
  const sendMutation = useSendMessage(id);

  // ── Guard: redirect if not paid or consultation not found ──────────
  useEffect(() => {
    if (!loadingConsult && consult && consult.paymentStatus !== "PAID") {
      navigate(`/consultations/${id}/payment`, { replace: true });
    }
  }, [consult, loadingConsult, id, navigate]);

  // ── Auto-scroll ────────────────────────────────────────────────────
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

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Loading ──────────────────────────────────────────────────────── */
  if (loadingConsult || loadingHistory) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-slate-500">Memuat sesi konsultasi...</p>
        </div>
      </div>
    );
  }

  /* ── Not ONGOING ──────────────────────────────────────────────────── */
  if (consult && consult.status !== "ONGOING") {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <span className="mb-4 text-6xl">{consult.status === "COMPLETED" ? "✅" : "⏳"}</span>
        <h2 className="text-xl font-bold text-slate-800">
          {consult.status === "COMPLETED" ? "Konsultasi Selesai" : "Menunggu Dokter"}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {consult.status === "COMPLETED"
            ? "Sesi konsultasi telah berakhir."
            : "Dokter belum bergabung. Harap tunggu sebentar."}
        </p>
        <Link
          to="/consultations"
          className="mt-6 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Kembali ke Konsultasi
        </Link>
      </div>
    );
  }

  /* ── Main Chat UI ─────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          id="chat-back-btn"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
        >
          ←
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-sm font-bold text-white shadow">
          Dr
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">Konsultasi #{id}</p>
          <div className="flex items-center gap-2">
            <StatusBadge status={consult?.status} />
            <ConnectionBadge isConnected={isConnected} error={connectionError} />
          </div>
        </div>
      </header>

      {/* ── Message Area ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-3 text-5xl">💬</span>
            <p className="text-sm font-medium text-slate-600">Belum ada pesan</p>
            <p className="mt-1 text-xs text-slate-400">Mulai percakapan dengan dokter kamu</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1];
          const showDate = !prevMsg || formatDate(msg.timestamp) !== formatDate(prevMsg?.timestamp);
          return (
            <div key={msg.id ?? i}>
              {showDate && (
                <div className="my-4 flex items-center gap-3">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-[10px] font-medium text-slate-400">{formatDate(msg.timestamp)}</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>
              )}
              <ChatBubble message={msg} isMine={msg.senderId === user?.id} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </main>

      {/* ── Input Bar ───────────────────────────────────────────────── */}
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
            onKeyDown={handleKey}
            placeholder="Ketik pesan... (Enter untuk kirim)"
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
          />
          <button
            id="send-message-btn"
            type="submit"
            disabled={!input.trim() || sendMutation.isPending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
          >
            {sendMutation.isPending ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}
