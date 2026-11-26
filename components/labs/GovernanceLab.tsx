"use client";
import { useState } from "react";
import { ExportBtn, LabProps, Panel } from "./shared";

const RISKS0 = [
  { r: "Vendor accesses PII in prod", type: "Reputational", l: 3, i: 5 },
  { r: "AI auto-approves a harmful change", type: "Operational", l: 2, i: 4 },
  { r: "Model bias in credit decisions", type: "Strategic", l: 3, i: 4 },
  { r: "Cloud cost overrun", type: "Financial", l: 4, i: 2 },
  { r: "Prompt-injection via tickets", type: "Technical", l: 3, i: 3 },
  { r: "Regulator finds no audit trail", type: "Reputational", l: 2, i: 5 },
];
const TYPE_C: Record<string, string> = { Operational: "#0ea5e9", Financial: "#10b981", Technical: "#8b5cf6", Strategic: "#f97316", Reputational: "#e11d48" };

const QS = [
  { q: "Is the decision easily reversible?", opts: ["Yes, in minutes", "With effort", "No / irreversible"] },
  { q: "Impact if wrong?", opts: ["Minor / internal", "Material", "Severe / customer or regulatory"] },
  { q: "Does it touch personal or regulated data?", opts: ["No", "Masked / aggregated", "Yes, raw PII"] },
  { q: "Can the AI explain its reasoning?", opts: ["Fully traceable", "Partly", "Black box"] },
  { q: "How often does this decision occur?", opts: ["Hundreds per day", "Weekly", "Rare / novel"] },
];
const LEVELS = [
  { name: "AUTONOMOUS", desc: "AI decides & executes within guardrails; sampled audits.", c: "#10b981" },
  { name: "HUMAN-ON-THE-LOOP", desc: "AI acts; human monitors and can veto.", c: "#84cc16" },
  { name: "HUMAN-IN-THE-LOOP", desc: "AI recommends; human must approve (LangGraph interrupt).", c: "#f59e0b" },
  { name: "HUMAN-ONLY", desc: "AI may inform; the decision stays exclusively human.", c: "#e11d48" },
];
const PILLARS = ["Transparency", "Fairness", "Accountability", "Explainability", "Human oversight", "Privacy & security"];

export default function GovernanceLab({ onExport, uc }: LabProps) {
  const [risks, setRisks] = useState(RISKS0);
  const [ans, setAns] = useState<number[]>([2, 2, 2, 1, 2]);
  const [pillars, setPillars] = useState<boolean[]>([true, false, true, false, true, false]);
  const score = ans.reduce((a, b) => a + b, 0) + (ans[2] === 2 ? 2 : 0) + (ans[1] === 2 ? 1 : 0);
  const lvl = score <= 2 ? 0 : score <= 5 ? 1 : score <= 9 ? 2 : 3;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="① Technology decision risk heatmap">
          <div className="flex">
            <div className="flex w-6 items-center justify-center"><span className="-rotate-90 whitespace-nowrap text-[10px] font-bold uppercase text-slate-400">Likelihood →</span></div>
            <div className="grid flex-1 grid-cols-5 gap-1">
              {[5, 4, 3, 2, 1].map((l) =>
                [1, 2, 3, 4, 5].map((i) => {
                  const sev = l * i;
                  const bg = sev >= 15 ? "bg-rose-400" : sev >= 8 ? "bg-amber-300" : sev >= 4 ? "bg-yellow-100" : "bg-emerald-100";
                  const here = risks.filter((r) => r.l === l && r.i === i);
                  return (
                    <div key={`${l}${i}`} className={`flex min-h-[54px] flex-wrap content-center items-center justify-center gap-1 rounded-lg ${bg}`}>
                      {here.map((r) => <span key={r.r} title={r.r} className="h-4 w-4 rounded-full ring-2 ring-white" style={{ background: TYPE_C[r.type] }} />)}
                    </div>
                  );
                }),
              )}
            </div>
          </div>
          <div className="ml-6 mt-1 text-center text-[10px] font-bold uppercase text-slate-400">Impact →</div>
          <div className="mt-3 space-y-1">
            {risks.map((r, k) => (
              <div key={r.r} className="flex items-center gap-2 text-xs">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: TYPE_C[r.type] }} />
                <span className="flex-1">{r.r} <span className="text-slate-400">({r.type})</span></span>
                L<select className="rounded border" value={r.l} onChange={(e) => setRisks(risks.map((x, j) => (j === k ? { ...x, l: +e.target.value } : x)))}>{[1, 2, 3, 4, 5].map((v) => <option key={v}>{v}</option>)}</select>
                I<select className="rounded border" value={r.i} onChange={(e) => setRisks(risks.map((x, j) => (j === k ? { ...x, i: +e.target.value } : x)))}>{[1, 2, 3, 4, 5].map((v) => <option key={v}>{v}</option>)}</select>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="② Autonomy classifier — how much can AI decide alone?">
          <div className="space-y-3">
            {QS.map((q, qi) => (
              <div key={q.q}>
                <div className="text-sm font-semibold">{q.q}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {q.opts.map((o, oi) => (
                    <button key={o} onClick={() => setAns(ans.map((a, j) => (j === qi ? oi : a)))} className={`rounded-full px-3 py-1 text-xs font-medium ${ans[qi] === oi ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-1">
            {LEVELS.map((L, i) => <div key={L.name} className={`h-3 rounded-full transition ${i === lvl ? "scale-y-150" : "opacity-30"}`} style={{ background: L.c }} />)}
          </div>
          <div className="mt-3 rounded-2xl p-4 text-white" style={{ background: LEVELS[lvl].c }}>
            <div className="text-xs font-bold uppercase opacity-80">Recommended autonomy</div>
            <div className="font-display text-xl font-bold">{LEVELS[lvl].name}</div>
            <div className="text-sm">{LEVELS[lvl].desc}</div>
          </div>
        </Panel>
      </div>
      <Panel title="③ Responsible-AI checklist for this decision (tick what is in place)">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
          {PILLARS.map((p, i) => (
            <button key={p} onClick={() => setPillars(pillars.map((v, j) => (j === i ? !v : v)))} className={`rounded-2xl p-3 text-sm font-semibold ring-2 transition ${pillars[i] ? "bg-emerald-50 text-emerald-700 ring-emerald-300" : "bg-rose-50 text-rose-600 ring-rose-200"}`}>
              {pillars[i] ? "✅" : "❌"} {p}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Gaps here should push the autonomy level <b>down</b>, not up.</p>
      </Panel>
      <ExportBtn onClick={() => onExport(`${uc.agent.data}\n\nGOVERNANCE CONTEXT FROM LAB:\nAutonomy classifier answers: ${QS.map((q, i) => `${q.q} → ${q.opts[ans[i]]}`).join("; ")}\nClassifier recommends: ${LEVELS[lvl].name}\nRAI controls in place: ${PILLARS.filter((_, i) => pillars[i]).join(", ") || "none"}; missing: ${PILLARS.filter((_, i) => !pillars[i]).join(", ") || "none"}\nRisk register (L×I): ${risks.map((r) => `${r.r} ${r.l}x${r.i}`).join("; ")}`)} />
    </div>
  );
}
