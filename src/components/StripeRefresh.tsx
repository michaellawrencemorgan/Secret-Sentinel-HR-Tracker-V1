import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';

interface StripeRefreshProps {
  onNavigate: (path: string) => void;
}

export default function StripeRefresh({ onNavigate }: StripeRefreshProps) {
  const [status, setStatus] = useState<'refreshing' | 'redirecting' | 'failed'>('refreshing');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Commented placeholder hook requested to hit our server backend, 
  // re-request a tokenized Stripe Connect URL, and automatically redirect the user.
  /*
  useEffect(() => {
    async function refreshStripeSession() {
      try {
        const token = localStorage.getItem('sentinel_token');
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch('/api/stripe/refresh-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to refresh Stripe session.");
        }

        const { stripeConnectUrl } = await response.json();
        
        // Auto-redirect user to the fresh tokenized Stripe onboarding session
        window.location.href = stripeConnectUrl;
        
      } catch (err: any) {
        console.error("Stripe Refresh Error:", err);
        setStatus('failed');
        setErrorMessage(err.message || "Unable to renew your Stripe onboarding link.");
      }
    }

    refreshStripeSession();
  }, []);
  */

  // 2. Demo Simulation Auto-flow: Show dynamic progress and simulate success and auto-navigation
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      setStatus('redirecting');
    }, 2000);

    const redirectTimer = setTimeout(() => {
      // Post-linking simulation (since user is on the refresh page, let's auto-complete)
      // Save link status locally
      const token = localStorage.getItem('sentinel_token');
      if (token) {
        fetch('/api/agents/stripe-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(err => console.error("Simulated API Error:", err));
      }
      onNavigate('/onboarding-complete');
    }, 4500);

    return () => {
      clearTimeout(refreshTimer);
      clearTimeout(redirectTimer);
    };
  }, [onNavigate]);

  return (
    <div id="stripe-refresh-view" className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 md:p-12 font-sans">
      {/* Top Header Row */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded bg-slate-900 flex items-center justify-center">
            <span className="font-display font-bold text-white text-base">S</span>
          </div>
          <span className="font-display font-semibold text-slate-900 tracking-tight text-lg">SENTINEL</span>
          <span className="text-[10px] bg-slate-200/60 text-slate-600 font-mono font-medium px-2 py-0.5 rounded tracking-wider">SECURE</span>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          System: <span className="text-amber-600 font-medium font-semibold">Stripe Session Manager</span>
        </div>
      </header>

      {/* Main Refresh Loading / Simulation State */}
      <main className="max-w-md mx-auto w-full my-auto py-12">
        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

          {status === 'refreshing' && (
            <>
              <div className="h-14 w-14 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
                <Loader2 className="h-7 w-7 text-amber-600 animate-spin" />
              </div>
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-3">
                Refreshing secure onboarding...
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                Your Stripe Connect session token expired. We are securely communicating with Stripe servers to generate a fresh onboarding link...
              </p>
            </>
          )}

          {status === 'redirecting' && (
            <>
              <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin" />
              </div>
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-3">
                Session Renewed!
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                A fresh onboarding token was successfully returned. Redirecting you to Stripe Connect direct deposit portal...
              </p>
              <div className="mt-4 w-full bg-slate-100 h-1 rounded overflow-hidden">
                <div className="bg-emerald-600 h-full rounded animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-3">
                Refresh Failed
              </h1>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs mb-6">
                {errorMessage || "We encountered an issue re-requesting your direct deposit session. Please log in again to resolve this."}
              </p>
              <button
                id="back-to-login-btn"
                onClick={() => onNavigate('/')}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Login
              </button>
            </>
          )}

          {/* Dynamic Interactive Bypass for Testing */}
          <div className="mt-8 border-t border-slate-100 pt-6 w-full text-left">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">Simulation controls</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                id="skip-to-success"
                onClick={() => onNavigate('/onboarding-complete')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded font-mono border border-slate-200"
              >
                ⏩ Skip to Success Link
              </button>
              <button
                id="simulate-fail"
                onClick={() => {
                  setStatus('failed');
                  setErrorMessage('Stripe API returned: Connect Account status "pending_requirements". Unable to issue fresh onboarding session.');
                }}
                className="text-[10px] bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1.5 rounded font-mono border border-red-100"
              >
                ⚠️ Test Expired Fail
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-7xl mx-auto w-full border-t border-slate-200/60 pt-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-mono">
        <div>© 2026 Sentinel HR & Compliance. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600">Security Protocols</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
