import type { HeroSettings } from '@/types/section-settings';
import { HeroReveal } from './motion/Reveal';
import { HeroShopButton } from './motion/HeroShopButton';

interface HeroProps {
  settings: HeroSettings;
}

const headlineClass =
  'font-bold uppercase leading-[1.1] tracking-[0.04em] text-white text-[clamp(1.75rem,6vw,5rem)]';

function HeroHeading({ html }: { html?: string }) {
  if (!html) return null;

  return (
    <div
      className={`${headlineClass} [&_*]:!text-white [&_em]:not-italic [&_p]:m-0`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Hero({ settings }: HeroProps) {
  const { heading, button_label, button_link, image_url, mobile_image_url } = settings;
  const mobileImg = mobile_image_url || image_url;

  return (
    <section className="relative w-full overflow-hidden bg-primary max-md:h-dvh max-md:min-h-dvh md:bg-cover md:bg-center md:bg-no-repeat">
      {mobileImg && (
        <img
          src={mobileImg}
          alt=""
          className="absolute inset-0 h-full min-h-full w-full min-w-full object-cover object-center md:hidden"
          aria-hidden
        />
      )}

      {image_url && (
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: `url("${image_url}")` }}
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-primary/45 max-md:block md:hidden" aria-hidden />

      <div className="relative z-10 mx-auto w-full">
        <div
          className="
            flex flex-col justify-center
            gap-[clamp(1.25rem,3vw,2rem)]
            max-md:h-dvh max-md:min-h-dvh max-md:items-center max-md:px-6 max-md:py-10 max-md:text-center
            md:min-h-[calc(100vh-88px)] md:w-[75%] md:items-start md:px-[clamp(1.5rem,4vw,5rem)] md:py-0 md:text-left
            lg:w-[60%]
          "
        >
          <HeroReveal delay={0.1}>
            {heading ? (
              <HeroHeading html={heading} />
            ) : (
              <h1 className={headlineClass}>Supplements designed around her biology.</h1>
            )}
          </HeroReveal>

          {button_label && button_link && (
            <div className="max-md:flex max-md:w-full max-md:justify-center">
              <HeroShopButton href={button_link}>{button_label}</HeroShopButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
