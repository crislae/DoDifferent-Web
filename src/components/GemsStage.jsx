import GemsCarousel from './GemsCarousel';
import SlideContinue from './SlideContinue';

export default function GemsStage({
  hiddenGems,
  cardHandlers,
  gemsRailSource,
  trackRailView,
  matchesSession,
}) {
  const hasGems = hiddenGems.length > 0;

  return (
    <section
      id="gems"
      className="story-stage story-stage--gems story-stage--band story-stage--content-start"
      aria-label="Slide 6: Gems"
      aria-labelledby="gems-title"
    >
      <div className="gems-stage slide-shell">
        <header id="gems-head" className="gems-stage__header worth-discovering__header">
          <h2 id="gems-title" className="worth-discovering__title">
            Worth Discovering
          </h2>
          <p className="worth-discovering__subtitle">
            Curated gems we think deserve your attention.
          </p>
        </header>

        {hasGems ? (
          <GemsCarousel
            key={`gems-${matchesSession}`}
            results={hiddenGems}
            railSource={gemsRailSource}
            trackRailView={trackRailView}
            {...cardHandlers}
          />
        ) : (
          <div className="worth-discovering__empty">
            <p>
              That&apos;s all the gems we have for now. We&apos;re curating more.
            </p>
          </div>
        )}

        <SlideContinue nextLabel="Contact" nextId="footer" />
      </div>
    </section>
  );
}
