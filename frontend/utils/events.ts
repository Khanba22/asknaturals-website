export const CART_UPDATED = 'asknatural:cart-updated';
export const OPEN_CART = 'asknatural:open-cart';

export function dispatchCartUpdated(): void {
  document.dispatchEvent(new CustomEvent(CART_UPDATED));
}

export function dispatchOpenCart(): void {
  document.dispatchEvent(new CustomEvent(OPEN_CART));
}
