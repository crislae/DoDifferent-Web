import { useEffect, useState } from 'react';

import { readScrollOffset } from '../utils/scrollToSection';

function resolveActiveSection(sectionIds) {
  if (!sectionIds.length) return null;

  const marker = window.scrollY + readScrollOffset() + 2;
  let activeId = sectionIds[0];

  for (const id of sectionIds) {
    const element = document.getElementById(id);
    if (!element) continue;

    if (element.offsetTop <= marker) {
      activeId = id;
    }
  }

  return activeId;
}

/** Highlights the section currently in view for anchor navigation. */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      setActiveId(resolveActiveSection(sectionIds));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeId;
}
