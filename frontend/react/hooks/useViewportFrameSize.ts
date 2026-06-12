import { useEffect, useState, type MutableRefObject } from 'react';
import type { HeroDriveLock } from '@/react/hooks/useHeroScrollDrive';
import {
  getAvailableViewportHeight,
  getScrollUnit,
  isMobileViewport,
} from '@/react/hero/viewport';

export function useViewportFrameSize(
  headerHeight: number,
  driveLockRef?: MutableRefObject<HeroDriveLock>,
) {
  const [size, setSize] = useState(() => computeSize(headerHeight));

  useEffect(() => {
    let debounceTimer = 0;

    const update = () => {
      if (driveLockRef?.current === 'driving') return;
      setSize(computeSize(headerHeight));
    };

    const scheduleUpdate = () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(update, 150);
    };

    update();

    const media = window.matchMedia('(max-width: 767px)');
    media.addEventListener('change', scheduleUpdate);
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.clearTimeout(debounceTimer);
      media.removeEventListener('change', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [headerHeight, driveLockRef]);

  return size;
}

function computeSize(headerHeight: number) {
  const scrollUnit = getScrollUnit();
  const availableHeight = getAvailableViewportHeight(headerHeight);

  return {
    isMobile: isMobileViewport(),
    scrollUnit,
    frameWidth: window.innerWidth,
    frameHeight: availableHeight,
    viewportHeight: availableHeight,
  };
}
