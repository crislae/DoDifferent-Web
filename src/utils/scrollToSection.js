function resolveScroller(scrollerRef) {
  if (scrollerRef?.current) {
    return scrollerRef.current;
  }

  return document.querySelector('.story-scroll');
}

/** Scrolls a deck section into view inside the story scroller (not the window). */
export function scrollToSection(targetId, behavior = 'smooth', scrollerRef = null) {
  const scroller = resolveScroller(scrollerRef);
  const target = document.getElementById(targetId);
  if (!scroller || !target) return;

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const top = scroller.scrollTop + (targetRect.top - scrollerRect.top);

  scroller.scrollTo({ top, behavior });
}
