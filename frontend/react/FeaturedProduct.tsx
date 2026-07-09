import { Button } from './ui/Button';
import { Reveal } from './motion/Reveal';

export interface FeaturedProductSettings {
  subtitle?: string;
  heading?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
  image_url?: string | null;
}

interface FeaturedProductProps {
  settings: FeaturedProductSettings;
}

export function FeaturedProduct({ settings }: FeaturedProductProps) {
  const buttonUrl = settings.button_link;
  const buttonLabel = settings.button_label ?? 'Shop Now';

  return (
    <section className="bg-cream py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <Reveal variant="slideInLeft" className="max-w-lg">

          {settings.heading && (
            <h2 className="text-2xl font-bold uppercase tracking-[0.08em] text-text md:text-3xl lg:text-4xl">
              {settings.heading}
            </h2>
          )}
          {settings.description && (
            <p className="mt-6 text-sm md:text-[18px] lg:text-[20px] leading-[1.75] text-text-muted">
              {settings.description}
            </p>
          )}
          {buttonUrl && buttonLabel && (
            <div className="mt-8 max-md:flex max-md:justify-center md:mt-10">
              <Button
                href={buttonUrl}
                variant="primary"
                className="!px-14 !py-5 !text-lg uppercase tracking-wide"
              >
                {buttonLabel}
              </Button>
            </div>
          )}
        </Reveal>

        <Reveal variant="slideInRight" delay={0.1} className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-dark">
            {settings.image_url ? (
              <img
                src={settings.image_url}
                alt={settings.heading ?? 'AskNatural Original'}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center px-6 text-center text-sm text-text-muted">
                Upload a featured image in the theme editor
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
