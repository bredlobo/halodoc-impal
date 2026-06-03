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
      className="relative flex items-center overflow-hidden bg-primary-light py-10 lg:py-0"
      style={{
        height: "auto",
        minHeight: `calc(100dvh - ${navbarHeight}px)`,
      }}
    >
      {/* Supergraphic & Background Blur Decor */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-primary/10 to-transparent opacity-80 blur-3xl" />
      <div className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-primary/15 to-transparent opacity-75 blur-3xl" />

      {/* Elegant SVG Supergraphic lines */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
        <svg
          className="h-full w-full max-w-[1440px]"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 500 C 300 350, 500 700, 900 500 C 1300 300, 1200 650, 1600 500"
            stroke="url(#supergradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M-50 400 C 250 250, 450 600, 850 400 C 1250 200, 1150 550, 1550 400"
            stroke="url(#supergradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="12 12"
          />
          <defs>
            <linearGradient id="supergradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1152px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-[34px] lg:px-8">
        <div className="flex flex-col justify-center py-4 lg:py-8">
          <h1 className="text-text-primary text-[30px] leading-[1.2] font-bold tracking-[-0.01em] sm:text-[36px] lg:text-[44px] xl:text-[52px] lg:leading-[1.15]">
            Akses layanan kesehatan jadi lebih cepat, aman, dan nyaman.
          </h1>
          <p className="text-text-secondary mt-[16px] max-w-xl text-[14px] leading-[1.5] sm:text-[16px] lg:text-[18px]">
            Konsultasi online dan tebus resep digital kesehatan dalam satu platform dengan alur yang sederhana untuk semua
            usia.
          </p>
          <div className="mt-[28px] flex flex-wrap items-center gap-[13px]">
            <button className="bg-primary hover:bg-primary-hover rounded-xl px-[21px] py-[13px] text-[14px] leading-[1] font-semibold tracking-[0.01em] text-white transition-all duration-150">
              Mulai Konsultasi
            </button>
            <button className="bg-surface text-text-primary hover:bg-border rounded-xl px-[21px] py-[13px] text-[14px] leading-[1] font-semibold tracking-[0.01em] transition-all duration-150">
              Lihat Dokter
            </button>
          </div>
        </div>

        <div className="relative flex items-end justify-center self-end px-4 lg:pt-4">
          <img
            src={heroDoctor}
            alt="Dokter HaloHealth"
            className="relative z-10 mx-auto h-auto max-h-[320px] sm:max-h-[420px] lg:max-h-[560px] xl:max-h-[680px] w-full max-w-xl lg:max-w-none object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
