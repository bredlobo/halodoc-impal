import { useNavigate } from "react-router-dom";
import {
  Hospital, Baby, Stethoscope, Heart, Brain, Eye,
  Droplets, Ear, ArrowRight,
} from "lucide-react";

const SPECIALIZATIONS = [
  {
    name: "Dokter Umum",
    Icon: Hospital,
    desc: "Konsultasi kesehatan umum & pemeriksaan rutin",
  },
  {
    name: "Spesialis Anak (M.Sc., Sp.A)",
    Icon: Baby,
    desc: "Kesehatan bayi, balita, dan anak-anak",
  },
  {
    name: "Spesialis Penyakit Dalam (Sp.PD)",
    Icon: Stethoscope,
    desc: "Penyakit dalam & gangguan metabolisme",
  },
  {
    name: "Spesialis Kandungan dan Ginekologi (Sp.OG)",
    Icon: Heart,
    desc: "Kesehatan reproduksi & kebidanan",
  },
  {
    name: "Spesialis Saraf (Sp.S)",
    Icon: Brain,
    desc: "Gangguan saraf, migrain & neurologi",
  },
  {
    name: "Spesialis Jantung dan Pembuluh Darah (Sp.JP)",
    Icon: Heart,
    desc: "Penyakit jantung & kardiovaskular",
  },
  {
    name: "Spesialis Mata (Sp.M)",
    Icon: Eye,
    desc: "Kesehatan mata & gangguan penglihatan",
  },
  {
    name: "Spesialis Kulit dan Kelamin (Sp.KK)",
    Icon: Droplets,
    desc: "Masalah kulit, jerawat & dermatologi",
  },
  {
    name: "Spesialis THT (Sp.THT-KL)",
    Icon: Ear,
    desc: "Telinga, hidung, tenggorokan & kepala-leher",
  },
  {
    name: "Spesialis Gigi (Sp.KG)",
    Icon: Stethoscope,
    desc: "Kesehatan gigi, mulut & perawatan gigi",
  },
];

export default function SpecializationSelect() {
  const navigate = useNavigate();

  const handleSelect = (specName) => {
    const encoded = encodeURIComponent(specName);
    navigate(`/consultations/doctors?spec=${encoded}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-light via-primary-light/40 to-background py-[44px] sm:py-[68px]">
        {/* Left side abstract outframe shapes */}
        <div className="pointer-events-none absolute -left-20 -top-20 w-64 h-64 rounded-full border-4 border-primary/10 hidden md:block" />
        <div className="pointer-events-none absolute -left-10 bottom-4 w-32 h-32 rounded-full bg-primary/5 blur-sm hidden md:block" />
        <div className="pointer-events-none absolute left-36 top-10 w-12 h-12 rounded-full border border-primary/20 hidden md:block" />

        {/* Right side abstract outframe shapes */}
        <div className="pointer-events-none absolute -right-24 -bottom-12 w-80 h-80 rounded-full border-2 border-primary/10 hidden md:block" />
        <div className="pointer-events-none absolute right-16 top-6 w-20 h-20 rounded-full border border-primary/15 hidden md:block" />
        <div className="pointer-events-none absolute -right-6 top-1/3 w-8 h-8 rounded-full bg-primary/10 hidden md:block" />

        <div className="relative z-10 mx-auto max-w-[1152px] px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-[34px] font-bold leading-[1.2] tracking-[-0.02em] text-text-primary sm:text-[44px]">
            Pilih Spesialisasi
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.55] text-text-secondary sm:text-[18px] sm:leading-[1.50]">
            Temukan dokter yang tepat untuk kebutuhanmu. Pilih bidang
            spesialisasi terlebih dahulu untuk melihat dokter yang tersedia.
          </p>
        </div>
      </section>

      {/* ── Specialization Grid ───────────────────────────────────────── */}
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-[1152px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-[13px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[21px] xl:grid-cols-4">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.name}
                id={`spec-${spec.name.replace(/[^a-zA-Z]/g, "-").toLowerCase()}`}
                onClick={() => handleSelect(spec.name)}
                className="group relative flex flex-col items-start gap-3 rounded-xl bg-background p-5 text-left shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light transition-transform duration-200 group-hover:scale-105">
                  <spec.Icon size={20} strokeWidth={1.75} className="text-primary" />
                </div>

                <div className="flex-1">
                  <p className="text-[14px] font-semibold leading-snug text-text-primary">
                    {spec.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                    {spec.desc}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-primary opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                  <ArrowRight size={14} strokeWidth={2} />
                </div>
              </button>
            ))}
          </div>

          {/* Browse all */}
          <div className="mt-[34px] text-center">
            <button
              id="browse-all-doctors"
              onClick={() => navigate("/consultations/doctors")}
              className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-2.5 text-[14px] font-semibold text-text-primary transition-all hover:bg-primary-light hover:text-primary"
            >
              Lihat Semua Dokter
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
