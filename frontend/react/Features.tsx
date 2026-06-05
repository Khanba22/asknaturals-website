import type { FeaturesSettings } from '@/types/section-settings';

interface FeaturesProps {
  settings: FeaturesSettings;
}

function RichText({ html }: { html?: string }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Features({ settings }: FeaturesProps) {
  const blocks = settings.blocks ?? [];

  return (
    <section className="bg-primary-light/30 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {(settings.heading || settings.subheading) && (
          <div className="mb-12 text-center">
            {settings.heading && (
              <div className="mb-4 font-serif text-3xl font-bold md:text-4xl [&_em]:italic [&_em]:text-primary">
                <RichText html={settings.heading} />
              </div>
            )}
            {settings.subheading && <p className="text-lg text-text-muted">{settings.subheading}</p>}
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="rounded-2xl bg-white p-8 text-center shadow-sm"
            >
              <div className="mb-4 text-4xl">
                {block.settings.custom_icon_url ? (
                  <img
                    src={block.settings.custom_icon_url}
                    alt=""
                    className="mx-auto h-12 w-12"
                  />
                ) : (
                  block.settings.emoji ?? '✓'
                )}
              </div>
              {block.settings.title && (
                <h3 className="mb-2 text-lg font-semibold">{block.settings.title}</h3>
              )}
              {block.settings.description && (
                <p className="text-sm text-text-muted">{block.settings.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
