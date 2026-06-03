import { useNavigate, useParams, Link } from "react-router-dom";
import { useDoctorById, useRequestConsultation } from "../../../hooks";

function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <div className="h-48 w-full rounded-2xl bg-slate-200" />
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="h-4 w-72 rounded bg-slate-100" />
        <div className="h-32 rounded-2xl bg-slate-100" />
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
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="mx-auto max-w-xl px-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-20 text-center">
            <span className="mb-4 text-5xl">⚠️</span>
            <h3 className="text-base font-bold text-slate-800">
              Gagal memuat profil dokter
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {error?.message || "Terjadi kesalahan."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              to="/consultations"
              className="transition-colors hover:text-teal-600"
            >
              Spesialisasi
            </Link>
            <span>/</span>
            <Link
              to={`/consultations/doctors?spec=${encodeURIComponent(doctor?.specialization ?? "")}`}
              className="transition-colors hover:text-teal-600"
            >
              {doctor?.specialization ?? "Dokter"}
            </Link>
            <span>/</span>
            <span className="font-medium text-slate-600">{doctor?.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Profile Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-linear-to-br from-teal-50 via-white to-cyan-50 pt-12 pb-10 sm:pt-16">
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #14b8a6, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 shadow-lg sm:h-32 sm:w-32">
                <span className="text-4xl font-extrabold text-white sm:text-5xl">
                  {initials}
                </span>
              </div>
              <span className="absolute -right-2 -bottom-2 flex h-7 w-7 items-center justify-center rounded-full bg-green-400 text-xs ring-2 ring-white">
                ✓
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200">
                {doctor?.specialization}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {doctor?.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold text-slate-800">
                    {doctor?.rating}
                  </span>
                  <span>Rating</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="h-4 w-4 text-teal-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {doctor?.experience}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detail Content ────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Info cards */}
            <div className="space-y-5 lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-sm font-bold tracking-wider text-slate-500 uppercase">
                  Tentang Dokter
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  {doctor?.bio ??
                    `${doctor?.name} adalah dokter spesialis berpengalaman di bidang ${doctor?.specialization}. Dengan dedikasi tinggi dalam memberikan pelayanan kesehatan terbaik, beliau siap membantu Anda berkonsultasi secara online dengan nyaman dan aman.`}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
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
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs text-teal-600">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Pasien", value: "500+", icon: "👥" },
                  {
                    label: "Pengalaman",
                    value: doctor?.experience ?? "Expert",
                    icon: "🏅",
                  },
                  {
                    label: "Rating",
                    value: `${doctor?.rating ?? 4.8}/5`,
                    icon: "⭐",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-5 shadow-sm"
                  >
                    <span className="text-2xl">{stat.icon}</span>
                    <span className="mt-2 text-lg font-extrabold text-slate-800">
                      {stat.value}
                    </span>
                    <span className="text-xs text-slate-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA sticky card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-bold tracking-wider text-slate-500 uppercase">
                  Mulai Konsultasi
                </h2>

                <div className="mb-5 rounded-xl bg-teal-50 px-4 py-4 text-center">
                  <p className="text-xs font-semibold text-teal-600">
                    Biaya Konsultasi
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-teal-700">
                    {formattedFee}
                  </p>
                </div>

                <ul className="mb-6 space-y-2">
                  {[
                    "Chat langsung dengan dokter",
                    "Aman & terpercaya",
                    "Pembayaran via Midtrans",
                    "Respon cepat & profesional",
                  ].map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <span className="text-teal-500">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  id={`consult-doctor-${doctorId}`}
                  onClick={() => requestMutation.mutate({ doctorId })}
                  disabled={requestMutation.isPending}
                  className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:from-teal-600 hover:to-cyan-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {requestMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    "Konsultasi Sekarang →"
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
