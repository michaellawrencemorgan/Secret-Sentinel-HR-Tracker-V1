import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CheckCircle2,
  Clock3,
  Headphones,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Navigation,
  Radar,
  Shield,
  ShieldAlert,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';

const missionStats = [
  { label: 'Agent ETA', value: '6-9 min' },
  { label: 'Live status', value: 'Tracking' },
  { label: 'Mission zone', value: 'Secure' },
];

const features = [
  {
    icon: Radar,
    title: 'Real-time geofencing',
    text: 'Create secure mission zones, monitor entry and exit activity, and keep every protection detail aware of location changes.',
  },
  {
    icon: ShieldAlert,
    title: 'Panic response',
    text: 'Clients can trigger urgent support while dispatch teams see the live context they need to coordinate the next move.',
  },
  {
    icon: MessageCircle,
    title: 'Agent communication',
    text: 'Keep clients, agents, and operations connected with mission chat, voice calls, and status updates in one workflow.',
  },
  {
    icon: BadgeCheck,
    title: 'Compliance onboarding',
    text: 'Verify agents, collect employment documents, and connect payouts before assigning personnel to active missions.',
  },
];

const workflow = [
  'Book or schedule a discreet protection mission.',
  'Match with a vetted agent and confirm route details.',
  'Track arrivals, geofence status, and live mission updates.',
  'Review completed missions, documents, and agent history.',
];

export default function LandingPage() {
  return (
    <div id="landing-page" className="min-h-screen bg-[#f8fafc] text-slate-950 font-sans selection:bg-slate-950 selection:text-white">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Sentinel home">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-950 text-white">
              <Shield className="h-5 w-5" />
            </span>
            <span className="text-left">
              <span className="block font-display text-lg font-bold leading-none tracking-tight">SENTINEL</span>
              <span className="mt-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">Protection Network</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-xs font-semibold text-slate-600 md:flex">
            <a href="#platform" className="hover:text-slate-950">Platform</a>
            <a href="#operations" className="hover:text-slate-950">Operations</a>
            <a href="#agents" className="hover:text-slate-950">Agents</a>
          </nav>

          <a
            href="/tracker"
            className="inline-flex items-center gap-2 rounded bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            Agent tracker
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 opacity-70">
            <div className="h-full w-full bg-[radial-gradient(circle_at_18%_25%,rgba(20,184,166,0.24),transparent_28%),linear-gradient(135deg,rgba(15,23,42,1),rgba(2,6,23,0.94)_46%,rgba(20,83,45,0.8))]" />
          </div>
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:py-20 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="flex flex-col justify-center"
            >
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                <Zap className="h-3.5 w-3.5 text-emerald-300" />
                Live protection, dispatch, and compliance
              </div>
              <h1 className="font-display text-5xl font-bold leading-[0.96] tracking-tight text-white md:text-6xl lg:text-7xl">
                Sentinel
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 md:text-lg">
                A compliant agent coordination system for real-time location awareness, emergency response support, mission zones, and professional onboarding.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#operations"
                  className="inline-flex items-center justify-center gap-2 rounded bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  See how it works
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#platform"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Explore platform
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
              className="min-h-[430px]"
            >
              <div className="relative h-full min-h-[430px] overflow-hidden rounded border border-white/15 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
                <div className="absolute left-[9%] top-[16%] h-44 w-44 rounded-full border border-emerald-300/40 bg-emerald-300/10" />
                <div className="absolute left-[18%] top-[27%] h-16 w-16 rounded-full border border-emerald-200/50 bg-emerald-300/15" />
                <div className="absolute right-[14%] top-[20%] h-28 w-28 rounded-full border border-amber-300/40 bg-amber-300/10" />
                <div className="absolute bottom-[13%] right-[22%] h-52 w-52 rounded-full border border-sky-300/30 bg-sky-300/10" />

                <div className="absolute left-[30%] top-[34%] flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/40">
                  <Navigation className="h-6 w-6" />
                </div>
                <div className="absolute right-[29%] top-[30%] flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950">
                  <Users className="h-5 w-5" />
                </div>
                <div className="absolute bottom-[28%] right-[38%] flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white ring-1 ring-white/20">
                  <MapPin className="h-5 w-5 text-emerald-300" />
                </div>

                <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded border border-white/10 bg-slate-950/70 p-3 backdrop-blur">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Mission Command</div>
                    <div className="mt-1 text-sm font-semibold">Client escort: West Loop</div>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-emerald-400/15 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Active
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                  {missionStats.map((stat) => (
                    <div key={stat.label} className="rounded border border-white/10 bg-slate-950/75 p-3 backdrop-blur">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{stat.label}</div>
                      <div className="mt-1 text-sm font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="platform" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">Platform</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Built for compliant agent teams that move in real time.
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Sentinel brings mission planning, mobile tracking, alerts, and agent readiness into a single operating layer for clients, agents, and administrators.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded bg-slate-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="operations" className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-20">
            <div className="flex flex-col justify-center">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">Operations</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                From request to mission closeout, the signal stays clean.
              </h2>
              <div className="mt-8 space-y-4">
                {workflow.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <div className="rounded border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">Dispatch Timeline</div>
                    <h3 className="mt-1 font-display text-xl font-bold">Tonight's protection detail</h3>
                  </div>
                  <Bell className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ['Agent matched', 'Verified profile and payout readiness confirmed.', CheckCircle2],
                    ['Route live', 'Client, agent, and destination locations syncing.', Navigation],
                    ['Geofence armed', 'Mission area alerts enabled for arrival and departure.', Radar],
                    ['Voice line ready', 'Secure call channel available during active protection.', Headphones],
                  ].map(([title, text, Icon]) => {
                    const TimelineIcon = Icon as typeof CheckCircle2;
                    return (
                      <div key={title as string} className="flex gap-3 rounded border border-slate-200 bg-white p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-700">
                          <TimelineIcon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-950">{title}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-500">{text as string}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="agents" className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">Agent Network</div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950">
                Secure onboarding before active assignment.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 md:col-span-2">
              {[
                [LockKeyhole, 'Encrypted operations', 'Protected workflows for mission coordination and agent readiness.'],
                [Smartphone, 'Mobile-first field ops', 'Location, alerts, calls, and mission status on device.'],
                [Clock3, 'Ready-state reviews', 'Track forms, payouts, and approval progress.'],
              ].map(([Icon, title, text]) => {
                const CardIcon = Icon as typeof LockKeyhole;
                return (
                  <div key={title as string} className="rounded border border-slate-200 bg-white p-5 shadow-sm">
                    <CardIcon className="h-6 w-6 text-slate-950" />
                    <h3 className="mt-4 text-sm font-bold text-slate-950">{title as string}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{text as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-8">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Bring real-time protection into focus.</h2>
              <p className="mt-2 text-sm text-slate-400">Real-time protection tools for clients, agents, and dispatch teams.</p>
            </div>
            <a
              href="#platform"
              className="inline-flex items-center justify-center gap-2 rounded bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-100"
            >
              Review platform
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
