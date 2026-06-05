import type { AboutApproachSettings } from '@/types/about-sections';
import { AboutLeafBackground } from './AboutLeafBackground';

interface AboutApproachProps {
  settings: AboutApproachSettings;
}

function ApproachIcon({ iconUrl, label }: { iconUrl?: string | null; label: string }) {
  return (
    <div
      className="relative aspect-square size-16 shrink-0 overflow-hidden rounded-full bg-primary"
      aria-hidden={!iconUrl}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-[10px] font-medium uppercase tracking-wide text-white/50">
          {label.slice(0, 1)}
        </span>
      )}
    </div>
  );
}

export function AboutApproach({ settings }: AboutApproachProps) {
  const blocks = settings.blocks ?? [];

  return (
    <section className="relative overflow-hidden bg-cream py-16 md:py-24">
      <AboutLeafBackground imageUrl={settings.leaf_background_url} />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          {settings.eyebrow && (
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {settings.eyebrow}
            </p>
          )}
          {settings.heading && (
            <h2 className="font-bold uppercase leading-snug tracking-wide text-primary text-2xl md:text-3xl lg:text-[2rem]">
              {settings.heading}
            </h2>
          )}
          {blocks.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-8 md:gap-10">
              {blocks.map((block) => (
                <div key={block.label} className="flex flex-col items-start gap-3">
                  <ApproachIcon iconUrl={block.icon_url} label={block.label} />
                  <p className="text-sm font-semibold text-primary md:text-base">{block.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-marble">
          {settings.image_url ? (
            <img
              src={settings.image_url}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-text-muted">
              Product image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
