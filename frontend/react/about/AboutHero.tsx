import type { AboutHeroSettings } from '@/types/about-sections';
import { HeroReveal } from '../motion/Reveal';

interface AboutHeroProps {
  settings: AboutHeroSettings;
}

export function AboutHero({ settings }: AboutHeroProps) {
  const paragraphs = settings.body
    ? settings.body.split('\n\n').filter(Boolean)
    : [];
  const mobileImg = settings.mobile_image_url || settings.image_url;

  return (
    <section className="relative w-full overflow-hidden bg-[#fcf6ef]">
      <div className="relative z-10 mx-auto flex min-h-[28rem] w-full max-w-7xl items-center px-4 py-16 sm:px-6 md:min-h-[32rem] md:py-20 lg:min-h-[36rem] lg:py-24">
        <div className="w-full max-w-full">
          {settings.eyebrow && (
            <HeroReveal delay={0.05}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-text">
                {settings.eyebrow}
              </p>
            </HeroReveal>
          )}
          {settings.heading && (
            <HeroReveal delay={0.15}>
              <h1 className="font-bold uppercase leading-[1.15] tracking-wide text-text text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                {settings.heading}
              </h1>
            </HeroReveal>
          )}
          {paragraphs.length > 0 && (
            <HeroReveal delay={0.3}>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-text md:text-[20px]">
                {paragraphs.map((para) => (
                  <p key={para.slice(0, 32)}>{para}</p>
                ))}
              </div>
            </HeroReveal>
          )}
        </div>
      </div>
    </section>
  );
}
