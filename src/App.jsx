import { Analytics } from '@vercel/analytics/react';
import { useAppRoute } from './hooks/useAppRoute';
import { ROUTES } from './utils/appRoute';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import PartnerPage from './pages/PartnerPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  const path = useAppRoute();

  let page;
  switch (path) {
    case ROUTES.contact:
      page = <ContactPage />;
      break;
    case ROUTES.partner:
      page = <PartnerPage />;
      break;
    case ROUTES.privacy:
      page = <PrivacyPage />;
      break;
    case ROUTES.terms:
      page = <TermsPage />;
      break;
    default:
      page = <HomePage />;
  }

  return (
    <>
      {page}
      <Analytics mode="production" />
    </>
  );
}
