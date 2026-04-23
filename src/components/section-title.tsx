interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionTitleProps) {
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      <p className="mb-4 inline-flex rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent">
        {eyebrow}
      </p>
      <h2 className="text-balance text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-brand-ink/70">
          {description}
        </p>
      ) : null}
    </div>
  );
}
