import { useState, useEffect } from 'react';
import { GETAWAY_HILLS_ALT, GETAWAY_HILLS_IMAGE } from '../data/siteImages';

const INSPIRATIONS = [
  'Participate in a wine tasting in Tuscany.',
  'Learn to make cheese in a beautiful cabin in the Alps.',
  'Watch the sunrise from a monastery normally closed to visitors.',
  'Celebrate your birthday somewhere unforgettable.',
  'Cycle around Lake Starnberg with new friends.',
  'Sleep under the stars in the Austrian Alps.',
];

const PHRASE_MS = 4000;
const FADE_MS = 400;

export default function Hero({ onFindExperience }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setVisible(false), PHRASE_MS - FADE_MS);
    const nextTimer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % INSPIRATIONS.length);
      setVisible(true);
    }, PHRASE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(nextTimer);
    };
  }, [index]);

  return (
    <section
      id="intro"
      className="story-stage story-stage--hero"
      aria-labelledby="hero-headline"
    >
      <div className="hero-deck">
        <div className="hero-deck__left">
          <h1 id="hero-headline" className="hero-deck__title">
            Not sure what to do different this weekend?
          </h1>

          <p className="hero-deck__support">
            We help you discover extraordinary experiences that fit what you&apos;re
            looking for.
          </p>

          <div className="hero-inspiration" aria-live="polite" aria-atomic="true">
            <p className="hero-inspiration__label">What if you could...</p>
            <div className="hero-inspiration__stage">
              {INSPIRATIONS.map((example, exampleIndex) => (
                <p
                  key={example}
                  className={`hero-inspiration__example${
                    exampleIndex === index && visible ? ' hero-inspiration__example--visible' : ''
                  }`}
                  aria-hidden={exampleIndex !== index}
                >
                  {example}
                </p>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn-primary hero-deck__cta"
            onClick={onFindExperience}
          >
            Find my next experience
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <figure className="hero-deck__right">
          <img
            className="hero-deck__image"
            src={GETAWAY_HILLS_IMAGE}
            alt={GETAWAY_HILLS_ALT}
            loading="eager"
          />
        </figure>
      </div>

      <p className="hero-deck__scroll-hint">
        <span className="hero-deck__scroll-icon" aria-hidden="true" />
        Scroll to explore
      </p>
    </section>
  );
}
