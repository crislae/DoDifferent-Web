import { useState, useRef, useCallback, useEffect } from 'react';
import EventCard from './EventCard';
import PickyMoodCard from './PickyMoodCard';
import CarouselNav from './CarouselNav';
import { useCenteredCarousel, toSlideIndex } from '../state/useCenteredCarousel';
import { useRailView } from '../state/useRailView';

const VISIBLE_SLOTS = 5;
const POOL_LIMIT = 10;
const PICKY_SLIDE_KEY = '__picky__';

function buildInitialDeck(results) {
  const pool = results.slice(0, POOL_LIMIT);
  return {
    deck: pool.slice(0, VISIBLE_SLOTS),
    reserve: pool.slice(VISIBLE_SLOTS),
    dismissCount: 0,
    pickyAppended: false,
  };
}

function EmptyCarouselCard() {
  return (
    <div className="matches-carousel__empty-card">
      <div className="matches-carousel__empty-card-line matches-carousel__empty-card-line--wide" />
      <div className="matches-carousel__empty-card-line" />
      <div className="matches-carousel__empty-card-line matches-carousel__empty-card-line--short" />
    </div>
  );
}

function CarouselSpacer({ position }) {
  return (
    <div
      className={`matches-carousel__spacer matches-carousel__spacer--${position}`}
      aria-hidden="true"
    >
      <EmptyCarouselCard />
    </div>
  );
}

export default function MatchesCarousel({
  results,
  hasGemsRail = false,
  railSource = null,
  trackRailView,
  isLoved,
  onLove,
  onTellMore,
  onDismiss,
  onChangeMood,
  onShowGems,
}) {
  const viewportRef = useRef(null);
  const scrollerRef = useRef(null);
  const pickyScrollPending = useRef(false);
  const [{ deck, pickyAppended }, setDeckState] = useState(() =>
    buildInitialDeck(results),
  );

  const showPickySlide = pickyAppended;
  const realCount = deck.length + (showPickySlide ? 1 : 0);

  const { activeRealIndex, scrollToRealIndex } = useCenteredCarousel(
    realCount,
    scrollerRef,
    viewportRef,
  );

  useRailView(viewportRef, railSource, trackRailView);

  const handleDismiss = useCallback(
    (eventId) => {
      onDismiss(eventId);

      setDeckState(({ deck: currentDeck, reserve: currentReserve, dismissCount: currentCount }) => {
        const nextCount = currentCount + 1;
        const without = currentDeck.filter((item) => item.event.id !== eventId);

        if (nextCount >= VISIBLE_SLOTS || nextCount >= POOL_LIMIT) {
          pickyScrollPending.current = true;
          return {
            deck: without,
            reserve: [],
            dismissCount: nextCount,
            pickyAppended: true,
          };
        }

        const nextReserve = [...currentReserve];
        let replacement = null;

        while (nextReserve.length > 0 && !replacement) {
          const candidate = nextReserve.shift();
          if (!without.some((item) => item.event.id === candidate.event.id)) {
            replacement = candidate;
          }
        }

        if (replacement) {
          const dismissIndex = currentDeck.findIndex((item) => item.event.id === eventId);
          const insertAt = dismissIndex >= 0 ? Math.min(dismissIndex, without.length) : without.length;
          const nextDeck = [...without];
          nextDeck.splice(insertAt, 0, replacement);
          return {
            deck: nextDeck.slice(0, VISIBLE_SLOTS),
            reserve: nextReserve,
            dismissCount: nextCount,
            pickyAppended: false,
          };
        }

        if (without.length === 0 && nextReserve.length === 0) {
          pickyScrollPending.current = true;
          return {
            deck: without,
            reserve: nextReserve,
            dismissCount: nextCount,
            pickyAppended: true,
          };
        }

        return { deck: without, reserve: nextReserve, dismissCount: nextCount, pickyAppended: false };
      });
    },
    [onDismiss],
  );

  useEffect(() => {
    if (!pickyScrollPending.current || !showPickySlide) return undefined;

    pickyScrollPending.current = false;
    const pickyIndex = deck.length;
    const frame = window.requestAnimationFrame(() => {
      scrollToRealIndex(pickyIndex, 'smooth');
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showPickySlide, deck.length, scrollToRealIndex]);

  useEffect(() => {
    if (realCount === 0) return;
    if (activeRealIndex > realCount - 1) {
      scrollToRealIndex(Math.max(realCount - 1, 0), 'smooth');
    }
  }, [realCount, activeRealIndex, scrollToRealIndex]);

  const handleShowGems = useCallback(() => {
    onShowGems?.();
  }, [onShowGems]);

  const handleChangeMood = useCallback(() => {
    onChangeMood?.();
  }, [onChangeMood]);

  const handlePrev = useCallback(() => {
    scrollToRealIndex(Math.max(activeRealIndex - 1, 0), 'smooth');
  }, [activeRealIndex, scrollToRealIndex]);

  const handleNext = useCallback(() => {
    scrollToRealIndex(Math.min(activeRealIndex + 1, realCount - 1), 'smooth');
  }, [activeRealIndex, realCount, scrollToRealIndex]);

  const handleSelect = useCallback(
    (index) => {
      scrollToRealIndex(index, 'smooth');
    },
    [scrollToRealIndex],
  );

  return (
    <div className="matches-carousel" aria-label="Picked for you">
      <div ref={viewportRef} className="matches-carousel__viewport">
        <div ref={scrollerRef} className="matches-carousel__scroller" tabIndex={0}>
          <CarouselSpacer position="lead" />

          {deck.map((item, index) => (
            <div
              key={item.event.id}
              data-slide-index={toSlideIndex(index)}
              className={`matches-carousel__slide${index === activeRealIndex ? ' matches-carousel__slide--active' : ''}`}
            >
              <div className="matches-carousel__slide-inner">
                <EventCard
                  event={item.event}
                  matchReasons={item.matchReasons}
                  isLoved={isLoved(item.event.id)}
                  onLove={() => onLove(item.event.id, railSource)}
                  onTellMore={() => onTellMore(item.event, railSource, item.matchReasons)}
                  onDismiss={() => handleDismiss(item.event.id)}
                />
              </div>
            </div>
          ))}

          {showPickySlide && (
            <div
              key={PICKY_SLIDE_KEY}
              data-slide-index={toSlideIndex(deck.length)}
              className={`matches-carousel__slide matches-carousel__slide--picky${
                activeRealIndex === deck.length ? ' matches-carousel__slide--active' : ''
              }`}
            >
              <div className="matches-carousel__slide-inner">
                <PickyMoodCard
                  onChangeMood={handleChangeMood}
                  onShowGems={handleShowGems}
                  canShowGems={hasGemsRail}
                />
              </div>
            </div>
          )}

          <CarouselSpacer position="trail" />
        </div>
      </div>
      <CarouselNav
        className="carousel-nav--comfortable"
        count={realCount}
        activeIndex={activeRealIndex}
        onSelect={handleSelect}
        onPrev={handlePrev}
        onNext={handleNext}
        labelPrefix="Pick"
      />
    </div>
  );
}
