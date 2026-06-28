/**
 * Homepage slide map — slide 1 is the hero, slide 2 is How it works, etc.
 *
 * Down-arrow rules (`continue`):
 * - `always` — SlideContinue after slide content (natural document scroll)
 * - `never` — no down arrow on this slide
 *
 * `onContinue` (when a down arrow is shown):
 * - `scroll` — ScrollCue scrolls to `nextId`
 * - `focusDiscovery` — custom handler: scroll to Discover + focus questionnaire (Our promise)
 */
export const SLIDES = [
  {
    slide: 1,
    id: 'intro',
    label: 'Welcome',
    navLabel: null,
    continue: 'always',
    onContinue: 'scroll',
    nextId: 'curated',
    nextLabel: 'How it works',
  },
  {
    slide: 2,
    id: 'curated',
    label: 'How it works',
    navLabel: 'How it works',
    continue: 'always',
    onContinue: 'scroll',
    nextId: 'trust',
    nextLabel: 'Our promise',
  },
  {
    slide: 3,
    id: 'trust',
    label: 'Our promise',
    navLabel: null,
    continue: 'always',
    onContinue: 'focusDiscovery',
    nextId: 'discovery',
    nextLabel: 'Discover',
  },
  {
    slide: 4,
    id: 'discovery',
    label: 'Discover',
    navLabel: 'Discover',
    continue: 'never',
    onContinue: null,
    nextId: null,
    nextLabel: null,
  },
  {
    slide: 5,
    id: 'matches',
    label: 'For you',
    navLabel: 'For you',
    continue: 'always',
    onContinue: 'scroll',
    nextId: 'gems',
    nextLabel: 'Gems',
  },
  {
    slide: 6,
    id: 'gems',
    label: 'Gems',
    navLabel: 'Gems',
    continue: 'always',
    onContinue: 'scroll',
    nextId: 'footer',
    nextLabel: 'Contact',
  },
  {
    slide: 7,
    id: 'footer',
    label: 'Contact',
    navLabel: 'Contact',
    continue: 'never',
    onContinue: null,
    nextId: null,
    nextLabel: null,
  },
];

export const SECTION_NAV = SLIDES.filter((item) => item.navLabel).map((item) => ({
  id: item.id,
  label: item.navLabel,
  slide: item.slide,
}));

export const SECTION_NAV_IDS = SLIDES.map((item) => item.id);

export function getSlideById(id) {
  return SLIDES.find((item) => item.id === id) ?? null;
}

/** Whether a slide should render SlideContinue for the current app state. */
export function shouldShowSlideContinue(slideId) {
  const slide = getSlideById(slideId);
  if (!slide) return false;

  return slide.continue === 'always';
}

export function getSlideNavAriaLabel({ slide, label }) {
  return `Go to slide ${slide}: ${label}`;
}

export function getContinueAriaLabel(nextLabel) {
  return `Continue to ${nextLabel}`;
}
