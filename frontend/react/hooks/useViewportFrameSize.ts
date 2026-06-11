import { useEffect, useState } from 'react';
import {
  getAvailableViewportHeight,
  getScrollUnit,
  isMobileViewport,
} from '@/react/hero/viewport';

export function useViewportFrameSize(headerHeight: number) {
  const [size, setSize] = useState(() => computeSize(headerHeight));

  useEffect(() => {
    const update = () => setSize(computeSize(headerHeight));
    update();

    const media = window.matchMedia('(max-width: 767px)');
    media.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);

    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, [headerHeight]);

  return size;
}

function computeSize(headerHeight: number) {
  const isMobile = isMobileViewport();
  const scrollUnit = getScrollUnit();
  const availableHeight = getAvailableViewportHeight(headerHeight);

  return {
    isMobile,
    scrollUnit,
    frameWidth: window.innerWidth,
    frameHeight: availableHeight,
    viewportHeight: availableHeight,
  };
}
