import type { AboutWhyCreatedSettings } from '@/types/about-sections';
import { Button } from '../ui/Button';

interface AboutWhyCreatedProps {
  settings: AboutWhyCreatedSettings;
}

export function AboutWhyCreated({ settings }: AboutWhyCreatedProps) {
  const paragraphs = settings.body
    ? settings.body.split('\n\n').filter(Boolean)
    : [];

  return (
    <section
      className="relative w-full overflow-hidden bg-primary bg-cover bg-[center_right] bg-no-repeat text-white"
      style={
        settings.image_url
          ? { backgroundImage: `url(${settings.image_url})` }
          : undefined
      }
    >
      <div className="mx-auto flex min-h-[28rem] w-full max-w-7xl items-center px-4 py-16 sm:px-6 md:min-h-[32rem] md:py-20 lg:min-h-[34rem] lg:py-24">
        <div className="w-full max-w-xl lg:max-w-[55%]">
          {settings.eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              {settings.eyebrow}
            </p>
          )}
          {settings.heading && (
            <h2 className="font-bold uppercase leading-[1.15] tracking-wide text-3xl md:text-4xl lg:text-[2.5rem]">
              {settings.heading}
            </h2>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/90 md:text-[15px]">
              {paragraphs.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          )}
          {settings.button_label && (
            <div className="mt-8">
              <Button
                href={settings.button_link || '#'}
                variant="inverse"
                className="!text-primary"
              >
                {settings.button_label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
