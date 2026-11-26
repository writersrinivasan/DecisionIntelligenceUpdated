"use client";
import { useState } from "react";
import { ExportBtn, LabProps, Panel, Stat } from "./shared";

const PROJECTS = [
  { p: "Atlas", sched: -18, budget: 22, scope: 14, defects: 9, debt: 180 },
  { p: "Borealis", sched: -4, budget: 3, scope: 6, defects: 3, debt: 40 },
  { p: "Cobalt", sched: -26, budget: 31, scope: 25, defects: 12, debt: 95 },
  { p: "Delta", sched: 2, budget: -5, scope: 3, defects: 2, debt: 20 },
  { p: "Ember", sched: -6, budget: 8, scope: 9, defects: 5, debt: 60 },
  { p: "Fjord", sched: 0, budget: -2, scope: 4, defects: 3, debt: 30 },
  { p: "Granite", sched: -9, budget: 11, scope: 11, defects: 6, debt: 70 },
];
const NAMES = PROJECTS.map((x) => x.p);
const INIT: Record<string, Record<string, number>> = {
  "Priya (Architect)": { Atlas: 40, Cobalt: 40, Delta: 40 },
  "Arjun (Architect)": { Atlas: 50, Granite: 50, Fjord: 30 },
  "Meera (QA lead)": { Cobalt: 50, Ember: 40, Borealis: 30 },
  "Kiran (DevOps)": { Atlas: 60, Delta: 30, Fjord: 30 },
  "Sana (Tech lead)": { Borealis: 100 },
  "Rahul (SRE)": { Delta: 50, Fjord: 50 },
  "Divya (PM)": { Ember: 50, Granite: 50 },
};

function health(x: (typeof PROJECTS)[number], seniorBoost: number) {
  const pen = Math.max(0, -x.sched) * 1.2 + Math.max(0, x.budget) * 0.8 + x.scope * 0.6 + x.defects * 1.5 + x.debt / 12;
  return Math.max(0, Math.min(100, Math.round(100 - pen + seniorBoost)));
}

export default function HealthLab({ onExport, accent, uc }: LabProps) {
  const [alloc, setAlloc] = useState(INIT);
  const people = Object.keys(alloc);
  const loadOf = (who: string) => Object.values(alloc[who]).reduce((a, b) => a + b, 0);
  const projCount = (who: string) => Object.values(alloc[who]).filter((v) => v > 0).length;
  const boost = (p: string) => people.reduce((a, who) => a + ((alloc[who][p] ?? 0) / 100) * (projCount(who) >= 3 ? 4 : 9), 0);
  const scored = PROJECTS.map((x) => ({ ...x, h: health(x, boost(x.p)) }));
  const over = people.filter((w) => loadOf(w) > 100 || projCount(w) >= 3);
  const red = scored.filter((s) => s.h < 45).length;

  const set = (who: string, p: string, v: number) => setAlloc({ ...alloc, [who]: { ...alloc[who], [p]: Math.max(0, Math.min(100, v)) } });
  const cell = (v: number) => (v === 0 ? "bg-white text-slate-300" : v >= 60 ? "bg-teal-500 text-white" : v >= 40 ? "bg-teal-300" : "bg-teal-100");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Projects in red" value={String(red)} color="#ef4444" />
        <Stat label="People over-allocated / on 3+ projects" value={String(over.length)} color="#f59e0b" />
        <Stat label="Avg portfolio health" value={`${Math.round(scored.reduce((a, b) => a + b.h, 0) / scored.length)}`} sub="0–100 index" color={accent} />
      </div>
      <Panel title="Portfolio health index (schedule · budget · scope · quality · tech debt)">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-7">
          {scored.map((s) => {
            const col = s.h < 45 ? "from-rose-500 to-red-600" : s.h < 70 ? "from-amber-400 to-orange-500" : "from-emerald-400 to-teal-500";
            return (
              <div key={s.p} className={`rounded-2xl bg-gradient-to-br ${col} p-3 text-white shadow`}>
                <div className="text-sm font-bold">{s.p}</div>
                <div className="font-display text-3xl font-bold">{s.h}</div>
                <div className="text-[10px] leading-tight opacity-90">sched {s.sched}% · budget +{Math.max(0, s.budget)}% · debt {s.debt}d</div>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel title="Key-people allocation heatmap (% of time) — edit to rebalance">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr><th className="p-1 text-left">Person</th>{NAMES.map((n) => <th key={n} className="p-1">{n}</th>)}<th className="p-1">Total</th><th className="p-1">Projects</th></tr></thead>
            <tbody>
              {people.map((who) => (
                <tr key={who} className="border-t border-slate-100">
                  <td className="p-1 font-semibold">{who}</td>
                  {NAMES.map((n) => {
                    const v = alloc[who][n] ?? 0;
                    return (
                      <td key={n} className="p-0.5">
                        <input type="number" step={10} className={`w-full rounded-md px-1 py-1 text-center font-bold outline-none ${cell(v)}`} value={v} onChange={(e) => set(who, n, +e.target.value)} />
                      </td>
                    );
                  })}
                  <td className={`p-1 text-center font-bold ${loadOf(who) > 100 ? "text-rose-600" : ""}`}>{loadOf(who)}%</td>
                  <td className={`p-1 text-center font-bold ${projCount(who) >= 3 ? "text-amber-600" : ""}`}>{projCount(who)}{projCount(who) >= 3 && " ⚠"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">Context switching penalty: a person on 3+ projects contributes less than half the health uplift of a focused person. Try moving Priya and Kiran to focus on Cobalt and Atlas.</p>
      </Panel>
      <ExportBtn onClick={() => onExport(`${uc.agent.data}\n\nCURRENT ALLOCATION (edited in lab):\n${people.map((w) => `${w}: ${Object.entries(alloc[w]).filter(([, v]) => v > 0).map(([p, v]) => `${p} ${v}%`).join(", ")} (total ${loadOf(w)}%)`).join("\n")}\nHealth index: ${scored.map((s) => `${s.p} ${s.h}`).join(", ")}`)} />
    </div>
  );
}
