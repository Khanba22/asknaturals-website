import { formatMoney } from '@/utils/formatMoney';
import { Button } from '../ui/Button';

interface CartSummaryProps {
  itemCount: number;
  totalPrice: number;
  checkoutUrl: string;
  cartUrl?: string;
  showViewCart?: boolean;
}

export function CartSummary({
  itemCount,
  totalPrice,
  checkoutUrl,
  cartUrl,
  showViewCart,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex justify-between text-base">
        <span className="text-text-muted">
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="text-lg font-bold text-primary">{formatMoney(totalPrice)}</span>
      </div>
      <p className="mb-6 text-xs text-text-muted">
        Shipping, taxes, and discounts calculated at checkout.
      </p>
      {showViewCart && cartUrl && (
        <Button href={cartUrl} variant="outline" className="mb-3 w-full text-center">
          View cart
        </Button>
      )}
      <Button href={checkoutUrl} variant="primary" className="w-full text-center">
        Checkout
      </Button>
    </div>
  );
}
