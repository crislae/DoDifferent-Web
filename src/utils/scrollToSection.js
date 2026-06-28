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

/** Section ids that should scroll to the section root (hero/image visible), not -head anchors. */
const SECTION_ROOT_SCROLL_IDS = new Set(['intro', 'discovery']);

/**
 * Scrolls so the slide head (icon + title), title, or section top sits below the sticky header.
 * @param {{ preferSectionRoot?: boolean }} [options]
 *   When true, scrolls to `#${targetId}` only (e.g. intro hero must show image + copy).
 */
export function scrollToSection(targetId, behavior = 'smooth', options = {}) {
  const { preferSectionRoot = false } = options;

  let target;
  if (preferSectionRoot || SECTION_ROOT_SCROLL_IDS.has(targetId)) {
    target = document.getElementById(targetId);
  } else {
    const headTarget = document.getElementById(`${targetId}-head`);
    const titleTarget = document.getElementById(`${targetId}-title`);
    target = headTarget ?? titleTarget ?? document.getElementById(targetId);
  }

  if (!target) return;

  const offset = readScrollOffset();
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  });
}
