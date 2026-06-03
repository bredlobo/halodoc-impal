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
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
import { getSocket } from "../../../lib/socket";
import { decodeTokenRole, decodeTokenUserId } from "../../Consultations/helpers/formatters";
import ChatBubble from "../../Consultations/components/ChatBubble";
import PatientItem from "../components/PatientItem";
=======
import { getSocket } from "../../lib/socket";
import { Bell, LogOut, Send, Loader2, MessageSquare, Stethoscope } from "lucide-react";

/* ─── JWT Decode ─────────────────────────────────────────────────────── */
function decodeTokenRole(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).role || null;
  } catch {
    return null;
  }
}

function decodeTokenUserId(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).userId || null;
  } catch {
    return null;
  }
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Chat Bubble ────────────────────────────────────────────────────── */
function ChatBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 text-[14px] leading-[1.55] ${
          isMine
            ? "rounded-2xl rounded-br-[4px] bg-primary-light text-text-primary"
            : "rounded-2xl rounded-bl-[4px] bg-[#F3F4F6] text-text-primary"
        }`}
      >
        <p>{message.content}</p>
        <p className="mt-1 text-[11px] text-right text-text-secondary">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx

/* ─── Empty State ────────────────────────────────────────────────────── */
function EmptyState({ Icon = MessageSquare, title, sub }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <Icon size={40} strokeWidth={1.5} className="mb-3 text-text-secondary opacity-40" />
      <p className="font-medium text-text-primary">{title}</p>
      {sub && <p className="mt-1 text-[14px] text-text-secondary">{sub}</p>}
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
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
      <div className="flex h-full items-center justify-center bg-slate-50">
        <svg className="h-7 w-7 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
=======
      <div className="flex h-full items-center justify-center bg-surface">
        <Loader2 size={28} strokeWidth={2} className="animate-spin text-primary" />
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-surface">
      {/* Live indicator */}
      <div className="flex items-center justify-end border-b border-border bg-background px-4 py-1.5">
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isConnected ? "animate-pulse bg-success" : "bg-border"
            }`}
          />
          {connectionError ? (
            <span className="text-error">{connectionError}</span>
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
            Icon={MessageSquare}
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
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <form onSubmit={handleSend} className="flex items-end gap-3">
=======
      <div className="border-t border-border bg-background px-4 py-3">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-3"
        >
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
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
            className="flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary placeholder-text-secondary outline-none transition focus:border-primary focus:bg-background focus:shadow-[0_0_0_3px_rgba(255,92,138,0.1)]"
          />
          <button
            id={`doctor-send-btn-${consultationId}`}
            type="submit"
            disabled={!input.trim() || sendMutation.isPending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary-hover disabled:bg-border disabled:text-[#9CA3AF]"
          >
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
            <svg className="h-4 w-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
=======
            {sendMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} strokeWidth={2} className="translate-x-0.5" />
            )}
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
          </button>
        </form>
      </div>
    </div>
  );
}

<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
=======
/* ─── Patient List Item (ONGOING only) ──────────────────────────────── */
function PatientItem({ consultation, isActive, onClick }) {
  const patient = consultation.patient;
  const initials =
    patient?.fullName
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "P";

  return (
    <button
      id={`patient-item-${consultation.id}`}
      onClick={onClick}
      className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
        isActive
          ? "bg-primary-light ring-2 ring-primary/30"
          : "bg-background hover:bg-surface"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-[14px] font-bold text-primary">
          {initials}
          {/* Online dot */}
          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-text-primary">
            {patient?.fullName || `Pasien #${consultation.patientId}`}
          </p>
          <p className="text-[11px] text-text-secondary">
            Konsultasi #{consultation.id}
          </p>
        </div>
        {isActive && (
          <span className="shrink-0 text-[14px] text-primary">●</span>
        )}
      </div>
    </button>
  );
}

>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
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
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <svg className="h-7 w-7 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
=======
      <div className="flex h-screen items-center justify-center bg-surface">
        <Loader2 size={28} strokeWidth={2} className="animate-spin text-primary" />
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
      </div>
    );
  }

  const pendingCount = allConsultations.filter(
    (c) => c.status === "REQUESTED"
  ).length;

  return (
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      {/* ══ TOP HEADER ═══════════════════════════════════════════════ */}
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
=======
    /* Full-screen, no navbar/footer */
    <div className="flex h-screen flex-col overflow-hidden bg-surface">
      {/* ══ TOP HEADER ═══════════════════════════════════════════════ */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-5 py-3">
        {/* Brand + doctor info */}
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-[14px] font-bold text-white">
            Dr
          </div>
          <div>
            <h1 className="text-[14px] font-semibold leading-none text-text-primary">
              Dashboard Dokter
            </h1>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              {user?.fullName || user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="view-requests-btn"
            onClick={() => navigate("/doctor/requests")}
            className="relative flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-[13px] font-semibold text-text-secondary transition hover:bg-surface"
          >
            <Bell size={14} strokeWidth={2} />
            Permintaan
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
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
            className="flex items-center gap-1.5 rounded-xl border border-error/20 bg-error-light px-3 py-1.5 text-[13px] font-semibold text-error transition hover:bg-error/10"
          >
            <LogOut size={14} strokeWidth={2} />
            Keluar
          </button>
        </div>
      </header>

      {/* ══ BODY ═════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR: Active Patient List ───────────────────── */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-border bg-background">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">
              Sesi Aktif
            </h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              {ongoingConsultations.length} pasien sedang dalam konsultasi
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoading && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorDashboard.jsx
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
=======
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl bg-surface"
                  />
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorDashboard.jsx
                ))}
              </div>
            )}
            {isError && (
              <div className="rounded-xl bg-error-light p-4 text-center">
                <p className="text-[13px] text-error">
                  {error?.message || "Gagal memuat"}
                </p>
                <button
                  onClick={refetch}
                  className="mt-2 text-[13px] font-semibold text-error underline"
                >
                  Coba lagi
                </button>
              </div>
            )}
            {!isLoading && !isError && ongoingConsultations.length === 0 && (
              <EmptyState
                Icon={Stethoscope}
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
              Icon={MessageSquare}
              title="Pilih pasien untuk memulai chat"
              sub="Daftar sesi aktif ada di panel kiri"
            />
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-4 border-b border-border bg-background px-6 py-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-[14px] font-bold text-primary">
                  {activeConsult.patient?.fullName?.[0]?.toUpperCase() || "P"}
                  <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[14px] font-semibold text-text-primary">
                    {activeConsult.patient?.fullName ||
                      `Pasien #${activeConsult.patientId}`}
                  </p>
                  <p className="text-[13px] font-medium text-primary">
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
