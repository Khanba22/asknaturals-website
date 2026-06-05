import type { AboutHeroSettings } from '@/types/about-sections';
import { Button } from '../ui/Button';

interface AboutHeroProps {
  settings: AboutHeroSettings;
}

function ChevronRight() {
  return (
    <svg className="ml-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function AboutHero({ settings }: AboutHeroProps) {
  return (
    <section className="bg-primary py-16 text-white md:py-24 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          {settings.eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              {settings.eyebrow}
            </p>
          )}
          {settings.heading && (
            <h1 className="font-bold uppercase leading-[1.15] tracking-wide text-3xl md:text-4xl lg:text-[2.75rem]">
              {settings.heading}
            </h1>
          )}
          {settings.body && (
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              {settings.body}
            </p>
          )}
          {settings.button_label && (
            <div className="mt-8">
              <Button
                href={settings.button_link || '#about-vision'}
                variant="inverse"
                className="inline-flex items-center !text-primary"
              >
                {settings.button_label}
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-cream">
          {settings.image_url ? (
            <img
              src={settings.image_url}
              alt=""
              className="aspect-[4/5] w-full object-cover md:aspect-square"
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center text-text-muted md:aspect-square">
              Hero image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
