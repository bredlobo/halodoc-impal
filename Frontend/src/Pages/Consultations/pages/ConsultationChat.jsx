import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  useConsultationDetail,
  useSendMessage,
  useChatHistory,
} from "../hooks/useConsultations";
import { useConsultationChat } from "../hooks/useConsultationChat";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../../lib/socket";
import { formatDate } from "../helpers/formatters";
import ChatBubble from "../components/ChatBubble";
import WaitingScreen from "../components/WaitingScreen";
import StatusScreen from "../components/StatusScreen";

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
    history,
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
    if (consult.status !== "REQUESTED" || consult.paymentStatus !== "PAID")
      return;

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

    const handleAccepted = () => {
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
          <svg className="h-8 w-8 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            onClick={() => navigate("/my-consultations")}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            ←
          </button>
          <p className="text-sm font-bold text-slate-800">Konsultasi #{id}</p>
          <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 ring-1 ring-blue-200">
            Menunggu
          </span>
        </header>
        <WaitingScreen consultationId={id} />
      </div>
    );
  }

  /* ── Completed / Cancelled ────────────────────────────────────────── */
  if (consult && (consult.status === "COMPLETED" || consult.status === "CANCELLED")) {
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
          <StatusScreen status={consult.status} />
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

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800">
            Konsultasi #{id}
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700 ring-1 ring-green-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Sedang Berlangsung
            </span>
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
              <ChatBubble message={msg} isMine={msg.senderId === user?.id} />
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
            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
          />
          <button
            id="send-message-btn"
            type="submit"
            disabled={!input.trim() || sendMutation.isPending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50"
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
