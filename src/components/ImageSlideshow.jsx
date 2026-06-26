import { useEffect, useState } from 'react';

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
}

export default function ImageSlideshow({ images, intervalMs = 4000, className = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || images.length <= 1) return undefined;

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [prefersReducedMotion, images.length, intervalMs]);

  if (!images.length) return null;

  const slides = prefersReducedMotion ? images.slice(0, 1) : images;

  return (
    <div className={`image-slideshow${className ? ` ${className}` : ''}`}>
      {slides.map((image, index) => {
        const isActive = prefersReducedMotion || index === activeIndex;

        return (
          <img
            key={image.src}
            className={`image-slideshow__slide${isActive ? ' image-slideshow__slide--active' : ''}`}
            src={image.src}
            alt=""
            loading={index === 0 ? 'lazy' : 'eager'}
            decoding="async"
            style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
          />
        );
      })}
    </div>
  );
}
