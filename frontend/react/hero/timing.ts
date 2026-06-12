/** Hero timeline: 10s video + 0.5s CTA appear + 2.5s CTA hold = 13s total */
export const HERO_VIDEO_SECONDS = 10;
export const HERO_CTA_APPEAR_SECONDS = 0.5;
export const HERO_CTA_HOLD_SECONDS = 2.5;
export const HERO_TOTAL_SECONDS =
  HERO_VIDEO_SECONDS + HERO_CTA_APPEAR_SECONDS + HERO_CTA_HOLD_SECONDS;

/** Auto-playthrough duration = HERO_TOTAL_SECONDS / this value. */
export const HERO_SCROLL_SPEED = 1;

/** Viewport heights of scroll for the full 13s timeline. Higher = slower manual scrub. */
export const HERO_SCROLL_DISTANCE_VH = 1.5;

/**
 * Extra section height after the animation completes so the sticky frame
 * stays on screen while the Shop Now button is visible.
 */
export const HERO_BUFFER_VH = 0.4;

export const HERO_VIDEO_SHARE = HERO_VIDEO_SECONDS / HERO_TOTAL_SECONDS;
export const HERO_CTA_APPEAR_START = HERO_VIDEO_SHARE;
export const HERO_CTA_APPEAR_SHARE = HERO_CTA_APPEAR_SECONDS / HERO_TOTAL_SECONDS;
export const HERO_CTA_APPEAR_END = HERO_CTA_APPEAR_START + HERO_CTA_APPEAR_SHARE;

export function getHeroVideoProgress(rawProgress: number) {
  return Math.min(1, Math.max(0, rawProgress / HERO_VIDEO_SHARE));
}

export function getHeroCtaReveal(rawProgress: number) {
  if (rawProgress < HERO_CTA_APPEAR_START) return 0;
  if (rawProgress >= HERO_CTA_APPEAR_END) return 1;

  const appearProgress =
    (rawProgress - HERO_CTA_APPEAR_START) / HERO_CTA_APPEAR_SHARE;
  return Math.min(1, Math.max(0, appearProgress));
}

export function getHeroDriveDurationSeconds(progress: number) {
  const remaining = 1 - Math.min(1, Math.max(0, progress));
  return (HERO_TOTAL_SECONDS * remaining) / HERO_SCROLL_SPEED;
}
