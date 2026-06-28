import SlideContinue from './SlideContinue';

export default function TrustSection({ onNavigate }) {
  return (
    <section
      id="trust"
      className="story-stage story-stage--transition story-stage--band"
      aria-label="Slide 3: Our promise"
      aria-labelledby="trust-title"
    >
      <div className="transition-deck slide-shell">
        <div id="trust-head" className="transition-deck__content">
          <h2 id="trust-title" className="transition-deck__title">
            Your weekends deserve better than endless searching.
          </h2>
          <p className="transition-deck__sub">
            Let&apos;s discover something worth remembering.
          </p>
        </div>

        <SlideContinue nextLabel="Discover" nextId="discovery" onNavigate={onNavigate} />
      </div>
    </section>
  );
}
