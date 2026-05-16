import { useNavigate } from "react-router-dom";

const SPECIALIZATIONS = [
  {
    name: "Dokter Umum",
    icon: "🏥",
    desc: "Konsultasi kesehatan umum & pemeriksaan rutin",
    color: "from-teal-400 to-cyan-500",
    bg: "bg-teal-50",
    ring: "ring-teal-200",
    text: "text-teal-700",
  },
  {
    name: "Spesialis Anak (M.Sc., Sp.A)",
    icon: "👶",
    desc: "Kesehatan bayi, balita, dan anak-anak",
    color: "from-sky-400 to-blue-500",
    bg: "bg-sky-50",
    ring: "ring-sky-200",
    text: "text-sky-700",
  },
  {
    name: "Spesialis Penyakit Dalam (Sp.PD)",
    icon: "🫁",
    desc: "Penyakit dalam & gangguan metabolisme",
    color: "from-indigo-400 to-violet-500",
    bg: "bg-indigo-50",
    ring: "ring-indigo-200",
    text: "text-indigo-700",
  },
  {
    name: "Spesialis Kandungan dan Ginekologi (Sp.OG)",
    icon: "🤰",
    desc: "Kesehatan reproduksi & kebidanan",
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    ring: "ring-pink-200",
    text: "text-pink-700",
  },
  {
    name: "Spesialis Saraf (Sp.S)",
    icon: "🧠",
    desc: "Gangguan saraf, migrain & neurologi",
    color: "from-purple-400 to-fuchsia-500",
    bg: "bg-purple-50",
    ring: "ring-purple-200",
    text: "text-purple-700",
  },
  {
    name: "Spesialis Jantung dan Pembuluh Darah (Sp.JP)",
    icon: "❤️",
    desc: "Penyakit jantung & kardiovaskular",
    color: "from-red-400 to-rose-500",
    bg: "bg-red-50",
    ring: "ring-red-200",
    text: "text-red-700",
  },
  {
    name: "Spesialis Mata (Sp.M)",
    icon: "👁️",
    desc: "Kesehatan mata & gangguan penglihatan",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    text: "text-amber-700",
  },
  {
    name: "Spesialis Kulit dan Kelamin (Sp.KK)",
    icon: "🧴",
    desc: "Masalah kulit, jerawat & dermatologi",
    color: "from-lime-400 to-green-500",
    bg: "bg-lime-50",
    ring: "ring-lime-200",
    text: "text-lime-700",
  },
  {
    name: "Spesialis THT (Sp.THT-KL)",
    icon: "👂",
    desc: "Telinga, hidung, tenggorokan & kepala-leher",
    color: "from-cyan-400 to-teal-500",
    bg: "bg-cyan-50",
    ring: "ring-cyan-200",
    text: "text-cyan-700",
  },
  {
    name: "Spesialis Gigi (Sp.KG)",
    icon: "🦷",
    desc: "Kesehatan gigi, mulut & perawatan gigi",
    color: "from-slate-400 to-zinc-500",
    bg: "bg-slate-50",
    ring: "ring-slate-200",
    text: "text-slate-700",
  },
];

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
          style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold tracking-widest text-teal-700 uppercase ring-1 ring-teal-200">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
            Konsultasi Online
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-5xl">
            Pilih{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent">
              Spesialisasi
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
            Temukan dokter yang tepat untuk kebutuhanmu. Pilih bidang spesialisasi
            terlebih dahulu untuk melihat dokter yang tersedia.
          </p>
        </div>
      </section>

      {/* ── Specialization Grid ───────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-5">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.name}
                id={`spec-${spec.name.replace(/[^a-zA-Z]/g, "-").toLowerCase()}`}
                onClick={() => handleSelect(spec.name)}
                className={`group relative flex flex-col items-start gap-3 rounded-2xl border bg-white p-5 text-left shadow-sm ring-1 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-2 ${spec.ring} focus:outline-none focus-visible:ring-2 ${spec.ring}`}
              >
                {/* Gradient strip */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${spec.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                {/* Icon bubble */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${spec.bg} text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110`}
                >
                  {spec.icon}
                </div>

                <div className="flex-1">
                  <p className={`text-sm font-bold leading-snug ${spec.text}`}>
                    {spec.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">
                    {spec.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div
                  className={`ml-auto flex h-7 w-7 items-center justify-center rounded-full ${spec.bg} text-xs font-bold ${spec.text} opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1`}
                >
                  →
                </div>
              </button>
            ))}
          </div>

          {/* Browse all */}
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
