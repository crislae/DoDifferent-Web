import {
  getPurposeSentence,
  getWhenSentence,
  getDistanceSentence,
  getCompanionTransform,
  getBudgetSentence,
} from './discoveryOptions';

function applyCompanion(companionValue, coreSentence) {
  const transform = getCompanionTransform(companionValue);
  return transform ? transform(coreSentence) : coreSentence;
}

function appendAnd(sentence, clause) {
  if (!clause) return sentence;
  return `${sentence} and ${clause}`;
}

export function buildDiscoverySentence(intent, whenOptions, answeredCount) {
  if (answeredCount < 1) return '';

  const purpose = getPurposeSentence(intent);
  if (!purpose) return '';
  if (answeredCount < 2) return purpose;

  const whenPart = getWhenSentence(intent, whenOptions);
  let sentence = whenPart ? `${purpose} ${whenPart}` : purpose;
  if (answeredCount < 3) return sentence;

  sentence = appendAnd(sentence, getDistanceSentence(intent));
  if (answeredCount < 4) return sentence;

  sentence = applyCompanion(intent.with, sentence);
  if (answeredCount < 5) return sentence;

  return appendAnd(sentence, getBudgetSentence(intent));
}
