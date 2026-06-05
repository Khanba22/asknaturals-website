import type { StorefrontProduct } from './products';
import { getStorefrontClient, hasStorefrontToken } from './client';
import { COLLECTION_BY_HANDLE, COLLECTIONS_LIST } from './collections.queries';

export interface StorefrontCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: { url: string; altText?: string | null } | null;
  products?: { nodes: StorefrontProduct[] };
}

export interface CollectionSummary {
  id: string;
  title: string;
  handle: string;
  image?: { url: string; altText?: string | null } | null;
}

export class CollectionService {
  async getCollection(handle: string, productCount = 12): Promise<StorefrontCollection | null> {
    if (!hasStorefrontToken()) return null;
    const { data, errors } = await getStorefrontClient().request(COLLECTION_BY_HANDLE, {
      variables: { handle, first: productCount },
    });
    if (errors?.length) {
      console.error('CollectionService.getCollection', errors);
      return null;
    }
    return (data as { collection: StorefrontCollection | null })?.collection ?? null;
  }

  async getCollections(first = 10): Promise<CollectionSummary[]> {
    if (!hasStorefrontToken()) return [];
    const { data, errors } = await getStorefrontClient().request(COLLECTIONS_LIST, {
      variables: { first },
    });
    if (errors?.length) {
      console.error('CollectionService.getCollections', errors);
      return [];
    }
    return (data as { collections: { nodes: CollectionSummary[] } })?.collections?.nodes ?? [];
  }
}

export const collectionService = new CollectionService();
