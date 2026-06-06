import type { AboutValuesSettings } from '@/types/about-sections';

interface AboutValuesProps {
  settings: AboutValuesSettings;
}

function ValueIcon({ iconUrl, title }: { iconUrl?: string | null; title: string }) {
  return (
    <div
      className="mx-auto size-16 overflow-hidden rounded-full"
      aria-hidden={!iconUrl}
    >
      {iconUrl ? (
        <img src={iconUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center border border-dashed border-text-muted/30 text-[10px] font-medium uppercase tracking-wide text-text-muted/60">
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
          <header className="mb-12 text-center md:mb-14">
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
          </header>
        )}

        {blocks.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {blocks.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl bg-cream px-6 py-8 text-center"
              >
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
