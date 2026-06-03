import { useNavigate } from "react-router-dom";
import { SPECIALIZATIONS } from "../constants/specializations";

export default function SpecializationSelect() {
  const navigate = useNavigate();

  const handleSelect = (specName) => {
    const encoded = encodeURIComponent(specName);
    navigate(`/consultations/doctors?spec=${encoded}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 py-14 sm:py-20">
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #14b8a6, transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #06b6d4, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold tracking-widest text-teal-700 uppercase ring-1 ring-teal-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
            Konsultasi Online
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-5xl">
            Pilih{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Spesialisasi
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
            Temukan dokter yang tepat untuk kebutuhanmu. Pilih bidang
            spesialisasi terlebih dahulu untuk melihat dokter yang tersedia.
          </p>
        </div>
      </section>

      {/* ── Specialization Grid ───────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.name}
                id={`spec-${spec.name.replace(/[^a-zA-Z]/g, "-").toLowerCase()}`}
                onClick={() => handleSelect(spec.name)}
                className={`group relative flex flex-col items-start gap-3 rounded-2xl border bg-white p-5 text-left shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-2 ${spec.ring} focus:outline-none focus-visible:ring-2 ${spec.ring}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${spec.bg} text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  {spec.icon}
                </div>

                <div className="flex-1">
                  <p className={`text-sm leading-snug font-bold ${spec.text}`}>
                    {spec.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {spec.desc}
                  </p>
                </div>

                <div
                  className={`ml-auto flex h-7 w-7 items-center justify-center rounded-full ${spec.bg} text-xs font-bold ${spec.text} opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100`}
                >
                  →
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              id="browse-all-doctors"
              onClick={() => navigate("/consultations/doctors")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-teal-300 hover:text-teal-600 hover:shadow"
            >
              Lihat Semua Dokter →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
