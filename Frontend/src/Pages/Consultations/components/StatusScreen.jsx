import { Link } from "react-router-dom";

/**
 * Layar status yang tampil ketika konsultasi sudah COMPLETED atau CANCELLED.
 */
export default function StatusScreen({ status }) {
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
