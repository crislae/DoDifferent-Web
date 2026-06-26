/**
 * Deterministic learning from local interactions.
 *
 * Similarity = 50% shared tags + 50% aligned mood scores.
 * Boost = sum(similarity × signal weight) per unique loved/tell_more event, capped at 12.
 * tell_more (8) outweighs love (5) when both exist for the same event.
 */

const MOOD_KEYS = ['relax', 'learn', 'connect', 'challenge', 'create', 'celebrate'];

const SIGNAL_WEIGHTS = {
  love: 5,
  tell_more: 8,
};

const MAX_LEARNING_BOOST = 12;
const LEARNING_REASON_THRESHOLD = 4;

function getEventScores(event) {
  return event.scores ?? event.moodScores ?? {};
}

export function eventSimilarity(sourceEvent, candidateEvent) {
  if (!sourceEvent || !candidateEvent || sourceEvent.id === candidateEvent.id) {
    return 0;
  }

  const sharedTags = sourceEvent.tags.filter((tag) =>
    candidateEvent.tags.includes(tag),
  );
  const tagUnion = new Set([...sourceEvent.tags, ...candidateEvent.tags]);
  const tagScore = tagUnion.size > 0 ? sharedTags.length / tagUnion.size : 0;

  const sourceScores = getEventScores(sourceEvent);
  const candidateScores = getEventScores(candidateEvent);

  const moodScore =
    MOOD_KEYS.reduce((sum, key) => {
      const diff = Math.abs((sourceScores[key] ?? 0) - (candidateScores[key] ?? 0));
      return sum + (100 - diff) / 100;
    }, 0) / MOOD_KEYS.length;

  return tagScore * 0.5 + moodScore * 0.5;
}

function getPositiveSignals(interactions) {
  const strongestByEvent = new Map();

  for (const item of interactions) {
    if (
      (item.interactionType !== 'love' && item.interactionType !== 'tell_more') ||
      !item.eventId
    ) {
      continue;
    }

    const weight = SIGNAL_WEIGHTS[item.interactionType] ?? 0;
    const existing = strongestByEvent.get(item.eventId);

    if (!existing || weight > existing.weight) {
      strongestByEvent.set(item.eventId, { ...item, weight });
    }
  }

  return [...strongestByEvent.values()];
}

export function computeLearningBoost(event, allEvents, interactions) {
  const positiveSignals = getPositiveSignals(interactions);
  if (positiveSignals.length === 0) return 0;

  let boost = 0;

  for (const signal of positiveSignals) {
    const sourceEvent = allEvents.find((item) => item.id === signal.eventId);
    if (!sourceEvent) continue;

    const similarity = eventSimilarity(sourceEvent, event);
    boost += similarity * signal.weight;
  }

  return Math.min(boost, MAX_LEARNING_BOOST);
}

export function shouldShowLearningReason(boost) {
  return boost >= LEARNING_REASON_THRESHOLD;
}

export function getLearningReason(sourceTags = []) {
  if (sourceTags.length > 0) {
    const themes = sourceTags.slice(0, 2).join(' and ');
    return `This reminded us of something you liked before — a similar ${themes} feeling`;
  }
  return 'This reminded us of something you liked before';
}

export function getTopLearningTags(event, allEvents, interactions) {
  const positiveSignals = getPositiveSignals(interactions);
  const shared = new Set();

  for (const signal of positiveSignals) {
    const sourceEvent = allEvents.find((item) => item.id === signal.eventId);
    if (!sourceEvent) continue;

    sourceEvent.tags
      .filter((tag) => event.tags.includes(tag))
      .forEach((tag) => shared.add(tag));
  }

  return [...shared];
}
