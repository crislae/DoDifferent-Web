import { scrollToSection } from '../utils/scrollToSection';

export default function Header({ scrollerRef = null }) {
  const handleIntroScroll = (event) => {
    event.preventDefault();
    scrollToSection('intro', 'smooth', scrollerRef);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#intro" className="header__brand-group" onClick={handleIntroScroll}>
          <span className="header__brand">Do Different</span>
        </a>

        <nav className="header__nav" aria-label="Main">
          <button
            type="button"
            className="btn-primary btn-primary--header"
            onClick={() => scrollToSection('discovery', 'smooth', scrollerRef)}
          >
            Start discovering
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
