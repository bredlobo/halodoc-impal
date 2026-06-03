import { Star } from "lucide-react";

function DoctorCard({ doctor }) {
  return (
    <article className="rounded-xl bg-background p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-poster mb-4 overflow-hidden rounded-xl bg-surface">
        <div className="flex h-full w-full items-center justify-center text-[13px] font-medium text-text-secondary">
          Foto Dokter
        </div>
      </div>
      <div>
        <h3 className="text-[14px] font-semibold text-text-primary">{doctor.name}</h3>
        <p className="text-[13px] text-text-secondary">{doctor.specialization}</p>
      </div>
      <div className="mb-4 flex items-center justify-between text-[14px] text-text-secondary">
        <p className="flex items-center gap-1">
          <Star size={14} strokeWidth={1.75} className="fill-warning text-warning" />
          {doctor.rating}
        </p>
        <p>{doctor.experience}</p>
      </div>
      <button className="w-full rounded-xl bg-primary-light px-4 py-2.5 text-[14px] font-semibold text-primary transition-all duration-150 hover:bg-primary hover:text-white">
        Konsultasi Sekarang
      </button>
    </article>
  );
}

export default DoctorCard;
