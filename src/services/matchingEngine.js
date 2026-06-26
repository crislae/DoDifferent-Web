import {
  computeLearningBoost,
  getTopLearningTags,
  shouldShowLearningReason,
  getLearningReason,
} from './learningEngine';

const WEIGHTS = {
  mood: 30,
  when: 25,
  distance: 20,
  with: 15,
  budget: 10,
  tagPreference: 8,
};

const SAVED_BOOST = 5;
const STRONG_MATCH_THRESHOLD = 45;
const PERSONALIZED_LIMIT = 10;
const HIDDEN_GEMS_LIMIT = 10;
const MOOD_MATCH_THRESHOLD = 50;

const WHEN_ADJACENT = {
  today: ['thisWeekend'],
  thisWeekend: ['today', 'nextWeeks'],
  nextWeeks: ['thisWeekend', 'later'],
  later: ['nextWeeks'],
};

const DISTANCE_RANK = { nearby: 0, '100km': 1, anywhere: 2 };

const BUDGET_LEVELS = ['€', '€€', '€€€'];

const NATURE_TAGS = new Set([
  'nature',
  'outdoor',
  'urban-nature',
  'wildlife',
  'alpine',
  'water',
  'forest',
  'ocean',
  'desert',
  'mountains',
]);

const OUTDOOR_TAGS = new Set([
  ...NATURE_TAGS,
  'adventure',
  'dawn',
  'night',
  'seasonal',
  'travel',
]);

const MOOD_REASONS = {
  relax: 'You seemed to need a little room to breathe',
  learn: 'We thought you might enjoy learning something with your hands',
  connect: 'This felt like a lovely way to spend time with someone',
  challenge: 'A gentle nudge out of the ordinary',
  create: 'For when you want to make something real',
  celebrate: 'Worth marking the moment properly',
  any: 'Sometimes the best plan is a pleasant surprise',
};

const WHEN_REASONS = {
  today: 'The timing could work for today',
  thisWeekend: 'We had this weekend in mind for you',
  nextWeeks: 'Something to look forward to in the coming weeks',
  later: 'No rush — tuck this away for when you are ready',
};

const DISTANCE_REASONS = {
  nearby: "Close enough that it doesn't become a whole expedition",
  '100km': 'A short trip, not a production',
  anywhere: 'Worth going a little further for',
};

const WITH_REASONS = {
  alone: 'Works beautifully on your own',
  partner: 'Made for time with someone special',
  friends: 'Good energy for a few friends',
  family: 'Room for the whole family',
  pet: 'Your dog might enjoy this one too',
  flexible: 'Easy to enjoy however the day unfolds',
};

const BUDGET_REASONS = {
  '€': "Won't ask too much of your wallet",
  '€€': 'A fair spend for something memorable',
  '€€€': 'A splurge, but a considered one',
};

function getEventScores(event) {
  return event.scores ?? event.moodScores ?? {};
}

function scoreMood(intent, event) {
  const scores = getEventScores(event);

  if (intent.mood === 'any') {
    const maxMood = Math.max(...Object.values(scores), 0);
    return (maxMood / 100) * WEIGHTS.mood;
  }

  const moodScore = scores[intent.mood] ?? 0;
  return (moodScore / 100) * WEIGHTS.mood;
}

function scoreTagPreference(intent, event) {
  if (intent.tagPreference !== 'nature') return 0;

  const hasNatureTag = event.tags.some(
    (tag) => NATURE_TAGS.has(tag) || tag.includes('nature') || tag.includes('outdoor'),
  );

  return hasNatureTag ? WEIGHTS.tagPreference : 0;
}

function scoreWhen(intent, event) {
  if (event.when.includes(intent.when)) return WEIGHTS.when;
  if (WHEN_ADJACENT[intent.when]?.some((w) => event.when.includes(w))) {
    return WEIGHTS.when * 0.4;
  }
  return 0;
}

function scoreDistance(intent, event) {
  if (intent.distance === 'anywhere') return WEIGHTS.distance;
  if (event.distance === 'anywhere') return WEIGHTS.distance * 0.7;

  const intentRank = DISTANCE_RANK[intent.distance];
  const eventRank = DISTANCE_RANK[event.distance];

  if (eventRank <= intentRank) return WEIGHTS.distance;
  if (eventRank === intentRank + 1) return WEIGHTS.distance * 0.5;
  return 0;
}

function isPetFriendly(event) {
  const hasOutdoorTag = event.tags.some((tag) => OUTDOOR_TAGS.has(tag));
  const allowsCompanion =
    event.with.includes('flexible') ||
    event.with.includes('friends') ||
    event.with.includes('alone');

  return hasOutdoorTag && allowsCompanion;
}

