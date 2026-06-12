import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const VIDEO_FPS = 24;
const FRAME_STEP = 1 / VIDEO_FPS;

function snapToFrame(time: number) {
  return Math.round(time / FRAME_STEP) * FRAME_STEP;
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (sourceWidth <= 0 || sourceHeight <= 0) return;

  const sourceAspect = sourceWidth / sourceHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let drawWidth: number;
  let drawHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (sourceAspect > canvasAspect) {
    drawHeight = canvasHeight;
    drawWidth = sourceWidth * (canvasHeight / sourceHeight);
    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = canvasWidth;
    drawHeight = sourceHeight * (canvasWidth / sourceWidth);
    offsetX = 0;
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
}

export function useHeroVideoScrub({
  videoRef,
  canvasRef,
  displayWidth,
  displayHeight,
  videoUrl,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  displayWidth: number;
  displayHeight: number;
  videoUrl: string;
}) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const targetProgressRef = useRef(0);
  const displayedTimeRef = useRef(0);
  const rafRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || displayWidth <= 0 || displayHeight <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctxRef.current = ctx;
  }, [canvasRef, displayHeight, displayWidth]);

  const drawVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    if (!video || !ctx || displayWidth <= 0 || displayHeight <= 0) return;
    if (video.readyState < 2 || video.videoWidth <= 0) return;

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    drawCover(ctx, video, video.videoWidth, video.videoHeight, displayWidth, displayHeight);
  }, [displayHeight, displayWidth, videoRef]);

  const setTargetProgress = useCallback((progress: number) => {
    targetProgressRef.current = Math.min(1, Math.max(0, progress));
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) {
      setIsReady(false);
      setLoadProgress(0);
      return;
    }

    let cancelled = false;
    setIsReady(false);
    setLoadProgress(0);
    targetProgressRef.current = 0;
    displayedTimeRef.current = 0;

    let firstFramePending = false;

    const primeFirstFrame = () => {
      if (cancelled || !video.duration) return;
      setLoadProgress(100);
      video.pause();
      displayedTimeRef.current = 0;
      firstFramePending = true;
      targetProgressRef.current = 0;
      video.currentTime = 0;
    };

    const onLoadedMetadata = () => setLoadProgress(60);
    let initStarted = false;
    const tryPrime = () => {
      if (initStarted || cancelled || !video.duration) return;
      initStarted = true;
      primeFirstFrame();
    };

    const onCanPlay = () => {
      setLoadProgress(90);
      tryPrime();
    };

    const onSeeked = () => {
      if (cancelled) return;

      displayedTimeRef.current = snapToFrame(video.currentTime);
      drawVideoFrame();

      if (firstFramePending) {
        firstFramePending = false;
        setIsReady(true);
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('loadeddata', onCanPlay);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('canplaythrough', onCanPlay);
    video.addEventListener('seeked', onSeeked);
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.src = videoUrl;
    video.load();

    const tick = () => {
      if (cancelled) return;

      const currentVideo = videoRef.current;
      if (currentVideo?.duration && !currentVideo.seeking) {
        const targetTime = snapToFrame(targetProgressRef.current * currentVideo.duration);
        const currentTime = snapToFrame(displayedTimeRef.current);
        const delta = targetTime - currentTime;

        if (Math.abs(delta) >= FRAME_STEP * 0.5) {
          const direction = delta > 0 ? 1 : -1;
          const nextTime = snapToFrame(
            Math.min(currentVideo.duration, Math.max(0, currentTime + direction * FRAME_STEP)),
          );

          displayedTimeRef.current = nextTime;
          currentVideo.currentTime = nextTime;
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafRef.current);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('loadeddata', onCanPlay);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('canplaythrough', onCanPlay);
      video.removeEventListener('seeked', onSeeked);
      video.removeAttribute('src');
      video.load();
    };
  }, [drawVideoFrame, videoRef, videoUrl]);

  return { setTargetProgress, isReady, loadProgress };
}
