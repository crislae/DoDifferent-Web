import { Star } from 'lucide-react';
import StageSection from './StageSection';
import MatchesCarousel from './MatchesCarousel';
import EmptyState from './EmptyState';
import DiscoveryPromptState from './DiscoveryPromptState';

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
  scrollerRef = null,
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
    <StageSection
      id="matches"
      title="Picked for you"
      titleId="matches-title"
      icon={Star}
      showCue={false}
      nextTarget="gems"
      ariaLabel="Your matched experiences"
      className="story-stage--matches"
      scrollerRef={scrollerRef}
    >
      {content}
    </StageSection>
  );
}
