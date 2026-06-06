export interface ShopifyRoutes {
  cart_add_url: string;
  cart_change_url: string;
  cart_update_url: string;
  cart_url: string;
  checkout_url: string;
  contact_url: string;
  search_url: string;
  predictive_search_url: string;
  root_url: string;
  account_url: string;
  account_login_url: string;
  storefront_login_url: string;
  account_register_url: string;
  account_logout_url: string;
  account_recover_url: string;
  account_addresses_url: string;
  account_reset_url: string;
  collections_url: string;
  all_products_collection_url: string;
}

export interface ShopifyStorefrontConfig {
  domain: string;
  token: string;
  apiVersion: string;
}

export interface ShopifyBootstrap {
  shop: string;
  shopUrl: string;
  routes: ShopifyRoutes;
  cart_ajax: {
    load: string;
    add: string;
    change: string;
    update: string;
  };
  cart: Cart;
  locale: string;
  customer: Customer | null;
  storefront: ShopifyStorefrontConfig;
  moneyFormat: string;
  currency: string;
  authenticity_token: string;
}

export interface CartItem {
  id: number;
  key: string;
  quantity: number;
  title: string;
  price: number;
  line_price: number;
  final_line_price: number;
  url: string;
  image: string | null;
  variant_id: number;
  product_id: number;
  variant_title: string | null;
  product_title: string;
}

export interface Cart {
  item_count: number;
  total_price: number;
  items: CartItem[];
  currency: string;
  note: string | null;
  checkout_url?: string;
}

export interface CustomerFormError {
  field: string;
  message: string;
}

export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
  orders_count?: number;
  total_spent?: number;
}

export interface CustomerOrder {
  id: number;
  name: string;
  order_number: number;
  created_at: string;
  financial_status: string;
  fulfillment_status: string;
  total_price: number;
  line_items_count: number;
  url: string;
}

export interface CustomerAddress {
  id: number;
  first_name: string;
  last_name: string;
  company: string | null;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string | null;
  default: boolean;
  url: string;
}

export interface OrderLineItem {
  id: number;
  title: string;
  variant_title: string | null;
  quantity: number;
  price: number;
  final_line_price: number;
  image: string | null;
  url: string | null;
  product_description?: string | null;
}

export interface OrderAddress {
  name: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone?: string | null;
}

export interface CustomerOrderDetail extends CustomerOrder {
  subtotal_price: number;
  total_tax: number;
  total_shipping_price: number;
  line_items: OrderLineItem[];
  shipping_address: OrderAddress | null;
  billing_address: OrderAddress | null;
}

export interface LiquidProduct {
  id: number;
  variant_id: number;
  variant_title?: string;
  variant_available?: boolean;
  title: string;
  handle: string;
  url: string;
  featured_image: string | null;
  price: number;
  compare_at_price: number | null;
  available: boolean;
  vendor?: string;
}

declare global {
  interface Window {
    __SHOPIFY__: ShopifyBootstrap;
  }
}

export { };
