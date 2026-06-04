import SectionHeader from "../../../components/SectionHeader";
import { testimonialsData } from "../../../constants/landingPageData";

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-[60px] bg-surface">
      <div className="mx-auto w-full max-w-[1152px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimoni"
          title="Apa Kata Mereka?"
          description="Ulasan nyata dari pengguna setia yang telah merasakan kepraktisan dan keandalan layanan kesehatan digital HaloHealth."
        />

        <div className="grid gap-[24px] md:grid-cols-3">
          {testimonialsData.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {/* Stars */}
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[15px] leading-relaxed text-text-secondary italic">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-[14px] ${testimonial.bgInitials}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-text-primary leading-tight">
                    {testimonial.name}
                  </h4>
                  <p className="text-[12px] text-text-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
