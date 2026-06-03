import { useEffect, useState } from "react";
import heroDoctor from "../../../assets/hero-doctor.png";

function HeroSection() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("header.sticky");
    if (!navbar) return undefined;

    const updateNavbarHeight = () => {
      setNavbarHeight(navbar.getBoundingClientRect().height);
    };

    updateNavbarHeight();

    const resizeObserver = new ResizeObserver(updateNavbarHeight);
    resizeObserver.observe(navbar);
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: `calc(100dvh - ${navbarHeight}px)` }}
    >
      <div className="bg-primary-light mx-auto grid h-full w-full max-w-[1152px] items-center gap-10 px-4 pt-3 pb-0 sm:px-6 lg:grid-cols-2 lg:gap-[34px] lg:px-8 lg:pt-6 lg:pb-0">
        <div>
          <h1 className="text-text-primary text-[32px] leading-[1.25] font-bold tracking-[-0.01em] sm:text-[40px] lg:text-[52px] lg:leading-[1.15] lg:tracking-[-0.02em]">
            Akses layanan kesehatan jadi lebih cepat, aman, dan nyaman.
          </h1>
          <p className="text-text-secondary mt-[21px] max-w-xl text-[14px] leading-[1.55] sm:text-[18px] sm:leading-[1.50]">
            Konsultasi online, tebus resep digital, dan belanja kebutuhan
            kesehatan dalam satu platform dengan alur yang sederhana untuk semua
            usia.
          </p>
          <div className="mt-[34px] flex flex-wrap items-center gap-[13px]">
            <button className="bg-primary hover:bg-primary-hover rounded-xl px-[21px] py-[13px] text-[14px] leading-[1] font-semibold tracking-[0.01em] text-white transition-all duration-150">
              Mulai Konsultasi
            </button>
            <button className="bg-surface text-text-primary hover:bg-border rounded-xl px-[21px] py-[13px] text-[14px] leading-[1] font-semibold tracking-[0.01em] transition-all duration-150">
              Lihat Dokter
            </button>
          </div>
        </div>

        <div className="relative flex items-end justify-center self-end overflow-hidden rounded-3xl px-4 pt-8 pb-2 sm:px-6 lg:px-8 lg:pt-10">
          <img
            src={heroDoctor}
            alt="Dokter HaloHealth"
            className="relative z-10 mx-auto h-auto w-full max-w-md object-contain object-center sm:max-w-lg lg:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
