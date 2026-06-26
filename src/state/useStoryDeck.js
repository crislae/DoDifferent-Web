import { useState, useEffect, useRef, useCallback } from 'react';
import { scrollToSection } from '../utils/scrollToSection';

/**
 * Full-viewport story deck: wheel/keyboard section jumps, intersection observer syncs pagination.
 * A short scroll lock prevents rapid double-advances; bypassLock allows CTA-driven jumps.
 */

const WHEEL_LOCK_MS = 900;

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
    return true;
  }

  return target.isContentEditable;
}

function isModalFocused() {
  return Boolean(document.querySelector('.modal__panel[role="dialog"]'));
}

export function useStoryDeck(sectionIds, scrollerRef) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const lockRef = useRef(false);

  const scrollToIndex = useCallback(
    (index, behavior = 'smooth', { bypassLock = false } = {}) => {
      if (!sectionIds.length) return;
      if (lockRef.current && !bypassLock) return;

      const nextIndex = Math.max(0, Math.min(index, sectionIds.length - 1));
      const targetId = sectionIds[nextIndex];
      if (!targetId) return;

      lockRef.current = true;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollToSection(targetId, behavior, scrollerRef);

      window.setTimeout(() => {
        lockRef.current = false;
      }, WHEEL_LOCK_MS);
    },
    [sectionIds, scrollerRef],
  );

  const scrollToSectionId = useCallback(
    (targetId, behavior = 'smooth', { bypassLock = false } = {}) => {
      const index = sectionIds.indexOf(targetId);
      if (index >= 0) {
        scrollToIndex(index, behavior, { bypassLock });
        return true;
      }

      scrollToSection(targetId, behavior, scrollerRef);
      return false;
    },
    [sectionIds, scrollToIndex, scrollerRef],
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndexRef.current < sectionIds.length) return;

    const discoveryIndex = sectionIds.indexOf('discovery');
    const nextIndex =
      discoveryIndex >= 0 ? discoveryIndex : Math.max(sectionIds.length - 1, 0);

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }, [sectionIds]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !sectionIds.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
          const index = sectionIds.indexOf(entry.target.id);
          if (index >= 0 && !lockRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        });
      },
      { root: scroller, threshold: [0.55, 0.75] },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [sectionIds, scrollerRef]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !sectionIds.length) return undefined;

    const coarsePointer = window.matchMedia('(pointer: coarse)');

    const onWheel = (event) => {
      if (coarsePointer.matches) return;

      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      event.preventDefault();
      if (lockRef.current) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = activeIndexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= sectionIds.length) return;

      scrollToIndex(nextIndex);
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', onWheel);
  }, [sectionIds, scrollerRef, scrollToIndex]);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const onKeyDown = (event) => {
      if (isModalFocused()) return;
      if (isEditableTarget(event.target)) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      let nextIndex;

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          nextIndex = activeIndexRef.current + 1;
          break;
        case 'ArrowUp':
        case 'PageUp':
          nextIndex = activeIndexRef.current - 1;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = sectionIds.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex < 0 || nextIndex >= sectionIds.length) return;

      event.preventDefault();
      scrollToIndex(nextIndex);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sectionIds, scrollToIndex]);

  return { activeIndex, scrollToIndex, scrollToSectionId };
}
