import type { PageBreadcrumb } from '@/types/order-pages';

interface OrderPageChromeProps {
  title: string;
  breadcrumbs?: PageBreadcrumb[];
}

export function OrderPageChrome({ title, breadcrumbs }: OrderPageChromeProps) {
  return (
    <header className="mb-10 text-center md:mb-12">
      <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-text md:text-4xl">
        {title}
      </h1>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mt-3 text-sm text-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-1">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.url}-${crumb.title}`} className="flex items-center gap-1">
                {index > 0 && <span aria-hidden>&gt;</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span>{crumb.title}</span>
                ) : (
                  <a href={crumb.url} className="hover:text-primary">
                    {crumb.title}
                  </a>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </header>
  );
}
