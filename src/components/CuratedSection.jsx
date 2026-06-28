import { useRef, useState } from 'react';
import { Search, Heart, Send } from 'lucide-react';
import SlideContinue from './SlideContinue';

const CARDS = [
  {
    step: '01',
    title: 'We Discover',
    body: 'We constantly search for experiences that are different, memorable and worth your free time.',
    icon: Search,
  },
  {
    step: '02',
    title: 'We Curate',
    body: 'Every experience has to pass one simple test: would we recommend it to someone we care about?',
    icon: Heart,
  },
  {
    step: '03',
    title: 'You Enjoy',
    body: "When you're ready, you'll book directly with the provider. No hidden fees. Just great experiences.",
    icon: Send,
  },
];

function TrustCard({ card, isActive, onActivate }) {
  const Icon = card.icon;

  return (
    <article
      className={`curated-deck__card${isActive ? ' curated-deck__card--active' : ''}`}
      onClick={() => onActivate(card.step)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate(card.step);
        }
      }}
      tabIndex={0}
    >
      <div className="curated-deck__card-content">
        <div className="curated-deck__card-head">
          <span className="curated-deck__card-badge" aria-hidden="true">
            <Icon size={20} strokeWidth={1.65} />
          </span>
          <h3 className="curated-deck__card-title">
            <span className="curated-deck__card-step">{card.step}</span>
            {card.title}
          </h3>
        </div>
        <p className="curated-deck__card-body">{card.body}</p>
      </div>

      <span className="curated-deck__card-accent curated-deck__card-accent--tr" aria-hidden="true" />
      <span className="curated-deck__card-accent curated-deck__card-accent--bl" aria-hidden="true" />
    </article>
  );
}

export default function CuratedSection() {
  const [activeStep, setActiveStep] = useState(null);
  const tapTimerRef = useRef(0);

  const handleCardActivate = (step) => {
    setActiveStep(step);
    window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => setActiveStep(null), 700);
  };

  return (
    <section
      id="curated"
      className="story-stage story-stage--curated"
      aria-label="Slide 2: How it works"
      aria-labelledby="curated-title"
    >
      <div className="curated-deck slide-shell">
        <div className="curated-deck__body">
          <header id="curated-head" className="curated-deck__header">
            <p className="curated-deck__eyebrow">HOW IT WORKS</p>
            <h2 id="curated-title" className="curated-deck__title">
              From our curiosity to your next story.
            </h2>
            <p className="curated-deck__subtitle">
              We take care of the searching, you take care of the memories.
            </p>
          </header>

          <div className="curated-deck__cards">
            {CARDS.map((card) => (
              <TrustCard
                key={card.step}
                card={card}
                isActive={activeStep === card.step}
                onActivate={handleCardActivate}
              />
            ))}
          </div>
        </div>

        <SlideContinue nextLabel="Our promise" nextId="trust" />
      </div>
    </section>
  );
}
