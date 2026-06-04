import DoctorsPreviewSection from "./components/DoctorsPreviewSection";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";
import StorePreviewSection from "./components/StorePreviewSection";

function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <DoctorsPreviewSection />
      <StorePreviewSection />
    </div>
  );
}

export default HomePage;
