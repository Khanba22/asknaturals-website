import { useMemo, useState } from 'react';
import type { ProductGridSettings } from '@/types/section-settings';
import { ProductCard } from './ProductCard';
import { cartService } from '@/services/cart';
import { dispatchOpenCart } from '@/utils/events';
import { getRoutes } from '@/utils/routes';
import type { LiquidProduct } from '@/types/shopify';

interface ProductGridProps {
  settings: ProductGridSettings & {
    show_shop_header?: boolean;
    collection_title?: string;
    products_count?: number;
  };
}

type SortOption = 'featured' | 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc';

function FilterIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4h18M6 10h12M10 16h4"
      />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h6" />
    </svg>
  );
}

export function ProductGrid({ settings }: ProductGridProps) {
  const [products] = useState<LiquidProduct[]>(settings.products ?? []);
  const [sort, setSort] = useState<SortOption>('featured');
  const [sortOpen, setSortOpen] = useState(false);

  const productCount = settings.products_count ?? products.length;

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'title-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [products, sort]);

  const handleAddToCart = async (product: LiquidProduct) => {
    try {
      await cartService.addLine({
        id: product.variant_id,
        quantity: 1,
        meta: {
          productTitle: product.title,
          variantTitle: product.variant_title,
        },
      });
      dispatchOpenCart();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not add to cart';
      console.error('[Cart API] Add from grid failed', { product, error });
      window.alert(message);
    }
  };

  const title = settings.collection_title ?? settings.heading;
  const homeUrl = getRoutes().root_url;

  const sortLabels: Record<SortOption, string> = {
    featured: 'Featured',
    'title-asc': 'Name: A–Z',
    'title-desc': 'Name: Z–A',
    'price-asc': 'Price: Low to high',
    'price-desc': 'Price: High to low',
  };

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {settings.show_shop_header && (
          <div className="mb-10 md:mb-12">
            <div className="mb-8 text-center md:mb-10">
              <h1 className="text-3xl font-bold uppercase tracking-[0.12em] text-text md:text-[2.5rem]">
                Shop
              </h1>
              <nav className="mt-3 text-sm text-text-muted" aria-label="Breadcrumb">
                <a href={homeUrl} className="transition hover:text-primary">
                  Home
                </a>
                <span className="mx-2">/</span>
                <span>Shop</span>
              </nav>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text transition hover:border-primary/40"
                >
                  <FilterIcon />
                  Filters
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-text transition hover:border-primary/40"
                    aria-expanded={sortOpen}
                    aria-haspopup="listbox"
                  >
                    <SortIcon />
                    Sort
                  </button>
                  {sortOpen && (
                    <ul
                      role="listbox"
                      className="absolute left-0 top-full z-20 mt-2 min-w-[180px] rounded-lg border border-black/10 bg-white py-1 shadow-lg"
                    >
                      {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={sort === option}
                            className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-cream ${sort === option ? 'font-semibold text-primary' : 'text-text'
                              }`}
                            onClick={() => {
                              setSort(option);
                              setSortOpen(false);
                            }}
                          >
                            {sortLabels[option]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <p className="text-sm text-text-muted">
                Showing {productCount} Product{productCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {!settings.show_shop_header && (settings.heading || settings.subheading) && (
          <div className="mb-12 text-center">
            {title && typeof title === 'string' && !title.includes('<') && (
              <h2 className="mb-4 font-bold uppercase leading-tight tracking-wide text-primary">
                {title}
              </h2>
            )}
            {settings.subheading && (
              <p className="text-lg text-text-muted">{settings.subheading}</p>
            )}
          </div>
        )}

        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-text-muted">
            No products in this collection yet. Assign a collection in the theme editor.
          </p>
        )}

        {settings.button_label && settings.button_link && (
          <div className="mt-12 text-center">
            <a
              href={settings.button_link}
              className="inline-flex items-center justify-center rounded-full border-2 border-primary bg-transparent px-8 py-3 text-sm font-semibold uppercase tracking-wider text-primary"
            >
              {settings.button_label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
