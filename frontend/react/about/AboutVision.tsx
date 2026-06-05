import type { AboutVisionSettings } from '@/types/about-sections';

interface AboutVisionProps {
  settings: AboutVisionSettings;
}

export function AboutVision({ settings }: AboutVisionProps) {
  const sectionId = settings.section_id ?? 'about-vision';

  return (
    <section id={sectionId} className="bg-cream py-16 text-center md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        {settings.eyebrow && (
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-text-muted">
            {settings.eyebrow}
          </p>
        )}
        {settings.heading && (
          <h2 className="font-bold uppercase leading-snug tracking-wide text-text text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl">
            {settings.heading}
          </h2>
        )}
        {settings.body && (
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-text-muted md:text-base">
            {settings.body}
          </p>
        )}
      </div>
    </section>
  );
}
