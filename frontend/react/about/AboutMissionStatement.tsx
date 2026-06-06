import type { AboutMissionStatementSettings } from '@/types/about-sections';

interface AboutMissionStatementProps {
  settings: AboutMissionStatementSettings;
}

export function AboutMissionStatement({ settings }: AboutMissionStatementProps) {
  const backgroundUrl =
    settings.image_url ?? settings.decor_right_url ?? settings.decor_left_url;

  return (
    <section
      className="relative w-full overflow-hidden bg-cream bg-cover bg-center bg-no-repeat py-16 md:py-20 lg:py-24"
      style={
        backgroundUrl
          ? { backgroundImage: `url(${backgroundUrl})` }
          : undefined
      }
    >
      <div className="relative mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
        {settings.heading && (
          <h2 className="font-bold uppercase tracking-wide text-primary text-2xl md:text-3xl">
            {settings.heading}
          </h2>
        )}
        {settings.body && (
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-white/70 bg-white/55 px-6 py-8 shadow-[0_8px_32px_rgba(45,74,30,0.08)] backdrop-blur-sm md:mt-10 md:px-10 md:py-10">
            <p className="text-sm leading-relaxed text-text md:text-[15px]">
              {settings.body}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
