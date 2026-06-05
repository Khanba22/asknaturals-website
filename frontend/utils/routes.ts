import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';

/** Resolve storefront paths using Liquid-injected routes (locale-safe). */
export function getRoutes() {
  return getShopifyBootstrap().routes;
}

export function shopUrl(path = ''): string {
  const { shopUrl, routes } = getShopifyBootstrap();
  const root = routes.root_url;
  if (!path) return root || shopUrl;
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${root}${normalized.replace(/^\//, '')}`;
}

/**
 * Ajax cart endpoints.
 *
 * We *expect* these to be injected by `layout/theme.liquid` as `window.__SHOPIFY__.cart_ajax`.
 * If they are missing (stale Liquid), we log loudly and fall back to a best-effort builder.
 */
export function cartAjaxUrl(action: 'load' | 'add' | 'change' | 'update'): string {
  const bootstrap = getShopifyBootstrap();
  const fromLiquid = bootstrap.cart_ajax?.[action];
  if (fromLiquid) return fromLiquid;

  // This should never happen once the theme bootstrap is synced.
  // Keep a fallback so the store doesn't fully break, but make it very obvious.
  // eslint-disable-next-line no-console
  console.error('[Cart API] Missing window.__SHOPIFY__.cart_ajax. Using fallback URLs.', {
    action,
    routesRootUrl: bootstrap.routes?.root_url,
  });

  const root = bootstrap.routes.root_url;
  const base = root.endsWith('/') ? root : `${root}/`;
  switch (action) {
    case 'load':
      return `${base}cart.js`;
    case 'add':
      return `${base}cart/add.js`;
    case 'change':
      return `${base}cart/change.js`;
    case 'update':
      return `${base}cart/update.js`;
  }
}
