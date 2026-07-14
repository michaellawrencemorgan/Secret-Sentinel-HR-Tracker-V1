import GuardTrackerDashboard from './components/GuardTrackerDashboard';
import LandingPage from './components/LandingPage';
import { ClassificationsPage, TermsAndConditionsPage } from './components/LegalPages';

export default function App() {
  if (window.location.pathname === '/tracker') {
    return <GuardTrackerDashboard />;
  }

  if (window.location.pathname === '/termsandconditions') {
    return <TermsAndConditionsPage />;
  }

  if (window.location.pathname === '/classifications') {
    return <ClassificationsPage />;
  }

  return <LandingPage />;
}
