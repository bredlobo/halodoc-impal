import { doctors } from "../../../data/mockData";
import DoctorCard from "../../../components/DoctorCard";
import SectionHeader from "../../../components/SectionHeader";

function DoctorsPreviewSection() {
  return (
    <section id="consultation" className="py-[55px]">
      <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Pilih dokter sesuai kebutuhanmu"
          description="Temukan dokter terpercaya untuk konsultasi online dengan rating tinggi dan pengalaman terverifikasi."
        />

        <div className="grid gap-[21px] sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorsPreviewSection;
