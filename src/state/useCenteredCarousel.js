import { useState, useRef, useCallback, useEffect } from 'react';

const WHEEL_THRESHOLD = 8;
const SNAP_COOLDOWN_MS = 380;
const SCROLL_IDLE_MS = 140;

/** Lead/trail spacers let the first and last real cards sit in the visual centre. */
export const CAROUSEL_LEAD_SPACERS = 1;

export function toSlideIndex(realIndex) {
  return realIndex + CAROUSEL_LEAD_SPACERS;
}

export function toRealIndex(slideIndex) {
  return slideIndex - CAROUSEL_LEAD_SPACERS;
}

function getCenteredScrollLeft(scroller, slide) {
  const scrollerRect = scroller.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const slideCenter =
    slideRect.left - scrollerRect.left + scroller.scrollLeft + slideRect.width / 2;
  return Math.max(0, slideCenter - scroller.clientWidth / 2);
}

function readClosestRealIndex(scroller, clampReal) {
  const slides = scroller.querySelectorAll('.matches-carousel__slide[data-slide-index]');
  if (!slides.length) return 0;

  const center = scroller.scrollLeft + scroller.clientWidth / 2;
  let closestSlide = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(center - slideCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestSlide = Number.parseInt(slide.getAttribute('data-slide-index'), 10);
    }
  });

  return clampReal(toRealIndex(closestSlide));
}

export function useCenteredCarousel(realCount, scrollerRef, viewportRef) {
  const [activeRealIndex, setActiveRealIndex] = useState(0);
  const lockRef = useRef(false);
  const activeRealRef = useRef(0);
  const wheelAccumulator = useRef(0);
  const programmaticScrollRef = useRef(false);
  const scrollIdleTimerRef = useRef(0);

  const clampReal = useCallback(
    (index) => Math.max(0, Math.min(Math.max(realCount - 1, 0), index)),
    [realCount],
  );

  const scrollToRealIndex = useCallback(
    (realIndex, behavior = 'smooth') => {
      const scroller = scrollerRef.current;
      if (!scroller || realCount === 0) return;

      const nextReal = clampReal(realIndex);
      const slide = scroller.querySelector(
        `.matches-carousel__slide[data-slide-index="${toSlideIndex(nextReal)}"]`,
      );
      if (!slide) return;

      window.clearTimeout(scrollIdleTimerRef.current);
      programmaticScrollRef.current = true;
      scroller.scrollTo({ left: getCenteredScrollLeft(scroller, slide), behavior });

      activeRealRef.current = nextReal;
      setActiveRealIndex(nextReal);
    },
    [clampReal, realCount, scrollerRef],
  );

  useEffect(() => {
    activeRealRef.current = activeRealIndex;
  }, [activeRealIndex]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp active slide when deck size changes
    setActiveRealIndex((current) => clampReal(current));
  }, [realCount, clampReal]);

  const hadSlidesRef = useRef(false);
  useEffect(() => {
    if (realCount === 0) {
      hadSlidesRef.current = false;
      return undefined;
    }
    if (hadSlidesRef.current) return undefined;

    hadSlidesRef.current = true;
    let innerFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        scrollToRealIndex(0, 'auto');
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [realCount, scrollToRealIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || realCount === 0) return undefined;

    const recenterActive = () => {
      window.requestAnimationFrame(() => {
        scrollToRealIndex(activeRealRef.current, 'auto');
      });
    };

    const ro = new ResizeObserver(recenterActive);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [realCount, scrollToRealIndex, scrollerRef]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || realCount === 0) return undefined;

    const snapToClosest = (behavior = 'smooth') => {
      if (lockRef.current) return;
      const closest = readClosestRealIndex(scroller, clampReal);
      activeRealRef.current = closest;
      setActiveRealIndex(closest);
      scrollToRealIndex(closest, behavior);
    };

    const onScroll = () => {
      const closest = readClosestRealIndex(scroller, clampReal);
      activeRealRef.current = closest;
      setActiveRealIndex(closest);

      if (programmaticScrollRef.current) return;

      window.clearTimeout(scrollIdleTimerRef.current);
      scrollIdleTimerRef.current = window.setTimeout(() => {
        snapToClosest('smooth');
      }, SCROLL_IDLE_MS);
    };

    const onScrollEnd = () => {
      programmaticScrollRef.current = false;
      if (!lockRef.current) {
        snapToClosest('smooth');
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('scrollend', onScrollEnd, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('scrollend', onScrollEnd);
      window.clearTimeout(scrollIdleTimerRef.current);
    };
  }, [clampReal, realCount, scrollToRealIndex, scrollerRef]);

  useEffect(() => {
    const viewport = viewportRef?.current;
    const scroller = scrollerRef.current;
    if (!viewport || !scroller || realCount === 0) return undefined;

    const onWheel = (event) => {
      const { deltaX, deltaY, deltaMode } = event;
      const vertical = deltaMode === 0 ? deltaY : deltaY * 16;
      const horizontal = deltaMode === 0 ? deltaX : deltaX * 16;

      if (Math.abs(horizontal) >= Math.abs(vertical)) {
        event.stopPropagation();
        return;
      }

      if (Math.abs(vertical) < WHEEL_THRESHOLD) return;

      const direction = vertical > 0 ? 1 : -1;
      const atStart = activeRealRef.current <= 0;
      const atEnd = activeRealRef.current >= realCount - 1;

      if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
        wheelAccumulator.current = 0;
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      wheelAccumulator.current += vertical;

      if (Math.abs(wheelAccumulator.current) < WHEEL_THRESHOLD * 2) return;
      if (lockRef.current) return;

      wheelAccumulator.current = 0;
      lockRef.current = true;

      scrollToRealIndex(activeRealRef.current + direction);

      window.setTimeout(() => {
        lockRef.current = false;
      }, SNAP_COOLDOWN_MS);
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [realCount, scrollToRealIndex, scrollerRef, viewportRef]);

  return {
    activeRealIndex,
    scrollToRealIndex,
  };
}
