import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useMyConsultations } from "../hooks/useConsultations";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../../lib/socket";
import ConsultationCard from "../components/ConsultationCard";

export default function MyConsultations() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: raw, isLoading, isError, error, refetch } = useMyConsultations();
  const consultations = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw)
      ? raw
      : [];

  /* Sort: ONGOING dulu, lalu REQUESTED, lalu sisanya berdasarkan tanggal */
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

  /* Poll setiap 10 detik jika ada konsultasi REQUESTED & PAID */
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
