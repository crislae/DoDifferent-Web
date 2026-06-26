const STORAGE_KEY = 'doDifferent_interactions';

/** Persists love, dismiss, tell-more, and rail-view signals in localStorage for local learning. */

const LEGACY_KEYS = {
  saved: 'doDifferent_saved',
  dismissed: 'doDifferent_dismissed',
};

export const INTERACTION_TYPES = {
  LOVE: 'love',
  DISMISS: 'dismiss',
  TELL_MORE: 'tell_more',
  RAIL_VIEW: 'rail_view',
};

export const RAIL_SOURCES = {
  PERSONALIZED: 'personalized',
  HIDDEN_GEMS: 'hidden_gems',
};

function readLegacyList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readInteractions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeInteractions(interactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(interactions));
}

function migrateLegacyInteractions() {
  const existing = readInteractions();
  if (existing.length > 0) return existing;

  const legacySaved = readLegacyList(LEGACY_KEYS.saved);
  const legacyDismissed = readLegacyList(LEGACY_KEYS.dismissed);
  const migrated = [];
  const snapshot = {};

  legacySaved.forEach((eventId) => {
    migrated.push({
      eventId,
      interactionType: INTERACTION_TYPES.LOVE,
      timestamp: new Date(0).toISOString(),
      currentIntent: snapshot,
      railSource: null,
    });
  });

  legacyDismissed.forEach((eventId) => {
    migrated.push({
      eventId,
      interactionType: INTERACTION_TYPES.DISMISS,
      timestamp: new Date(0).toISOString(),
      currentIntent: snapshot,
      railSource: null,
    });
  });

  if (migrated.length > 0) {
    writeInteractions(migrated);
  }

  return migrated;
}

export function getInteractions() {
  return migrateLegacyInteractions();
}

export function recordInteraction({
  eventId = null,
  interactionType,
  currentIntent,
  railSource = null,
}) {
  const entry = {
    eventId,
    interactionType,
    timestamp: new Date().toISOString(),
    currentIntent: { ...currentIntent },
    railSource,
  };

  const interactions = readInteractions();
  interactions.push(entry);
  writeInteractions(interactions);
  return entry;
}

export function getDismissedEventIds(interactions = getInteractions()) {
  return [
    ...new Set(
      interactions
        .filter((item) => item.interactionType === INTERACTION_TYPES.DISMISS)
        .map((item) => item.eventId)
        .filter(Boolean),
    ),
  ];
}

export function getLovedEventIds(interactions = getInteractions()) {
  return [
    ...new Set(
      interactions
        .filter((item) => item.interactionType === INTERACTION_TYPES.LOVE)
        .map((item) => item.eventId)
        .filter(Boolean),
    ),
  ];
}

export function hasRailView(interactions, railSource) {
  return interactions.some(
    (item) =>
      item.interactionType === INTERACTION_TYPES.RAIL_VIEW &&
      item.railSource === railSource,
  );
}

export function clearDismissedInteractions() {
  const interactions = readInteractions().filter(
    (item) => item.interactionType !== INTERACTION_TYPES.DISMISS,
  );
  writeInteractions(interactions);
}
