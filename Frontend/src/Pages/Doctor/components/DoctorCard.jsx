import { Star, Clock } from "lucide-react";

function DoctorCard({ doctor, onViewDetail }) {
  const formattedFee = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(doctor.fee);

  const initials = doctor.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden">
      {/* Banner */}
      <div className="relative h-28 bg-gradient-to-br from-teal-500 to-cyan-400">
        {/* Avatar */}
        <div
          className="absolute -bottom-9 left-5 flex items-center justify-center rounded-full border-4 border-background bg-primary-light shadow-sm"
          style={{ width: "4.5rem", height: "4.5rem" }}
        >
          <span className="text-xl font-extrabold text-teal-700">{initials}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pt-12 pb-5">
        {/* Specialization badge */}
        <span className="mb-1 inline-flex w-fit rounded-full bg-primary-light px-3 py-0.5 text-[11px] font-semibold text-primary">
          {doctor.specialization}
        </span>

        <h3 className="text-sm font-bold leading-snug text-slate-900 line-clamp-1">
          {doctor.name}
        </h3>

        {/* Meta row */}
        <div className="mt-2 flex items-center gap-3 text-[13px] text-text-secondary">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {doctor.experience}
          </span>
          <span className="flex items-center gap-1 font-semibold text-warning">
            <Star size={14} strokeWidth={1.75} className="fill-warning text-warning" />
            {doctor.rating}
          </span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-teal-600">{formattedFee}</p>
          <button
            id={`view-doctor-${doctor.id}`}
            onClick={() => onViewDetail(doctor.id)}
            className="rounded-xl bg-surface px-3 py-1.5 text-[13px] font-semibold text-text-primary transition-all duration-150 hover:bg-primary-light hover:text-primary"
          >
            Lihat Profil
          </button>
        </div>
      </div>
    </article>
  );
}

export default DoctorCard;
