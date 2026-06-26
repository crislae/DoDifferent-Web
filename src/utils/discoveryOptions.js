export function getWhenOptions(date = new Date()) {
  const hour = date.getHours();
  const isSunday = date.getDay() === 0;
  const isEvening = hour >= 17;

  const browsing = { label: 'No rush', value: 'later', sentence: 'when the moment feels right' };
  const nextWeek = { label: 'Next week', value: 'nextWeeks', sentence: 'next week' };

  if (isSunday) {
    return [
      { label: 'Today', value: 'today', sentence: 'today' },
      { label: 'Next weekend', value: 'thisWeekend', sentence: 'next weekend' },
      nextWeek,
      browsing,
    ];
  }

  if (isEvening) {
    return [
      { label: 'Tonight', value: 'today', sentence: 'tonight' },
      { label: 'This weekend', value: 'thisWeekend', sentence: 'this weekend' },
      nextWeek,
      browsing,
    ];
  }

  return [
    { label: 'Today', value: 'today', sentence: 'today' },
    { label: 'This weekend', value: 'thisWeekend', sentence: 'this weekend' },
    nextWeek,
    browsing,
  ];
}

export const PURPOSE_OPTIONS = [
  {
    label: 'I need to switch off',
    sentence: 'I need to switch off',
    intent: { mood: 'relax', tagPreference: null },
  },
  {
    label: 'I want to learn something new',
    sentence: 'I want to learn something new',
    intent: { mood: 'learn', tagPreference: null },
  },
  {
    label: 'I want to feel inspired',
    sentence: 'I want to feel inspired',
    intent: { mood: 'create', tagPreference: null },
  },
  {
    label: 'I want to celebrate',
    sentence: 'I want to celebrate',
    intent: { mood: 'celebrate', tagPreference: null },
  },
  {
    label: 'I want to connect',
    sentence: 'I want to connect',
    intent: { mood: 'connect', tagPreference: null },
  },
  {
    label: 'Surprise me',
    sentence: 'I am open to anything',
    intent: { mood: 'any', tagPreference: null },
  },
];

export const DISTANCE_OPTIONS = [
  {
    label: 'Somewhere close to home',
    value: 'nearby',
    sentence: 'stay close to home',
  },
  {
    label: 'Within a short drive',
    value: '100km',
    sentence: 'drive a bit further',
  },
  {
    label: 'Wherever the road takes me',
    value: 'anywhere',
    sentence: 'go wherever feels right',
  },
];

export const COMPANION_OPTIONS = [
  { label: 'Just me', value: 'alone' },
  { label: 'Someone special', value: 'partner' },
  { label: 'My friends', value: 'friends' },
  { label: 'My family', value: 'family' },
  { label: 'My pet and me', value: 'pet' },
  { label: 'Happy to meet people', value: 'flexible' },
];

export const BUDGET_OPTIONS = [
  { label: 'Open to anything', value: 'any', sentence: "I'm open to any budget" },
  { label: 'Keeping spend light', value: '€', sentence: 'keep spend light' },
  {
    label: 'Happy to spend a little more',
    value: '€€',
    sentence: "I'm happy to spend a little more",
  },
  {
    label: 'Ready to make it special',
    value: '€€€',
    sentence: "I'm ready to make it special",
  },
];

const COMPANION_TRANSFORMS = {
  alone: (core) => core,
  partner: (core) => `Someone special and ${core}`,
  friends: (core) => core.replace(/^I /, 'My friends and I '),
  family: (core) => core.replace(/^I /, 'My family and I '),
  pet: (core) => core.replace(/^I /, 'My pet and I '),
  flexible: (core) => `I am happy to meet people — ${core}`,
};

export function getCompanionTransform(value) {
  return COMPANION_TRANSFORMS[value] ?? COMPANION_TRANSFORMS.alone;
}

function matchesPurposeOption(intent, option) {
  return (
    intent.mood === option.intent.mood &&
    (intent.tagPreference ?? null) === (option.intent.tagPreference ?? null)
  );
}

export function getSelectedPurpose(intent) {
  return PURPOSE_OPTIONS.find((option) => matchesPurposeOption(intent, option))?.label;
}

export function getPurposeSentence(intent) {
  return PURPOSE_OPTIONS.find((option) => matchesPurposeOption(intent, option))?.sentence ?? '';
}

export function getWhenSentence(intent, whenOptions = getWhenOptions()) {
  return whenOptions.find((option) => option.value === intent.when)?.sentence ?? '';
}

export function getDistanceSentence(intent) {
  return DISTANCE_OPTIONS.find((option) => option.value === intent.distance)?.sentence ?? '';
}

export function getBudgetSentence(intent) {
  return BUDGET_OPTIONS.find((option) => option.value === intent.budget)?.sentence ?? '';
}

export function getStepAnswerLabel(stepId, intent, whenOptions = getWhenOptions()) {
  switch (stepId) {
    case 'purpose':
      return getSelectedPurpose(intent) ?? '';
    case 'when':
      return whenOptions.find((option) => option.value === intent.when)?.label ?? '';
    case 'distance':
      return DISTANCE_OPTIONS.find((option) => option.value === intent.distance)?.label ?? '';
    case 'with':
      return COMPANION_OPTIONS.find((option) => option.value === intent.with)?.label ?? '';
    case 'budget':
      return BUDGET_OPTIONS.find((option) => option.value === intent.budget)?.label ?? '';
    default:
      return '';
  }
}

export const DISCOVERY_STEPS = [
  { id: 'purpose', question: 'What brings you here today?', icon: 'sparkles' },
  { id: 'when', question: 'When are you thinking?', icon: 'calendar' },
  { id: 'distance', question: 'How far would you happily go?', icon: 'map-pin' },
  { id: 'with', question: "Who's joining?", icon: 'users' },
  { id: 'budget', question: "What's the budget mood?", icon: 'wallet' },
];
