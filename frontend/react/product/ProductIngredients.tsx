import { useCallback, useEffect, useRef, useState } from 'react';
import type { IngredientItem, ProductIngredientsSettings } from '@/types/product-sections';

interface ProductIngredientsProps {
  settings: ProductIngredientsSettings;
}

const SATELLITE_COUNT = 6;
const DEGREE_STEP = 360 / SATELLITE_COUNT;
const ROTATION_MS = 700;
const ROTATION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

/** Orbit radius as a fraction of container width (118 / 400 in the design) */
const ORBIT_RATIO = 118 / 400;

const rotationTransition = `transform ${ROTATION_MS}ms ${ROTATION_EASE}`;

function IngredientWheel({
  hubLabel,
  ingredients,
  activeIndex,
}: {
  hubLabel: string;
  ingredients: IngredientItem[];
  activeIndex: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbitR, setOrbitR] = useState(118);
  const satellites = ingredients.slice(0, SATELLITE_COUNT);
  const ringRotation = activeIndex <= 0 ? 0 : -(activeIndex - 1) * DEGREE_STEP;
  const hubActive = activeIndex === 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setOrbitR(el.offsetWidth * ORBIT_RATIO);
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full max-w-[340px] md:max-w-[400px]"
    >
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 400 400"
        aria-hidden
      >
        <circle cx="200" cy="200" r="118" fill="none" stroke="#d4d4d4" strokeWidth="1" />
        {satellites.map((_, index) => {
          const angleRad = ((index * DEGREE_STEP - 90) * Math.PI) / 180;
          return (
            <line
              key={`spoke-${index}`}
              x1="200"
              y1="200"
              x2={200 + 118 * Math.cos(angleRad)}
              y2={200 + 118 * Math.sin(angleRad)}
              stroke="#d4d4d4"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 size-0">
        <div
          className="will-change-transform"
          style={{
            transform: `rotate(${ringRotation}deg)`,
            transformOrigin: '0 0',
            transition: rotationTransition,
          }}
        >
          {satellites.map((ingredient, index) => {
            const angleRad = ((index * DEGREE_STEP - 90) * Math.PI) / 180;
            const x = orbitR * Math.cos(angleRad);
            const y = orbitR * Math.sin(angleRad);
            const isActive = activeIndex > 0 && activeIndex - 1 === index;

            return (
              <div
                key={ingredient.title}
                className="absolute"
                style={{
                  left: x,
                  top: y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Counter-rotate in sync with the ring so labels stay upright */}
                <div
                  className="flex size-[4.5rem] items-center justify-center rounded-full text-center md:size-20"
                  style={{
                    transform: `rotate(${-ringRotation}deg)`,
                    transformOrigin: 'center center',
                    transition: `${rotationTransition}, background-color 300ms ease, box-shadow 300ms ease, color 300ms ease`,
                    backgroundColor: isActive ? '#2d4a1e' : '#c5d4bc',
                    color: isActive ? '#fff' : '#2d4a1e',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    letterSpacing: '0.04em',
                    boxShadow: isActive ? '0 4px 20px rgba(45,74,30,0.35)' : 'none',
                    willChange: 'transform',
                  }}
                >
                  {ingredient.short_label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center transition-[transform,box-shadow] duration-500 md:size-32 ${hubActive
          ? 'scale-105 bg-primary text-white shadow-lg shadow-primary/30'
          : 'bg-primary text-white'
          }`}
      >
        <span className="px-3 text-xs font-bold uppercase leading-tight tracking-wider md:text-sm">
          {hubLabel}
        </span>
      </div>
    </div>
  );
}

/** Pick the scroll item whose heading is closest to the focus line (stable, no IO flicker). */
function useScrollSpy(itemCount: number, itemRefs: React.RefObject<(HTMLDivElement | null)[]>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const focusY = window.innerHeight * 0.38;
      let bestIndex = 0;
      let bestDistance = Infinity;

      itemRefs.current?.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const headingY = rect.top + 24;
        const distance = Math.abs(headingY - focusY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [itemCount, itemRefs]);

  return activeIndex;
}

export function ProductIngredients({ settings }: ProductIngredientsProps) {
  const hubLabel = settings.hub_label ?? 'Harmony Blend';
  const hubDescription =
    settings.hub_description ??
    'A synergistic Ayurvedic blend designed to support hormonal balance, energy, and everyday wellness.';
  const ingredients = settings.ingredients ?? [];
  const scrollItems: IngredientItem[] =
    ingredients.length >= SATELLITE_COUNT
      ? [
        {
          title: hubLabel,
          short_label: hubLabel.split(' ')[0] ?? 'Blend',
          description: hubDescription,
        },
        ...ingredients.slice(0, SATELLITE_COUNT),
      ]
      : [
        {
          title: hubLabel,
          short_label: hubLabel.split(' ')[0] ?? 'Blend',
          description: hubDescription,
        },
        ...ingredients,
      ];

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const activeIndex = useScrollSpy(scrollItems.length, itemRefs);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
    },
    [],
  );

  const satelliteIngredients = scrollItems.slice(1, 1 + SATELLITE_COUNT);

  return (
    <section ref={sectionRef} className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {settings.heading && (
          <h2 className="mb-12 font-bold uppercase tracking-wide text-primary text-2xl md:text-3xl">
            {settings.heading}
          </h2>
        )}

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="sticky top-24 self-start">
            <IngredientWheel
              hubLabel={hubLabel}
              ingredients={satelliteIngredients}
              activeIndex={activeIndex}
            />
          </div>

          <div className="divide-y divide-cream">
            {scrollItems.map((item, index) => (
              <div
                key={item.title}
                ref={setItemRef(index)}
                data-index={index}
                className="min-h-[40vh] py-10 first:pt-0 lg:min-h-[45vh]"
              >
                <h3
                  className={`font-bold uppercase tracking-wide transition-colors duration-300 text-xl md:text-2xl ${activeIndex === index ? 'text-primary' : 'text-text'
                    }`}
                >
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
