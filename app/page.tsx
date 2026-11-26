import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Layers, Bot, Factory, GraduationCap, Rocket } from "lucide-react";
import { USE_CASES, byDay, OUTCOMES } from "@/lib/usecases";
import { THEMES, DAY_META } from "@/lib/theme";
import Icon from "@/components/Icon";

const ECO = [
  { t: "Data", d: "structured · unstructured · ops · business", c: "#0ea5e9" },
  { t: "Analytics", d: "descriptive → prescriptive", c: "#10b981" },
  { t: "AI / ML", d: "forecast · detect · classify", c: "#8b5cf6" },
  { t: "GenAI + Agents", d: "reason · summarise · orchestrate", c: "#d946ef" },
  { t: "Human expertise", d: "judgement · accountability", c: "#f43f5e" },
  { t: "Business context", d: "strategy · risk appetite", c: "#f97316" },
  { t: "Decision & action", d: "execute with guardrails", c: "#eab308" },
  { t: "Feedback loop", d: "measure outcome · learn", c: "#14b8a6" },
];

const RECIPE = ["Definition", "Why", "What", "How AI helps", "Impact & time saved", "Hands-on lab", "LangGraph agent", "Implement"];

export default function Home() {
  const agents = USE_CASES.reduce((a, u) => a + u.agent.stages.flat().length, 0);
  const industries = Array.from(new Set(USE_CASES.map((u) => u.industry.split(" · ")[0])));
  return (
    <div className="pb-24">
      {/* HERO */}
      <section className="bg-mesh relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-200"><Sparkles size={14} /> 6-hour hands-on executive programme · 3 days × 2 hours</div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
              Decision Intelligence <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 bg-clip-text text-transparent">for Technology Leaders</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Sixteen real industry decisions. Each one comes with a live lab you can change, a LangGraph multi-agent workflow that runs on your own Groq key, and a plan for putting it into practice in your organisation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/usecase/${USE_CASES[0].id}`} className="btn-primary px-6 py-3 text-base">Start Day 1 <ArrowRight size={18} /></Link>
              <Link href="/agenda" className="btn-ghost px-6 py-3 text-base"><Clock size={18} /> See the 6-hour agenda</Link>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-4 gap-3">
              {[
                { v: "16", l: "industry use cases", i: Factory },
                { v: "7", l: "modules covered", i: Layers },
                { v: String(agents), l: "LangGraph agents", i: Bot },
                { v: String(industries.length), l: "industries", i: GraduationCap },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/80 p-3 text-center ring-1 ring-slate-200">
                  <s.i className="mx-auto text-violet-500" size={18} />
                  <div className="font-display text-2xl font-bold">{s.v}</div>
                  <div className="text-[10px] leading-tight text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ecosystem wheel */}
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full">
              <circle cx="260" cy="260" r="190" fill="none" stroke="url(#g)" strokeWidth="3" strokeDasharray="8 8" className="animate-dash" />
              <defs>
                <linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#f97316" /></linearGradient>
              </defs>
            </svg>
            <div className="absolute left-1/2 top-1/2 grid h-40 w-40 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-center text-white shadow-2xl shadow-fuchsia-500/30">
              <div>
                <div className="font-display text-xl font-bold leading-tight">Decision<br />Intelligence</div>
                <div className="text-[10px] opacity-90">the ecosystem</div>
              </div>
            </div>
            {ECO.map((e, i) => {
              const a = (i / ECO.length) * Math.PI * 2 - Math.PI / 2;
              const x = 50 + Math.cos(a) * 37;
              const y = 50 + Math.sin(a) * 37;
              return (
                <div key={e.t} className="absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-2 text-center shadow-lg ring-2" style={{ left: `${x}%`, top: `${y}%`, borderColor: e.c, boxShadow: `0 8px 20px ${e.c}33`, ["--tw-ring-color" as string]: e.c }}>
                  <div className="text-[13px] font-bold" style={{ color: e.c }}>{e.t}</div>
                  <div className="text-[10px] leading-tight text-slate-500">{e.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECIPE */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="font-display text-2xl font-bold">Every use case follows the same 8-step format</h2>
        <p className="text-slate-600">The same structure every time, so participants can focus on the decision instead of working out the format.</p>
        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-8">
          {RECIPE.map((r, i) => (
            <div key={r} className="relative rounded-2xl p-4 text-white shadow-md" style={{ background: `hsl(${265 - i * 28} 80% ${55 + (i % 2) * 4}%)` }}>
              <div className="font-display text-3xl font-bold opacity-50">{i + 1}</div>
              <div className="text-sm font-bold">{r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY */}
      {([1, 2, 3] as const).map((d) => {
        const meta = DAY_META[d];
        const list = byDay(d);
        const mins = list.reduce((a, u) => a + u.minutes, 0);
        return (
          <section key={d} className="mx-auto max-w-7xl px-4 py-8">
            <div className={`mb-5 flex flex-wrap items-end justify-between gap-3 rounded-3xl bg-gradient-to-r ${meta.grad} p-6 text-white shadow-lg`}>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">{meta.modules}</div>
                <h2 className="font-display text-3xl font-bold">{meta.title}</h2>
                <p className="opacity-90">{meta.sub}</p>
              </div>
              <div className="rounded-2xl bg-white/20 px-4 py-2 text-center">
                <div className="font-display text-2xl font-bold">{mins} min</div>
                <div className="text-xs">{list.length} use cases</div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((u) => {
                const t = THEMES[u.theme];
                return (
                  <Link key={u.id} href={`/usecase/${u.id}`} className="group card relative overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-xl">
                    <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${t.grad} opacity-15 transition group-hover:scale-125`} />
                    <div className="flex items-center justify-between">
                      <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${t.grad} text-white shadow`}><Icon name={u.icon} /></span>
                      <span className="font-display text-3xl font-bold text-slate-200">{String(u.num).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-3 font-display text-lg font-bold leading-snug">{u.title}</div>
                    <div className="mt-1 line-clamp-2 text-sm text-slate-500">{u.tagline}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                      <span className={`rounded-full px-2 py-0.5 ${t.chip}`}>{u.industry}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">M{u.module} · {u.subtopics[0]}{u.subtopics.length > 1 ? "+" : ""}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{u.minutes}m</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* OUTCOMES + CTA */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <h2 className="font-display text-2xl font-bold">By the end, participants can…</h2>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {OUTCOMES.map((o, i) => (
                <div key={o} className="flex gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-bold text-white">{i + 1}</span>{o}
                </div>
              ))}
            </div>
          </div>
          <Link href="/playbook" className="group flex flex-col justify-between rounded-3xl bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-800 p-6 text-white shadow-xl">
            <div>
              <Rocket className="mb-3" size={32} />
              <div className="font-display text-2xl font-bold">Implementation Playbook</div>
              <p className="mt-2 text-white/80">Reference architecture, 90-day roadmap, readiness check, and an agent builder where you design and run your own LangGraph decision workflow.</p>
            </div>
            <div className="mt-4 flex items-center gap-2 font-semibold">Open the playbook <ArrowRight className="transition group-hover:translate-x-1" size={18} /></div>
          </Link>
        </div>
      </section>
    </div>
  );
}
