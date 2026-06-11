import { useCallback, useRef, useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ScrollTrigger as ScrollTriggerInstance } from 'gsap/ScrollTrigger';
import type { HeroSettings } from '@/types/section-settings';
import { useHeaderHeight } from '@/react/hooks/useHeaderHeight';
import { useViewportFrameSize } from '@/react/hooks/useViewportFrameSize';
import { useHeroVideoScrub } from '@/react/hooks/useHeroVideoScrub';
import { getHeroSectionHeight, useHeroScrollTrigger } from '@/react/hooks/useHeroScrollTrigger';
import { useHeroScrollDrive, type HeroDriveLock } from '@/react/hooks/useHeroScrollDrive';
import {
  getHeroCtaReveal,
  getHeroVideoProgress,
  HERO_SCROLL_DISTANCE_VH,
} from '@/react/hero/timing';
import { Button } from './ui/Button';

interface HeroProps {
  settings: HeroSettings;
}

function HeroLoader({ progress }: { progress: number }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-primary/95 px-6 text-white"
      role="status"
      aria-live="polite"
      aria-label={`Loading hero video, ${progress} percent`}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/25 border-t-white" />

      <div className="text-center">
        <p className="text-sm font-medium tracking-[0.2em] uppercase">Loading experience</p>
        <p className="mt-2 text-xs text-white/70">Preparing scroll video</p>
      </div>

      <div className="w-full max-w-xs">
        <div className="h-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-white/80">{progress}%</p>
      </div>
    </div>
  );
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

function resolveScrollDistance(settings: HeroSettings) {
  if (settings.scroll_distance != null) return settings.scroll_distance;
  return HERO_SCROLL_DISTANCE_VH;
}

export function Hero({ settings }: HeroProps) {
  const {
    button_label = 'Shop Now',
    button_link,
    intro_autoplay = true,
    desktop_video_url = '',
    mobile_video_url = '',
  } = settings;

  const scrollDistance = resolveScrollDistance(settings);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTriggerRef = useRef<ScrollTriggerInstance | null>(null);
  const driveLockRef = useRef<HeroDriveLock>('idle');
  const headerHeight = useHeaderHeight();
  const { isMobile, scrollUnit, frameHeight, frameWidth, viewportHeight } =
    useViewportFrameSize(headerHeight);

  const videoUrl = isMobile
    ? mobile_video_url || desktop_video_url
    : desktop_video_url || mobile_video_url;

  const [sectionHeight, setSectionHeight] = useState(() =>
    getHeroSectionHeight(scrollDistance, viewportHeight, scrollUnit, isMobile),
  );
  const [ctaReveal, setCtaReveal] = useState(0);

  useEffect(() => {
    const update = () =>
      setSectionHeight(getHeroSectionHeight(scrollDistance, viewportHeight, scrollUnit, isMobile));
    update();
    window.addEventListener('resize', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, [scrollDistance, viewportHeight, scrollUnit, isMobile]);

  const { setTargetProgress, isReady, loadProgress } = useHeroVideoScrub({
    videoRef,
    canvasRef,
    displayWidth: frameWidth,
    displayHeight: frameHeight,
    isMobile,
    videoUrl,
  });

  const handleScrollProgress = useCallback((rawProgress: number) => {
    setCtaReveal(easeOutCubic(getHeroCtaReveal(rawProgress)));
  }, []);

  const emitHeroProgress = useCallback(
    (rawProgress: number) => {
      handleScrollProgress(rawProgress);
      setTargetProgress(getHeroVideoProgress(rawProgress));
    },
    [handleScrollProgress, setTargetProgress],
  );

  useHeroScrollTrigger({
    sectionRef,
    scrollDistance,
    scrollUnit,
    viewportHeight,
    headerHeight,
    isMobile,
    driveLockRef,
    onVideoProgress: setTargetProgress,
    onScrollProgress: handleScrollProgress,
    triggerRef: scrollTriggerRef,
    enabled: isReady && Boolean(videoUrl),
  });

  useHeroScrollDrive({
    triggerRef: scrollTriggerRef,
    driveLockRef,
    enabled: isReady && Boolean(videoUrl),
    autoplay: intro_autoplay,
    isMobile,
    onScrollProgress: emitHeroProgress,
  });

  useEffect(() => {
    if (!isReady) return;
    ScrollTrigger.refresh();
  }, [isReady, scrollDistance, viewportHeight, scrollUnit, isMobile, headerHeight, videoUrl]);

  const ctaOffsetY = (1 - ctaReveal) * 36;

  return (
    <section
      ref={sectionRef}
      className="relative w-full touch-pan-y"
      style={{ height: sectionHeight > 0 ? `${sectionHeight}px` : undefined }}
      aria-label="Hero"
    >
      <div
        className="sticky left-0 w-full overflow-hidden bg-black supports-[height:100dvh]:min-h-0"
        style={{
          top: headerHeight,
          height: viewportHeight > 0 ? `${viewportHeight}px` : undefined,
        }}
      >
        <div className="relative h-full w-full overflow-hidden">
          <video
            ref={videoRef}
            className="hidden"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-hidden
          />

          {!isReady && <HeroLoader progress={loadProgress} />}

          {button_label && button_link && (
            <div
              className="absolute top-[80%] left-1/2 z-20 flex w-full justify-center px-6"
              style={{
                opacity: ctaReveal,
                transform: `translate(-50%, calc(-50% + ${ctaOffsetY}px)) scale(${0.88 + ctaReveal * 0.12})`,
                pointerEvents: ctaReveal > 0.35 ? 'auto' : 'none',
              }}
            >
              <Button
                href={button_link}
                variant="inverse"
                className="
                  min-w-[clamp(14rem,32vw,22rem)]
                  !px-[clamp(2.25rem,4.5vw,4rem)]
                  !py-[clamp(1.125rem,2vw,1.625rem)]
                  text-[clamp(1.0625rem,1.5vw,1.375rem)]
                  !font-semibold
                  tracking-wide
                  shadow-xl
                "
              >
                {button_label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
