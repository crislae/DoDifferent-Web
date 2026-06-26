import { useSyncExternalStore } from 'react';
import { getPathname, subscribeToRoute } from '../utils/appRoute';

export function useAppRoute() {
  return useSyncExternalStore(subscribeToRoute, getPathname, getPathname);
}
