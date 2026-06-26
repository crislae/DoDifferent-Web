import { useAppRoute } from './hooks/useAppRoute';
import { ROUTES } from './utils/appRoute';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import PartnerPage from './pages/PartnerPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

export default function App() {
  const path = useAppRoute();

  switch (path) {
    case ROUTES.contact:
      return <ContactPage />;
    case ROUTES.partner:
      return <PartnerPage />;
    case ROUTES.privacy:
      return <PrivacyPage />;
    case ROUTES.terms:
      return <TermsPage />;
    default:
      return <HomePage />;
  }
}
