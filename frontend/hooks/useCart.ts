import { useCallback, useEffect, useState } from 'react';
import type { Cart } from '@/types/shopify';
import { cartService } from '@/services/cart';
import { getShopifyBootstrap } from '@/utils/shopifyBootstrap';
import { CART_UPDATED } from '@/utils/events';

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => getShopifyBootstrap().cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await cartService.getCart();
      setCart(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cart error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setCart(getShopifyBootstrap().cart);
    };
    document.addEventListener(CART_UPDATED, handler);
    return () => document.removeEventListener(CART_UPDATED, handler);
  }, []);

  const changeQuantity = useCallback(
    async (key: string, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const next = await cartService.changeLine({ id: key, quantity });
        setCart(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addToCart = useCallback(async (variantId: number, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const next = await cartService.addLine({ id: variantId, quantity });
      setCart(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cart, loading, error, refresh, changeQuantity, addToCart };
}
