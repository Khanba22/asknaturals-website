import type { CustomerOrder } from '@/types/shopify';
import { formatMoney } from '@/utils/formatMoney';

/**
 * Order placement happens via Shopify Checkout after cart — not a custom Order API.
 * This service formats and works with orders exposed to logged-in customers (Liquid → React).
 */
export class OrderService {
  formatOrderTotal(cents: number): string {
    return formatMoney(cents);
  }

  formatOrderDate(isoDate: string): string {
    try {
      return new Date(isoDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoDate;
    }
  }

  getStatusLabel(order: Pick<CustomerOrder, 'financial_status' | 'fulfillment_status'>): string {
    if (order.fulfillment_status === 'fulfilled') return 'Fulfilled';
    if (order.fulfillment_status === 'partial') return 'Partially fulfilled';
    if (order.financial_status === 'paid') return 'Paid';
    if (order.financial_status === 'pending') return 'Payment pending';
    return order.financial_status || 'Processing';
  }

  sortOrdersNewestFirst(orders: CustomerOrder[]): CustomerOrder[] {
    return [...orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
}

export const orderService = new OrderService();
