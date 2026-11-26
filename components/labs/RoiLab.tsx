"use client";
import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar, ReferenceLine, Cell } from "recharts";
import { ExportBtn, LabProps, Panel, Stat } from "./shared";

interface In { refresh: number; refreshNeeded: boolean; onpremOpex: number; migration: number; dualRun: number; cloudRun: number; cloudGrowth: number; benefit: number; rate: number; years: number }

function model(i: In) {
  const rows: { year: string; stay: number; migrate: number }[] = [];
  let cs = 0, cm = 0, npv = 0, payback: number | null = null;
  for (let y = 0; y <= i.years; y++) {
    const stay = y === 0 ? (i.refreshNeeded ? i.refresh : 0) : i.onpremOpex;
    const benefit = y === 0 ? 0 : i.benefit * (y === 1 ? 0.5 : 1);
    const mig = y === 0 ? i.migration : i.cloudRun * Math.pow(1 + i.cloudGrowth / 100, y - 1) + (y === 1 ? i.dualRun : 0) - benefit;
    cs += stay; cm += mig;
    npv += (stay - mig) / Math.pow(1 + i.rate / 100, y);
    if (payback === null && cm <= cs) payback = y;
    rows.push({ year: `Y${y}`, stay: +cs.toFixed(2), migrate: +cm.toFixed(2) });
  }
  const invest = i.migration + i.dualRun;
  const roi = ((cs - cm) / invest) * 100;
  return { rows, npv, roi, payback, tcoStay: cs, tcoMig: cm };
}

const FIELDS: { k: keyof In; label: string; step: number }[] = [
  { k: "refresh", label: "Hardware refresh (one-time) ₹Cr", step: 0.5 },
  { k: "onpremOpex", label: "On-prem opex / yr ₹Cr (DC, licences, staff)", step: 0.1 },
  { k: "migration", label: "Migration one-time ₹Cr", step: 0.5 },
  { k: "dualRun", label: "Dual-running cost (yr 1) ₹Cr", step: 0.1 },
  { k: "cloudRun", label: "Cloud run cost / yr ₹Cr (incl. ops staff)", step: 0.1 },
  { k: "cloudGrowth", label: "Cloud cost growth % / yr", step: 1 },
  { k: "benefit", label: "Business benefit / yr ₹Cr (time-to-market)", step: 0.1 },
  { k: "rate", label: "Discount rate %", step: 0.5 },
];

