import { Star } from 'lucide-react';
import StageSection from './StageSection';
import MatchesCarousel from './MatchesCarousel';
import EmptyState from './EmptyState';

export default function MatchesStage({
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
  scrollerRef = null,
}) {
  return (
    <StageSection
      id="matches"
      title="Picked for you"
      titleId="matches-title"
      icon={Star}
      showCue
      nextTarget="gems"
      ariaLabel="Your matched experiences"
      className="story-stage--matches"
      scrollerRef={scrollerRef}
    >
      {hasStrongMatches && results.length > 0 ? (
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
      ) : (
        <EmptyState onBroaden={onBroaden} />
      )}
    </StageSection>
  );
}
