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
          className="absolute -bottom-9 left-5 flex items-center justify-center rounded-full border-4 border-white bg-teal-100 shadow-md"
          style={{ width: "4.5rem", height: "4.5rem" }}
        >
          <span className="text-xl font-extrabold text-teal-700">{initials}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-12">
        {/* Specialization badge */}
        <span className="mb-1 inline-flex w-fit rounded-full bg-teal-50 px-3 py-0.5 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
          {doctor.specialization}
        </span>

        <h3 className="text-sm font-bold leading-snug text-slate-900 line-clamp-1">
          {doctor.name}
        </h3>

        {/* Meta row */}
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {doctor.experience}
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-500">
            ⭐ {doctor.rating}
          </span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-teal-600">{formattedFee}</p>
          <button
            id={`view-doctor-${doctor.id}`}
            onClick={() => onViewDetail(doctor.id)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
          >
            Lihat Profil →
          </button>
        </div>
      </div>
    </article>
  );
}

export default DoctorCard;
