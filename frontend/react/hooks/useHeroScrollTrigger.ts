import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HeroDriveLock } from '@/react/hooks/useHeroScrollDrive';
import { getHeroBufferVh, getHeroCtaReveal, getHeroVideoProgress } from '@/react/hero/timing';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_HEIGHT_CONST = 1;

export function useHeroScrollTrigger({
  sectionRef,
  scrollDistance,
  scrollUnit,
  headerHeight,
  isMobile,
  driveLockRef,
  onVideoProgress,
  onScrollProgress,
  triggerRef,
  enabled = true,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  scrollDistance: number;
  scrollUnit: number;
  viewportHeight: number;
  headerHeight: number;
  isMobile: boolean;
  driveLockRef: MutableRefObject<HeroDriveLock>;
  onVideoProgress: (progress: number) => void;
  onScrollProgress?: (progress: number) => void;
  triggerRef?: MutableRefObject<ScrollTrigger | null>;
  enabled?: boolean;
}) {
  const onVideoProgressRef = useRef(onVideoProgress);
  const onScrollProgressRef = useRef(onScrollProgress);
  onVideoProgressRef.current = onVideoProgress;
  onScrollProgressRef.current = onScrollProgress;

  const emitProgress = (raw: number) => {
    if (driveLockRef.current === 'driving') return;

    const clamped = Math.min(1, Math.max(0, raw));
    onScrollProgressRef.current?.(clamped);
    onVideoProgressRef.current(getHeroVideoProgress(clamped));
    return clamped;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled || scrollUnit <= 0) return;

    let normalizer: { kill?: () => void } | undefined;
    if (isMobile && ScrollTrigger.normalizeScroll) {
      normalizer = ScrollTrigger.normalizeScroll(true);
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: () => `top ${headerHeight}px`,
      end: () => `+=${scrollDistance * SCROLL_HEIGHT_CONST * scrollUnit}`,
      scrub: 1.75,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        emitProgress(self.progress);
      },
      onScrubComplete: (self) => {
        emitProgress(self.progress);
      },
    });

    if (triggerRef) triggerRef.current = trigger;

    if (driveLockRef.current !== 'driving') {
      emitProgress(0);
    }
    ScrollTrigger.refresh();

    return () => {
      normalizer?.kill?.();
      trigger.kill();
      if (triggerRef) triggerRef.current = null;
    };
  }, [sectionRef, scrollDistance, scrollUnit, headerHeight, isMobile, enabled, triggerRef, driveLockRef]);

  return { emitProgress };
}

/** Section height = animation scroll + sticky viewport + buffer (keeps frame pinned through CTA). */
export function getHeroSectionHeight(
  scrollDistance: number,
  viewportHeight: number,
  scrollUnit: number,
  isMobile: boolean,
) {
  if (typeof window === 'undefined' || scrollUnit <= 0) return 0;
  const animationScroll = scrollDistance * SCROLL_HEIGHT_CONST * scrollUnit;
  const buffer = getHeroBufferVh(isMobile) * scrollUnit;
  return animationScroll + viewportHeight + buffer;
}

export { getHeroCtaReveal, getHeroVideoProgress };
