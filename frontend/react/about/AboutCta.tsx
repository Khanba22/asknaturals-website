import type { AboutCtaSettings } from '@/types/about-sections';
import { Button } from '../ui/Button';
import { getRoutes } from '@/utils/routes';

interface AboutCtaProps {
  settings: AboutCtaSettings;
}

export function AboutCta({ settings }: AboutCtaProps) {
  const routes = getRoutes();
  const btn1Link = settings.button_1_link ?? routes.all_products_collection_url;
  const btn2Link = settings.button_2_link ?? '/pages/subscribe';

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {settings.image_url && (
        <>
          <img
            src={settings.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/45" aria-hidden />
        </>
      )}
      {!settings.image_url && <div className="absolute inset-0 bg-primary" aria-hidden />}

      <div className="relative mx-auto w-full max-w-3xl px-4 text-center text-white sm:px-6">
        {settings.heading && (
          <h2 className="font-bold uppercase leading-snug tracking-wide text-2xl md:text-3xl lg:text-4xl">
            {settings.heading}
          </h2>
        )}
        {settings.body && (
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
            {settings.body}
          </p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {settings.button_1_label && (
            <Button href={btn1Link} variant="inverse" className="!text-primary">
              {settings.button_1_label}
            </Button>
          )}
          {settings.button_2_label && (
            <Button href={btn2Link} variant="primary">
              {settings.button_2_label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
