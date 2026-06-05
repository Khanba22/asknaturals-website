import type { CategoriesSettings } from '@/types/section-settings';

const ICONS: Record<string, string> = {
  pcos: '◉',
  hormones: '♡',
  digestion: '◎',
  metabolism: '⚡',
  energy: '☀',
  immunity: '🛡',
  sleep: '☾',
  fatloss: '↓',
  beauty: '✦',
  stress: '〜',
  other: '•',
};

interface CategoriesProps {
  settings: CategoriesSettings;
}

export function Categories({ settings }: CategoriesProps) {
  const blocks = settings.blocks ?? [];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {settings.heading && (
            <h2 className="mb-5 font-bold uppercase leading-tight tracking-wide text-primary text-2xl md:text-3xl">
              {settings.heading}
            </h2>
          )}
          {settings.subheading && (
            <p className="text-base leading-relaxed text-text-muted md:text-lg">
              {settings.subheading}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
          {blocks.map((block) => {
            const { title, icon, icon_url } = block.settings;
            return (
              <div key={block.id} className="flex flex-col items-center justify-center">
                <div className="mb-4 flex size-16 shrink-0 items-center justify-center md:size-20">
                  {icon_url ? (
                    <img
                      src={icon_url}
                      alt=""
                      className="size-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl text-primary md:text-4xl">
                      {ICONS[icon ?? 'other'] ?? '•'}
                    </span>
                  )}
                </div>
                {title && (
                  <h3 className="text-center text-sm font-bold uppercase tracking-wide text-primary">
                    {title}
                  </h3>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
