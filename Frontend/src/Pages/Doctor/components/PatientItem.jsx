/**
 * Item pasien di sidebar kiri DoctorDashboard.
 * Menampilkan avatar, nama pasien, dan nomor konsultasi.
 */
export default function PatientItem({ consultation, isActive, onClick }) {
  const patient = consultation.patient;
  const initials =
    patient?.fullName
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "P";

  return (
    <button
      id={`patient-item-${consultation.id}`}
      onClick={onClick}
      className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
        isActive
          ? "bg-teal-50 ring-2 ring-teal-400 shadow-sm"
          : "bg-white hover:bg-slate-50 ring-1 ring-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 text-sm font-bold text-white shadow-sm">
          {initials}
          {/* Online dot */}
          <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800">
            {patient?.fullName || `Pasien #${consultation.patientId}`}
          </p>
          <p className="text-[11px] text-slate-400">
            Konsultasi #{consultation.id}
          </p>
        </div>
        {isActive && (
          <span className="shrink-0 text-sm text-teal-500">●</span>
        )}
      </div>
    </button>
  );
}
