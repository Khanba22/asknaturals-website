const MOBILE_MQ = '(max-width: 767px)';

export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

/** Height unit for vh-based hero math — uses visualViewport on mobile for iOS/Android accuracy. */
export function getScrollUnit() {
  if (typeof window === 'undefined') return 0;
  if (isMobileViewport() && window.visualViewport) {
    return window.visualViewport.height;
  }
  return window.innerHeight;
}

export function getAvailableViewportHeight(headerHeight: number) {
  return Math.max(getScrollUnit() - headerHeight, 0);
}

export function setScrollY(y: number) {
  window.scrollTo(0, y);
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}
