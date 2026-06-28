import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselNav({
  count,
  activeIndex,
  onPrev,
  onNext,
  labelPrefix = 'Pick',
  className = '',
}) {
  if (count <= 1) return null;

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < count - 1;
  const position = activeIndex + 1;

  return (
    <nav
      className={`carousel-nav${className ? ` ${className}` : ''}`}
      aria-label="Carousel navigation"
    >
      <button
        type="button"
        className="carousel-nav__btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`Previous ${labelPrefix.toLowerCase()}`}
      >
        <ChevronLeft size={18} strokeWidth={1.65} aria-hidden="true" />
      </button>

      <p className="carousel-nav__status" aria-live="polite">
        <span className="visually-hidden">{labelPrefix} </span>
        {position} of {count}
      </p>

      <button
        type="button"
        className="carousel-nav__btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label={`Next ${labelPrefix.toLowerCase()}`}
      >
        <ChevronRight size={18} strokeWidth={1.65} aria-hidden="true" />
      </button>
    </nav>
  );
}
