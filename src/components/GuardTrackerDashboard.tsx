import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  Circle,
  LockKeyhole,
  LogOut,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { OnboardingStatus, UserProfile } from '../types';

const AGENT_SPECIALIZATIONS = [
  'Discreet Escort',
  'Sober Companion',
  'Sober Transport',
  'Recovery Coach',
  'De-escalation Support',
  'Mental Health Support',
  'Medical Response',
  'High-Risk Transport',
  'Executive Support',
  'Residential Companion',
  'Event Support',
];

const VERIFIED_CREDENTIALS = [
  'CA Guard Card',
  'CA CCW Permit',
  'BSIS Exposed Firearm Permit',
  'Chemical/Tear Gas Cert',
  'Baton Permit',
  'Certified Sober Companion / Recovery Coach',
  'RADT / CADC',
  'De-escalation / Social-Emotional Specialist',
  'Mental Health First Aid (MHFA)',
  'Narcan/Naloxone Certified',
  'CPR / AED / First Aid',
  'EMT / Paramedic',
  'Taser / CEW Certification',
  'Defensive Tactics / Combatives',
  'Evasive / Defensive Driving',
  'Prior Law Enforcement (LEO)',
  'Military Veteran',
  'Executive Protection (EP) Graduate',
  'Background Check',
];

const STATUS_FILTERS: Array<'All' | OnboardingStatus> = ['All', 'Not Started', 'In Progress', 'Complete'];

const emptyAgent: UserProfile = {
  id: '',
  email: '',
  name: '',
  role: 'agent',
  status: 'Not Started',
  stripeLinked: false,
  createdAt: new Date().toISOString(),
  rating: 0,
  notes: '',
  agentSpecializations: [],
  verifiedCredentials: [],
  phone: '',
  active: true,
};

function statusClass(status: OnboardingStatus) {
  if (status === 'Complete') return 'border-teal-200 bg-teal-50 text-teal-700';
  if (status === 'In Progress') return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-slate-200 bg-slate-100 text-slate-600';
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function RatingStars({
  value,
  onChange,
  readonly = false,
  size = 'sm',
}: {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}) {
  const iconSize = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= value;
        const IconButton = readonly ? 'span' : 'button';
        return (
          <IconButton
            key={star}
            type={readonly ? undefined : 'button'}
            onClick={readonly ? undefined : () => onChange?.(star)}
            className={readonly ? 'inline-flex' : 'inline-flex rounded p-1 hover:bg-amber-50'}
            aria-label={readonly ? undefined : `Set rating to ${star}`}
          >
            <Star className={`${iconSize} ${isActive ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
          </IconButton>
        );
      })}
    </div>
  );
}

function Chip({
  children,
  selected = false,
  tone = 'slate',
  onClick,
}: {
  key?: React.Key;
  children: React.ReactNode;
  selected?: boolean;
  tone?: 'slate' | 'emerald';
  onClick?: () => void;
}) {
  const selectedClass =
    tone === 'emerald'
      ? 'border-teal-700 bg-teal-700 text-white'
      : 'border-[#315963] bg-[#315963] text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-8 max-w-full items-center gap-1 rounded border px-2.5 text-[11px] font-semibold transition ${
        selected ? selectedClass : 'border-slate-200 bg-white text-slate-600 hover:border-[#315963] hover:text-[#24464f]'
      }`}
    >
      {selected && <Check className="h-3 w-3 shrink-0" />}
      <span className="truncate">{children}</span>
    </button>
  );
}

function makeEmptyAgent(): UserProfile {
  return {
    ...emptyAgent,
    createdAt: new Date().toISOString(),
  };
}

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  const body = await response.text();
  if (body.trimStart().startsWith('<')) {
    throw new Error('The API server returned the web app instead of JSON. Deploy with Firebase App Hosting or another Node backend so /api routes reach server.ts.');
  }

  throw new Error(body || `Unexpected API response (${response.status}).`);
}

