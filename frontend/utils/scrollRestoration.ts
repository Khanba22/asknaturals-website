import { setScrollY } from '@/react/hero/viewport';

const SCROLL_KEY = 'asknatural:scrollY';
const PATH_KEY = 'asknatural:scrollPath';

function getPageKey() {
  return window.location.pathname + window.location.search + window.location.hash;
}

export function getSavedScrollPosition(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    if (sessionStorage.getItem(PATH_KEY) !== getPageKey()) return null;
    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (!raw) return null;
    const y = Number(raw);
    return Number.isFinite(y) && y >= 0 ? y : null;
  } catch {
    return null;
  }
}

/** Saved reload position, or the live scroll offset once the page has painted. */
export function getEffectiveScrollY(): number {
  return getSavedScrollPosition() ?? window.scrollY;
}

function saveScrollPosition() {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    sessionStorage.setItem(PATH_KEY, getPageKey());
  } catch {
    // Storage may be unavailable in private browsing.
  }
}

export function restoreScrollPosition(): number | null {
  const y = getSavedScrollPosition();
  if (y == null || y <= 0) return null;
  setScrollY(y);
  return y;
}

export function initScrollRestoration() {
  if (typeof window === 'undefined') return;

  window.addEventListener('pagehide', saveScrollPosition);
  window.addEventListener('beforeunload', saveScrollPosition);

  const restored = restoreScrollPosition();
  if (restored == null) return;

  requestAnimationFrame(restoreScrollPosition);
  window.addEventListener('DOMContentLoaded', restoreScrollPosition, { once: true });
  window.addEventListener('load', restoreScrollPosition, { once: true });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      restoreScrollPosition();
    }
  });
}
