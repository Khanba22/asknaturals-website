import { useEffect, useState } from 'react';
import type { HeaderSettings } from '@/types/section-settings';
import { CART_UPDATED, dispatchOpenCart } from '@/utils/events';
import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';
import { getRoutes } from '@/utils/routes';
import { AccountMenu } from './AccountMenu';

interface HeaderProps {
  settings: HeaderSettings;
}

function mergeNavLinks(
  menuLinks: { title: string; url: string }[],
  utilityLinks: { title: string; url: string }[],
) {
  const seen = new Set(menuLinks.map((link) => link.url));
  const merged = [...menuLinks];
  for (const link of utilityLinks) {
    if (link.url && !seen.has(link.url)) {
      merged.push(link);
      seen.add(link.url);
    }
  }
  return merged;
}

function isHomeLink(link: { title: string; url: string }, homeUrl: string) {
  if (link.title.trim().toLowerCase() === 'home') return true;
  const normalize = (url: string) => url.replace(/\/$/, '') || '/';
  return normalize(link.url) === normalize(homeUrl);
}

export function Header({ settings }: HeaderProps) {
  const [cartCount, setCartCount] = useState(() => getShopifyBootstrap().cart.item_count);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => setCartCount(getShopifyBootstrap().cart.item_count);
    document.addEventListener(CART_UPDATED, sync);
    return () => document.removeEventListener(CART_UPDATED, sync);
  }, []);

  const homeUrl = getRoutes().root_url;
  const overlayHero = settings.overlay_hero ?? false;
  const links = mergeNavLinks(settings.menu_links ?? [], settings.utility_links ?? []).filter(
    (link) => !isHomeLink(link, homeUrl),
  );

  return (
    <header
      className={`w-full px-4 text-white ${overlayHero
          ? 'bg-primary md:bg-primary/95 md:backdrop-blur-sm md:supports-[backdrop-filter]:bg-primary/85'
          : 'bg-primary'
        }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 py-4 md:py-5">
        <a href={homeUrl} className="flex shrink-0 items-center">
          <img
            src={settings.logo_url ?? ''}
            alt={settings.shop_name ?? 'AskNatural'}
            className="h-9 w-auto max-w-[220px] object-contain md:h-10"
          />
        </a>

        <div className="flex items-center justify-end gap-4 lg:gap-6">
          <nav
            className="hidden items-center justify-end gap-6 lg:flex xl:gap-8"
            aria-label="Main"
          >
            {links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                className="relative whitespace-nowrap text-sm font-medium text-white transition-all duration-300 hover:text-white/80 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
              >
                {link.title}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1">
            <a
              href={getRoutes().search_url}
              className="hidden rounded-full p-2.5 transition-all hover:scale-110 hover:bg-white/10 active:scale-95 sm:inline-flex"
              aria-label="Search"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.2-5.2M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </a>
            <AccountMenu />
            <button
              type="button"
              onClick={() => dispatchOpenCart()}
              className="relative rounded-full p-2.5 transition-all hover:scale-110 hover:bg-white/10 active:scale-95"
              aria-label={`Cart, ${cartCount} items`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              className="rounded-full p-2.5 transition-all hover:scale-110 hover:bg-white/10 active:scale-95 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileOpen ? (
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className={`border-t border-white/15 px-4 py-4 lg:hidden ${settings.overlay_hero ? 'bg-primary' : 'bg-primary-dark'
            }`}
        >
          <a
            href={getRoutes().search_url}
            className="block border-b border-white/10 py-3 text-sm text-white transition-all hover:pl-2 hover:text-white/80"
            onClick={() => setMobileOpen(false)}
          >
            Search
          </a>
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="block border-b border-white/10 py-3 text-sm text-white transition-all hover:pl-2 hover:text-white/80 last:border-0"
              onClick={() => setMobileOpen(false)}
            >
              {link.title}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
