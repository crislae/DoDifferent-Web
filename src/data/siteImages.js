// Pixabay — free use under the Pixabay Content License (Kostenlose Nutzung).
// https://pixabay.com/service/license/
// Local files live in public/images/.

export const FOOTER_YOGA_IMAGE = '/images/pixabay-yoga.png';
export const FOOTER_YOGA_ALT =
  'Person practicing yoga in a calm, sunlit setting with a peaceful expression';

export const HALLSTATT_VILLAGE_IMAGE = '/images/pixabay-alpine-village.png';
export const HALLSTATT_VILLAGE_ALT =
  'Historic alpine village with colorful traditional houses nestled against a steep mountain cliff';

export const DISCOVERY_IMAGE = '/images/pixabay-discovery-paraglide.png';
export const DISCOVERY_ALT =
  'Person paragliding over a green valley with mountains in the distance';

export const HORSE_BARN_IMAGE = '/images/pixabay-horse-barn.png';
// TODO: replace with commercial-use licensed per-event images before production.
export const HORSE_BARN_ALT =
  'Premium wooden horse barn and stable set on a green lawn under a clear blue sky';

export const GETAWAY_HILLS_IMAGE = '/images/pixabay-getaway-hills.png';
export const GETAWAY_HILLS_ALT =
  'Rolling green hills with yellow wildflowers and cypress trees under a soft cloudy sky';

export const TRUST_CARD_DISCOVER_IMAGE = HALLSTATT_VILLAGE_IMAGE;
export const TRUST_CARD_DISCOVER_ALT = HALLSTATT_VILLAGE_ALT;

export const TRUST_CARD_CURATE_IMAGE = '/images/pixabay-trust-enjoy.png';
export const TRUST_CARD_CURATE_ALT =
  'Friends toasting together at a candlelit outdoor dinner at dusk';

export const TRUST_CARD_ENJOY_IMAGE = '/images/pixabay-trust-curate.png';
export const TRUST_CARD_ENJOY_ALT =
  'Couple walking arm in arm along a scenic autumn forest path';

/** Homepage section imagery for the discovery intro slideshow. */
export const DISCOVERY_SLIDESHOW_IMAGES = [
  { src: GETAWAY_HILLS_IMAGE, alt: GETAWAY_HILLS_ALT },
  { src: TRUST_CARD_DISCOVER_IMAGE, alt: TRUST_CARD_DISCOVER_ALT },
  { src: TRUST_CARD_CURATE_IMAGE, alt: TRUST_CARD_CURATE_ALT },
  { src: TRUST_CARD_ENJOY_IMAGE, alt: TRUST_CARD_ENJOY_ALT },
  { src: DISCOVERY_IMAGE, alt: DISCOVERY_ALT, objectPosition: 'center 42%' },
];
