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
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
          {blocks.map((block) => {
            const { title, icon, icon_url, link } = block.settings;
            return (
              <a
                key={block.id}
                href={link || '#'}
                className="flex flex-col items-center justify-center rounded-2xl border border-transparent bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-5 flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-2xl text-white">
                  {icon_url ? (
                    <img
                      src={icon_url}
                      alt=""
                      className="size-full object-contain p-1"
                      style={{ transform: 'scale(1.45)' }}
                    />
                  ) : (
                    <span>{ICONS[icon ?? 'other'] ?? '•'}</span>
                  )}
                </div>
                {title && (
                  <h3 className="text-center text-sm font-bold uppercase tracking-wide text-primary">
                    {title}
                  </h3>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
