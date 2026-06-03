import { Stethoscope, Pill, FileText, CreditCard } from "lucide-react";

const ICON_MAP = {
  Stethoscope,
  Pill,
  FileText,
  CreditCard,
};

function FeatureCard({ feature }) {
  const IconComponent = ICON_MAP[feature.icon];

  return (
    <article className="rounded-xl bg-background p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light">
        {IconComponent ? (
          <IconComponent size={20} strokeWidth={1.75} className="text-primary" />
        ) : (
          <span className="text-lg text-primary">{feature.icon}</span>
        )}
      </span>
      <h3 className="text-[16px] font-semibold text-text-primary">{feature.title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{feature.description}</p>
    </article>
  )
}

export default FeatureCard
