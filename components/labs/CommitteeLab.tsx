"use client";
import { useState } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ExportBtn, LabProps, Panel, PALETTE } from "./shared";

interface Opt { name: string; cost: number; benefit: number; months: number; risk: number; fit: number; desc: string }

const INIT: Opt[] = [
  { name: "A · Predictive maintenance", cost: 14, benefit: 9, months: 18, risk: 3, fit: 5, desc: "40 plants, OT sensors, downtime −30%" },
  { name: "B · MES–ERP integration", cost: 12, benefit: 6.5, months: 12, risk: 4, fit: 4, desc: "Inventory accuracy 82→97%, ₹20 Cr working capital" },
  { name: "C · GenAI field-service assistant", cost: 6, benefit: 4, months: 5, risk: 2, fit: 3, desc: "First-time-fix 68→80%, 20 yrs of manuals" },
];

export default function CommitteeLab({ onExport }: LabProps) {
  const [opts, setOpts] = useState(INIT);
  const upd = (i: number, k: keyof Opt, v: string | number) => setOpts(opts.map((o, j) => (j === i ? { ...o, [k]: v } : o)));
  const calc = opts.map((o) => {
    const payback = o.cost / o.benefit + o.months / 12 / 2;
    const roi3 = ((o.benefit * Math.max(0, 3 - o.months / 24) - o.cost) / o.cost) * 100;
    return { ...o, payback, roi3 };
  });
  const radar = ["Financial", "Speed", "Low risk", "Strategic fit", "Scale of benefit"].map((dim) => {
    const row: Record<string, string | number> = { dim };
    calc.forEach((c) => {
      row[c.name.split(" · ")[0]] =
        dim === "Financial" ? Math.max(1, Math.min(5, 5 - c.payback + 1)) : dim === "Speed" ? Math.max(1, 5 - c.months / 5) : dim === "Low risk" ? 6 - c.risk : dim === "Strategic fit" ? c.fit : Math.min(5, c.benefit / 2);
    });
    return row;
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {calc.map((o, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="h-2" style={{ background: PALETTE[i] }} />
            <div className="space-y-2 p-4">
              <input className="w-full font-display text-lg font-bold outline-none" value={o.name} onChange={(e) => upd(i, "name", e.target.value)} />
              <input className="w-full text-xs text-slate-500 outline-none" value={o.desc} onChange={(e) => upd(i, "desc", e.target.value)} />
              {([["cost", "Investment ₹Cr"], ["benefit", "Annual benefit ₹Cr"], ["months", "Months to value"], ["risk", "Delivery risk 1–5"], ["fit", "Strategic fit 1–5"]] as [keyof Opt, string][]).map(([k, l]) => (
                <label key={k} className="flex items-center justify-between text-sm"><span className="text-slate-600">{l}</span><input type="number" className="input w-20 py-1 text-right font-bold" value={o[k] as number} onChange={(e) => upd(i, k, +e.target.value)} /></label>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="rounded-xl bg-slate-50 p-2"><div className="text-[10px] font-bold uppercase text-slate-500">Payback</div><div className="font-bold">{o.payback.toFixed(1)} yrs</div></div>
                <div className="rounded-xl bg-slate-50 p-2"><div className="text-[10px] font-bold uppercase text-slate-500">3-yr ROI</div><div className={`font-bold ${o.roi3 >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{o.roi3.toFixed(0)}%</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Panel title="Option profile (quick quantitative view — the agents add the qualitative debate)">
        <div className="h-72">
          <ResponsiveContainer>
            <RadarChart data={radar}>
              <PolarGrid /><PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} /><Tooltip /><Legend />
              {["A", "B", "C"].map((k, i) => <Radar key={k} dataKey={k} stroke={PALETTE[i]} fill={PALETTE[i]} fillOpacity={0.2} />)}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <ExportBtn onClick={() => onExport(calc.map((o) => `${o.name}: ${o.desc}. Investment ₹${o.cost} Cr, annual benefit ₹${o.benefit} Cr, ${o.months} months to value, delivery risk ${o.risk}/5, strategic fit ${o.fit}/5, est. payback ${o.payback.toFixed(1)} yrs, 3-yr ROI ${o.roi3.toFixed(0)}%`).join("\n") + "\nBudget: ₹15 Cr for ONE investment.")} />
    </div>
  );
}
