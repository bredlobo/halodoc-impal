function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-2 text-[11px] font-semibold tracking-widest text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[24px] font-semibold leading-[1.30] text-text-primary sm:text-[32px] sm:font-bold sm:leading-[1.25]">{title}</h2>
      <p className="mt-4 text-[14px] leading-relaxed text-text-secondary sm:text-[18px] sm:leading-[1.50]">
        {description}
      </p>
    </div>
  );
}

export default SectionHeader;
