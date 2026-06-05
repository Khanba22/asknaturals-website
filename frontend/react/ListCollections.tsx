export interface CollectionCard {
  id: number;
  title: string;
  handle: string;
  url: string;
  description: string | null;
  image_url: string | null;
  products_count: number;
}

export interface ListCollectionsSettings {
  heading?: string;
  subtext?: string;
  collections?: CollectionCard[];
}

interface ListCollectionsProps {
  settings: ListCollectionsSettings;
}

export function ListCollections({ settings }: ListCollectionsProps) {
  const collections = settings.collections ?? [];

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-text md:text-[2.5rem]">
            {settings.heading ?? 'Collections'}
          </h1>
          {settings.subtext && (
            <p className="mt-3 text-text-muted">{settings.subtext}</p>
          )}
        </div>

        {collections.length === 0 ? (
          <p className="text-center text-text-muted">No collections yet.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <li key={collection.id}>
                <a
                  href={collection.url}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-primary-light">
                    {collection.image_url ? (
                      <img
                        src={collection.image_url}
                        alt={collection.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/70">
                        {collection.title}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-lg font-bold uppercase text-primary">
                      {collection.title}
                    </h2>
                    {collection.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                        {collection.description}
                      </p>
                    )}
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                      {collection.products_count} products
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
