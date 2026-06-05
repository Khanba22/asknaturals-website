import type { Cart } from '@/types/shopify';
import { cartAjaxUrl } from '@/utils/routes';
import { logCart, readResponseBody } from '@/utils/cartLogger';
import { updateBootstrapCart } from '@/utils/shopifyBootstrap';
import { dispatchCartUpdated } from '@/utils/events';

export interface AddToCartPayload {
  id: number;
  quantity?: number;
  properties?: Record<string, string>;
  /** Optional context for debug logs */
  meta?: {
    productTitle?: string;
    variantTitle?: string;
  };
}

export interface CartChangePayload {
  id: string;
  quantity: number;
}

async function cartFetch(
  action: 'load' | 'add' | 'change' | 'update',
  init?: RequestInit,
): Promise<{ res: Response; body: unknown }> {
  const url = cartAjaxUrl(action);
  logCart(`→ ${action.toUpperCase()} request`, { url, ...init });

  const res = await fetch(url, init);
  const body = await readResponseBody(res.clone());

  logCart(`← ${action.toUpperCase()} response`, {
    url,
    status: res.status,
    ok: res.ok,
    body,
  });

  return { res, body };
}

export class CartService {
  async getCart(): Promise<Cart> {
    const { res, body } = await cartFetch('load');
    if (!res.ok) throw new Error('Failed to fetch cart');
    const cart = body as Cart;
    updateBootstrapCart(cart);
    return cart;
  }

  async addLine(payload: AddToCartPayload): Promise<Cart> {
    const item: Record<string, unknown> = {
      id: payload.id,
      quantity: payload.quantity ?? 1,
    };
    if (payload.properties) {
      item.properties = payload.properties;
    }

    const requestBody = { items: [item] };

    logCart('ADD context', {
      variantId: payload.id,
      productTitle: payload.meta?.productTitle,
      variantTitle: payload.meta?.variantTitle,
      body: requestBody,
    });

    const { res, body } = await cartFetch('add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const err = (body ?? {}) as { description?: string; message?: string };
      throw new Error(err.description ?? err.message ?? 'Add to cart failed');
    }

    const cart = await this.getCart();
    dispatchCartUpdated();
    return cart;
  }

  async changeLine(payload: CartChangePayload): Promise<Cart> {
    const { res } = await cartFetch('change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update cart line');
    const cart = await this.getCart();
    dispatchCartUpdated();
    return cart;
  }

  async updateCart(updates: Record<string, number>): Promise<Cart> {
    const { res } = await cartFetch('update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ updates }),
    });
    if (!res.ok) throw new Error('Failed to update cart');
    const cart = await this.getCart();
    dispatchCartUpdated();
    return cart;
  }

  async updateNote(note: string): Promise<Cart> {
    const { res } = await cartFetch('update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) throw new Error('Failed to update cart note');
    const cart = await this.getCart();
    dispatchCartUpdated();
    return cart;
  }
}

export const cartService = new CartService();
