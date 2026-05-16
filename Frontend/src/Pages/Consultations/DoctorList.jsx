import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDoctors } from "../../hooks/useDoctors";
import { useRequestConsultation } from "../../hooks/useConsultations";
import DoctorCard from "./components/DoctorCard";
import DoctorSkeleton from "./components/DoctorSkeleton";

const SPECIALIZATIONS = [
  "Dokter Umum",
  "Spesialis Anak (M.Sc., Sp.A)",
  "Spesialis Penyakit Dalam (Sp.PD)",
  "Spesialis Kandungan dan Ginekologi (Sp.OG)",
  "Spesialis Saraf (Sp.S)",
  "Spesialis Jantung dan Pembuluh Darah (Sp.JP)",
  "Spesialis Mata (Sp.M)",
  "Spesialis Kulit dan Kelamin (Sp.KK)",
  "Spesialis THT (Sp.THT-KL)",
  "Spesialis Gigi (Sp.KG)",
];

export default function DoctorList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: doctors = [], isLoading, isError, error, refetch } = useDoctors();

  const requestMutation = useRequestConsultation({
    onSuccess: (res) => {
      if (res?.data?.id) {
        navigate(`/consultations/${res.data.id}/payment`);
      }
    },
    onError: (err) => {
      console.error(err);
      alert("Gagal membuat konsultasi. Silakan coba lagi.");
    },
  });

  // Client-side filter
  const filtered = doctors.filter((doc) => {
    const matchSearch =
      !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase());
    const matchSpec = !selectedSpec || doc.specialization === selectedSpec;
    return matchSearch && matchSpec;
  });

  const hasActiveFilters = search || selectedSpec;

  const clearFilters = () => {
    setSearch("");
    setSelectedSpec("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-3 inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold tracking-widest text-teal-700 uppercase">
            Konsultasi Online
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Temukan Dokter Terpercaya
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Konsultasikan kesehatanmu dengan dokter spesialis berpengalaman.
            Booking mudah, langsung terhubung secara online.
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
              placeholder="Cari nama dokter atau spesialisasi..."
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
      <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Filter toggle */}
            <button
              id="toggle-filters"
              onClick={() => setFiltersOpen((v) => !v)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                filtersOpen
                  ? "border-teal-300 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-600"
              }`}
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-6.3 8.4V19a1 1 0 0 1-1.4.9l-4-2A1 1 0 0 1 9 17v-4.8L3.2 4.6A1 1 0 0 1 3 4z" />
              </svg>
              Filter
              {hasActiveFilters && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] text-white">
                  !
                </span>
              )}
            </button>

            {/* Result count */}
            <p className="text-xs text-slate-500">
              {isLoading ? "Memuat..." : `${filtered.length} dokter tersedia`}
            </p>
          </div>

          {/* ── Expandable Filters Panel ───────────────────────────────── */}
          {filtersOpen && (
            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-3 pb-4 sm:grid-cols-2">
              {/* Specialization filter */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Spesialisasi
                </label>
                <select
                  id="filter-specialization"
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition-all outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Semua Spesialisasi</option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <div className="flex items-end sm:col-span-2">
                  <button
                    id="clear-filters"
                    onClick={clearFilters}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-teal-200 hover:text-teal-600"
                  >
                    Hapus Semua Filter
                  </button>
                </div>
              )}
            </div>
          )}
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
                Coba ubah kata kunci pencarian atau hapus filter yang aktif.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-teal-200 hover:text-teal-600"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          )}

          {/* Doctors grid */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {filtered.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onBook={(id) => requestMutation.mutate({ doctorId: id })}
                  isBooking={requestMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
