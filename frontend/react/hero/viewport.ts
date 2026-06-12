const MOBILE_MQ = '(max-width: 767px)';

/** Used only to pick mobile vs desktop video (aspect ratio). */
export function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_MQ).matches;
}

export function getScrollUnit() {
  if (typeof window === 'undefined') return 0;
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
