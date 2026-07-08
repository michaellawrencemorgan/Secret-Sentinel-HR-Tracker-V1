import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface StripeCompleteProps {
  onNavigate: (path: string) => void;
}

export default function StripeComplete({ onNavigate }: StripeCompleteProps) {
  return (
    <div id="stripe-complete-view" className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 md:p-12 font-sans selection:bg-slate-900 selection:text-white">
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
          System: <span className="text-emerald-600 font-medium">Stripe Direct Deposit</span>
        </div>
      </header>

      {/* Main Success Card Grid Container */}
      <main className="max-w-md mx-auto w-full my-auto py-12">
        <div className="bg-white border border-slate-200 rounded-lg p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          {/* Subtle accent border line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          
          {/* Minimalist Checkmark */}
          <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100 animate-pulse">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>

          {/* Main Headers */}
          <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
            Bank Account Linked Successfully!
          </h1>
          
          <p className="text-slate-600 text-sm leading-relaxed mb-8 text-center max-w-sm">
            Your direct deposit information has been securely updated via Stripe Connect. You can now safely close this browser window and return to the Secret Sentinel application.
          </p>

          <div className="w-full border-t border-slate-100 pt-6 flex flex-col gap-3">
            <div className="bg-slate-50 rounded p-4 text-left border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-800">Sentinel Direct Deposit Active</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Your banking details are stored and encrypted directly on Stripe's server. Sentinel HR never sees or keeps your routing numbers.</p>
              </div>
            </div>

            <button
              id="return-to-login"
              onClick={() => onNavigate('/')}
              className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold px-4 py-2.5 rounded transition-all shadow-sm"
            >
              Go to Sentinel Portal
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
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
          <span>·</span>
          <a href="#" className="hover:text-slate-600">Stripe Agreement</a>
        </div>
      </footer>
    </div>
  );
}
