import type { AboutHeroSettings } from '@/types/about-sections';

interface AboutHeroProps {
  settings: AboutHeroSettings;
}

export function AboutHero({ settings }: AboutHeroProps) {
  const paragraphs = settings.body
    ? settings.body.split('\n\n').filter(Boolean)
    : [];

  return (
    <section
      className="relative w-full overflow-hidden bg-cream bg-cover bg-[center_right] bg-no-repeat"
      style={
        settings.image_url
          ? { backgroundImage: `url(${settings.image_url})` }
          : undefined
      }
    >
      <div className="mx-auto flex min-h-[28rem] w-full max-w-7xl items-center px-4 py-16 sm:px-6 md:min-h-[32rem] md:py-20 lg:min-h-[36rem] lg:py-24">
        <div className="w-full max-w-xl lg:max-w-[48%]">
          {settings.eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-text">
              {settings.eyebrow}
            </p>
          )}
          {settings.heading && (
            <h1 className="font-bold uppercase leading-[1.15] tracking-wide text-text text-3xl md:text-4xl lg:text-[2.75rem]">
              {settings.heading}
            </h1>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-text md:text-[15px]">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
