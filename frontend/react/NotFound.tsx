import { getRoutes } from '@/utils/routes';
import { Button } from './ui/Button';

export interface NotFoundSettings {
  heading?: string;
  subtext?: string;
}

interface NotFoundProps {
  settings: NotFoundSettings;
}

export function NotFound({ settings }: NotFoundProps) {
  const routes = getRoutes();

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto w-full max-w-lg px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-4 font-bold uppercase leading-tight tracking-wide text-primary">
          {settings.heading ?? 'Page not found'}
        </h1>
        <p className="mt-4 text-text-muted">
          {settings.subtext ?? "The page you're looking for doesn't exist or has been moved."}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={routes.root_url} variant="primary">
            Back to home
          </Button>
          <Button href={routes.all_products_collection_url} variant="outline">
            Shop all
          </Button>
        </div>
      </div>
    </section>
  );
}