export default function RoiLab({ onExport, accent, uc }: LabProps) {
  const [inp, setInp] = useState<In>({ refresh: 14, refreshNeeded: true, onpremOpex: 6.7, migration: 9.5, dualRun: 2.5, cloudRun: 8.4, cloudGrowth: 6, benefit: 3, rate: 11, years: 5 });
  const base = useMemo(() => model(inp), [inp]);
  const scen = useMemo(() => ({
    Best: model({ ...inp, migration: inp.migration * 0.9, cloudRun: inp.cloudRun * 0.9, benefit: inp.benefit * 1.3 }),
    Expected: base,
    Worst: model({ ...inp, migration: inp.migration * 1.4, cloudRun: inp.cloudRun * 1.3, benefit: inp.benefit * 0.5, cloudGrowth: inp.cloudGrowth + 6 }),
  }), [inp, base]);
  const tornado = useMemo(() => (["migration", "cloudRun", "benefit", "onpremOpex", "dualRun", "rate", "cloudGrowth"] as (keyof In)[]).map((k) => {
    const lo = model({ ...inp, [k]: (inp[k] as number) * 0.8 }).npv - base.npv;
    const hi = model({ ...inp, [k]: (inp[k] as number) * 1.2 }).npv - base.npv;
    return { k: FIELDS.find((f) => f.k === k)!.label.split(" ₹")[0].split(" %")[0], lo: +lo.toFixed(2), hi: +hi.toFixed(2), span: Math.abs(hi - lo) };
  }).sort((a, b) => b.span - a.span), [inp, base]);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Assumptions (Halvorn Bank)">
          <div className="space-y-2">
            {FIELDS.map((f) => (
              <label key={f.k} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-600">{f.label}</span>
                <input type="number" step={f.step} className="input w-24 py-1 text-right font-bold" value={inp[f.k] as number} onChange={(e) => setInp({ ...inp, [f.k]: +e.target.value })} />
              </label>
            ))}
            <label className="flex items-center gap-2 pt-2 text-sm font-semibold"><input type="checkbox" checked={inp.refreshNeeded} onChange={(e) => setInp({ ...inp, refreshNeeded: e.target.checked })} /> Hardware refresh is unavoidable if we stay</label>
          </div>
        </Panel>
        <div className="space-y-5 lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label={`NPV (${inp.years}y @ ${inp.rate}%)`} value={`₹${base.npv.toFixed(1)} Cr`} color={base.npv >= 0 ? "#10b981" : "#ef4444"} />
            <Stat label="ROI on migration" value={`${base.roi.toFixed(0)}%`} color={accent} />
            <Stat label="Payback" value={base.payback === null ? "never" : base.payback === 0 ? "Y0" : `Year ${base.payback}`} color="#0ea5e9" />
            <Stat label="5-yr TCO stay vs migrate" value={`${base.tcoStay.toFixed(0)} vs ${base.tcoMig.toFixed(0)}`} sub="₹ Cr, net of benefits" color="#64748b" />
          </div>
          <Panel title="Cumulative cost (₹ Cr) — where the lines cross is payback">
            <div className="h-60">
              <ResponsiveContainer>
                <LineChart data={base.rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" /><YAxis /><Tooltip /><Legend />
                  <Line dataKey="stay" name="Stay on-prem" stroke="#94a3b8" strokeWidth={3} />
                  <Line dataKey="migrate" name="Migrate to AWS" stroke={accent} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Scenarios">
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(scen) as [string, ReturnType<typeof model>][]).map(([k, m]) => (
              <div key={k} className={`rounded-2xl p-4 text-center ${k === "Best" ? "bg-emerald-50" : k === "Worst" ? "bg-rose-50" : "bg-sky-50"}`}>
                <div className="text-xs font-bold uppercase text-slate-500">{k} case</div>
                <div className={`font-display text-2xl font-bold ${m.npv >= 0 ? "text-emerald-600" : "text-rose-600"}`}>₹{m.npv.toFixed(1)} Cr</div>
                <div className="text-xs text-slate-500">NPV · payback {m.payback === null ? "never" : `Y${m.payback}`}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Worst = migration +40%, cloud run +30%, benefits −50%, cloud growth +6 pts.</p>
        </Panel>
        <Panel title="Sensitivity tornado · NPV change for ±20% on each input">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={tornado} layout="vertical" stackOffset="sign" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" /><YAxis type="category" dataKey="k" width={130} tick={{ fontSize: 11 }} />
                <Tooltip /><ReferenceLine x={0} stroke="#0f172a" />
                <Bar dataKey="lo" name="−20%" stackId="s">{tornado.map((t, i) => <Cell key={i} fill={t.lo < 0 ? "#f43f5e" : "#10b981"} />)}</Bar>
                <Bar dataKey="hi" name="+20%" stackId="s">{tornado.map((t, i) => <Cell key={i} fill={t.hi < 0 ? "#f43f5e" : "#10b981"} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500">Top bar = the assumption to validate first (e.g. with a pilot workload).</p>
        </Panel>
      </div>
      <ExportBtn onClick={() => onExport(`${uc.agent.data}\n\nMODEL OUTPUT (from our lab):\nAssumptions: ${JSON.stringify(inp)}\nNPV ₹${base.npv.toFixed(2)} Cr; ROI ${base.roi.toFixed(0)}%; payback ${base.payback ?? "never"}; 5y TCO stay ₹${base.tcoStay.toFixed(1)} Cr vs migrate ₹${base.tcoMig.toFixed(1)} Cr (net of benefits)\nScenarios NPV: best ₹${scen.Best.npv.toFixed(1)}, expected ₹${scen.Expected.npv.toFixed(1)}, worst ₹${scen.Worst.npv.toFixed(1)} Cr\nMost sensitive assumptions: ${tornado.slice(0, 3).map((t) => `${t.k} (NPV swing ₹${t.span.toFixed(1)} Cr)`).join(", ")}`)} />
    </div>
  );
}
