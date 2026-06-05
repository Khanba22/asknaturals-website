import type { AboutSplitSettings } from '@/types/about-sections';

interface AboutSplitProps {
  settings: AboutSplitSettings;
}

const SCHEME_CLASS = {
  white: 'bg-white text-text',
  green: 'bg-primary text-white',
  cream: 'bg-cream text-text',
} as const;

export function AboutSplit({ settings }: AboutSplitProps) {
  const scheme = settings.color_scheme ?? 'white';
  const imageLeft = settings.image_position === 'left';
  const isGreen = scheme === 'green';

  const eyebrowClass = isGreen
    ? 'text-white/80'
    : 'text-primary';
  const headingClass = isGreen ? 'text-white' : 'text-primary';
  const bodyClass = isGreen ? 'text-white/85' : 'text-text-muted';

  const textBlock = (
    <div className="flex flex-col justify-center">
      {settings.eyebrow && (
        <p className={`mb-4 text-xs font-bold uppercase tracking-[0.2em] ${eyebrowClass}`}>
          {settings.eyebrow}
        </p>
      )}
      {settings.heading && (
        <h2
          className={`font-bold uppercase leading-snug tracking-wide text-2xl md:text-3xl lg:text-[2rem] ${headingClass}`}
        >
          {settings.heading}
        </h2>
      )}
      {settings.body && (
        <p className={`mt-6 text-sm leading-relaxed md:text-base ${bodyClass}`}>{settings.body}</p>
      )}
    </div>
  );

  const imageBlock = (
    <div className={`overflow-hidden rounded-[2rem] ${isGreen ? 'bg-cream' : 'bg-cream'}`}>
      {settings.image_url ? (
        <img
          src={settings.image_url}
          alt=""
          className="aspect-[4/3] w-full object-cover md:aspect-[5/4]"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center text-text-muted md:aspect-[5/4]">
          Image
        </div>
      )}
    </div>
  );

  return (
    <section className={`py-16 md:py-24 ${SCHEME_CLASS[scheme]}`}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {imageLeft ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  );
}
