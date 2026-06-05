export const COLLECTION_BY_HANDLE = `#graphql
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: $first) {
        nodes {
          id
          title
          handle
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_LIST = `#graphql
  query CollectionsList($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
        }
      }
    }
  }
`;
