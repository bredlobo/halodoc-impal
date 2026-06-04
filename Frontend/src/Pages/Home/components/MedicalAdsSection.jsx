import { useEffect, useRef, useState } from "react";
import { adsData } from "../../../constants/landingPageData";

function MedicalAdsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const dragStart = useRef(0);
  const isDraggingRef = useRef(false);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? adsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === adsData.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    // Only auto-play when not dragging
    if (isDraggingState) return undefined;
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, [currentIndex, isDraggingState]);

  const handleStart = (clientX) => {
    dragStart.current = clientX;
    isDraggingRef.current = true;
    setIsDraggingState(true);
  };

  const handleMove = (clientX) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - dragStart.current;
    setDragOffset(delta);
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);

    // Calculate snap based on dominant visibility
    // Step size is 72% of window.innerWidth (slide card is 70% and gap is 2%)
    const stepSize = window.innerWidth * 0.72;
    const dragRatio = -dragOffset / stepSize;
    let targetIndex = Math.round(currentIndex + dragRatio);
    targetIndex = Math.max(0, Math.min(adsData.length - 1, targetIndex));

    setCurrentIndex(targetIndex);
    setDragOffset(0);
  };

  // Base translation percentages for the non-overlapping layout:
  // Slide 0: translate 0% (Slide 1 at left edge)
  // Slide 1: translate -57% (Slide 2 centered in viewport)
  // Slide 2: translate -114% (Slide 3 aligned to right edge)
  const basePercentages = [0, -57, -114];

  return (
    <section id="services" className="w-full bg-white py-8 border-y border-border/30 overflow-hidden">
      {/* Full-width Horizontal Viewport */}
      <div 
        className="w-full overflow-hidden relative cursor-grab active:cursor-grabbing"
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(calc(${basePercentages[currentIndex]}% + ${dragOffset}px))`,
            transition: isDraggingState ? "none" : "transform 500ms ease-out"
          }}
        >
          {adsData.map((ad, index) => {
            const isActive = index === currentIndex;

            return (
              <div
                key={ad.id}
                onClick={() => {
                  if (dragOffset === 0) {
                    setCurrentIndex(index);
                  }
                }}
                className={`w-[70%] h-[185px] sm:h-[240px] md:h-[280px] shrink-0 rounded-2xl border overflow-hidden transition-all duration-300 mr-[2%] select-none shadow-sm ${
                  isActive
                    ? "border-primary/20 shadow-md scale-100 opacity-100 cursor-default"
                    : "border-border/50 scale-98 opacity-90 cursor-pointer hover:opacity-95"
                }`}
              >
                <img
                  src={ad.image}
                  alt={ad.alt}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimalist Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prevSlide}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-white text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
          aria-label="Previous Slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {adsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                currentIndex === index
                  ? "bg-primary w-4"
                  : "bg-border w-1.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-white text-text-secondary hover:text-primary hover:border-primary transition-all duration-200"
          aria-label="Next Slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default MedicalAdsSection;
