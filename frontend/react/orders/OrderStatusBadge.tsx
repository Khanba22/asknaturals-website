import { orderService } from '@/services/orders';
import type { OrderPageOrder } from '@/types/order-pages';

interface OrderStatusBadgeProps {
  order: OrderPageOrder;
}

export function OrderStatusBadge({ order }: OrderStatusBadgeProps) {
  const status = orderService.getDisplayStatus(order);

  const className =
    status === 'delivered'
      ? 'bg-primary/10 text-primary'
      : status === 'cancelled'
        ? 'bg-red-50 text-red-700'
        : 'bg-cream-dark text-text-muted';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {orderService.getStatusLabel(order)}
    </span>
  );
}
