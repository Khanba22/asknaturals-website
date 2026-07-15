import type { HeroSettings } from '@/types/section-settings';
import { HeroReveal } from './motion/Reveal';
import { HeroShopButton } from './motion/HeroShopButton';

interface HeroProps {
  settings: HeroSettings;
}

const desktopHeadlineClass =
  'font-bold uppercase leading-[1.1] pl-4 tracking-[0.04em] text-white text-[clamp(1.75rem,6vw,5rem)]';

const mobileHeadlineClass =
  'font-bold uppercase leading-[1.08] tracking-[0.03em] text-white text-[clamp(2.4rem,9vw,3.8rem)]';
function HeroHeading({
  html,
  className,
}: {
  html?: string;
  className: string;
}) {
  if (!html) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Hero({ settings }: HeroProps) {
  const {
    heading,
    subtitle,
    description,
    button_label,
    button_link,
    image_url,
    mobile_image_url,
    product_image_url,
  } = settings;

  // Desktop right-side image: prefer dedicated product/clipart, fall back to hero photo
  const desktopImg = product_image_url || image_url;
  // Mobile bottom image: same clipart, fall back chain
  const mobileImg = product_image_url || mobile_image_url || image_url;

  return (
    <>
      {/* ─── DESKTOP HERO (md+) ─────────────────────────────────────── */}
      <section
        className="relative hidden w-full overflow-hidden bg-primary md:flex md:items-center"
        style={{ minHeight: 'calc(100vh - 88px)' }}
        aria-label="Hero"
      >
        {/* Left content column */}
        <div
          className="
            relative z-10 flex flex-col justify-center gap-[clamp(1.25rem,3vw,2rem)]
            w-[55%] lg:w-[52%]
            px-[clamp(1.5rem,4vw,5rem)] py-20
            items-start text-left
          "
        >
          {subtitle && (
            <HeroReveal delay={0.05}>
              <p className="text-[clamp(0.75rem,1vw,0.875rem)] hidden font-semibold uppercase tracking-[0.18em] text-white/70">
                {subtitle}
              </p>
            </HeroReveal>
          )}

          <HeroReveal delay={0.1}>
            {heading ? (
              <HeroHeading html={heading} className={desktopHeadlineClass} />
            ) : (
              <h1 className={desktopHeadlineClass}>
                Supplements designed around her biology.
              </h1>
            )}
          </HeroReveal>

          {button_label && button_link && (
            <HeroReveal delay={0.3}>
              <HeroShopButton href={button_link}>{button_label}</HeroShopButton>
            </HeroReveal>
          )}
        </div>

        {/* Right: hero product / clipart image — vertically centred, screen-width independent */}
        {desktopImg && (
          <div
            className="absolute right-0 w-[50%] lg:w-[55%] pointer-events-none flex items-center justify-center"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              maxHeight: '90%',
              aspectRatio: '1',
            }}
          >
            <img
              src={desktopImg}
              alt=""
              aria-hidden
              className="w-full h-full"
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </section>

      {/* ─── MOBILE HERO (max-md) ───────────────────────────────────── */}
      <section
        className="relative flex flex-col justify-center w-full md:hidden"
        style={{ minHeight: '92dvh' }}
        aria-label="Hero"
      >
        {/* ① Background — radial gradient: lighter green center, deep edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 30%, #06552e 0%, #034c29 50%, #021f12 100%)',
          }}
        />

        {/* ⑤ Botanical texture layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{ opacity: 0.06 }}
        />

        {/* ⑥ Content — tight vertical rhythm, no dead space */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-8 pb-4 gap-3">
          {subtitle && (
            <HeroReveal delay={0.05}>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-white/40">
                {subtitle}
              </p>
            </HeroReveal>
          )}

          <HeroReveal delay={0.1}>
            {heading ? (
              <HeroHeading
                html={heading}
                className={`${mobileHeadlineClass} [&_*]:!text-white [&_em]:not-italic [&_p]:m-0`}
              />
            ) : (
              <h1 className={mobileHeadlineClass}>
                Supplements designed around her biology.
              </h1>
            )}
          </HeroReveal>

          {button_label && button_link && (
            <HeroReveal delay={0.26}>
              <div className="flex flex-col items-center gap-2.5 mt-2">
                <HeroShopButton href={button_link}>{button_label}</HeroShopButton>
              </div>
            </HeroReveal>
          )}
        </div>

        {/* Product image — sits naturally below content, no overlap */}
        <div className="relative z-10 flex items-center justify-center px-4 pt-6 pb-6">
          {mobileImg && (
            <HeroReveal
              delay={0.38}
              variant="fadeUp"
              className="flex items-center justify-center w-full"
            >
              <img
                src={mobileImg}
                alt="AskNaturals Re-Cycle product"
                style={{
                  objectFit: 'contain',
                  maxHeight: '45vh',
                  filter:
                    'drop-shadow(0 24px 32px rgba(0,0,0,0.55)) drop-shadow(0 0 24px rgba(5,90,40,0.3))',
                }}
              />
            </HeroReveal>
          )}
        </div>
      </section >
    </>
  );
}