import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselNav({
  count,
  activeIndex,
  onSelect,
  onPrev,
  onNext,
  labelPrefix = 'Pick',
}) {
  if (count <= 1) return null;

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < count - 1;

  return (
    <nav className="carousel-nav" aria-label="Carousel navigation">
      <button
        type="button"
        className="carousel-nav__btn"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={`Previous ${labelPrefix.toLowerCase()}`}
      >
        <ChevronLeft size={15} strokeWidth={1.5} aria-hidden="true" />
      </button>

      <ol className="carousel-nav__dots">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <button
              type="button"
              className={`carousel-nav__dot${index === activeIndex ? ' carousel-nav__dot--active' : ''}`}
              onClick={() => onSelect(index)}
              aria-label={`${labelPrefix} ${index + 1} of ${count}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="carousel-nav__btn"
        onClick={onNext}
        disabled={!canNext}
        aria-label={`Next ${labelPrefix.toLowerCase()}`}
      >
        <ChevronRight size={15} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </nav>
  );
}
