import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import CuratedSection from '../components/CuratedSection';
import DiscoveryPanel from '../components/DiscoveryPanel';
import MatchesStage from '../components/MatchesStage';
import GemsStage from '../components/GemsStage';
import TrustSection from '../components/TrustSection';
import FooterSection from '../components/FooterSection';
import EventDetailModal from '../components/EventDetailModal';
import { events } from '../data/events';
import { rankExperiences } from '../services/matchingEngine';
import { useCurrentIntent } from '../state/useCurrentIntent';
import { useInteractions } from '../state/useInteractions';
import { useStoryDeck } from '../state/useStoryDeck';
import {
  readMatchesRevealed,
  saveMatchesRevealed,
  resetDiscoveryProgress,
} from '../utils/discoveryProgress';

export default function HomePage() {
  const scrollerRef = useRef(null);
  const pendingNavigationRef = useRef(null);
  const pendingMatchesScrollRef = useRef(false);

  const { intent, updateIntent, setIntentFields, resetIntent } = useCurrentIntent();
  const {
    interactions,
    saved,
    dismissed,
    love,
    dismiss,
    tellMore,
    trackRailView,
    isLoved,
    railSources,
    clearDismissed,
  } = useInteractions(intent);

  const [detailEvent, setDetailEvent] = useState(null);
  const [recommendationsRevealed, setRecommendationsRevealed] = useState(readMatchesRevealed);
  const [matchesSession, setMatchesSession] = useState(0);
  const [discoverySession, setDiscoverySession] = useState(0);
  const [discoveryFocusToken, setDiscoveryFocusToken] = useState(0);

  const { personalized, hiddenGems, hasStrongMatches } = useMemo(
    () =>
      rankExperiences(intent, events, {
        dismissed,
        saved,
        interactions,
      }),
    [intent, dismissed, saved, interactions],
  );

  const sectionIds = useMemo(
    () => ['intro', 'curated', 'trust', 'discovery', 'matches', 'gems', 'footer'],
    [],
  );

  const { scrollToIndex, scrollToSectionId } = useStoryDeck(
    sectionIds,
    scrollerRef,
  );

  const queueSectionNavigation = useCallback((sectionId) => {
    pendingNavigationRef.current = sectionId;
  }, []);

  useEffect(() => {
    const targetId = pendingNavigationRef.current;
    if (!targetId) return;

    const index = sectionIds.indexOf(targetId);
    const target = document.getElementById(targetId);
    if (index < 0 || !target) return;

    pendingNavigationRef.current = null;
    scrollToIndex(index, 'smooth', { bypassLock: true });
  }, [sectionIds, scrollToIndex]);

  // Matches stage mounts after first reveal — scroll once the section exists in the DOM.
  useEffect(() => {
    if (!pendingMatchesScrollRef.current || !recommendationsRevealed) return;

    const index = sectionIds.indexOf('matches');
    const matchesSection = document.getElementById('matches');
    if (index < 0 || !matchesSection) return;

    pendingMatchesScrollRef.current = false;
    scrollToIndex(index, 'smooth', { bypassLock: true });
  }, [recommendationsRevealed, sectionIds, scrollToIndex, matchesSession]);

  const resetToDiscovery = useCallback(
    ({ remountDiscovery = false } = {}) => {
      resetDiscoveryProgress();
      setRecommendationsRevealed(false);
      if (remountDiscovery) {
        setDiscoverySession((current) => current + 1);
      }
      queueSectionNavigation('discovery');
    },
    [queueSectionNavigation],
  );

  const handleRestartDiscovery = useCallback(() => {
    resetToDiscovery();
  }, [resetToDiscovery]);

  const handleChangeMood = useCallback(() => {
    resetIntent();
    clearDismissed();
    resetToDiscovery({ remountDiscovery: true });
  }, [resetIntent, clearDismissed, resetToDiscovery]);

  const handleViewResults = useCallback(() => {
    if (!recommendationsRevealed) {
      saveMatchesRevealed();
      setRecommendationsRevealed(true);
      setMatchesSession((current) => current + 1);
      pendingMatchesScrollRef.current = true;
      return;
    }
    scrollToSectionId('matches');
  }, [recommendationsRevealed, scrollToSectionId]);

  const handleStartDiscovery = useCallback(() => {
    scrollToSectionId('discovery', 'smooth', { bypassLock: true });
    setDiscoveryFocusToken((token) => token + 1);
  }, [scrollToSectionId]);

  const handleViewGems = useCallback(() => {
    scrollToSectionId('gems');
  }, [scrollToSectionId]);

  const handleTellMore = (event, railSource = null, matchReasons = []) => {
    tellMore(event.id, railSource);

    if (event?.title) {
      setDetailEvent({ event, matchReasons, railSource });
      return;
    }

    if (event?.providerUrl) {
      window.open(event.providerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBroaden = useCallback(() => {
    resetIntent();
    clearDismissed();
    resetToDiscovery({ remountDiscovery: true });
  }, [resetIntent, clearDismissed, resetToDiscovery]);

  const cardHandlers = {
    isLoved,
    onLove: love,
    onTellMore: handleTellMore,
    onDismiss: dismiss,
  };

  return (
    <div className="page">
      <Header scrollerRef={scrollerRef} />

      <div className="story-scroll" ref={scrollerRef}>
        <Hero />
        <CuratedSection />
        <TrustSection />

        <DiscoveryPanel
          key={discoverySession}
          intent={intent}
          updateIntent={updateIntent}
          setIntentFields={setIntentFields}
          onViewResults={handleViewResults}
          onRestartDiscovery={handleRestartDiscovery}
          focusToken={discoveryFocusToken}
        />

        <MatchesStage
          recommendationsRevealed={recommendationsRevealed}
          onStartDiscovery={handleStartDiscovery}
          results={personalized}
          hasStrongMatches={hasStrongMatches}
          hasGemsRail
          onBroaden={handleBroaden}
          onChangeMood={handleChangeMood}
          onShowGems={handleViewGems}
          cardHandlers={cardHandlers}
          railSource={railSources.PERSONALIZED}
          trackRailView={trackRailView}
          matchesSession={matchesSession}
          scrollerRef={scrollerRef}
        />

        <GemsStage
          hiddenGems={hiddenGems}
          cardHandlers={cardHandlers}
          gemsRailSource={railSources.HIDDEN_GEMS}
          trackRailView={trackRailView}
          matchesSession={matchesSession}
        />

        <FooterSection />
      </div>

      <EventDetailModal
        event={detailEvent?.event ?? null}
        matchReasons={detailEvent?.matchReasons ?? []}
        isLoved={detailEvent?.event ? isLoved(detailEvent.event.id) : false}
        onLove={(eventId) => love(eventId, detailEvent?.railSource ?? null)}
        onClose={() => setDetailEvent(null)}
      />
    </div>
  );
}
