import { Button } from './ui/Button';

export interface TrustQualitySettings {
  eyebrow?: string;
  heading?: string;
  description?: string;
  button_label?: string;
  button_link?: string;
  badges?: { label: string; icon_url?: string }[];
}

interface TrustQualityProps {
  settings: TrustQualitySettings;
}

export function TrustQuality({ settings }: TrustQualityProps) {
  const badges = settings.badges ?? [
    { label: 'Third-Party Lab Tested' },
    { label: 'Authenticity Verified' },
    { label: 'Quality You Deserve' },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 text-center sm:px-6">
        {settings.eyebrow && (
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-primary/40" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {settings.eyebrow}
            </p>
            <span className="h-px w-12 bg-primary/40" aria-hidden />
          </div>
        )}
        {settings.heading && (
          <h2 className="mx-auto max-w-4xl font-bold uppercase leading-tight tracking-wide text-primary text-2xl md:text-3xl lg:text-4xl">
            {settings.heading}
          </h2>
        )}
        {settings.button_label && (
          <div className="mt-8">
            {settings.button_link ? (
              <Button href={settings.button_link} variant="primary">
                {settings.button_label}
              </Button>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white italic">
                {settings.button_label}
              </span>
            )}
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-stretch justify-center gap-10 md:gap-16">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex w-[160px] flex-col items-center justify-center gap-3"
            >
              <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/30 bg-white">
                {badge.icon_url ? (
                  <img
                    src={badge.icon_url}
                    alt=""
                    className="size-full object-contain p-1"
                    style={{ transform: 'scale(1.35)' }}
                  />
                ) : (
                  <span className="text-xl text-primary">✓</span>
                )}
              </span>
              <span className="flex min-h-10 flex-1 items-center justify-center text-center text-xs font-bold uppercase leading-snug tracking-wide text-primary">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
        {settings.description && (
          <p className="mx-auto mt-14 max-w-3xl text-sm leading-relaxed text-text-muted md:text-base">
            {settings.description}
          </p>
        )}
      </div>
    </section>
  );
}
