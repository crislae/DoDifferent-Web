/** Sticky header clearance — measured live so titles never sit under the bar. */
export function readScrollOffset() {
  const header = document.querySelector('.header');
  if (header) {
    return Math.ceil(header.getBoundingClientRect().height) + 12;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset');
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed + 12 : 92;
}

/** Scrolls so the slide head (icon + title), title, or section top sits below the sticky header. */
export function scrollToSection(targetId, behavior = 'smooth', _scrollerRef = null) {
  const headTarget = document.getElementById(`${targetId}-head`);
  const titleTarget = document.getElementById(`${targetId}-title`);
  const target = headTarget ?? titleTarget ?? document.getElementById(targetId);
  if (!target) return;

  const offset = readScrollOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  });
}
