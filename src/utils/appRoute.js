export const ROUTES = {
  home: '/',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  partner: '/partner',
};

export function getPathname() {
  return window.location.pathname || ROUTES.home;
}

export function subscribeToRoute(listener) {
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
}

export function navigate(path) {
  const nextPath = path || ROUTES.home;
  if (window.location.pathname === nextPath) return;
  window.history.pushState({}, '', nextPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
