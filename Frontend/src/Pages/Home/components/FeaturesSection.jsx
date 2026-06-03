import { features } from "../../../data/mockData";
import FeatureCard from "../../../components/FeatureCard";
import SectionHeader from "../../../components/SectionHeader";

function FeaturesSection() {
  return (
    <section className="bg-surface py-[55px]">
      <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Semua kebutuhan kesehatan, dalam satu alur yang ringkas"
          description="Dirancang mengikuti alur inti layanan: konsultasi, resep digital, pembelian obat, hingga pembayaran yang aman."
        />

        <div className="grid gap-[21px] sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
