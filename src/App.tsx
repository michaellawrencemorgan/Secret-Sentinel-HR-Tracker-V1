import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import StripeComplete from './components/StripeComplete';
import StripeRefresh from './components/StripeRefresh';
import { UserProfile } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Synchronize with popstate events for back/forward browser navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Client-side state routing function
  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  };

  // Check auth session on boot
  useEffect(() => {
    const storedToken = localStorage.getItem('sentinel_token');
    if (!storedToken) {
      setAppLoading(false);
      return;
    }

    async function checkSession() {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${storedToken}` }
        });
        const data = await response.json();
        if (response.ok && data.user) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem('sentinel_token');
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setAppLoading(false);
      }
    }

    checkSession();
  }, []);

  const handleLoginSuccess = (loggedInUser: UserProfile, sessionToken: string) => {
    setUser(loggedInUser);
    setToken(sessionToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('sentinel_token');
    setUser(null);
    setToken(null);
    navigate('/');
  };

  // Render spinner when establishing initial session
  if (appLoading) {
    return (
      <div id="boot-loader" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="h-8 w-8 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin mb-4" />
        <span className="text-xs text-slate-500 font-mono">Verifying Sentinel Security Cryptography...</span>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // ROUTING RENDER LOGIC
  // ------------------------------------------------------------------

  // 1. Stripe Onboarding Success Route
  if (currentPath === '/onboarding-complete') {
    return <StripeComplete onNavigate={navigate} />;
  }

  // 2. Stripe Onboarding Session Expired/Refresh Route
  if (currentPath === '/onboarding-refresh') {
    return <StripeRefresh onNavigate={navigate} />;
  }

  // 3. Primary Portal Routing (Default / Root or any dashboard fallback)
  if (!user || !token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Authenticated flows
  if (user.role === 'admin') {
    return (
      <AdminDashboard 
        user={user} 
        token={token} 
        onLogout={handleLogout} 
        onNavigate={navigate} 
      />
    );
  }

  // Default agent view
  return (
    <AgentDashboard 
      user={user} 
      token={token} 
      onLogout={handleLogout} 
      onNavigate={navigate} 
    />
  );
}
