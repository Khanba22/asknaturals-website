import type { TestimonialsSettings } from '@/types/section-settings';
import { Button } from './ui/Button';

interface TestimonialsProps {
  settings: TestimonialsSettings;
}

export function Testimonials({ settings }: TestimonialsProps) {
  const blocks = settings.blocks ?? [];
  const knowMoreLink = settings.know_more_link;
  const knowMoreLabel = settings.know_more_label ?? 'Know More';

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
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
          </div>
          {knowMoreLink && (
            <a
              href={knowMoreLink}
              className="shrink-0 text-sm font-bold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
            >
              {knowMoreLabel}
            </a>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => {
            const { quote, author_name, author_title, author_date, rating } = block.settings as {
              quote?: string;
              author_name?: string;
              author_title?: string;
              author_date?: string;
              rating?: number;
            };
            return (
              <blockquote
                key={block.id}
                className="flex flex-col rounded-2xl border border-cream bg-white p-8 shadow-sm"
              >
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
            );
          })}
        </div>

        {knowMoreLink && (
          <div className="mt-10 flex justify-center">
            <Button href={knowMoreLink} variant="primary" className="uppercase tracking-wide">
              {knowMoreLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
