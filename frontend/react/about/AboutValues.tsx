import type { AboutValuesSettings } from '@/types/about-sections';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal';

interface AboutValuesProps {
  settings: AboutValuesSettings;
}

function ValueIcon({
  iconUrl,
  title,
}: {
  iconUrl?: string | null;
  title: string;
}) {
  return (
    <div
      className="mx-auto flex size-16 items-center justify-center overflow-hidden rounded-full md:size-20"
      aria-hidden={!iconUrl}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          className="h-full w-full rounded-full object-contain p-1"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-dashed border-text-muted/30 text-[12px] font-medium uppercase tracking-wide text-text-muted/60">
          {title.slice(0, 1)}
        </div>
      )}
    </div>
  );
}

export function AboutValues({ settings }: AboutValuesProps) {
  const blocks = settings.blocks ?? [];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {(settings.heading || settings.subheading) && (
          <Reveal as="header" className="mb-12 text-center md:mb-14">
            {settings.heading && (
              <h2 className="font-bold uppercase tracking-wide text-primary text-2xl md:text-3xl">
                {settings.heading}
              </h2>
            )}
            {settings.subheading && (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted md:text-base">
                {settings.subheading}
              </p>
            )}
          </Reveal>
        )}

        {blocks.length > 0 && (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {blocks.map((block) => (
              <StaggerItem key={block.title}>
                <article className="h-full rounded-2xl bg-cream px-6 py-8 text-center">
                  <ValueIcon iconUrl={block.icon_url} title={block.title} />
                  {block.title && (
                    <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-text md:text-[15px]">
                      {block.title}
                    </h3>
                  )}
                  {block.description && (
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      {block.description}
                    </p>
                  )}
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
