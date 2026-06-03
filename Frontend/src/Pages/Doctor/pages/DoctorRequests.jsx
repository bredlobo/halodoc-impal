import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useMyConsultations, useRespondToConsultation } from "../../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../../lib/socket";
import { decodeTokenRole } from "../../Consultations/helpers/formatters";
import RequestCard from "../components/RequestCard";

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
        showToast("✅ Konsultasi diterima! Pasien sekarang bisa chat.", "success");
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

  /* Real-time: refresh ketika ada permintaan baru masuk */
  useEffect(() => {
    if (!token) return;
    const socket = getSocket();
    if (!socket.connected) socket.connect();

    const handleNew = () => {
      queryClient.invalidateQueries({ queryKey: ["my-consultations"] });
      showToast("🔔 Permintaan baru masuk!", "success");
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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <svg className="h-7 w-7 animate-spin text-teal-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="back-to-dashboard"
              onClick={() => navigate("/doctor/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              ←
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-800 leading-none">
                Permintaan Konsultasi
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                {requests.length} permintaan menunggu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
            >
              ↻ Refresh
            </button>
            <button
              id="doctor-requests-logout"
              onClick={() => { logout(); navigate("/auth"); }}
              className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
            >
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
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <span className="mb-3 block text-4xl">⚠️</span>
            <p className="font-bold text-red-700">Gagal memuat permintaan</p>
            <p className="mt-1 text-sm text-red-500">{error?.message}</p>
            <button
              onClick={refetch}
              className="mt-4 rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <span className="mb-4 text-6xl">🎉</span>
            <h3 className="text-base font-bold text-slate-700">
              Tidak ada permintaan
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Belum ada pasien yang mengajukan konsultasi saat ini.
            </p>
            <button
              onClick={() => navigate("/doctor/dashboard")}
              className="mt-6 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-600"
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
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <p className="text-xs font-semibold text-slate-500">
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
