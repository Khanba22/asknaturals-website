import type { AboutLookingAheadSettings } from '@/types/about-sections';

interface AboutLookingAheadProps {
  settings: AboutLookingAheadSettings;
}

export function AboutLookingAhead({ settings }: AboutLookingAheadProps) {
  const paragraphs = settings.body
    ? settings.body.split('\n\n').filter(Boolean)
    : [];

  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          {settings.eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
              {settings.eyebrow}
            </p>
          )}
          {settings.heading && (
            <h2 className="font-bold uppercase leading-[1.15] tracking-wide text-primary text-2xl md:text-3xl lg:text-[2rem]">
              {settings.heading}
            </h2>
          )}
        </div>

        {paragraphs.length > 0 && (
          <div className="space-y-5 text-sm leading-relaxed text-text md:text-[15px]">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 32)}>{para}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
