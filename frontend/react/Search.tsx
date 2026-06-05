import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchSettings } from '@/types/section-settings';
import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';
import { formatMoney } from '@/utils/formatMoney';

interface SearchProps {
  settings: SearchSettings;
}

interface PredictiveProduct {
  title: string;
  url: string;
  featured_image?: { url: string };
  price: number;
}

interface PredictiveResult {
  resources?: {
    results?: {
      products?: PredictiveProduct[];
    };
  };
}

export function Search({ settings }: SearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<PredictiveProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const base = getShopifyBootstrap().routes.predictive_search_url.replace(/\/?$/, '');
      const url = new URL(`${base}.json`, window.location.origin);
      url.searchParams.set('q', q);
      url.searchParams.set('resources[type]', 'product');
      url.searchParams.set('resources[limit]', '6');

      const res = await fetch(url.toString());
      const data = (await res.json()) as PredictiveResult;
      setResults(data.resources?.results?.products ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchResults]);

  return (
    <div className="relative w-full max-w-md">
      <label className="sr-only" htmlFor="site-search">
        Search
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={settings.placeholder ?? 'Search products…'}
        className="w-full rounded-full border border-cream-dark bg-cream px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        autoComplete="off"
      />
      {open && query.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-white shadow-lg">
          {loading ? (
            <p className="px-4 py-3 text-sm text-text-muted">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-muted">No products found</p>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product.url}>
                  <a
                    href={product.url}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-cream"
                  >
                    {product.featured_image?.url && (
                      <img
                        src={product.featured_image.url}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-primary">{formatMoney(product.price)}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
