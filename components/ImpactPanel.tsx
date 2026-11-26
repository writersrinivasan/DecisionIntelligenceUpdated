"use client";
import { useState } from "react";
import { TrendingDown, TrendingUp, Clock, IndianRupee } from "lucide-react";
import type { UseCase } from "@/lib/types";

export default function ImpactPanel({ uc, accent }: { uc: UseCase; accent: string }) {
  const [freq, setFreq] = useState(24);
  const [rate, setRate] = useState(6000);
  const perCycle = uc.timeSavings.reduce((s, t) => s + (t.before - t.after), 0);
  const annualHours = Math.round(perCycle * freq);
  const annualValue = annualHours * rate;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* KPI before/after */}
      <div className="space-y-3">
        <div className="label">Business impact (illustrative benchmarks)</div>
        {uc.metrics.map((m) => {
          const max = Math.max(m.before, m.after) || 1;
          const improved = m.better === "lower" ? m.after < m.before : m.after > m.before;
          const delta = m.before === 0 ? null : Math.round(((m.after - m.before) / m.before) * 100);
          return (
            <div key={m.label} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{m.label}</div>
                <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${improved ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {m.better === "lower" ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {delta === null ? "new" : `${delta > 0 ? "+" : ""}${delta}%`}
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <Bar label="Before" v={m.before} max={max} unit={m.unit} color="#94a3b8" />
                <Bar label="With DI" v={m.after} max={max} unit={m.unit} color={accent} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Time saved */}
      <div className="space-y-3">
        <div className="label">Time saved per cycle</div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
          {uc.timeSavings.map((t) => {
            const pct = Math.round(((t.before - t.after) / t.before) * 100);
            return (
              <div key={t.task} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{t.task}</span>
                  <span className="text-xs text-slate-500">{t.cadence}</span>
                </div>
                <div className="mt-1.5 flex h-7 overflow-hidden rounded-lg bg-slate-100 text-[11px] font-bold">
                  <div className="grid place-items-center text-white" style={{ width: `${100 - pct}%`, background: accent, minWidth: 48 }}>{t.after}h</div>
                  <div className="grid flex-1 place-items-center bg-emerald-100 text-emerald-700">−{pct}% · saves {+(t.before - t.after).toFixed(1)}h of {t.before}h</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl p-4 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, #0f172a)` }}>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">Your organisation · quick value calculator</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <label>Cycles per year
              <input type="number" min={1} value={freq} onChange={(e) => setFreq(+e.target.value || 0)} className="mt-1 w-full rounded-lg bg-white/15 px-2 py-1 font-bold outline-none" />
            </label>
            <label>Loaded cost ₹/hour
              <input type="number" min={0} value={rate} onChange={(e) => setRate(+e.target.value || 0)} className="mt-1 w-full rounded-lg bg-white/15 px-2 py-1 font-bold outline-none" />
            </label>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <div className="flex items-center gap-1 text-xs opacity-80"><Clock size={12} /> Hours / year</div>
              <div className="font-display text-3xl font-bold">{annualHours.toLocaleString("en-IN")}</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <div className="flex items-center gap-1 text-xs opacity-80"><IndianRupee size={12} /> Capacity value</div>
              <div className="font-display text-3xl font-bold">₹{(annualValue / 100000).toFixed(1)}L</div>
            </div>
          </div>
          <p className="mt-3 text-sm opacity-90">{uc.valueStatement}</p>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, v, max, unit, color }: { label: string; v: number; max: number; unit: string; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-14 text-slate-500">{label}</span>
      <div className="h-5 flex-1 overflow-hidden rounded-md bg-slate-100">
        <div className="h-full rounded-md transition-all" style={{ width: `${Math.max(3, (v / max) * 100)}%`, background: color }} />
      </div>
      <span className="w-24 text-right font-bold">{v} {unit}</span>
    </div>
  );
}
