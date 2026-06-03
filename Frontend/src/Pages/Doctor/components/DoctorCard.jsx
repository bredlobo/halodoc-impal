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
    <article className="group relative flex flex-col overflow-hidden rounded-xl bg-background shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Banner */}
      <div className="relative h-28 bg-primary-light">
        {/* Avatar */}
        <div
          className="absolute -bottom-9 left-5 flex items-center justify-center rounded-full border-4 border-background bg-primary-light shadow-sm"
          style={{ width: "4.5rem", height: "4.5rem" }}
        >
          <span className="text-xl font-bold text-primary">{initials}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-12">
        {/* Specialization badge */}
        <span className="mb-1 inline-flex w-fit rounded-full bg-primary-light px-3 py-0.5 text-[11px] font-semibold text-primary">
          {doctor.specialization}
        </span>

        <h3 className="text-[14px] font-semibold leading-snug text-text-primary line-clamp-1">
          {doctor.name}
        </h3>

        {/* Meta row */}
        <div className="mt-2 flex items-center gap-3 text-[13px] text-text-secondary">
          <span className="flex items-center gap-1">
            <Clock size={14} strokeWidth={1.75} className="text-text-secondary" />
            {doctor.experience}
          </span>
          <span className="flex items-center gap-1 font-semibold text-warning">
            <Star size={14} strokeWidth={1.75} className="fill-warning text-warning" />
            {doctor.rating}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <p className="text-[16px] font-bold text-primary">{formattedFee}</p>
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
