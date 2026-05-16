import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDoctors } from "../../hooks/useDoctors";
import DoctorCard from "./components/DoctorCard";
import DoctorSkeleton from "./components/DoctorSkeleton";

export default function DoctorList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const specFromUrl = searchParams.get("spec") ?? "";

  const [search, setSearch] = useState("");

  const { data: doctors = [], isLoading, isError, error, refetch } = useDoctors();

  // Filter by spec from URL + search
  const filtered = doctors.filter((doc) => {
    const matchSearch =
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specFromUrl || doc.specialization === specFromUrl;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Link to="/consultations" className="hover:text-teal-600 transition-colors">
              Spesialisasi
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-600">
              {specFromUrl || "Semua Dokter"}
            </span>
          </nav>

          <span className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold tracking-widest text-teal-700 uppercase">
            Konsultasi Online
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {specFromUrl ? specFromUrl : "Semua Dokter"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            {specFromUrl
              ? `Pilih dokter ${specFromUrl} yang sesuai dengan kebutuhanmu.`
              : "Konsultasikan kesehatanmu dengan dokter spesialis berpengalaman."}
          </p>

          {/* ── Search Bar ──────────────────────────────────────────── */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-teal-400/40">
            <svg className="h-4 w-4 shrink-0 text-slate-400" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 10.65 10.65z" />
            </svg>
            <input
              id="doctor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama dokter..."
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 transition-colors hover:text-slate-600"
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Back link */}
            <Link
              to="/consultations"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-teal-600"
            >
              ← Ganti Spesialisasi
            </Link>

            {/* Result count */}
            <p className="text-xs text-slate-500">
              {isLoading ? "Memuat..." : `${filtered.length} dokter tersedia`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Doctors Grid ────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <DoctorSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-20 text-center">
              <span className="mb-4 text-5xl">⚠️</span>
              <h3 className="text-base font-bold text-slate-800">Gagal memuat dokter</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {error?.message || "Terjadi kesalahan saat mengambil data."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-6 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-6xl opacity-40">🔍</span>
              <h3 className="text-lg font-bold text-slate-700">Dokter tidak ditemukan</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                {specFromUrl
                  ? `Belum ada dokter dengan spesialisasi "${specFromUrl}".`
                  : "Coba ubah kata kunci pencarian."}
              </p>
              <Link
                to="/consultations"
                className="mt-5 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-teal-200 hover:text-teal-600"
              >
                Pilih Spesialisasi Lain
              </Link>
            </div>
          )}

          {/* Doctors grid */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filtered.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onViewDetail={(id) => navigate(`/consultations/doctors/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