export default function GuardTrackerDashboard() {
  const [adminUser, setAdminUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [agents, setAgents] = useState<UserProfile[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState<UserProfile>(emptyAgent);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [credentialFilter, setCredentialFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | OnboardingStatus>('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState('');

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedId) || null,
    [agents, selectedId],
  );

  const loadAgents = async () => {
    if (!token) return;
    setLoading(true);
    setNotice('');
    try {
      const response = await fetch('/api/agents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(data.error || 'Unable to load agent profiles.');
      }
      const nextAgents = data.agents || [];
      setAgents(nextAgents);
      const nextSelected = nextAgents.find((agent: UserProfile) => agent.id === selectedId) || nextAgents[0];
      if (nextSelected) {
        setSelectedId(nextSelected.id);
        setDraft(nextSelected);
        setIsCreatingAgent(false);
      }
    } catch (error) {
      setNotice('Unable to load agent profiles. Please refresh the app.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('sentinel_tracker_token');
    if (!storedToken) {
      setAuthLoading(false);
      setLoading(false);
      return;
    }

    async function checkSession() {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        const data = await parseApiResponse(response);
        if (response.ok && data.user?.role === 'admin') {
          setToken(storedToken);
          setAdminUser(data.user);
        } else {
          localStorage.removeItem('sentinel_tracker_token');
        }
      } catch (error) {
        localStorage.removeItem('sentinel_tracker_token');
      } finally {
        setAuthLoading(false);
      }
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (token) {
      loadAgents();
    }
  }, [token]);

  useEffect(() => {
    if (selectedAgent) {
      setDraft(selectedAgent);
      setIsCreatingAgent(false);
      setConfirmDelete(false);
    }
  }, [selectedAgent]);

  const filteredAgents = agents.filter((agent) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      agent.name.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query);
    const matchesSpecialization =
      specializationFilter === 'All' || agent.agentSpecializations.includes(specializationFilter);
    const matchesCredential =
      credentialFilter === 'All' || agent.verifiedCredentials.includes(credentialFilter);
    const matchesStatus = statusFilter === 'All' || agent.status === statusFilter;
    const matchesRating = ratingFilter === 0 || agent.rating >= ratingFilter;

    return matchesSearch && matchesSpecialization && matchesCredential && matchesStatus && matchesRating;
  });

  const activeCount = agents.filter((agent) => agent.active).length;
  const averageRating = agents.length
    ? (agents.reduce((total, agent) => total + agent.rating, 0) / agents.length).toFixed(1)
    : '0.0';
  const completedCount = agents.filter((agent) => agent.status === 'Complete').length;
  const selectedCredentialCount = draft.verifiedCredentials.length;

  const toggleDraftListValue = (field: 'agentSpecializations' | 'verifiedCredentials', value: string) => {
    setDraft((current) => {
      const list = current[field];
      const nextList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...current, [field]: nextList };
    });
  };

  const loginAdmin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in.');
      }
      if (data.user.role !== 'admin') {
        throw new Error('This tracker is restricted to administrator accounts.');
      }

      localStorage.setItem('sentinel_tracker_token', data.token);
      setToken(data.token);
      setAdminUser(data.user);
    } catch (error: any) {
      setLoginError(error.message || 'Unable to sign in.');
    } finally {
      setLoginLoading(false);
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('sentinel_tracker_token');
    setAdminUser(null);
    setToken('');
    setAgents([]);
    setSelectedId('');
    setDraft(makeEmptyAgent());
    setIsCreatingAgent(false);
  };

  const startNewAgent = () => {
    setSelectedId('');
    setDraft(makeEmptyAgent());
    setIsCreatingAgent(true);
    setNotice('');
    setConfirmDelete(false);
  };

  const saveProfile = async () => {
    if (!token) return;
    setSaving(true);
    setNotice('');
    try {
      const isNewAgent = !draft.id;
      const response = await fetch(isNewAgent ? '/api/agents' : `/api/agents/${draft.id}`, {
        method: isNewAgent ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          phone: draft.phone,
          status: draft.status,
          rating: draft.rating,
          notes: draft.notes,
          agentSpecializations: draft.agentSpecializations,
          verifiedCredentials: draft.verifiedCredentials,
          active: draft.active,
        }),
      });
      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save profile.');
      }

      setAgents((current) => {
        if (isNewAgent) return [data.agent, ...current];
        return current.map((agent) => (agent.id === data.agent.id ? data.agent : agent));
      });
      setSelectedId(data.agent.id);
      setDraft(data.agent);
      setIsCreatingAgent(false);
      setConfirmDelete(false);
      setNotice(`${data.agent.name}'s profile was ${isNewAgent ? 'created' : 'updated'}.`);
    } catch (error: any) {
      setNotice(error.message || 'Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async () => {
    if (!token || !draft.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setNotice('Click Delete agent again to confirm removal.');
      return;
    }

    setDeleting(true);
    setNotice('');
    try {
      const response = await fetch(`/api/agents/${draft.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await parseApiResponse(response);
      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete profile.');
      }

      setAgents((current) => {
        const nextAgents = current.filter((agent) => agent.id !== data.deletedAgentId);
        const nextSelected = nextAgents[0] || null;
        setSelectedId(nextSelected?.id || '');
        setDraft(nextSelected || makeEmptyAgent());
        setIsCreatingAgent(false);
        return nextAgents;
      });
      setConfirmDelete(false);
      setNotice('Agent profile was deleted.');
    } catch (error: any) {
      setNotice(error.message || 'Unable to delete profile.');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef3f2] font-sans text-slate-700">
        <div className="rounded border border-slate-200 bg-white px-5 py-4 text-sm font-semibold shadow-sm">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!adminUser || !token) {
    return (
      <div className="min-h-screen bg-[#eef3f2] font-sans text-slate-950">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="grid w-full overflow-hidden rounded border border-slate-200 bg-white shadow-xl md:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[#24464f] p-8 text-white md:p-10">
              <a
                href="/"
                className="mb-10 inline-flex h-9 w-9 items-center justify-center rounded bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Back to landing page"
              >
                <ChevronLeft className="h-4 w-4" />
              </a>
              <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-[#24464f]">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Admin access required</h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-teal-50/80">
                The agent tracker contains internal ratings, notes, and verified credential records. Sign in with a Sentinel administrator account to continue.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded border border-white/15 bg-white/10 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-teal-100/70">Protected</div>
                  <div className="mt-1 font-bold">Agent records</div>
                </div>
                <div className="rounded border border-white/15 bg-white/10 p-3">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-teal-100/70">Role</div>
                  <div className="mt-1 font-bold">Admin only</div>
                </div>
              </div>
            </div>

            <form onSubmit={loginAdmin} className="p-8 md:p-10">
              <div className="mb-8">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Sentinel tracker
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">Sign in</h2>
                <p className="mt-2 text-sm text-slate-500">Enter your administrator credentials to continue.</p>
              </div>

              {loginError && (
                <div className="mb-4 rounded border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {loginError}
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-600">
                  Email
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="username"
                    className="mt-1 h-11 w-full rounded border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-[#24464f]"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-600">
                  Password
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="mt-1 h-11 w-full rounded border border-slate-200 px-3 text-sm font-normal outline-none transition focus:border-[#24464f]"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded bg-[#24464f] px-4 text-sm font-bold text-white transition hover:bg-[#1d3941] disabled:bg-slate-300"
              >
                {loginLoading ? 'Signing in...' : 'Open tracker'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3f2] font-sans text-slate-950 selection:bg-[#24464f] selection:text-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1480px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#24464f] text-white transition hover:bg-[#1d3941]"
              aria-label="Back to landing page"
            >
              <ChevronLeft className="h-4 w-4" />
            </a>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Sentinel Agent Tracker</h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Internal profile intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600 sm:flex">
              <Circle className="h-2 w-2 fill-teal-500 text-teal-500" />
              {activeCount} active
            </div>
            <button
              type="button"
              onClick={startNewAgent}
              className="inline-flex h-9 items-center gap-2 rounded bg-[#24464f] px-3 text-xs font-semibold text-white transition hover:bg-[#1d3941]"
            >
              <Plus className="h-4 w-4" />
              New agent
            </button>
            <button
              type="button"
              onClick={loadAgents}
              className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1480px] gap-4 px-4 py-4 md:px-6 lg:grid-cols-[390px_1fr]">
        <section className="flex min-h-[calc(100vh-88px)] flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Agents</span>
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 text-xl font-bold">{agents.length}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Ready</span>
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 text-xl font-bold">{completedCount}</div>
              </div>
              <div className="rounded border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider">Rating</span>
                  <Star className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1 text-xl font-bold">{averageRating}</div>
              </div>
            </div>

            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search agents"
                className="h-10 w-full rounded border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#24464f]"
              />
            </label>
          </div>

          <div className="border-b border-slate-100 p-4">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter roster
            </div>
            <div className="grid gap-2">
              <select
                value={specializationFilter}
                onChange={(event) => setSpecializationFilter(event.target.value)}
                className="h-9 rounded border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-[#24464f]"
              >
                <option value="All">All specializations</option>
                {AGENT_SPECIALIZATIONS.map((specialization) => (
                  <option key={specialization}>{specialization}</option>
                ))}
              </select>
              <select
                value={credentialFilter}
                onChange={(event) => setCredentialFilter(event.target.value)}
                className="h-9 rounded border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-[#24464f]"
              >
                <option value="All">All credentials</option>
                {VERIFIED_CREDENTIALS.map((credential) => (
                  <option key={credential}>{credential}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as 'All' | OnboardingStatus)}
                  className="h-9 rounded border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-[#24464f]"
                >
                  {STATUS_FILTERS.map((status) => (
                    <option key={status}>{status === 'All' ? 'All statuses' : status}</option>
                  ))}
                </select>
                <select
                  value={ratingFilter}
                  onChange={(event) => setRatingFilter(Number(event.target.value))}
                  className="h-9 rounded border border-slate-200 bg-white px-3 text-xs outline-none transition focus:border-[#24464f]"
                >
                  <option value={0}>Any rating</option>
                  <option value={5}>5 stars</option>
                  <option value={4}>4+ stars</option>
                  <option value={3}>3+ stars</option>
                  <option value={2}>2+ stars</option>
                  <option value={1}>1+ stars</option>
                </select>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex h-64 items-center justify-center text-xs font-semibold text-slate-500">
                Loading agent roster...
              </div>
            ) : filteredAgents.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center px-8 text-center">
                <Search className="h-8 w-8 text-slate-300" />
                <h2 className="mt-3 text-sm font-bold">No matching agents</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Clear a filter or search a broader specialization.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAgents.map((agent) => (
                  <button
                    type="button"
                    key={agent.id}
                    onClick={() => setSelectedId(agent.id)}
                    className={`block w-full px-4 py-3 text-left transition hover:bg-teal-50/50 ${
                      selectedId === agent.id && !isCreatingAgent ? 'bg-teal-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#24464f] text-xs font-bold text-white">
                      {initials(agent.name) || 'NA'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="truncate text-sm font-bold text-slate-950">{agent.name}</div>
                          <span className={`shrink-0 rounded border px-2 py-0.5 text-[9px] font-bold ${statusClass(agent.status)}`}>
                            {agent.status}
                          </span>
                        </div>
                        <div className="mt-1 truncate font-mono text-[11px] text-slate-400">{agent.email}</div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <RatingStars value={agent.rating} readonly />
                          <span className="text-[10px] font-semibold text-slate-500">
                            {agent.verifiedCredentials.length} credentials
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {agent.agentSpecializations.slice(0, 2).map((specialization) => (
                            <span key={specialization} className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                              {specialization}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="min-h-[calc(100vh-88px)] overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
          {draft.id || isCreatingAgent ? (
            <div className="flex h-full flex-col">
              <div className="border-b border-teal-100 bg-[#f8fbfa] p-5 text-slate-950">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-[#24464f] text-lg font-bold text-white">
                      {initials(draft.name) || 'NA'}
                    </div>
                    <div>
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-700">Profile workspace</div>
                      <h2 className="mt-1 font-display text-3xl font-bold tracking-tight">
                        {draft.name || 'New agent profile'}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          {draft.email || 'Email pending'}
                        </span>
                        {draft.phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            {draft.phone}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          {selectedCredentialCount} verified credentials
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isCreatingAgent ? (
                      <span className="rounded border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                        New profile
                      </span>
                    ) : (
                      <span className={`rounded border px-2.5 py-1 text-[10px] font-bold ${statusClass(draft.status)}`}>
                        {draft.status}
                      </span>
                    )}
                    <span className={`rounded border px-2.5 py-1 text-[10px] font-bold ${
                      draft.active
                        ? 'border-teal-200 bg-teal-50 text-teal-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}>
                      {draft.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {notice && (
                <div className="border-b border-teal-100 bg-teal-50 px-5 py-3 text-xs font-semibold text-teal-800">
                  {notice}
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                  <div className="space-y-5">
                    <div className="rounded border border-slate-200 bg-white">
                      <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold">Core profile</h3>
                      </div>
                      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
                        <label className="text-xs font-semibold text-slate-600">
                          Name
                          <input
                            value={draft.name}
                            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                            className="mt-1 h-10 w-full rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#24464f]"
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600">
                          Email
                          <input
                            value={draft.email}
                            onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                            className="mt-1 h-10 w-full rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#24464f]"
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600">
                          Phone
                          <input
                            value={draft.phone || ''}
                            onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
                            className="mt-1 h-10 w-full rounded border border-slate-200 px-3 text-sm font-normal outline-none focus:border-[#24464f]"
                          />
                        </label>
                        <label className="text-xs font-semibold text-slate-600">
                          Status
                          <select
                            value={draft.status}
                            onChange={(event) => setDraft({ ...draft, status: event.target.value as OnboardingStatus })}
                            className="mt-1 h-10 w-full rounded border border-slate-200 bg-white px-3 text-sm font-normal outline-none focus:border-[#24464f]"
                          >
                            {STATUS_FILTERS.filter((status) => status !== 'All').map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </label>
                        <label className="flex h-10 items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700">
                          Active agent
                          <input
                            type="checkbox"
                            checked={draft.active}
                            onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
                            className="h-4 w-4 accent-[#24464f]"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="rounded border border-slate-200 bg-white">
                      <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold">Manager rating</h3>
                      </div>
                      <div className="p-4">
                        <RatingStars value={draft.rating} onChange={(rating) => setDraft({ ...draft, rating })} size="md" />
                        <div className="mt-2 text-xs text-slate-500">
                          {draft.rating || 0} of 5 based on internal manager review.
                        </div>
                      </div>
                    </div>

                    <label className="block rounded border border-slate-200 bg-white">
                      <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold">Manager notes</h3>
                      </div>
                      <textarea
                        value={draft.notes}
                        onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                        rows={8}
                        className="block w-full resize-none rounded-b border-0 p-4 text-sm leading-6 outline-none"
                      />
                    </label>
                  </div>

                  <div className="space-y-5">
                    <div className="rounded border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold">Agent specializations</h3>
                        <Shield className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="flex flex-wrap gap-2 p-4">
                        {AGENT_SPECIALIZATIONS.map((specialization) => (
                          <Chip
                            key={specialization}
                            selected={draft.agentSpecializations.includes(specialization)}
                            onClick={() => toggleDraftListValue('agentSpecializations', specialization)}
                          >
                            {specialization}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    <div className="rounded border border-slate-200 bg-white">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-bold">Verified credentials</h3>
                        <BadgeCheck className="h-4 w-4 text-slate-400" />
                      </div>
                      <div className="flex max-h-[360px] flex-wrap gap-2 overflow-y-auto p-4">
                        {VERIFIED_CREDENTIALS.map((credential) => (
                          <Chip
                            key={credential}
                            selected={draft.verifiedCredentials.includes(credential)}
                            tone="emerald"
                            onClick={() => toggleDraftListValue('verifiedCredentials', credential)}
                          >
                            {credential}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-slate-500">
                  {draft.id
                    ? 'Changes save to the current in-memory server session.'
                    : 'Create a new profile with at least a name and email.'}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  {draft.id && (
                    <button
                      type="button"
                      onClick={deleteProfile}
                      disabled={deleting || saving}
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded border px-4 text-sm font-bold transition disabled:opacity-50 ${
                        confirmDelete
                          ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
                          : 'border-red-200 bg-white text-red-700 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleting ? 'Deleting...' : confirmDelete ? 'Confirm delete' : 'Delete agent'}
                    </button>
                  )}
                  {confirmDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDelete(false);
                        setNotice('');
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                  {isCreatingAgent && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextSelected = agents[0] || null;
                        setSelectedId(nextSelected?.id || '');
                        setDraft(nextSelected || makeEmptyAgent());
                        setIsCreatingAgent(false);
                        setNotice('');
                      }}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={saving || deleting}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#24464f] px-4 text-sm font-bold text-white transition hover:bg-[#1d3941] disabled:bg-slate-300"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving profile...' : draft.id ? 'Save profile' : 'Create agent'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-96 items-center justify-center text-center text-sm text-slate-500">
              Select an agent to review profile details.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
