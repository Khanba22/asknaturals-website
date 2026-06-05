import { getStorefrontClient, hasStorefrontToken } from './client';
import { PRODUCT_BY_HANDLE, PRODUCTS_LIST, SEARCH_PRODUCTS } from './products.queries';

export interface StorefrontProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  vendor?: string;
  availableForSale: boolean;
  featuredImage?: { url: string; altText?: string | null } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  } | null;
  variants?: { nodes: { id: string }[] };
}

export class ProductService {
  async getProduct(handle: string): Promise<StorefrontProduct | null> {
    if (!hasStorefrontToken()) return null;
    const { data, errors } = await getStorefrontClient().request(PRODUCT_BY_HANDLE, {
      variables: { handle },
    });
    if (errors?.length) {
      console.error('ProductService.getProduct', errors);
      return null;
    }
    return (data as { product: StorefrontProduct | null })?.product ?? null;
  }

  async getProducts(first = 12): Promise<StorefrontProduct[]> {
    if (!hasStorefrontToken()) return [];
    const { data, errors } = await getStorefrontClient().request(PRODUCTS_LIST, {
      variables: { first },
    });
    if (errors?.length) {
      console.error('ProductService.getProducts', errors);
      return [];
    }
    return (data as { products: { nodes: StorefrontProduct[] } })?.products?.nodes ?? [];
  }

  async search(query: string, first = 8): Promise<StorefrontProduct[]> {
    if (!hasStorefrontToken() || !query.trim()) return [];
    const { data, errors } = await getStorefrontClient().request(SEARCH_PRODUCTS, {
      variables: { query, first },
    });
    if (errors?.length) {
      console.error('ProductService.search', errors);
      return [];
    }
    const nodes = (data as { search: { nodes: StorefrontProduct[] } })?.search?.nodes ?? [];
    return nodes;
  }
}

export const productService = new ProductService();
