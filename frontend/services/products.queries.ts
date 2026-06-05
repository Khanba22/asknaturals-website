export const PRODUCT_BY_HANDLE = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      vendor
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
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
        }
      }
    }
  }
`;

export const PRODUCTS_LIST = `#graphql
  query ProductsList($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        vendor
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
`;

export const SEARCH_PRODUCTS = `#graphql
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          id
          title
          handle
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
