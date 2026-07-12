import React, { useEffect } from 'react';
import { AlertCircle, ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';

interface StripeRefreshProps {
  onNavigate: (path: string) => void;
}

const APP_DEEP_LINK = 'secretsentinel://stripe/onboarding-refresh';

export default function StripeRefresh({ onNavigate }: StripeRefreshProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = APP_DEEP_LINK;
    }, 700);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

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
          System: <span className="text-amber-600 font-semibold">Stripe Session Manager</span>
        </div>
      </header>

      {/* Main Refresh State */}
      <main className="max-w-md mx-auto w-full my-auto py-12">
        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

          <div className="h-14 w-14 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100">
            <RefreshCw className="h-7 w-7 text-amber-600 animate-spin" />
          </div>
          <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-3">
            Stripe Session Expired
          </h1>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
            This secure onboarding link needs to be refreshed. Return to the Secret Sentinel app so a fresh Stripe Connect link can be generated for you.
          </p>

          <div className="mt-8 border-t border-slate-100 pt-6 w-full flex flex-col gap-3">
            <a
              id="return-to-app"
              href={APP_DEEP_LINK}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded transition-all"
            >
              Open Secret Sentinel App
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              id="back-to-login-btn"
              onClick={() => onNavigate('/')}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue on Web Portal
            </button>

            <div className="bg-amber-50 rounded p-4 text-left border border-amber-100 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                No banking status has been changed. The app must request a new Stripe link before onboarding can continue.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-7xl mx-auto w-full border-t border-slate-200/60 pt-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-mono">
        <div>© 2026 Sentinel HR & Compliance. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-600">Compliance Protocols</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
