import { Star } from 'lucide-react';
import MatchesCarousel from './MatchesCarousel';
import EmptyState from './EmptyState';
import DiscoveryPromptState from './DiscoveryPromptState';
import SlideContinue from './SlideContinue';

export default function MatchesStage({
  recommendationsRevealed,
  onStartDiscovery,
  results,
  hasStrongMatches,
  hasGemsRail,
  onBroaden,
  onChangeMood,
  onShowGems,
  cardHandlers,
  railSource,
  trackRailView,
  matchesSession,
}) {
  let content;

  if (!recommendationsRevealed) {
    content = <DiscoveryPromptState onStartDiscovery={onStartDiscovery} />;
  } else if (hasStrongMatches && results.length > 0) {
    content = (
      <MatchesCarousel
        key={`picks-${matchesSession}`}
        results={results}
        hasGemsRail={hasGemsRail}
        railSource={railSource}
        trackRailView={trackRailView}
        onChangeMood={onChangeMood}
        onShowGems={onShowGems}
        {...cardHandlers}
      />
    );
  } else {
    content = <EmptyState onBroaden={onBroaden} />;
  }

  return (
    <section
      id="matches"
      className="story-stage story-stage--matches story-stage--band"
      aria-label="Slide 5: For you"
      aria-labelledby="matches-title"
    >
      <div className="matches-stage slide-shell">
        <header id="matches-head" className="matches-stage__header">
          <div className="matches-stage__title-row">
            <div className="matches-stage__icon" aria-hidden="true">
              <Star size={22} strokeWidth={1.5} />
            </div>
            <h2 id="matches-title" className="story-stage__title">
              Picked for you
            </h2>
          </div>
        </header>

        <div className="matches-stage__body">{content}</div>

        {recommendationsRevealed && (
          <SlideContinue nextLabel="Gems" nextId="gems" />
        )}
      </div>
    </section>
  );
}
