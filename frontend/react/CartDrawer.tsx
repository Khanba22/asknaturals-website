import { useEffect, useState } from 'react';
import type { CartDrawerSettings } from '@/types/section-settings';
import { useCart } from '@/hooks/useCart';
import { customerService } from '@/services/customer';
import { getRoutes } from '@/utils/routes';
import { OPEN_CART } from '@/utils/events';
import { CartLineList } from './cart/CartLineList';
import { CartSummary } from './cart/CartSummary';

interface CartDrawerProps {
  settings: CartDrawerSettings;
}

export function CartDrawer({ settings }: CartDrawerProps) {
  const { cart, loading, changeQuantity, refresh } = useCart();
  const [open, setOpen] = useState(false);
  const routes = getRoutes();
  const checkoutUrl = cart.checkout_url ?? customerService.getCheckoutUrl();

  useEffect(() => {
    const openHandler = () => {
      setOpen(true);
      void refresh();
    };
    document.addEventListener(OPEN_CART, openHandler);
    return () => document.removeEventListener(OPEN_CART, openHandler);
  }, [refresh]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40"
          aria-label="Close cart"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-cream px-6 py-4">
          <h2 className="text-lg font-semibold text-primary">Your cart ({cart.item_count})</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-2xl leading-none text-text-muted hover:bg-cream"
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.items.length === 0 ? (
            <p className="py-12 text-center text-text-muted">
              {settings.empty_message ?? 'Your cart is empty'}
            </p>
          ) : (
            <CartLineList
              items={cart.items}
              loading={loading}
              onChangeQuantity={changeQuantity}
              compact
            />
          )}
        </div>

        {cart.items.length > 0 && (
          <footer className="border-t border-cream px-6 py-4">
            <CartSummary
              itemCount={cart.item_count}
              totalPrice={cart.total_price}
              checkoutUrl={checkoutUrl}
              cartUrl={routes.cart_url}
              showViewCart
            />
          </footer>
        )}
      </aside>
    </>
  );
}
