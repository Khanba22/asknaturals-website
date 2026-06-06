import type { OrderFilterTab, OrderPageOrder } from '@/types/order-pages';
import type { CustomerOrder } from '@/types/shopify';
import { formatMoney } from '@/utils/formatMoney';

export type OrderDisplayStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'pending';

const PROGRESS_LABELS = [
  'Ordered',
  'Packed',
  'Shipped',
  'Out For Delivery',
  'Delivered',
] as const;

export class OrderService {
  formatOrderTotal(cents: number): string {
    return formatMoney(cents);
  }

  formatOrderDate(isoDate: string): string {
    try {
      return new Date(isoDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return isoDate;
    }
  }

  formatOrderDateShort(isoDate: string): string {
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

  getDisplayStatus(order: Pick<OrderPageOrder, 'cancelled' | 'fulfillment_status' | 'financial_status'>): OrderDisplayStatus {
    if (order.cancelled) return 'cancelled';
    if (order.fulfillment_status === 'fulfilled') return 'delivered';
    if (order.fulfillment_status === 'partial') return 'shipped';
    if (order.financial_status === 'pending' || order.financial_status === 'authorized') {
      return 'pending';
    }
    return 'processing';
  }

  getStatusLabel(order: Pick<OrderPageOrder, 'cancelled' | 'fulfillment_status' | 'financial_status'>): string {
    const status = this.getDisplayStatus(order);
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      default:
        return 'Processing';
    }
  }

  getTransitLabel(order: Pick<OrderPageOrder, 'cancelled' | 'fulfillment_status' | 'financial_status'>): string {
    const status = this.getDisplayStatus(order);
    if (status === 'delivered') return 'Delivered';
    if (status === 'cancelled') return 'Cancelled';
    if (status === 'shipped') return 'In Transit';
    if (status === 'pending') return 'Pending';
    return 'Processing';
  }

  matchesFilter(order: OrderPageOrder, tab: OrderFilterTab): boolean {
    if (tab === 'all') return true;
    const status = this.getDisplayStatus(order);
    if (tab === 'processing') return status === 'processing' || status === 'pending';
    return status === tab;
  }

  getProgressStep(order: Pick<OrderPageOrder, 'cancelled' | 'fulfillment_status' | 'financial_status'>): number {
    const status = this.getDisplayStatus(order);
    if (status === 'cancelled') return 0;
    if (status === 'delivered') return 4;
    if (status === 'shipped') return 2;
    if (status === 'processing' || status === 'pending') return 1;
    return 0;
  }

  getProgressLabels(): readonly string[] {
    return PROGRESS_LABELS;
  }

  getExpectedDeliveryDate(isoDate: string, daysToAdd = 6): string {
    try {
      const date = new Date(isoDate);
      date.setDate(date.getDate() + daysToAdd);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  getPaymentLabel(order: OrderPageOrder): string {
    const gateway = order.payment_gateway_names?.[0];
    if (!gateway) return 'Online payment';
    return gateway.replace(/_/g, ' ');
  }

  orderMatchesSearch(order: OrderPageOrder, query: string): boolean {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;

    if (order.name.toLowerCase().includes(normalized)) return true;
    if (String(order.order_number).includes(normalized)) return true;

    return order.line_items.some((item) => item.title.toLowerCase().includes(normalized));
  }

  sortOrdersNewestFirst(orders: CustomerOrder[]): CustomerOrder[] {
    return [...orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
}

export const orderService = new OrderService();
