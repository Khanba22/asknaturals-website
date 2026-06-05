import { createStorefrontApiClient, type StorefrontApiClient } from '@shopify/storefront-api-client';
import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';

let client: StorefrontApiClient | null = null;

export function getStorefrontClient(): StorefrontApiClient {
  if (client) return client;

  const { storefront } = getShopifyBootstrap();
  if (!storefront.token) {
    throw new Error(
      'Storefront API token is missing. Add it in Theme settings → Storefront API.',
    );
  }

  client = createStorefrontApiClient({
    storeDomain: storefront.domain,
    apiVersion: storefront.apiVersion,
    publicAccessToken: storefront.token,
  });

  return client;
}

export function hasStorefrontToken(): boolean {
  try {
    return Boolean(getShopifyBootstrap().storefront.token);
  } catch {
    return false;
  }
}
