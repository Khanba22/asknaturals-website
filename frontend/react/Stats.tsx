export interface StatBlock {
  value: string;
  label: string;
}

export interface StatsSettings {
  heading?: string;
  description?: string;
  stats?: StatBlock[];
}

interface StatsProps {
  settings: StatsSettings;
}

export function Stats({ settings }: StatsProps) {
  const stats = settings.stats ?? [];
  const gridClass =
    stats.length >= 5
      ? 'mt-14 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-6'
      : 'mt-14 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6';

  return (
    <section className="bg-cream/60 py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            {settings.heading && (
              <h2 className="font-bold uppercase leading-tight tracking-wide text-primary text-2xl md:text-3xl">
                {settings.heading}
              </h2>
            )}
          </div>
          <div>
            {settings.description && (
              <p className="text-base leading-relaxed text-text-muted">{settings.description}</p>
            )}
          </div>
        </div>
        <div className={gridClass}>
          {stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`} className="text-center md:text-left">
              <p className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</p>
              <p className="mt-2 text-xs font-bold uppercase leading-snug tracking-wide text-primary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
