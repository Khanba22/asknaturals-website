import { useCallback, useEffect, useState } from 'react';
import type { CartDrawerSettings } from '@/types/section-settings';
import { useCart } from '@/hooks/useCart';
import { customerService } from '@/services/customer';
import { cartService } from '@/services/cart';
import { getRoutes } from '@/utils/routes';
import { CartLineList } from './cart/CartLineList';
import { CartSummary } from './cart/CartSummary';
import { Button } from './ui/Button';

interface CartPageProps {
  settings: CartDrawerSettings;
}

export function CartPage({ settings }: CartPageProps) {
  const { cart, loading, error, changeQuantity, refresh } = useCart();
  const [note, setNote] = useState(cart.note ?? '');
  const [noteSaving, setNoteSaving] = useState(false);
  const routes = getRoutes();
  const checkoutUrl = cart.checkout_url ?? customerService.getCheckoutUrl();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    setNote(cart.note ?? '');
  }, [cart.note]);

  const saveNote = useCallback(async () => {
    setNoteSaving(true);
    try {
      await cartService.updateNote(note);
      await refresh();
    } finally {
      setNoteSaving(false);
    }
  }, [note, refresh]);

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="mb-10">
          <h1 className="font-bold uppercase leading-tight tracking-wide text-primary">Your cart</h1>
          <p className="mt-2 text-text-muted">
            {cart.item_count === 0
              ? 'Your cart is empty'
              : `${cart.item_count} ${cart.item_count === 1 ? 'item' : 'items'}`}
          </p>
        </div>

        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        {cart.items.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-text-muted">{settings.empty_message ?? 'Your cart is empty'}</p>
            <div className="mt-8">
              <Button href={routes.all_products_collection_url} variant="primary">
                Continue shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl bg-white px-6 py-2 shadow-sm lg:col-span-2">
              <CartLineList
                items={cart.items}
                loading={loading}
                onChangeQuantity={changeQuantity}
              />
            </div>

            <div className="space-y-6">
              <CartSummary
                itemCount={cart.item_count}
                totalPrice={cart.total_price}
                checkoutUrl={checkoutUrl}
              />

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <label htmlFor="cart-note" className="mb-2 block text-sm font-semibold text-primary">
                  Order note
                </label>
                <textarea
                  id="cart-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Special instructions for your order"
                  className="w-full resize-none rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  disabled={noteSaving || note === (cart.note ?? '')}
                  onClick={() => void saveNote()}
                  className="mt-3 text-sm font-medium text-primary underline disabled:opacity-50"
                >
                  {noteSaving ? 'Saving…' : 'Save note'}
                </button>
              </div>

              <Button href={routes.all_products_collection_url} variant="outline" className="w-full text-center">
                Continue shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
