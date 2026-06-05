import type { CartItem } from '@/types/shopify';
import { formatMoney } from '@/utils/formatMoney';

interface CartLineListProps {
  items: CartItem[];
  loading?: boolean;
  onChangeQuantity: (key: string, quantity: number) => void;
  compact?: boolean;
}

export function CartLineList({ items, loading, onChangeQuantity, compact }: CartLineListProps) {
  const imageClass = compact ? 'h-20 w-20' : 'h-24 w-24';

  return (
    <ul className="divide-y divide-cream">
      {items.map((item) => (
        <li key={item.key} className="flex gap-4 py-5 first:pt-0">
          {item.image && (
            <a href={item.url} className="shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className={`${imageClass} rounded-xl object-cover`}
              />
            </a>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <a href={item.url} className="font-semibold text-primary hover:underline">
              {item.product_title}
            </a>
            {item.variant_title && (
              <p className="mt-0.5 text-sm text-text-muted">{item.variant_title}</p>
            )}
            <p className="mt-2 text-sm font-semibold">{formatMoney(item.final_line_price)}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => onChangeQuantity(item.key, Math.max(0, item.quantity - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream-dark text-lg hover:bg-cream disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                disabled={loading}
                onClick={() => onChangeQuantity(item.key, item.quantity + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream-dark text-lg hover:bg-cream disabled:opacity-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
