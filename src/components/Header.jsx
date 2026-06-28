import { useCallback, useEffect, useId, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SECTION_NAV } from '../data/sectionNav';
import { getSlideNavAriaLabel } from '../data/slides';
import { scrollToSection } from '../utils/scrollToSection';

export default function Header({ activeSectionId = null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navPanelId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleSectionClick = (event, sectionId) => {
    event.preventDefault();
    scrollToSection(sectionId, 'smooth');
    closeMenu();
  };

  const handleIntroScroll = (event) => {
    event.preventDefault();
    scrollToSection('intro', 'smooth', { preferSectionRoot: true });
    closeMenu();
  };

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#intro" className="header__brand-group" onClick={handleIntroScroll}>
          <span className="header__brand">Do Different</span>
        </a>

        <nav className="header__section-nav" aria-label="Slides">
          <ul className="header__section-list">
            {SECTION_NAV.map((item) => {
              const isActive = activeSectionId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`header__section-link${isActive ? ' header__section-link--active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={getSlideNavAriaLabel(item)}
                    onClick={(event) => handleSectionClick(event, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="header__menu-toggle"
            aria-expanded={menuOpen}
            aria-controls={navPanelId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? (
              <X size={22} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <nav
        id={navPanelId}
        className={`header__mobile-nav${menuOpen ? ' header__mobile-nav--open' : ''}`}
        aria-label="Slides"
        aria-hidden={!menuOpen}
      >
        <ul className="header__mobile-list">
          {SECTION_NAV.map((item) => {
            const isActive = activeSectionId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`header__mobile-link${isActive ? ' header__mobile-link--active' : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={getSlideNavAriaLabel(item)}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={(event) => handleSectionClick(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
