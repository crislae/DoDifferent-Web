import { DISCOVERY_STEPS } from './discoveryOptions';

/** Discovery step + matches-revealed flag: sessionStorage (per tab). Intent: localStorage (useCurrentIntent). */

export const DISCOVERY_PROGRESS_KEY = 'doDifferent_discovery_step';
export const MATCHES_REVEALED_KEY = 'doDifferent_matches_revealed';

export const COMPLETE_INTENT_STEPS = DISCOVERY_STEPS.length;

function readStorage(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // ignore quota / private mode
  }
}

function removeStorage(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Drop legacy localStorage progress so returning visitors don't skip the question flow. */
export function migrateDiscoveryStorage() {
  removeStorage(localStorage, DISCOVERY_PROGRESS_KEY);
}

export function readDiscoveryProgress() {
  migrateDiscoveryStorage();

  const raw = readStorage(sessionStorage, DISCOVERY_PROGRESS_KEY);
  const step = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(step)
    ? Math.min(Math.max(step, 0), DISCOVERY_STEPS.length)
    : 0;
}

export function saveDiscoveryProgress(step) {
  writeStorage(sessionStorage, DISCOVERY_PROGRESS_KEY, String(step));
}

export function resetDiscoveryProgress() {
  removeStorage(sessionStorage, DISCOVERY_PROGRESS_KEY);
  removeStorage(sessionStorage, MATCHES_REVEALED_KEY);
}

export function readMatchesRevealed() {
  return readStorage(sessionStorage, MATCHES_REVEALED_KEY) === '1';
}

export function saveMatchesRevealed() {
  writeStorage(sessionStorage, MATCHES_REVEALED_KEY, '1');
}
