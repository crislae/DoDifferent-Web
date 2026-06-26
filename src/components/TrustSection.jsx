import ScrollCue from './ScrollCue';

export default function TrustSection({ scrollerRef = null }) {
  return (
    <section
      id="trust"
      className="story-stage story-stage--transition"
      aria-labelledby="trust-title"
    >
      <div className="transition-deck">
        <h2 id="trust-title" className="transition-deck__title">
          Your weekends deserve better than endless searching.
        </h2>
        <p className="transition-deck__sub">
          Let&apos;s discover something worth remembering.
        </p>
        <ScrollCue
          targetId="discovery"
          label="Continue to discovery"
          scrollerRef={scrollerRef}
        />
      </div>
    </section>
  );
}
