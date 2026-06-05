import type { ProductStorySettings } from '@/types/product-sections';

interface ProductStorySplitProps {
  settings: ProductStorySettings;
}

export function ProductStorySplit({ settings }: ProductStorySplitProps) {
  const imageRight = settings.image_position !== 'left';
  const paragraphs = settings.paragraphs ?? [];

  const textBlock = (
    <div
      className={`flex flex-col justify-center ${imageRight ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
        }`}
    >
      {settings.heading && (
        <h2 className="text-xl font-bold uppercase leading-snug tracking-wide text-primary md:text-3xl lg:text-[2rem]">
          {settings.heading}
        </h2>
      )}
      <div className="mt-4 space-y-3 text-xs leading-relaxed text-text md:mt-6 md:space-y-4 md:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );

  const imageBlock = (
    <div
      className={`overflow-hidden rounded-[1.5rem] bg-cream md:rounded-[2rem] ${imageRight ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
        }`}
    >
      {settings.image_url ? (
        <img
          src={settings.image_url}
          alt=""
          className="aspect-[4/3] w-full object-cover md:aspect-square"
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-cream text-text-muted md:aspect-square">
          Image
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-white py-10 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-4 sm:px-6 md:gap-10 lg:grid-cols-2 lg:gap-16">
        {imageBlock}
        {textBlock}
      </div>
    </section>
  );
}
