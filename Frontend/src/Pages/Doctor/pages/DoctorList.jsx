import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorList.jsx
import { useDoctors } from "../../../hooks/useDoctors";
import DoctorCard from "../components/DoctorCard";
import DoctorSkeleton from "../components/DoctorSkeleton";
=======
import { useDoctors } from "../../hooks/useDoctors";
import DoctorCard from "./components/DoctorCard";
import DoctorSkeleton from "./components/DoctorSkeleton";
import { Search, X, ArrowLeft, AlertTriangle } from "lucide-react";
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorList.jsx

export default function DoctorList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const specFromUrl = searchParams.get("spec") ?? "";

  const [search, setSearch] = useState("");

  const { data: doctors = [], isLoading, isError, error, refetch } = useDoctors();

  const filtered = doctors.filter((doc) => {
    const matchSearch =
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !specFromUrl || doc.specialization === specFromUrl;
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Page Hero ──────────────────────────────────────────────────── */}
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorList.jsx
      <section className="border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <nav className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Link to="/consultations" className="hover:text-teal-600 transition-colors">
=======
      <section className="border-b border-border bg-background py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 text-center sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center justify-center gap-2 text-[13px] text-text-secondary">
            <Link to="/consultations" className="hover:text-primary transition-colors">
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorList.jsx
              Spesialisasi
            </Link>
            <span>/</span>
            <span className="font-semibold text-text-primary">
              {specFromUrl || "Semua Dokter"}
            </span>
          </nav>

          <span className="mb-3 inline-flex rounded-full bg-primary-light px-3 py-1 text-[11px] font-semibold tracking-widest text-primary uppercase">
            Konsultasi Online
          </span>
          <h1 className="mt-2 text-[32px] font-bold leading-[1.25] tracking-[-0.01em] text-text-primary">
            {specFromUrl ? specFromUrl : "Semua Dokter"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[14px] leading-[1.55] text-text-secondary sm:text-[18px] sm:leading-[1.50]">
            {specFromUrl
              ? `Pilih dokter ${specFromUrl} yang sesuai dengan kebutuhanmu.`
              : "Konsultasikan kesehatanmu dengan dokter spesialis berpengalaman."}
          </p>

<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorList.jsx
          {/* Search Bar */}
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-teal-400/40">
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 4.5 4.5a7.5 7.5 0 0 0 10.65 10.65z"
              />
            </svg>
=======
          {/* ── Search Bar ──────────────────────────────────────────── */}
          <div className="mx-auto mt-[21px] flex max-w-xl items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 transition-shadow focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(255,92,138,0.1)]">
            <Search size={16} strokeWidth={2} className="shrink-0 text-text-secondary" />
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorList.jsx
            <input
              id="doctor-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama dokter..."
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-text-secondary outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Hapus pencarian"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            <Link
              to="/consultations"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-text-secondary transition-colors hover:text-primary"
            >
              <ArrowLeft size={14} strokeWidth={2} />
              Ganti Spesialisasi
            </Link>
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorList.jsx
            <p className="text-xs text-slate-500">
=======

            {/* Result count */}
            <p className="text-[13px] text-text-secondary">
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorList.jsx
              {isLoading ? "Memuat..." : `${filtered.length} dokter tersedia`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Doctors Grid ────────────────────────────────────────────────── */}
<<<<<<< HEAD:Frontend/src/Pages/Doctor/pages/DoctorList.jsx
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
=======
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8">
          {/* Loading skeletons */}
>>>>>>> 6097824eca4d3edbffc762d34c876ab2e1ca0b57:Frontend/src/Pages/Consultations/DoctorList.jsx
          {isLoading && (
            <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <DoctorSkeleton key={i} />
              ))}
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-error-light py-20 text-center">
              <AlertTriangle size={40} strokeWidth={1.75} className="mb-4 text-error" />
              <h3 className="text-[16px] font-semibold text-text-primary">Gagal memuat dokter</h3>
              <p className="mt-1 max-w-sm text-[14px] text-text-secondary">
                {error?.message || "Terjadi kesalahan saat mengambil data."}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search size={48} strokeWidth={1.5} className="mb-4 text-text-secondary opacity-40" />
              <h3 className="text-[18px] font-semibold text-text-primary">Dokter tidak ditemukan</h3>
              <p className="mt-1 max-w-xs text-[14px] text-text-secondary">
                {specFromUrl
                  ? `Belum ada dokter dengan spesialisasi "${specFromUrl}".`
                  : "Coba ubah kata kunci pencarian."}
              </p>
              <Link
                to="/consultations"
                className="mt-5 rounded-xl bg-surface px-5 py-2.5 text-[14px] font-semibold text-text-primary transition-colors hover:bg-primary-light hover:text-primary"
              >
                Pilih Spesialisasi Lain
              </Link>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
