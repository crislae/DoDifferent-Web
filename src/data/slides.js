/**
 * Homepage slide map — slide 1 is the hero, slide 2 is How it works, etc.
 */
export const SLIDES = [
  {
    slide: 1,
    id: 'intro',
    label: 'Welcome',
    navLabel: null,
    nextId: 'curated',
    nextLabel: 'How it works',
  },
  {
    slide: 2,
    id: 'curated',
    label: 'How it works',
    navLabel: 'How it works',
    nextId: 'trust',
    nextLabel: 'Our promise',
  },
  {
    slide: 3,
    id: 'trust',
    label: 'Our promise',
    navLabel: null,
    nextId: 'discovery',
    nextLabel: 'Discover',
  },
  {
    slide: 4,
    id: 'discovery',
    label: 'Discover',
    navLabel: 'Discover',
    nextId: 'matches',
    nextLabel: 'For you',
  },
  {
    slide: 5,
    id: 'matches',
    label: 'For you',
    navLabel: 'For you',
    nextId: 'gems',
    nextLabel: 'Gems',
  },
  {
    slide: 6,
    id: 'gems',
    label: 'Gems',
    navLabel: 'Gems',
    nextId: 'footer',
    nextLabel: 'Contact',
  },
  {
    slide: 7,
    id: 'footer',
    label: 'Contact',
    navLabel: 'Contact',
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

export function getSlideNavAriaLabel({ slide, label }) {
  return `Go to slide ${slide}: ${label}`;
}

export function getContinueAriaLabel(nextLabel) {
  return `Continue to ${nextLabel}`;
}
