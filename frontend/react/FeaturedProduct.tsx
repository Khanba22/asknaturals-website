import { Button } from './ui/Button';

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
  const buttonLabel = settings.button_label ?? 'Shop AskNatural Original';

  return (
    <section className="bg-cream py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="max-w-lg">
          {settings.subtitle && (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {settings.subtitle}
            </p>
          )}
          {settings.heading && (
            <h2 className="text-2xl font-bold uppercase tracking-[0.08em] text-text md:text-3xl lg:text-4xl">
              {settings.heading}
            </h2>
          )}
          {settings.description && (
            <p className="mt-6 text-sm leading-[1.75] text-text md:text-base">{settings.description}</p>
          )}
          {buttonUrl && buttonLabel && (
            <div className="mt-8 md:mt-10">
              <Button href={buttonUrl} variant="primary" className="uppercase tracking-wide">
                {buttonLabel}
              </Button>
            </div>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end">
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
        </div>
      </div>
    </section>
  );
}
