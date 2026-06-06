import type { AboutMissionSettings } from '@/types/about-sections';

interface AboutMissionProps {
  settings: AboutMissionSettings;
}

function MissionIcon({ iconUrl, title }: { iconUrl?: string | null; title: string }) {
  return (
    <div
      className="relative z-10 size-20 shrink-0 overflow-hidden rounded-full"
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

export function AboutMission({ settings }: AboutMissionProps) {
  const blocks = settings.blocks ?? [];

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {(settings.heading || settings.subheading) && (
          <header className="mb-12 text-center md:mb-16">
            {settings.heading && (
              <h2 className="font-bold uppercase tracking-wide text-text text-2xl md:text-3xl">
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
          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            <div
              className="pointer-events-none absolute inset-x-0 top-10 hidden h-px bg-text-muted/20 lg:block"
              aria-hidden
            />

            {blocks.map((block) => (
              <div key={block.title} className="flex flex-col items-center text-center">
                <MissionIcon iconUrl={block.icon_url} title={block.title} />
                {block.title && (
                  <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-text md:text-[15px]">
                    {block.title}
                  </h3>
                )}
                {block.description && (
                  <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-text-muted">
                    {block.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
