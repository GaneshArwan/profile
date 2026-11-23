import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useOptimizedVideo
 *
 * High-performance video lifecycle controller for React 19 / Vite SPAs.
 * Features:
 * - Plays video ONLY when >= threshold is visible in viewport via IntersectionObserver
 * - Pauses immediately when scrolled offscreen
 * - Pauses immediately on document visibilitychange (tab switch / backgrounding)
 * - Safely handles HTMLMediaElement.play() async Promise rejections (AbortError / NotAllowedError)
 * - Respects prefers-reduced-motion media query
 * - Disconnects observers and releases video listeners on unmount
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.35] Visibility ratio required to play (0.0 - 1.0)
 * @param {string} [options.rootMargin='50px 0px 50px 0px'] Root margin for pre-buffering
 * @param {boolean} [options.enabled=true] Enable or disable the observer
 * @returns {{ videoRef: React.RefObject<HTMLVideoElement>, isPlaying: boolean, isInView: boolean }}
 */
export function useOptimizedVideo({
  threshold = 0.35,
  rootMargin = '50px 0px 50px 0px',
  enabled = true,
} = {}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const safePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect user's reduced-motion preference
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    try {
      const promise = video.play();
      if (promise !== undefined && typeof promise.then === 'function') {
        promise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            // AbortError occurs when pause() is called while play() is pending (e.g. rapid scroll)
            if (err && err.name !== 'AbortError') {
              setIsPlaying(false);
            }
          });
      }
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const safePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.pause();
      setIsPlaying(false);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!enabled) {
      if (video) {
        try {
          video.pause();
        } catch {
          // Ignore
        }
      }
      return;
    }

    if (!video) return;

    // Fallback if IntersectionObserver is unsupported in older runtime
    if (typeof IntersectionObserver === 'undefined') {
      try {
        const p = video.play();
        if (p && typeof p.then === 'function') {
          p.then(() => setIsPlaying(true)).catch(() => {});
        }
      } catch {
        // Ignore
      }
      return;
    }

    let isIntersecting = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        isIntersecting = entry.isIntersecting;
        setIsInView(entry.isIntersecting);

        const isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;

        if (entry.isIntersecting && isDocVisible) {
          safePlay();
        } else {
          safePause();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(video);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        safePause();
      } else if (isIntersecting) {
        safePlay();
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      observer.disconnect();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      safePause();
    };
  }, [enabled, threshold, rootMargin, safePlay, safePause]);

  return { videoRef, isPlaying, isInView };
}
