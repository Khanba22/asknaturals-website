import { useState } from 'react';
import type { ContactFaqSettings } from '@/types/contact-sections';

interface ContactFaqProps {
  settings: ContactFaqSettings;
}

export function ContactFaq({ settings }: ContactFaqProps) {
  const items = settings.items ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const bgClass = settings.background === 'white' ? 'bg-white' : 'bg-cream';

  if (items.length === 0) return null;

  return (
    <section className={`${bgClass} py-16 md:py-24`}>
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <h2 className="text-4xl font-bold uppercase leading-none tracking-wide text-primary md:text-5xl">
            {settings.heading ?? 'FAQ.'}
          </h2>
          {settings.subheading && (
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-text-muted">
              {settings.subheading}
            </p>
          )}
        </div>

        <div className="divide-y divide-cream border-t border-cream">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold uppercase tracking-wide text-text">
                    {item.question}
                  </span>
                  <span className="shrink-0 text-xl leading-none text-text-muted" aria-hidden>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 text-sm leading-relaxed text-text-muted">{item.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
