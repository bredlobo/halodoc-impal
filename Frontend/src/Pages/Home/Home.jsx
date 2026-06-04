import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import MedicalAdsSection from "./components/MedicalAdsSection";
import TestimonialsSection from "./components/TestimonialsSection";

function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <MedicalAdsSection />
      <TestimonialsSection />
    </div>
  );
}

export default HomePage;
