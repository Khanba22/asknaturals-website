import { useMemo } from 'react';
import type { LiquidProduct } from '@/types/shopify';
import { cartService } from '@/services/cart';
import { getRoutes } from '@/utils/routes';
import { dispatchOpenCart } from '@/utils/events';
import { ProductCard } from './ProductCard';
import { Button } from './ui/Button';

export interface SearchPageSettings {
  heading?: string;
  terms?: string;
  results_count?: number;
  products?: LiquidProduct[];
}

interface SearchPageProps {
  settings: SearchPageSettings;
}

export function SearchPage({ settings }: SearchPageProps) {
  const routes = getRoutes();
  const terms = settings.terms?.trim() ?? '';
  const products = settings.products ?? [];
  const hasQuery = terms.length > 0;

  const sortedProducts = useMemo(() => [...products], [products]);

  const handleAddToCart = async (product: LiquidProduct) => {
    try {
      await cartService.addLine({
        id: product.variant_id,
        quantity: 1,
        meta: { productTitle: product.title, variantTitle: product.variant_title },
      });
      dispatchOpenCart();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not add to cart';
      window.alert(message);
    }
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-text md:text-[2.5rem]">
            {settings.heading ?? 'Search'}
          </h1>
        </div>

        <form
          action={routes.search_url}
          method="get"
          role="search"
          className="mx-auto mb-12 max-w-xl"
        >
          <label htmlFor="search-page-input" className="sr-only">
            Search products
          </label>
          <div className="flex gap-2">
            <input
              id="search-page-input"
              type="search"
              name="q"
              defaultValue={terms}
              placeholder="Search products…"
              className="min-w-0 flex-1 rounded-full border border-cream-dark bg-cream px-5 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" variant="primary" className="shrink-0 px-6">
              Search
            </Button>
          </div>
        </form>

        {!hasQuery ? (
          <p className="text-center text-text-muted">Enter a search term to find products.</p>
        ) : sortedProducts.length === 0 ? (
          <div className="rounded-2xl bg-cream px-6 py-12 text-center">
            <p className="text-text-muted">
              No products found for &ldquo;{terms}&rdquo;.
            </p>
            <div className="mt-6">
              <Button href={routes.all_products_collection_url} variant="primary">
                Browse all products
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-8 text-sm text-text-muted">
              {settings.results_count ?? sortedProducts.length} result
              {(settings.results_count ?? sortedProducts.length) === 1 ? '' : 's'} for &ldquo;
              {terms}&rdquo;
            </p>
            <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
