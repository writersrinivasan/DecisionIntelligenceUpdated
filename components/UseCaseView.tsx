"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, HelpCircle, Lightbulb, ListChecks, Rocket, Sparkles, Wrench, Clock, Building2, FlaskConical, Bot, MessagesSquare, Gauge } from "lucide-react";
import type { UseCase } from "@/lib/types";
import { THEMES, AI_BADGE } from "@/lib/theme";
import Icon from "./Icon";
import ImpactPanel from "./ImpactPanel";
import AgentRunner from "./AgentRunner";
import { LABS } from "./labs";

const SECTIONS = [
  { id: "definition", label: "Definition", icon: BookOpen },
  { id: "why", label: "Why · What", icon: Lightbulb },
  { id: "how", label: "How AI helps", icon: Sparkles },
  { id: "impact", label: "Impact & time", icon: Gauge },
  { id: "lab", label: "Hands-on lab", icon: FlaskConical },
  { id: "agent", label: "LangGraph agent", icon: Bot },
  { id: "implement", label: "Implement", icon: Rocket },
  { id: "discuss", label: "Discuss", icon: MessagesSquare },
];

export default function UseCaseView({ uc, prev, next }: { uc: UseCase; prev?: { id: string; title: string }; next?: { id: string; title: string } }) {
  const t = THEMES[uc.theme];
  const [agentData, setAgentData] = useState(uc.agent.data);
  const [agentQ, setAgentQ] = useState(uc.agent.question);
  const [flash, setFlash] = useState(false);
  const [agentFinal, setAgentFinal] = useState<string | undefined>();
  const agentRef = useRef<HTMLDivElement>(null);
  const Lab = LABS[uc.lab];
  const manualHours = uc.timeSavings.reduce((s, x) => s + x.before, 0);

  const onExport = (data: string, question?: string) => {
    setAgentData(data);
    if (question) setAgentQ(question);
    setFlash(true);
    setTimeout(() => setFlash(false), 1800);
    agentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pb-24">
      {/* HERO */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${t.grad} text-white`}>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-black/10 blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-10">
          <Link href="/" className="no-print mb-4 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"><ArrowLeft size={14} /> All use cases</Link>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/20 px-3 py-1">USE CASE {uc.num}</span>
            <span className="rounded-full bg-white/20 px-3 py-1">DAY {uc.day}</span>
            <span className="rounded-full bg-white/20 px-3 py-1">MODULE {uc.module} · {uc.subtopics.join(" · ")}</span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1"><Clock size={12} /> {uc.minutes} min</span>
          </div>
          <div className="mt-4 flex items-start gap-4">
            <div className="hidden h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/20 shadow-inner sm:grid animate-floaty"><Icon name={uc.icon} size={34} /></div>
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">{uc.title}</h1>
              <p className="mt-2 max-w-3xl text-lg text-white/90">{uc.tagline}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur md:col-span-2">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80"><Building2 size={14} /> The situation · {uc.company} ({uc.industry})</div>
              <p className="text-[15px] leading-relaxed">{uc.scenario}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-white/80">Your mission in this session</div>
              <ol className="space-y-1 text-sm">
                <li>① Understand the concept</li>
                <li>② Play with the live lab</li>
                <li>③ Run the LangGraph agents</li>
                <li>④ Decide — and plan to implement</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION NAV */}
      <nav className="no-print sticky top-[57px] z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {SECTIONS.map((s, i) => (
            <a key={s.id} href={`#${s.id}`} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900`}>
              <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] text-white bg-gradient-to-br ${t.grad}`}>{i + 1}</span>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-10">
        {/* DEFINITION */}
        <Section id="definition" n={1} title="Definition" icon={BookOpen} t={t}>
          <div className={`card relative overflow-hidden p-6 md:p-8`}>
            <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${t.grad}`} />
            <p className="font-display text-lg leading-relaxed text-slate-800 md:text-xl">{uc.definition}</p>
          </div>
        </Section>

        {/* WHY / WHAT */}
        <Section id="why" n={2} title="Why it matters · What we cover" icon={Lightbulb} t={t}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="card p-6">
              <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><HelpCircle className="text-rose-500" /> WHY</div>
              <ul className="space-y-3">
                {uc.why.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">{i + 1}</span>{w}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold"><ListChecks className="text-emerald-500" /> WHAT</div>
              <ul className="space-y-3">
                {uc.what.map((w, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">✓</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* HOW AI */}
        <Section id="how" n={3} title="How we use AI — step by step" icon={Sparkles} t={t}>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(170px, 1fr))` }}>
            {uc.howAI.map((h, i) => (
              <div key={i} className="relative">
                <div className="card h-full p-4">
                  <div className="flex items-center justify-between">
                    <span className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${t.grad} font-display font-bold text-white`}>{i + 1}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${AI_BADGE[h.ai]}`}>{h.ai}</span>
                  </div>
                  <div className="mt-3 font-display font-bold">{h.step}</div>
                  <p className="mt-1 text-sm text-slate-600">{h.detail}</p>
                </div>
                {i < uc.howAI.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white text-slate-400 shadow lg:block" size={22} />}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            Legend: {Object.keys(AI_BADGE).map((k) => <span key={k} className={`rounded-full px-2 py-0.5 font-bold ${AI_BADGE[k]}`}>{k}</span>)}
          </div>
        </Section>

        {/* IMPACT */}
        <Section id="impact" n={4} title="Impact & time saved" icon={Gauge} t={t}>
          <ImpactPanel uc={uc} accent={t.hex} />
          <p className="mt-2 text-xs text-slate-400">Benchmarks are illustrative for training. Calibrate against your own baseline before using in a business case.</p>
        </Section>

        {/* LAB */}
        <Section id="lab" n={5} title="Hands-on lab" icon={FlaskConical} t={t}>
          <p className="mb-4 text-slate-600">{uc.labIntro}</p>
          {Lab ? <Lab uc={uc} accent={t.hex} onExport={onExport} agentFinal={agentFinal} /> : <div className="card p-6">Lab coming soon</div>}
        </Section>

        {/* AGENT */}
        <div ref={agentRef} className="scroll-mt-28">
          <Section id="agent" n={6} title="Run the LangGraph agents (BYOK Groq)" icon={Bot} t={t}>
            {flash && <div className="mb-3 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">✓ Lab results loaded into the agent&apos;s data. Press “Run agents”.</div>}
            <AgentRunner
              title={uc.agent.title}
              pattern={uc.agent.pattern}
              stages={uc.agent.stages}
              question={agentQ}
              data={agentData}
              useCaseId={uc.id}
              accent={t.hex}
              manualHours={manualHours}
              onFinal={setAgentFinal}
            />
          </Section>
        </div>

        {/* IMPLEMENT */}
        <Section id="implement" n={7} title="Implement it in your organisation" icon={Rocket} t={t}>
          <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {uc.implement.map((ph, i) => (
              <div key={i} className="card p-5">
                <div className={`mb-2 inline-flex rounded-full bg-gradient-to-r ${t.grad} px-3 py-1 text-xs font-bold text-white`}>{ph.weeks}</div>
                <div className="font-display text-lg font-bold">{ph.phase}</div>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                  {ph.actions.map((a) => <li key={a} className="flex gap-2"><span className={t.text}>▸</span>{a}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-semibold text-slate-600"><Wrench size={16} /> Tools:</span>
            {uc.tools.map((x) => <span key={x} className={`rounded-full px-3 py-1 text-xs font-semibold ${t.chip}`}>{x}</span>)}
          </div>
        </Section>

        {/* DISCUSS */}
        <Section id="discuss" n={8} title="Executive discussion" icon={MessagesSquare} t={t}>
          <div className="grid gap-4 md:grid-cols-3">
            {uc.discuss.map((d, i) => (
              <div key={i} className={`rounded-2xl ${t.soft} p-5 ring-1 ${t.ring}`}>
                <div className={`font-display text-3xl font-bold ${t.text}`}>Q{i + 1}</div>
                <p className="mt-1 font-medium text-slate-800">{d}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* PREV / NEXT */}
        <div className="no-print flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-6">
          {prev ? <Link href={`/usecase/${prev.id}`} className="btn-ghost"><ArrowLeft size={16} /> {prev.title}</Link> : <span />}
          {next ? <Link href={`/usecase/${next.id}`} className="btn-primary">{next.title} <ArrowRight size={16} /></Link> : <Link href="/playbook" className="btn-primary">Implementation Playbook <ArrowRight size={16} /></Link>}
        </div>
      </div>
    </div>
  );
}

function Section({ id, n, title, icon: I, t, children }: { id: string; n: number; title: string; icon: React.ComponentType<{ size?: number; className?: string }>; t: (typeof THEMES)[keyof typeof THEMES]; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-4 flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${t.grad} text-white shadow-md`}><I size={20} /></span>
        <div>
          <div className={`text-xs font-bold uppercase tracking-widest ${t.text}`}>Step {n}</div>
          <h2 className="font-display text-2xl font-bold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
