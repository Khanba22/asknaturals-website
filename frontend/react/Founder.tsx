export interface FounderSettings {
  heading?: string;
  body?: string;
  signature?: string;
  image_url?: string | null;
}

interface FounderProps {
  settings: FounderSettings;
}

export function Founder({ settings }: FounderProps) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.44fr)_minmax(0,0.56fr)] lg:gap-16 xl:gap-20">
        <div className="overflow-hidden rounded-3xl bg-cream">
          {settings.image_url ? (
            <img
              src={settings.image_url}
              alt={settings.signature ?? 'Founder'}
              className="mx-auto block w-full max-h-[560px] object-contain object-center"
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center text-text-muted">
              Founder photo
            </div>
          )}
        </div>
        <div>
          {settings.heading && (
            <h2 className="mb-6 font-bold uppercase leading-tight tracking-wide text-xl text-primary md:text-2xl lg:mb-8">
              {settings.heading}
            </h2>
          )}
          {settings.body && (
            <div className="space-y-5 text-sm leading-[1.75] text-text md:text-[15px]">
              {settings.body.split('\n\n').map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          )}
          {settings.signature && (
            <p className="mt-8 text-sm font-bold italic text-primary md:mt-10 md:text-base">
              {settings.signature}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
