import React, { useState, useEffect } from 'react';
import { Shield, Key, Mail, User, AlertCircle, Info, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (user: any, token: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sysConfig, setSysConfig] = useState<{ supabaseEnabled: boolean; supabaseUrl: string | null }>({
    supabaseEnabled: false,
    supabaseUrl: null,
  });

  const parseApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    const body = await response.text();
    if (body.trimStart().startsWith('<')) {
      throw new Error('The API server returned the web app instead of JSON. Deploy with Firebase App Hosting or another Node backend so /api routes reach server.ts.');
    }

    throw new Error(body || `Unexpected API response (${response.status}).`);
  };

  // Fetch the configuration to display the Database state banner (Local Mode vs Supabase Mode)
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setSysConfig(data))
      .catch((err) => console.error("Error loading config:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
    const body = isRegisterMode ? { email, password, name } : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token and call callback
      localStorage.setItem('sentinel_token', data.token);
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setIsRegisterMode(false);
    setError('');
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Left panel: Info banner / Branding */}
      <div className="w-full md:w-[42%] bg-slate-900 text-white p-8 md:p-16 flex flex-col justify-between border-r border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-white flex items-center justify-center text-slate-900">
            <Shield className="h-5 w-5 text-slate-900" />
          </div>
          <div>
            <h1 className="font-display font-bold tracking-tight text-xl leading-none">SENTINEL</h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-1">HR & PROFESSIONAL COMPLIANCE</p>
          </div>
        </div>

        <div className="my-12 md:my-0 max-w-sm">
          <div className="text-emerald-500 font-mono text-[11px] font-bold tracking-widest mb-3 uppercase">
            Protocol Active
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mb-4">
            Securing the agent network, starting with your onboarding.
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Welcome to the Sentinel Professional Onboarding Portal. Securely register as an active compliance agent, upload critical employment W-2 forms, and link direct deposit via automated Stripe Connect.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
            <div>
              <div className="text-[10px] text-slate-500 font-mono">ENCRYPTION</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">AES-256 Bit TLS</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono">COMPLIANCE</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">SOC2 & Stripe certified</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Database className="h-3.5 w-3.5 text-slate-500" />
          {sysConfig.supabaseEnabled ? (
            <span>Supabase Active: <span className="text-emerald-400 font-medium">Supabase Auth & Storage Connected</span></span>
          ) : (
            <span>Environment: <span className="text-amber-400 font-medium font-semibold">Local Sandbox Mode</span></span>
          )}
        </div>
      </div>

      {/* Right panel: Login & Signup Forms */}
      <div className="w-full md:w-[58%] bg-white p-8 md:p-24 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          
          {/* Database Banner Helper */}
          {!sysConfig.supabaseEnabled && (
            <div className="mb-8 p-3.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex gap-2.5 items-start">
              <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">⚡ Running in Sandbox Mode</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px]">
                  All database transactions, auth sessions, and document uploads are running on our secure Express backend state. Link a production database anytime by setting <code className="bg-slate-200 px-1 rounded">SUPABASE_URL</code> in AI Studio.
                </p>
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="mb-8">
            <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {isRegisterMode ? "Create Onboarding Account" : "Partner Credentials Verification"}
            </h3>
            <p className="text-slate-500 text-xs mt-1.5">
              {isRegisterMode 
                ? "Enter your details to initiate your personal Sentinel compliance checklist." 
                : "Secure gateway for authorized onboarding agents and system administrators."}
            </p>
          </div>

          {/* Alert Error Box */}
          {error && (
            <div className="mb-6 p-4 rounded bg-red-50 border border-red-100 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                  Full Legal Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. James Bond"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none rounded transition-all text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                Username (Email Address)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@sentinel.com"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none rounded transition-all text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none rounded transition-all text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold py-2.5 rounded transition-all flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying Credentials...
                </>
              ) : isRegisterMode ? (
                "Create Account & Start Onboarding"
              ) : (
                "Verify Credentials & Sign In"
              )}
            </button>
          </form>

          {/* Switch Auth Modes */}
          <div className="mt-6 text-center">
            <button
              id="toggle-auth-mode"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
              }}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors underline underline-offset-4"
            >
              {isRegisterMode 
                ? "Already have an account? Sign in here" 
                : "Need to start onboarding? Create an Agent account"}
            </button>
          </div>

          {/* Quick Credential Test Suite */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-400 block mb-3">
              DEMO GATEWAYS (PRE-SEEDED CREDENTIALS)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                id="seed-admin-btn"
                onClick={() => fillQuickCredentials("admin@sentinel.com", "admin123")}
                className="text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3 rounded transition-all"
              >
                <div className="text-[10px] font-mono font-bold text-slate-500">ROLE: HR ADMIN</div>
                <div className="text-xs font-semibold text-slate-800 mt-1">Victoria Vance</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">admin@sentinel.com / admin123</div>
              </button>

              <button
                id="seed-agent-btn"
                onClick={() => fillQuickCredentials("agent@sentinel.com", "agent123")}
                className="text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3 rounded transition-all"
              >
                <div className="text-[10px] font-mono font-bold text-slate-500">ROLE: ONBOARDING AGENT</div>
                <div className="text-xs font-semibold text-slate-800 mt-1">Ethan Hunt</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">agent@sentinel.com / agent123</div>
              </button>
            </div>
            
            <div className="mt-2 text-center text-[10px] text-slate-400 font-mono">
              Tip: You can also use registration above to create and test any dynamic user!
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
