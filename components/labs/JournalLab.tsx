"use client";
import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { ExportBtn, LabProps, Panel, Stat } from "./shared";

interface D { id: string; title: string; date: string; confidence: number; process: number; outcome: number; expected: string; actual: string }

const SEED: D[] = [
  { id: "1", title: "Moved CRM to SaaS", date: "2025-03", confidence: 80, process: 4, outcome: 4, expected: "Cost −20%", actual: "Cost −24%" },
  { id: "2", title: "Built in-house API gateway", date: "2025-01", confidence: 70, process: 2, outcome: 2, expected: "Live in 4 months", actual: "11 months, 2 outages" },
  { id: "3", title: "Delayed DR upgrade", date: "2024-11", confidence: 60, process: 2, outcome: 4, expected: "No impact", actual: "No incident (yet)" },
  { id: "4", title: "Chose vendor X for observability", date: "2025-05", confidence: 85, process: 4, outcome: 2, expected: "MTTR −40%", actual: "Vendor acquired, roadmap frozen" },
  { id: "5", title: "Hired 2 squads for Payments", date: "2025-06", confidence: 90, process: 2, outcome: 2, expected: "Releases on time", actual: "Still late — review bottleneck" },
];

const QUAD = [
  { k: "Deserved success", c: "bg-emerald-100 text-emerald-800", test: (d: D) => d.process >= 3 && d.outcome >= 3 },
  { k: "Dumb luck", c: "bg-amber-100 text-amber-800", test: (d: D) => d.process < 3 && d.outcome >= 3 },
  { k: "Bad break", c: "bg-sky-100 text-sky-800", test: (d: D) => d.process >= 3 && d.outcome < 3 },
  { k: "Poetic justice", c: "bg-rose-100 text-rose-800", test: (d: D) => d.process < 3 && d.outcome < 3 },
];

export default function JournalLab({ onExport, accent }: LabProps) {
  const [list, setList] = useState<D[]>(SEED);
  const [f, setF] = useState<Omit<D, "id">>({ title: "", date: new Date().toISOString().slice(0, 7), confidence: 70, process: 3, outcome: 3, expected: "", actual: "" });

  useEffect(() => {
    const s = localStorage.getItem("di_journal");
    if (s) try { setList(JSON.parse(s)); } catch {}
  }, []);
  const save = (l: D[]) => { setList(l); localStorage.setItem("di_journal", JSON.stringify(l)); };

  const avgConf = list.reduce((a, d) => a + d.confidence, 0) / (list.length || 1);
  const hitRate = (list.filter((d) => d.outcome >= 3).length / (list.length || 1)) * 100;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Decisions logged" value={String(list.length)} color={accent} />
        <Stat label="Avg stated confidence" value={`${avgConf.toFixed(0)}%`} color="#0ea5e9" />
        <Stat label="Actual success rate" value={`${hitRate.toFixed(0)}%`} sub={`calibration gap ${Math.abs(avgConf - hitRate).toFixed(0)} pts${avgConf > hitRate ? " (over-confident)" : ""}`} color={Math.abs(avgConf - hitRate) > 15 ? "#ef4444" : "#10b981"} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Process × Outcome matrix">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-xs">
            <div />
            <div className="text-center font-bold uppercase text-slate-400">Good outcome</div>
            <div className="text-center font-bold uppercase text-slate-400">Bad outcome</div>
            {[["Good process", 0, 2], ["Bad process", 1, 3]].map(([label, a, b]) => (
              <div key={label as string} className="contents">
                <div className="flex items-center font-bold uppercase text-slate-400 [writing-mode:vertical-rl] rotate-180">{label}</div>
                {[a as number, b as number].map((qi) => (
                  <div key={qi} className={`min-h-[120px] rounded-2xl p-3 ${QUAD[qi].c}`}>
                    <div className="font-display text-sm font-bold">{QUAD[qi].k}</div>
                    {list.filter(QUAD[qi].test).map((d) => <div key={d.id} className="mt-1 rounded-lg bg-white/70 px-2 py-1">{d.title}</div>)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Log a decision">
          <div className="grid gap-2">
            <input className="input" placeholder="Decision (e.g. Migrate payments to Kubernetes)" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Expected outcome / KPI" value={f.expected} onChange={(e) => setF({ ...f, expected: e.target.value })} />
              <input className="input" placeholder="Actual outcome" value={f.actual} onChange={(e) => setF({ ...f, actual: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <label>Confidence %<input type="number" className="input" value={f.confidence} onChange={(e) => setF({ ...f, confidence: +e.target.value })} /></label>
              <label>Process quality 1–5<input type="number" min={1} max={5} className="input" value={f.process} onChange={(e) => setF({ ...f, process: +e.target.value })} /></label>
              <label>Outcome 1–5<input type="number" min={1} max={5} className="input" value={f.outcome} onChange={(e) => setF({ ...f, outcome: +e.target.value })} /></label>
            </div>
            <button className="btn-primary justify-center" disabled={!f.title} onClick={() => { save([{ ...f, id: Date.now().toString() }, ...list]); setF({ ...f, title: "", expected: "", actual: "" }); }}><Plus size={16} /> Add to journal</button>
          </div>
          <div className="mt-3 max-h-48 space-y-1 overflow-y-auto">
            {list.map((d) => (
              <div key={d.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 text-xs">
                <span className="flex-1"><b>{d.title}</b> · conf {d.confidence}% · P{d.process}/O{d.outcome}</span>
                <button onClick={() => save(list.filter((x) => x.id !== d.id))} className="text-slate-400 hover:text-rose-600"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Saved only in this browser (localStorage).</p>
        </Panel>
      </div>
      <ExportBtn onClick={() => onExport(`Decision journal:\nDecision | date | confidence% | process 1-5 | outcome 1-5 | expected | actual\n${list.map((d) => `${d.title} | ${d.date} | ${d.confidence} | ${d.process} | ${d.outcome} | ${d.expected} | ${d.actual}`).join("\n")}\nAvg confidence ${avgConf.toFixed(0)}% vs success rate ${hitRate.toFixed(0)}%`)} />
    </div>
  );
}
