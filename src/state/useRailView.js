import { useEffect } from 'react';

/** Fires a one-time rail_view interaction when a carousel rail enters the viewport. */
export function useRailView(ref, railSource, trackRailView) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && trackRailView) {
          trackRailView(railSource);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, railSource, trackRailView]);
}
