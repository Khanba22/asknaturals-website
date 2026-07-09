import type { TestimonialsSettings } from '@/types/section-settings';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal';

interface TestimonialsProps {
  settings: TestimonialsSettings;
}

export function Testimonials({ settings }: TestimonialsProps) {
  const blocks = settings.blocks ?? [];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <Reveal className="mb-12 text-center md:text-left">
          {settings.subheading && (
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              {settings.subheading}
            </p>
          )}
          {settings.heading && (
            <h2 className="font-bold uppercase leading-tight tracking-wide text-2xl text-primary md:text-3xl">
              {settings.heading}
            </h2>
          )}
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => {
            const { quote, author_name, author_title, author_date, rating } = block.settings as {
              quote?: string;
              author_name?: string;
              author_title?: string;
              author_date?: string;
              rating?: number;
            };
            return (
              <StaggerItem key={block.id}>
                <blockquote className="flex h-full flex-col rounded-2xl border border-cream bg-white p-8 shadow-sm">
                  {rating != null && rating > 0 && (
                    <div className="mb-4 flex gap-0.5 text-primary" aria-label={`${rating} stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  )}
                  {quote && (
                    <p className="mb-8 flex-1 text-sm leading-relaxed text-text-muted">
                      &ldquo;{quote}&rdquo;
                    </p>
                  )}
                  {author_name && (
                    <footer>
                      <p className="text-sm font-bold uppercase tracking-wide text-text">
                        {author_name}
                      </p>
                      {(author_date || author_title) && (
                        <p className="mt-1 text-xs text-text-muted">
                          {[author_date, author_title].filter(Boolean).join(' · ')}
                        </p>
                      )}
                    </footer>
                  )}
                </blockquote>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
