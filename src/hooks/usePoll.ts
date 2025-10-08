import { useEffect, useRef } from 'react';

interface UsePollOptions {
  enabled?: boolean;
  immediate?: boolean;
}

export function usePoll(callback: () => void | Promise<void>, intervalMs: number, options: UsePollOptions = {}) {
  const { enabled = true, immediate = false } = options;
  const timerRef = useRef<number | null>(null);
  const cbRef = useRef(callback);

  // Keep latest callback without re-registering interval
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const run = () => {
      try {
        const result = cbRef.current();
        if (result && typeof (result as any).catch === 'function') {
          (result as Promise<void>).catch(() => {/* swallow */});
        }
      } catch {
        // swallow; let caller handle their own toasts/logging
      }
    };

    let isVisible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;

    const start = () => {
      if (timerRef.current != null) return;
      timerRef.current = window.setInterval(() => {
        if (isVisible) run();
      }, intervalMs);
    };

    const stop = () => {
      if (timerRef.current != null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const onVisibility = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        if (immediate) run();
      }
    };

    // Initialize
    if (immediate) run();
    start();

    // Visibility handling
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      stop();
      if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
    };
  }, [enabled, immediate, intervalMs]);
}
