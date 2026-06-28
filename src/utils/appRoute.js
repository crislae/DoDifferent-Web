export const ROUTES = {
  home: '/',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms',
  partner: '/partner',
};

const RETURN_SECTION_KEY = 'doDifferentReturnSection';

export function getPathname() {
  return window.location.pathname || ROUTES.home;
}

export function subscribeToRoute(listener) {
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
}

export function setReturnSection(sectionId) {
  if (sectionId) {
    sessionStorage.setItem(RETURN_SECTION_KEY, sectionId);
  }
}

export function consumeReturnSection() {
  const value = sessionStorage.getItem(RETURN_SECTION_KEY);
  sessionStorage.removeItem(RETURN_SECTION_KEY);
  return value || null;
}

export function navigate(path, { returnSection } = {}) {
  const nextPath = path || ROUTES.home;
  if (returnSection) {
    setReturnSection(returnSection);
  }
  if (window.location.pathname === nextPath) return;
  window.history.pushState({}, '', nextPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function navigateToStaticPage(path, returnSection) {
  navigate(path, { returnSection });
}

export function navigateHome() {
  navigate(ROUTES.home);
}
