import type { AboutFounderQuoteSettings } from '@/types/about-sections';
import { AboutLeafBackground } from './AboutLeafBackground';

interface AboutFounderQuoteProps {
  settings: AboutFounderQuoteSettings;
}

export function AboutFounderQuote({ settings }: AboutFounderQuoteProps) {
  const bullets = settings.bullets ?? [];

  return (
    <section className="relative overflow-hidden bg-cream py-16 md:py-24 lg:py-28">
      <AboutLeafBackground imageUrl={settings.leaf_background_url} />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {settings.quote && (
          <blockquote className="font-bold uppercase leading-snug tracking-wide text-text text-2xl md:text-3xl lg:text-[2.125rem] xl:text-4xl">
            &ldquo;{settings.quote}&rdquo;
          </blockquote>
        )}

        <div className="flex flex-col justify-center">
          {bullets.length > 0 && (
            <ul className="space-y-3 text-sm leading-relaxed text-text md:text-base">
              {bullets.map((item) => (
                <li key={item.slice(0, 40)} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {(settings.author_name || settings.author_title) && (
            <footer className="mt-8 border-t border-cream-dark pt-6">
              {settings.author_name && (
                <p className="text-sm font-bold text-text">— {settings.author_name}</p>
              )}
              {settings.author_title && (
                <p className="mt-1 text-sm font-bold text-primary">{settings.author_title}</p>
              )}
            </footer>
          )}
        </div>
      </div>
    </section>
  );
}
