import { ROUTES } from '../utils/appRoute';

const LAB_URL = 'https://curiosity-in-motion.vercel.app/';

const LEGAL_LINKS = [
  { label: 'Privacy', href: ROUTES.privacy },
  { label: 'Terms', href: ROUTES.terms },
  { label: 'Contact', href: ROUTES.contact },
  { label: 'Become a Partner', href: ROUTES.partner },
];

export default function FooterSection() {
  return (
    <section id="footer" className="story-stage story-stage--footer" aria-label="Footer">
      <div className="deck-footer">
        <div className="deck-footer__lab">
          <p className="deck-footer__eyebrow">Crafted by Curiosity in Motion</p>
          <p className="deck-footer__description">
            A personal product lab for exploring AI, automation, digital products and modern ways
            of working.
          </p>
          <a
            href={LAB_URL}
            className="deck-footer__lab-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about the lab →
          </a>
        </div>

        <hr className="deck-footer__rule" aria-hidden="true" />

        <div className="deck-footer__base">
          <p className="deck-footer__legal">
            © 2026 Do Different™
            <br />
            All rights reserved.
          </p>

          <nav className="deck-footer__nav" aria-label="Legal and contact">
            <ul className="deck-footer__links">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="deck-footer__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
