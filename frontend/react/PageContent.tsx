export interface PageContentSettings {
  title?: string;
  content_html?: string;
}

interface PageContentProps {
  settings: PageContentSettings;
}

export function PageContent({ settings }: PageContentProps) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        {settings.title && (
          <h1 className="mb-8 font-bold uppercase leading-tight tracking-wide text-primary">
            {settings.title}
          </h1>
        )}
        {settings.content_html && (
          <div
            className="prose prose-neutral max-w-none text-text [&_a]:text-primary [&_a]:underline [&_h2]:font-heading [&_h2]:text-primary [&_h3]:font-heading [&_h3]:text-primary"
            dangerouslySetInnerHTML={{ __html: settings.content_html }}
          />
        )}
      </div>
    </section>
  );
}
