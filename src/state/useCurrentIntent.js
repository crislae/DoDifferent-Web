import { useState, useCallback, useEffect } from 'react';
import { defaultIntent } from '../services/matchingEngine';

/** User discovery intent — persisted in localStorage across visits. */

const STORAGE_KEY = 'doDifferent_intent';

function readIntent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultIntent;
    return { ...defaultIntent, ...JSON.parse(raw) };
  } catch {
    return defaultIntent;
  }
}

export function useCurrentIntent() {
  const [intent, setIntent] = useState(readIntent);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(intent));
  }, [intent]);

  const updateIntent = useCallback((key, value) => {
    setIntent((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setIntentFields = useCallback((fields) => {
    setIntent((prev) => ({ ...prev, ...fields }));
  }, []);

  const resetIntent = useCallback(() => {
    setIntent(defaultIntent);
  }, []);

  return {
    intent,
    updateIntent,
    setIntentFields,
    resetIntent,
  };
}
