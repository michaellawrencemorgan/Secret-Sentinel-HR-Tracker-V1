import GuardTrackerDashboard from './components/GuardTrackerDashboard';
import LandingPage from './components/LandingPage';

export default function App() {
  if (window.location.pathname === '/tracker') {
    return <GuardTrackerDashboard />;
  }

  return <LandingPage />;
}
