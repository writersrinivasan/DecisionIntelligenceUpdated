import Link from "next/link";
import { KeyRound, Laptop, Users, Timer } from "lucide-react";
import { USE_CASES, byDay, MODULES } from "@/lib/usecases";
import { THEMES, DAY_META } from "@/lib/theme";

export const metadata = { title: "6-Hour Agenda · DI Lab" };

const RHYTHM = [
  { p: 20, t: "Concept", d: "Definition · why · what (facilitator)", c: "#8b5cf6" },
  { p: 35, t: "Lab", d: "Teams change the inputs and debate the result", c: "#ec4899" },
  { p: 30, t: "Agent", d: "Run the LangGraph workflow and critique its output", c: "#f97316" },
  { p: 15, t: "Decide", d: "Commit to a call and name one thing to implement", c: "#10b981" },
];

export default function Agenda() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 pb-24">
      <div>
        <h1 className="font-display text-4xl font-bold">The 6-hour agenda</h1>
        <p className="mt-1 text-slate-600">360 minutes across 3 sessions of about 2 hours. Every minute in the original syllabus is mapped to a hands-on industry use case.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { i: KeyRound, t: "Pre-work (5 min)", d: "Each table creates a free Groq API key at console.groq.com and pastes it into the app." },
          { i: Users, t: "Tables of 4–5", d: "Mix roles at each table: CTO/CIO, architect, delivery, finance or ops." },
          { i: Laptop, t: "One laptop per table", d: "Put it on the projector during debriefs." },
          { i: Timer, t: "Session rhythm", d: "Concept, then lab, then agent, then decision. See the bar below." },
        ].map((x) => (
          <div key={x.t} className="card p-4"><x.i className="text-violet-600" /><div className="mt-2 font-bold">{x.t}</div><div className="text-sm text-slate-600">{x.d}</div></div>
        ))}
      </div>

      <div className="card p-5">
        <div className="mb-2 font-display font-bold">The rhythm inside every use case</div>
        <div className="flex h-14 overflow-hidden rounded-2xl text-white">
          {RHYTHM.map((r) => (
            <div key={r.t} className="flex flex-col justify-center px-3" style={{ width: `${r.p}%`, background: r.c }}>
              <div className="text-sm font-bold">{r.t} · {r.p}%</div>
              <div className="hidden text-[11px] opacity-90 md:block">{r.d}</div>
            </div>
          ))}
        </div>
      </div>

      {([1, 2, 3] as const).map((d) => {
        const list = byDay(d);
        const total = list.reduce((a, u) => a + u.minutes, 0);
        let clock = 0;
        return (
          <section key={d}>
            <div className={`rounded-t-3xl bg-gradient-to-r ${DAY_META[d].grad} p-5 text-white`}>
              <div className="flex flex-wrap items-end justify-between">
                <div><h2 className="font-display text-2xl font-bold">{DAY_META[d].title}</h2><div className="text-sm opacity-90">{DAY_META[d].modules}</div></div>
                <div className="font-display text-2xl font-bold">{total} min</div>
              </div>
              <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-white/20">
                {list.map((u) => <div key={u.id} title={u.title} style={{ width: `${(u.minutes / total) * 100}%`, background: THEMES[u.theme].hex }} className="border-r-2 border-white/60" />)}
              </div>
            </div>
            <div className="card rounded-t-none">
              {list.map((u) => {
                const start = clock;
                clock += u.minutes;
                const t = THEMES[u.theme];
                return (
                  <Link key={u.id} href={`/usecase/${u.id}`} className="flex flex-wrap items-center gap-4 border-b border-slate-100 p-4 last:border-0 hover:bg-slate-50">
                    <div className="w-24 font-mono text-sm text-slate-500">{fmt(start)}–{fmt(clock)}</div>
                    <span className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${t.grad} text-sm font-bold text-white`}>{u.num}</span>
                    <div className="min-w-[240px] flex-1">
                      <div className="font-semibold">{u.title}</div>
                      <div className="text-xs text-slate-500">{u.company} · {u.industry}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">{u.subtopics.map((s) => <span key={s} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${t.chip}`}>{s}</span>)}</div>
                    <div className="w-16 text-right font-bold">{u.minutes}m</div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="card overflow-x-auto p-5">
        <h2 className="mb-3 font-display text-xl font-bold">Syllabus coverage: modules → use cases</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase text-slate-500"><th className="p-2">Module</th><th>Syllabus time</th><th>Delivered through</th></tr></thead>
          <tbody>
            {MODULES.map((m) => (
              <tr key={m.n} className="border-t border-slate-100">
                <td className="p-2 font-semibold">{m.n}. {m.title}</td>
                <td>{m.min} min</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {USE_CASES.filter((u) => u.module === m.n || u.subtopics.some((s) => s.startsWith(`${m.n}.`))).map((u) => (
                      <Link key={u.id} href={`/usecase/${u.id}`} className={`rounded-full px-2 py-0.5 text-xs font-semibold ${THEMES[u.theme].chip}`}>#{u.num} {u.title}</Link>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function fmt(m: number) {
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}
