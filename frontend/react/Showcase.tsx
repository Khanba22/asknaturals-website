import type { ShowcaseSettings } from '@/types/section-settings';

interface ShowcaseProps {
  settings: ShowcaseSettings;
}

function RichText({ html }: { html?: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Showcase({ settings }: ShowcaseProps) {
  const imageFirst = settings.image_position !== 'right';
  const blocks = settings.blocks ?? [];

  const content = (
    <div>
      {settings.subtitle && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
          {settings.subtitle}
        </p>
      )}
      {settings.heading && (
        <div className="mb-6 font-serif text-3xl font-bold md:text-4xl [&_em]:italic [&_em]:text-primary">
          <RichText html={settings.heading} />
        </div>
      )}
      {settings.description && (
        <div className="mb-6 text-lg text-text-muted [&_p]:m-0">
          <RichText html={settings.description} />
        </div>
      )}
      {blocks.length > 0 && (
        <ul className="mb-8 space-y-3">
          {blocks.map((block) => (
            <li key={block.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                ✓
              </span>
              <span>{block.settings.text}</span>
            </li>
          ))}
        </ul>
      )}
      {settings.button_label && settings.button_link && (
        <a
          href={settings.button_link}
          className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          {settings.button_label}
        </a>
      )}
    </div>
  );

  const media = (
    <div className="overflow-hidden rounded-3xl bg-primary-light p-8">
      {settings.image_url ? (
        <img src={settings.image_url} alt="" className="h-auto w-full rounded-2xl" loading="lazy" />
      ) : (
        <div className="flex aspect-video items-center justify-center text-text-muted">Image</div>
      )}
    </div>
  );

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {imageFirst ? (
            <>
              {media}
              {content}
            </>
          ) : (
            <>
              {content}
              {media}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
