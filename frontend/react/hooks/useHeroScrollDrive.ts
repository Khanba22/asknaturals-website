import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import gsap from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HERO_TOTAL_SECONDS, getHeroDriveDurationSeconds } from '@/react/hero/timing';
import { setScrollY } from '@/react/hero/viewport';

const WHEEL_COMMIT_DELTA = 28;
const WHEEL_ACCUMULATE_MS = 180;
const TOUCH_THRESHOLD_DESKTOP = 12;
const TOUCH_THRESHOLD_MOBILE = 6;

export type HeroDriveLock = 'idle' | 'driving' | 'done';

function getScrollProgress(trigger: ScrollTrigger, scrollY: number) {
  const range = trigger.end - trigger.start;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, (scrollY - trigger.start) / range));
}

export function useHeroScrollDrive({
  triggerRef,
  driveLockRef,
  enabled = false,
  autoplay = true,
  isMobile = false,
  onScrollProgress,
}: {
  triggerRef: RefObject<ScrollTrigger | null>;
  driveLockRef: MutableRefObject<HeroDriveLock>;
  enabled?: boolean;
  autoplay?: boolean;
  isMobile?: boolean;
  onScrollProgress?: (progress: number) => void;
}) {
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const wheelAccumRef = useRef(0);
  const wheelResetTimerRef = useRef(0);
  const onScrollProgressRef = useRef(onScrollProgress);
  onScrollProgressRef.current = onScrollProgress;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let introAttempts = 0;
    const touchThreshold = isMobile ? TOUCH_THRESHOLD_MOBILE : TOUCH_THRESHOLD_DESKTOP;

    const hasPlaythroughCompleted = () => driveLockRef.current === 'done';

    const isInHeroZone = () => {
      const trigger = triggerRef.current;
      if (!trigger) return false;
      const y = window.scrollY;
      return y >= trigger.start - 4 && y <= trigger.end + 4;
    };

    const emitProgress = (scrollY: number) => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      onScrollProgressRef.current?.(getScrollProgress(trigger, scrollY));
    };

    const detachInputListeners = () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.clearTimeout(wheelResetTimerRef.current);
      wheelAccumRef.current = 0;
      touchStartYRef.current = null;
    };

    const killTween = () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    };

    const beginPlaythrough = (fromProgress?: number) => {
      if (cancelled || hasPlaythroughCompleted() || driveLockRef.current === 'driving') {
        return false;
      }

      const trigger = triggerRef.current;
      if (!trigger) return false;

      const progress = fromProgress ?? getScrollProgress(trigger, window.scrollY);
      if (progress >= 0.995) {
        driveLockRef.current = 'done';
        return false;
      }

      driveLockRef.current = 'driving';
      detachInputListeners();
      killTween();

      const startY = window.scrollY;
      const endY = trigger.end;
      const duration = getHeroDriveDurationSeconds(progress);
      const scrollProxy = { y: startY };

      tweenRef.current = gsap.to(scrollProxy, {
        y: endY,
        duration,
        ease: 'none',
        overwrite: true,
        onUpdate: () => {
          setScrollY(scrollProxy.y);
          emitProgress(scrollProxy.y);
        },
        onComplete: () => {
          tweenRef.current = null;
          driveLockRef.current = 'done';
          emitProgress(endY);
        },
        onInterrupt: () => {
          tweenRef.current = null;
          if (driveLockRef.current === 'driving') {
            driveLockRef.current = 'done';
          }
        },
      });

      return true;
    };

    const onWheel = (event: WheelEvent) => {
      if (hasPlaythroughCompleted() || driveLockRef.current === 'driving') {
        if (driveLockRef.current === 'driving') event.preventDefault();
        return;
      }

      if (!isInHeroZone()) return;

      const trigger = triggerRef.current;
      if (!trigger) return;

      wheelAccumRef.current += event.deltaY;
      window.clearTimeout(wheelResetTimerRef.current);
      wheelResetTimerRef.current = window.setTimeout(() => {
        wheelAccumRef.current = 0;
      }, WHEEL_ACCUMULATE_MS);

      if (wheelAccumRef.current < WHEEL_COMMIT_DELTA) return;

      event.preventDefault();
      beginPlaythrough();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (hasPlaythroughCompleted() || driveLockRef.current === 'driving') return;
      if (!isInHeroZone()) return;
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (driveLockRef.current === 'driving') {
        event.preventDefault();
        return;
      }

      if (hasPlaythroughCompleted()) return;

      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;
      if (startY === null || currentY === undefined) return;
      if (!isInHeroZone()) return;

      const delta = startY - currentY;
      if (Math.abs(delta) < touchThreshold) return;

      event.preventDefault();
      beginPlaythrough();
    };

    const startIntro = () => {
      if (!autoplay || cancelled || hasPlaythroughCompleted()) return;

      const trigger = triggerRef.current;
      if (!trigger) return;

      if (window.scrollY > trigger.start + 8) {
        driveLockRef.current = 'done';
        return;
      }

      setScrollY(trigger.start);
      emitProgress(trigger.start);
      beginPlaythrough(0);
    };

    const waitForIntro = () => {
      if (cancelled || hasPlaythroughCompleted()) return;
      if (triggerRef.current) {
        startIntro();
        return;
      }
      if (introAttempts++ > 120) return;
      requestAnimationFrame(waitForIntro);
    };

    if (!hasPlaythroughCompleted()) {
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: false });

      if (autoplay) {
        requestAnimationFrame(waitForIntro);
      }
    }

    return () => {
      cancelled = true;
      killTween();
      detachInputListeners();
    };
  }, [autoplay, driveLockRef, enabled, isMobile, triggerRef]);
}

export { HERO_TOTAL_SECONDS };
