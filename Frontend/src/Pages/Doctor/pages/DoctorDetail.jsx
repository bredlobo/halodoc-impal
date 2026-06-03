import { useNavigate, useParams, Link } from "react-router-dom";
import { useDoctorById } from "../../../hooks/useDoctors";
import { useRequestConsultation } from "../../../hooks/useConsultations";
import { Star, Clock, Users, Award, Check, AlertTriangle, Loader2 } from "lucide-react";

function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-surface py-12">
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <div className="h-48 w-full rounded-xl bg-border" />
        <div className="h-6 w-48 rounded bg-border" />
        <div className="h-4 w-72 rounded bg-surface" />
        <div className="h-32 rounded-xl bg-surface" />
      </div>
    </div>
  );
}

export default function DoctorDetail() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const {
    data: doctor,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorById(doctorId);

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

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <div className="min-h-screen bg-surface py-16">
        <div className="mx-auto max-w-xl px-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-error-light py-20 text-center">
            <AlertTriangle size={40} strokeWidth={1.75} className="mb-4 text-error" />
            <h3 className="text-[16px] font-semibold text-text-primary">
              Gagal memuat profil dokter
            </h3>
            <p className="mt-1 max-w-sm text-[14px] text-text-secondary">
              {error?.message || "Terjadi kesalahan."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-primary-hover"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedFee = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(doctor?.fee ?? 0);

  const initials = (doctor?.name ?? "DR")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[13px] text-text-secondary">
            <Link
              to="/consultations"
              className="transition-colors hover:text-primary"
            >
              Spesialisasi
            </Link>
            <span>/</span>
            <Link
              to={`/consultations/doctors?spec=${encodeURIComponent(doctor?.specialization ?? "")}`}
              className="transition-colors hover:text-primary"
            >
              {doctor?.specialization ?? "Dokter"}
            </Link>
            <span>/</span>
            <span className="font-medium text-text-primary">{doctor?.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Profile Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-border bg-background pt-[34px] pb-[21px] sm:pt-[55px]">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-primary-light shadow-sm sm:h-32 sm:w-32">
                <span className="text-4xl font-bold text-primary sm:text-5xl">
                  {initials}
                </span>
              </div>
              <span className="absolute -right-2 -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-success text-white ring-2 ring-background">
                <Check size={14} strokeWidth={3} />
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-flex rounded-full bg-primary-light px-3 py-1 text-[11px] font-semibold text-primary">
                {doctor?.specialization}
              </span>
              <h1 className="mt-2 text-[24px] font-bold leading-[1.30] tracking-[-0.01em] text-text-primary sm:text-[32px] sm:leading-[1.25]">
                {doctor?.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[14px] text-text-secondary sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Star size={16} strokeWidth={1.75} className="fill-warning text-warning" />
                  <span className="font-semibold text-text-primary">
                    {doctor?.rating}
                  </span>
                  <span>Rating</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} strokeWidth={1.75} className="text-primary" />
                  {doctor?.experience}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detail Content ────────────────────────────────────────────── */}
      <section className="py-[34px] sm:py-[55px]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-[21px] lg:grid-cols-3">
            {/* Left: Info cards */}
            <div className="space-y-[21px] lg:col-span-2">
              {/* About */}
              <div className="rounded-xl bg-background p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                <h2 className="mb-3 text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                  Tentang Dokter
                </h2>
                <p className="text-[14px] leading-[1.55] text-text-secondary">
                  {doctor?.bio ??
                    `${doctor?.name} adalah dokter spesialis berpengalaman di bidang ${doctor?.specialization}. 
                    Dengan dedikasi tinggi dalam memberikan pelayanan kesehatan terbaik, beliau siap membantu 
                    Anda berkonsultasi secara online dengan nyaman dan aman.`}
                </p>
              </div>

              {/* Keahlian */}
              <div className="rounded-xl bg-background p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                <h2 className="mb-4 text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                  Keahlian & Layanan
                </h2>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {[
                    "Diagnosis & konsultasi online",
                    "Rekomendasi pengobatan",
                    "Penjelasan hasil lab/pemeriksaan",
                    "Resep digital",
                    "Follow-up kondisi pasien",
                    "Edukasi kesehatan",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[14px] text-text-secondary"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light">
                        <Check size={12} strokeWidth={2.5} className="text-success" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info tambahan */}
              <div className="grid grid-cols-3 gap-[13px]">
                {[
                  { label: "Pasien", value: "500+", Icon: Users },
                  {
                    label: "Pengalaman",
                    value: doctor?.experience ?? "Expert",
                    Icon: Award,
                  },
                  {
                    label: "Rating",
                    value: `${doctor?.rating ?? 4.8}/5`,
                    Icon: Star,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center rounded-xl bg-background py-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]"
                  >
                    <stat.Icon size={24} strokeWidth={1.75} className="text-primary" />
                    <span className="mt-2 text-[18px] font-bold text-text-primary">
                      {stat.value}
                    </span>
                    <span className="text-[11px] text-text-secondary">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA sticky card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-xl bg-background p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
                <h2 className="mb-4 text-[14px] font-semibold tracking-wider text-text-secondary uppercase">
                  Mulai Konsultasi
                </h2>

                {/* Fee */}
                <div className="mb-5 rounded-xl bg-primary-light px-4 py-4 text-center">
                  <p className="text-[13px] font-semibold text-primary">
                    Biaya Konsultasi
                  </p>
                  <p className="mt-1 text-[32px] font-bold leading-[1.25] text-primary">
                    {formattedFee}
                  </p>
                </div>

                {/* Features */}
                <ul className="mb-6 space-y-2">
                  {[
                    "Chat langsung dengan dokter",
                    "Aman & terpercaya",
                    "Pembayaran via Midtrans",
                    "Respon cepat & profesional",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[13px] text-text-secondary"
                    >
                      <Check size={14} strokeWidth={2} className="text-success" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  id={`consult-doctor-${doctorId}`}
                  onClick={() => requestMutation.mutate({ doctorId })}
                  disabled={requestMutation.isPending}
                  className="w-full rounded-xl bg-primary py-[13px] text-[14px] font-semibold leading-[1] tracking-[0.01em] text-white transition-all duration-150 hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border disabled:text-[#9CA3AF]"
                >
                  {requestMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Memproses...
                    </span>
                  ) : (
                    "Konsultasi Sekarang"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
