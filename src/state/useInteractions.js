import { useState, useCallback } from 'react';
import {
  getInteractions,
  recordInteraction,
  getDismissedEventIds,
  getLovedEventIds,
  hasRailView,
  clearDismissedInteractions,
  removeLoveInteraction,
  INTERACTION_TYPES,
  RAIL_SOURCES,
} from '../services/interactionStore';

function syncDerivedState(interactions) {
  return {
    loved: getLovedEventIds(interactions),
    dismissed: getDismissedEventIds(interactions),
  };
}

/** Tracks card interactions and syncs derived love/dismiss state for matching + learning. */
export function useInteractions(intent) {
  const [interactions, setInteractions] = useState(getInteractions);
  const [saved, setSaved] = useState(() => getLovedEventIds(getInteractions()));
  const [dismissed, setDismissed] = useState(() =>
    getDismissedEventIds(getInteractions()),
  );

  const refresh = useCallback(() => {
    const latest = getInteractions();
    const { loved, dismissed: dismissedIds } = syncDerivedState(latest);
    setInteractions(latest);
    setSaved(loved);
    setDismissed(dismissedIds);
  }, []);

  const track = useCallback(
    ({ eventId = null, interactionType, railSource = null }) => {
      recordInteraction({
        eventId,
        interactionType,
        currentIntent: intent,
        railSource,
      });
      refresh();
    },
    [intent, refresh],
  );

  const love = useCallback(
    (eventId, railSource = null) => {
      if (saved.includes(eventId)) {
        removeLoveInteraction(eventId);
        refresh();
        return;
      }

      track({ eventId, interactionType: INTERACTION_TYPES.LOVE, railSource });
    },
    [saved, track, refresh],
  );

  const dismiss = useCallback(
    (eventId, railSource = null) => {
      if (dismissed.includes(eventId)) return;
      track({ eventId, interactionType: INTERACTION_TYPES.DISMISS, railSource });
    },
    [dismissed, track],
  );

  const tellMore = useCallback(
    (eventId, railSource = null) => {
      track({ eventId, interactionType: INTERACTION_TYPES.TELL_MORE, railSource });
    },
    [track],
  );

  const trackRailView = useCallback(
    (railSource) => {
      const latest = getInteractions();
      if (hasRailView(latest, railSource)) return;

      track({
        interactionType: INTERACTION_TYPES.RAIL_VIEW,
        railSource,
      });
    },
    [track],
  );

  const clearDismissed = useCallback(() => {
    clearDismissedInteractions();
    refresh();
  }, [refresh]);

  const isLoved = useCallback(
    (eventId) => saved.includes(eventId),
    [saved],
  );

  return {
    interactions,
    saved,
    dismissed,
    love,
    dismiss,
    tellMore,
    trackRailView,
    isLoved,
    clearDismissed,
    railSources: RAIL_SOURCES,
  };
}
