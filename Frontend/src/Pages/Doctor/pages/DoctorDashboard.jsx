import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  useMyConsultations,
  useSendMessage,
  useChatHistory,
  useConsultationChat,
} from "../../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../../lib/socket";
import { decodeTokenRole, decodeTokenUserId } from "../../Consultations/helpers/formatters";
import ChatBubble from "../../Consultations/components/ChatBubble";
import PatientItem from "../components/PatientItem";

/* ─── Empty State ────────────────────────────────────────────────────── */
function EmptyState({ emoji = "💬", title, sub }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <span className="mb-3 text-5xl">{emoji}</span>
      <p className="font-semibold text-slate-700">{title}</p>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

/* ─── Chat Window ────────────────────────────────────────────────────── */
function ChatWindow({ consultationId, currentUserId }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const { data: historyRaw, isLoading } = useChatHistory(consultationId);
  const history = Array.isArray(historyRaw?.data)
    ? historyRaw.data
    : Array.isArray(historyRaw)
    ? historyRaw
    : [];

  const { messages, isConnected, connectionError } = useConsultationChat(
    consultationId,
    history
  );
  const sendMutation = useSendMessage(consultationId);

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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <svg className="h-7 w-7 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Live indicator */}
      <div className="flex items-center justify-end border-b border-slate-200 bg-white px-4 py-1.5">
        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "animate-pulse bg-green-400" : "bg-slate-300"
            }`}
          />
          {connectionError ? (
            <span className="text-red-400">{connectionError}</span>
          ) : isConnected ? (
            "Live"
          ) : (
            "Menghubungkan..."
          )}
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <EmptyState
            emoji="💬"
            title="Belum ada pesan"
            sub="Mulai percakapan dengan pasien"
          />
        )}
        {messages.map((msg, i) => (
          <ChatBubble
            key={msg.id ?? i}
            message={msg}
            isMine={msg.senderId === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <textarea
            id={`doctor-chat-input-${consultationId}`}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Balas pasien... (Enter untuk kirim)"
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
          />
          <button
            id={`doctor-send-btn-${consultationId}`}
            type="submit"
            disabled={!input.trim() || sendMutation.isPending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow transition hover:scale-105 hover:shadow-md disabled:opacity-50"
          >
            <svg className="h-4 w-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                        */
/* ══════════════════════════════════════════════════════════════════════ */
export default function DoctorDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState(null);

  /* Role resolution */
  const role = user?.role || decodeTokenRole(token);
  const currentUserId = user?.id || decodeTokenUserId(token);

  /* Fetch consultations — hanya ONGOING untuk dashboard */
  const { data: raw, isLoading, isError, error, refetch } = useMyConsultations();
  const allConsultations = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
    ? raw
    : [];

  const ongoingConsultations = allConsultations.filter(
    (c) => c.status === "ONGOING"
  );
  const activeConsult = ongoingConsultations.find((c) => c.id === activeId);

  /* ── Auth guard ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!user && !token) {
      navigate("/auth", { replace: true });
      return;
    }
    if (role && role !== "DOCTOR") {
      navigate("/", { replace: true });
    }
  }, [user, token, role, navigate]);

  /* ── Real-time: listen for new requests & accepted consultations ── */
  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleNewRequest = () => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
    };

    socket.on("new_consultation_request", handleNewRequest);
    socket.on("consultation_started", () => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
    });

    return () => {
      socket.off("new_consultation_request", handleNewRequest);
    };
  }, [token, queryClient]);

  /* ── Loading / role resolving ────────────────────────────────────── */
  if (!role) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <svg className="h-7 w-7 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  const pendingCount = allConsultations.filter(
    (c) => c.status === "REQUESTED"
  ).length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      {/* ══ TOP HEADER ═══════════════════════════════════════════════ */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-sm font-extrabold text-white shadow">
            Dr
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-800 leading-none">
              Dashboard Dokter
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              {user?.fullName || user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="view-requests-btn"
            onClick={() => navigate("/doctor/requests")}
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Permintaan
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            id="doctor-logout-btn"
            onClick={() => {
              logout();
              navigate("/auth");
            }}
            className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* ══ BODY ═════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR: Active Patient List ───────────────────── */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Sesi Aktif
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {ongoingConsultations.length} pasien sedang dalam konsultasi
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            )}
            {isError && (
              <div className="rounded-xl bg-red-50 p-4 text-center">
                <p className="text-xs text-red-500">
                  {error?.message || "Gagal memuat"}
                </p>
                <button
                  onClick={refetch}
                  className="mt-2 text-xs font-semibold text-red-600 underline"
                >
                  Coba lagi
                </button>
              </div>
            )}
            {!isLoading && !isError && ongoingConsultations.length === 0 && (
              <EmptyState
                emoji="🩺"
                title="Tidak ada sesi aktif"
                sub="Terima permintaan pasien terlebih dahulu"
              />
            )}
            {ongoingConsultations.map((c) => (
              <PatientItem
                key={c.id}
                consultation={c}
                isActive={activeId === c.id}
                onClick={() => setActiveId(c.id)}
              />
            ))}
          </div>
        </aside>

        {/* ── RIGHT PANEL: Chat Area ───────────────────────────────── */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {!activeConsult ? (
            <EmptyState
              emoji="👈"
              title="Pilih pasien untuk memulai chat"
              sub="Daftar sesi aktif ada di panel kiri"
            />
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-4 border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-sm font-bold text-white shadow-sm">
                  {activeConsult.patient?.fullName?.[0]?.toUpperCase() || "P"}
                  <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {activeConsult.patient?.fullName ||
                      `Pasien #${activeConsult.patientId}`}
                  </p>
                  <p className="text-xs text-teal-500 font-medium">
                    Konsultasi #{activeConsult.id} · Sedang berlangsung
                  </p>
                </div>
              </div>

              {/* Chat body */}
              <ChatWindow
                key={activeConsult.id}
                consultationId={activeConsult.id}
                currentUserId={currentUserId}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
