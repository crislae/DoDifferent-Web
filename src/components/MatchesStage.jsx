import MatchesCarousel from './MatchesCarousel';
import EmptyState from './EmptyState';
import DiscoveryPromptState from './DiscoveryPromptState';
import SlideContinue from './SlideContinue';
import { shouldShowSlideContinue } from '../data/sectionNav';

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
          <h2 id="matches-title" className="story-stage__title">
            Picked for you
          </h2>
          <p className="story-stage__subtitle">
            Curated experiences based on what you&apos;re looking for.
          </p>
        </header>

        <div className="matches-stage__body">{content}</div>

        {shouldShowSlideContinue('matches') && (
          <SlideContinue nextLabel="Gems" nextId="gems" />
        )}
      </div>
    </section>
  );
}
