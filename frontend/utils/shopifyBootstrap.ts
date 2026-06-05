import type { ShopifyBootstrap } from '@/types/shopify';

export function getShopifyBootstrap(): ShopifyBootstrap {
  if (typeof window === 'undefined' || !window.__SHOPIFY__) {
    throw new Error('window.__SHOPIFY__ is not defined. Ensure theme.liquid bootstrap runs.');
  }
  return window.__SHOPIFY__;
}

export function updateBootstrapCart(cart: ShopifyBootstrap['cart']): void {
  window.__SHOPIFY__.cart = cart;
}
