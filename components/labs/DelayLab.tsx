"use client";
import { useState } from "react";
import { ExportBtn, LabProps, Panel, Slider } from "./shared";

const PROJECTS = [
  { name: "5G Core", scope: 32, vel: 41, deps: 9, churn: 18, cov: 54, status: "Green" },
  { name: "BSS Migration", scope: 18, vel: 22, deps: 12, churn: 9, cov: 61, status: "Amber" },
  { name: "Digital Onboarding", scope: 6, vel: 9, deps: 2, churn: 4, cov: 82, status: "Green" },
  { name: "Fibre Rollout App", scope: 24, vel: 35, deps: 5, churn: 22, cov: 47, status: "Green" },
  { name: "Billing Re-platform", scope: 41, vel: 28, deps: 7, churn: 15, cov: 50, status: "Amber" },
  { name: "Data Lake", scope: 12, vel: 14, deps: 3, churn: 6, cov: 70, status: "Green" },
];
const FEATS = [
  { k: "scope", label: "Scope change %", max: 45 },
  { k: "vel", label: "Velocity variance %", max: 45 },
  { k: "deps", label: "Open dependencies", max: 12 },
  { k: "churn", label: "Team churn %", max: 25 },
  { k: "cov", label: "Low test coverage", max: 100, invert: true },
] as const;

const LADDER = [
  { l: "Descriptive", q: "What happened?", ex: "Schedule variance dashboard", c: "#94a3b8" },
  { l: "Diagnostic", q: "Why did it happen?", ex: "Scope churn drove last 4 slips", c: "#0ea5e9" },
  { l: "Predictive", q: "What will happen?", ex: "P(delay) per programme", c: "#8b5cf6" },
  { l: "Prescriptive", q: "What should we do?", ex: "Freeze scope, add integration lead", c: "#ec4899" },
];

export default function DelayLab({ onExport, accent }: LabProps) {
  const [w, setW] = useState<Record<string, number>>({ scope: 3, vel: 3, deps: 2, churn: 2, cov: 1 });
  const [completeness, setCompleteness] = useState(75);
  const [freshness, setFreshness] = useState(5);

  const scored = PROJECTS.map((p) => {
    const wsum = Object.values(w).reduce((a, b) => a + b, 0) || 1;
    let z = 0;
    for (const f of FEATS) {
      const raw = p[f.k] as number;
      const norm = "invert" in f && f.invert ? (100 - raw) / 60 : raw / f.max;
      z += (w[f.k] / wsum) * norm;
    }
    const prob = 1 / (1 + Math.exp(-(z * 9 - 4)));
    return { ...p, prob };
  }).sort((a, b) => b.prob - a.prob);

  const confidence = Math.max(20, Math.min(95, completeness - freshness * 3));
  const band = Math.round((100 - confidence) / 3);

  return (
    <div className="space-y-5">
      <Panel title="The four levels of analytics">
        <div className="grid gap-2 md:grid-cols-4">
          {LADDER.map((l, i) => (
            <div key={l.l} className="relative rounded-2xl p-4 text-white" style={{ background: l.c, marginTop: `${(3 - i) * 10}px` }}>
              <div className="text-xs font-bold uppercase opacity-80">Level {i + 1}</div>
              <div className="font-display text-lg font-bold">{l.l}</div>
              <div className="text-sm">{l.q}</div>
              <div className="mt-2 rounded-lg bg-white/20 px-2 py-1 text-xs">{l.ex}</div>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Model weights (what predicts delay?)">
          {FEATS.map((f) => <Slider key={f.k} label={f.label} value={w[f.k]} min={0} max={5} onChange={(v) => setW({ ...w, [f.k]: v })} />)}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="mb-2 font-display font-bold">Data quality</div>
            <Slider label="Completeness" value={completeness} min={30} max={100} onChange={setCompleteness} suffix="%" />
            <Slider label="Data age (weeks)" value={freshness} min={0} max={12} onChange={setFreshness} suffix="w" />
            <div className="mt-2 rounded-xl p-3 text-center text-white" style={{ background: confidence > 70 ? "#10b981" : confidence > 50 ? "#f59e0b" : "#ef4444" }}>
              <div className="text-xs font-bold uppercase">Decision confidence</div>
              <div className="font-display text-3xl font-bold">{confidence}%</div>
              <div className="text-xs">± {band} pts on every prediction</div>
            </div>
          </div>
        </Panel>
        <Panel title="Predicted probability of missing go-live" className="lg:col-span-2">
          <div className="space-y-3">
            {scored.map((p) => {
              const pct = Math.round(p.prob * 100);
              const lo = Math.max(0, pct - band), hi = Math.min(100, pct + band);
              const col = pct > 60 ? "#ef4444" : pct > 35 ? "#f59e0b" : "#10b981";
              const watermelon = p.status === "Green" && pct > 50;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{p.name} {watermelon && <span className="ml-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">🍉 reported GREEN</span>}</span>
                    <span className="font-bold" style={{ color: col }}>{pct}%</span>
                  </div>
                  <div className="relative mt-1 h-5 rounded-full bg-slate-100">
                    <div className="absolute h-5 rounded-full opacity-25" style={{ left: `${lo}%`, width: `${hi - lo}%`, background: col }} />
                    <div className="absolute h-5 rounded-full" style={{ width: `${pct}%`, background: col }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-slate-500">Shaded band = uncertainty from data quality. A 🍉 “watermelon” project reports green but the model sees red inside. A transparent weighted-logistic model like this is the right first step before ML.</p>
        </Panel>
      </div>
      <ExportBtn
        onClick={() =>
          onExport(
            `Project | Scope change % | Velocity variance % | Open deps | Team churn % | Test coverage % | Reported status | Model P(delay)\n${scored.map((p) => `${p.name} | ${p.scope} | ${p.vel} | ${p.deps} | ${p.churn} | ${p.cov} | ${p.status} | ${Math.round(p.prob * 100)}%`).join("\n")}\nModel weights: ${JSON.stringify(w)}\nData quality: completeness ${completeness}%, data age ${freshness} weeks → confidence ${confidence}% (±${band} pts)`,
          )
        }
      />
    </div>
  );
}