function scoreWith(intent, event) {
  if (intent.with === 'flexible') return WEIGHTS.with;

  if (intent.with === 'family') {
    if (
      event.with.includes('friends') ||
      event.with.includes('flexible') ||
      event.with.includes('partner')
    ) {
      return WEIGHTS.with * 0.9;
    }
    return 0;
  }

  if (intent.with === 'pet') {
    if (isPetFriendly(event)) return WEIGHTS.with;
    if (event.with.includes('flexible')) return WEIGHTS.with * 0.45;
    return 0;
  }

  if (event.with.includes(intent.with) || event.with.includes('flexible')) {
    return WEIGHTS.with;
  }

  return 0;
}

function scoreBudget(intent, event) {
  if (intent.budget === 'any') return WEIGHTS.budget;
  if (event.budgetLevel === intent.budget) return WEIGHTS.budget;

  const intentIdx = BUDGET_LEVELS.indexOf(intent.budget);
  const eventIdx = BUDGET_LEVELS.indexOf(event.budgetLevel);
  if (intentIdx !== -1 && eventIdx !== -1 && Math.abs(intentIdx - eventIdx) === 1) {
    return WEIGHTS.budget * 0.5;
  }
  return 0;
}

function getMoodScoreForReason(intent, event) {
  const scores = getEventScores(event);
  if (intent.mood === 'any') {
    return Math.max(...Object.values(scores), 0);
  }
  return scores[intent.mood] ?? 0;
}

function buildMatchReasons(intent, event, breakdown, isSaved, learningBoost, learningTags) {
  const reasons = [];
  const moodScore = getMoodScoreForReason(intent, event);

  if (moodScore >= MOOD_MATCH_THRESHOLD && MOOD_REASONS[intent.mood]) {
    reasons.push(MOOD_REASONS[intent.mood]);
  }

  if (shouldShowLearningReason(learningBoost)) {
    reasons.push(getLearningReason(learningTags));
  }

  if (breakdown.tagPreference > 0) {
    reasons.push('You wanted time outdoors — this one takes you there');
  }

  if (breakdown.when > 0 && WHEN_REASONS[intent.when]) {
    reasons.push(WHEN_REASONS[intent.when]);
  }

  if (breakdown.distance > 0 && DISTANCE_REASONS[intent.distance]) {
    reasons.push(DISTANCE_REASONS[intent.distance]);
  }

  if (breakdown.with > 0 && WITH_REASONS[intent.with]) {
    reasons.push(WITH_REASONS[intent.with]);
  }

  if (breakdown.budget > 0 && intent.budget !== 'any' && BUDGET_REASONS[intent.budget]) {
    reasons.push(BUDGET_REASONS[intent.budget]);
  }

  if (isSaved) {
    reasons.push('You warmed to something like this already');
  }

  if (reasons.length === 0) {
    return ['One we keep coming back to — it simply feels right'];
  }

  return reasons.slice(0, 3);
}

export function rankExperiences(
  intent,
  allEvents,
  { dismissed = [], saved = [], interactions = [] } = {},
) {
  const dismissedSet = new Set(dismissed);
  const savedSet = new Set(saved);

  const ranked = allEvents
    .filter((event) => !dismissedSet.has(event.id))
    .map((event) => {
      const isSaved = savedSet.has(event.id);
      const learningBoost = computeLearningBoost(event, allEvents, interactions);
      const learningTags = getTopLearningTags(event, allEvents, interactions);

      const breakdown = {
        mood: scoreMood(intent, event),
        tagPreference: scoreTagPreference(intent, event),
        when: scoreWhen(intent, event),
        distance: scoreDistance(intent, event),
        with: scoreWith(intent, event),
        budget: scoreBudget(intent, event),
        saved: isSaved ? SAVED_BOOST : 0,
        learning: learningBoost,
      };

      const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

      return {
        event,
        score,
        matchReasons: buildMatchReasons(
          intent,
          event,
          breakdown,
          isSaved,
          learningBoost,
          learningTags,
        ),
      };
    })
    .filter((item) => item.score >= STRONG_MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  const toResult = ({ event, matchReasons }) => ({
    event,
    matchReasons,
  });

  const personalized = ranked
    .slice(0, PERSONALIZED_LIMIT)
    .map(toResult);

  const personalizedIds = new Set(personalized.map((item) => item.event.id));

  const hiddenGems = ranked
    .filter((item) => !personalizedIds.has(item.event.id))
    .slice(0, HIDDEN_GEMS_LIMIT)
    .map(toResult);

  return {
    personalized,
    hiddenGems,
    hasStrongMatches: personalized.length > 0,
  };
}

export const defaultIntent = {
  mood: 'connect',
  tagPreference: null,
  when: 'thisWeekend',
  distance: 'nearby',
  with: 'flexible',
  budget: 'any',
};

/** Widest practical intent — used when the user asks to broaden their search. */
export const broadenIntent = {
  mood: 'any',
  tagPreference: null,
  when: 'thisWeekend',
  distance: 'anywhere',
  with: 'flexible',
  budget: 'any',
};
