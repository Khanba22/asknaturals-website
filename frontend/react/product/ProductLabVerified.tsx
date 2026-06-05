import type { ProductLabVerifiedSettings } from '@/types/product-sections';

interface ProductLabVerifiedProps {
  settings: ProductLabVerifiedSettings;
}

export function ProductLabVerified({ settings }: ProductLabVerifiedProps) {
  return (
    <section className="bg-primary py-16 text-white md:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="font-bold uppercase leading-snug tracking-wide text-2xl md:text-3xl lg:text-4xl">
            {settings.heading ?? 'Laboratory Verified & Triple Tested.'}
          </h2>
          {settings.description && (
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
              {settings.description}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-10 md:gap-16">
            <div>
              <p className="text-4xl font-bold md:text-5xl">
                {settings.stat_1_value ?? '0.00%'}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/80">
                {settings.stat_1_label ?? 'Synthetic Fillers'}
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold md:text-5xl">
                {settings.stat_2_value ?? '100%'}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/80">
                {settings.stat_2_label ?? 'Batch Traced'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm -rotate-6 rounded-2xl bg-white p-8 shadow-2xl shadow-black/20">
            <div className="absolute -right-2 -top-2 flex size-10 items-center justify-center rounded-full bg-primary text-white">
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M5 12l5 5L20 7" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded bg-cream" />
              <div className="h-2 w-4/5 rounded bg-cream" />
              <div className="h-2 w-full rounded bg-cream" />
              <div className="h-2 w-3/5 rounded bg-cream" />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="h-16 rounded-lg bg-cream" />
                <div className="h-16 rounded-lg bg-cream" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
