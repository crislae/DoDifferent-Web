import { useCallback } from 'react';
import { scrollToSection } from '../utils/scrollToSection';

/**
 * Programmatic section navigation for CTAs (header, discovery flow).
 * Page scroll is native — no snap, wheel hijacking, or keyboard section jumps.
 */

export function useStoryDeck(sectionIds, scrollerRef) {
  const scrollToIndex = useCallback(
    (index, behavior = 'smooth') => {
      if (!sectionIds.length) return;

      const nextIndex = Math.max(0, Math.min(index, sectionIds.length - 1));
      const targetId = sectionIds[nextIndex];
      if (!targetId) return;

      scrollToSection(targetId, behavior, scrollerRef);
    },
    [sectionIds, scrollerRef],
  );

  const scrollToSectionId = useCallback(
    (targetId, behavior = 'smooth') => {
      const index = sectionIds.indexOf(targetId);
      if (index >= 0) {
        scrollToIndex(index, behavior);
        return true;
      }

      scrollToSection(targetId, behavior, scrollerRef);
      return false;
    },
    [sectionIds, scrollToIndex, scrollerRef],
  );

  return { scrollToIndex, scrollToSectionId };
}
