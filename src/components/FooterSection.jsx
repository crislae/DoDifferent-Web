import { ROUTES } from '../utils/appRoute';
import { FOOTER_YOGA_ALT, FOOTER_YOGA_IMAGE } from '../data/siteImages';

const CURIOSITY_IN_MOTION_URL = 'https://curiosity-in-motion.vercel.app/#curiosity';

const FOOTER_LINKS = [
  { label: 'Privacy', href: ROUTES.privacy },
  { label: 'Terms', href: ROUTES.terms },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Become a Partner', href: ROUTES.partner },
];

export default function FooterSection() {
  return (
    <section id="footer" className="story-stage story-stage--footer" aria-label="Footer">
      <div className="deck-footer">
        <figure className="deck-footer__hero">
          <img
            src={FOOTER_YOGA_IMAGE}
            alt={FOOTER_YOGA_ALT}
            className="deck-footer__hero-image"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="deck-footer__hero-overlay">
            <h2 className="deck-footer__headline">Ready for your next story?</h2>
            <p className="deck-footer__support">
              We&apos;ll keep searching for experiences worth remembering.
              <br />
              You keep exploring.
            </p>
          </figcaption>
        </figure>

        <div className="deck-footer__lab">
          <p className="deck-footer__eyebrow">Crafted by Curiosity in Motion</p>
          <p className="deck-footer__description">
            A personal product lab exploring ideas through product discovery, design and
            experimentation.
          </p>
          <a
            href={CURIOSITY_IN_MOTION_URL}
            className="deck-footer__lab-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discover the lab →
          </a>
        </div>

        <nav className="deck-footer__nav" aria-label="Legal and contact">
          <ul className="deck-footer__links">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="deck-footer__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="deck-footer__closing">
          © 2026 Do Different™ · Built with curiosity.
        </p>
      </div>
    </section>
  );
}
