import { useState } from 'react';
import type { ProductAccordionSettings } from '@/types/product-sections';

interface ProductAccordionProps {
  settings: ProductAccordionSettings;
}

export function ProductAccordion({ settings }: ProductAccordionProps) {
  const items = settings.items ?? [];
  const [openIndex, setOpenIndex] = useState(0);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-cream bg-white py-4 md:py-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="divide-y divide-cream">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.title}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wide text-text">
                    {item.title}
                  </span>
                  <span className="text-xl leading-none text-text-muted" aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5 text-sm leading-relaxed text-text-muted">{item.content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
