import { Reveal } from './motion/Reveal';

interface OriginalsStorySettings {
  image_url?: string | null;
}

interface OriginalsStoryProps {
  settings?: OriginalsStorySettings;
  // Legacy direct prop support (kept for any internal calls)
  imageUrl?: string | null;
}

export function OriginalsStory({ settings, imageUrl }: OriginalsStoryProps) {
  const img = settings?.image_url ?? imageUrl ?? null;

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 xl:gap-20">

        {/* Left — text */}
        <Reveal variant="slideInLeft" className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold uppercase tracking-[0.08em] text-text md:text-3xl lg:text-4xl">
            Askknatural Originals
          </h2>

          <p className="text-sm leading-[1.8] text-text-muted md:text-base">
            Supplements in the market are like individual flowers. Manufacturers make them, sellers
            sell them, and doctors remain largely clueless about how they actually work inside the
            body.
          </p>

          <p className="text-sm leading-[1.8] text-text-muted md:text-base">
            As the founder of a health tech brand, I was built with an optimiser&apos;s mind. I
            realised very early that women were taking these individual supplements without getting
            optimal results — and the reason was simple. The sequencing, the combinations, and the
            bioavailability required for a supplement to actually absorb and work in the human body
            is something a layperson is never told about. Women try hard. They spend real money. And
            they get nothing in return.
          </p>

          <p className="text-sm font-semibold leading-[1.8] text-text md:text-base">
            So I decided to build a garland instead of handing you flowers.
          </p>

          <p className="text-sm leading-[1.8] text-text-muted md:text-base">
            Each Askknatural original brings together the right supplements — the ones that must work
            together to deliver real results — into one single formulation. You do not need to buy ten
            different products or swallow pills by the handful every day. One supplement, designed
            with intention, can solve almost 90% of what women go through when it comes to hormones,
            fat loss, and sleep.
          </p>

          <p className="text-sm leading-[1.8] text-text md:text-base">
            This is not a product. It is a decision made for you, by someone who actually understands
            the biology.
          </p>
        </Reveal>

        {/* Right — image */}
        <Reveal
          variant="slideInRight"
          delay={0.1}
          className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl">
            {img ? (
              <img
                src={img}
                alt="Askknatural Originals"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex size-full items-center justify-center px-6 text-center text-sm text-text-muted">
                Upload a product image in the theme editor
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
