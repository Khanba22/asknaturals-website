import type { ReactNode } from 'react';

interface HeroShopButtonProps {
  href: string;
  children: ReactNode;
}

/** Primary green (#034c29) — staggered across the 3s loop */
const SHINE_LINES = [
  { delay: '0s', width: '25%', color: 'rgba(3, 76, 41, 0.32)' },
  { delay: '0.75s', width: '30%', color: 'rgba(3, 76, 41, 0.24)' },
  { delay: '1.5s', width: '35%', color: 'rgba(3, 76, 41, 0.28)' },
  { delay: '2.25s', width: '30%', color: 'rgba(3, 76, 41, 0.2)' },
] as const;

export function HeroShopButton({ href, children }: HeroShopButtonProps) {
  return (
    <a
      href={href}
      className="
        hero-shop-btn__nudge relative inline-flex min-w-[min(100%,20rem)] items-center
        justify-center overflow-hidden rounded-xl bg-white
        px-[clamp(2.75rem,6vw,5.5rem)] py-[clamp(1rem,1.5vw,1.375rem)]
        text-[clamp(1.0625rem,1.35vw,1.25rem)] font-semibold uppercase tracking-wide text-primary
        shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:min-w-[22rem]
      "
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {SHINE_LINES.map((line) => (
          <span
            key={line.delay}
            className="hero-shop-btn__shine"
            style={{
              width: line.width,
              animationDelay: line.delay,
              background: `linear-gradient(90deg, transparent 0%, ${line.color} 50%, transparent 100%)`,
            }}
          />
        ))}
      </span>

      <span className="relative z-[1]">{children}</span>
    </a>
  );
}
