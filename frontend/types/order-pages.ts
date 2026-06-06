import type { CustomerOrderDetail } from '@/types/shopify';

export interface PageBreadcrumb {
  title: string;
  url: string;
}

export type OrderFilterTab = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderPageOrder extends CustomerOrderDetail {
  cancelled: boolean;
  total_discounts: number;
  email?: string;
  phone?: string | null;
  payment_gateway_names?: string[];
}

export interface OrderListPageSettings {
  orders?: OrderPageOrder[];
  products_page_url?: string;
  contact_page_url?: string;
  breadcrumbs?: PageBreadcrumb[];
}

export interface OrderStatusPageSettings {
  order?: OrderPageOrder | null;
  orders?: OrderPageOrder[];
  order_list_page_url?: string;
  contact_page_url?: string;
  breadcrumbs?: PageBreadcrumb[];
}
