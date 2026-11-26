"use client";
import { useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell, LabelList } from "recharts";
import { ExportBtn, LabProps, Panel, Slider, Stat } from "./shared";

type M = "Must" | "Should" | "Could" | "Won't";
interface I { name: string; cost: number; reach: number; impact: number; conf: number; effort: number; bv: number; tc: number; rr: number; size: number; moscow: M }

const INIT: I[] = [
  { name: "e-Prescription compliance", cost: 1.8, reach: 9, impact: 2, conf: 90, effort: 6, bv: 8, tc: 10, rr: 9, size: 5, moscow: "Must" },
  { name: "Patient app redesign", cost: 3.2, reach: 10, impact: 2, conf: 60, effort: 12, bv: 7, tc: 3, rr: 2, size: 13, moscow: "Should" },
  { name: "EHR cloud migration", cost: 4.5, reach: 8, impact: 3, conf: 50, effort: 18, bv: 8, tc: 5, rr: 8, size: 20, moscow: "Should" },
  { name: "AI radiology triage pilot", cost: 1.5, reach: 3, impact: 3, conf: 50, effort: 5, bv: 6, tc: 4, rr: 3, size: 5, moscow: "Could" },
  { name: "Bed management dashboard", cost: 0.6, reach: 6, impact: 2, conf: 80, effort: 2, bv: 7, tc: 8, rr: 4, size: 2, moscow: "Should" },
  { name: "Ransomware resilience", cost: 1.4, reach: 10, impact: 3, conf: 80, effort: 4, bv: 6, tc: 9, rr: 10, size: 3, moscow: "Must" },
  { name: "Tele-consult scaling", cost: 1.1, reach: 7, impact: 2, conf: 70, effort: 4, bv: 8, tc: 6, rr: 2, size: 3, moscow: "Should" },
  { name: "Billing automation (RPA)", cost: 0.8, reach: 5, impact: 1, conf: 90, effort: 2, bv: 6, tc: 4, rr: 3, size: 2, moscow: "Could" },
  { name: "Data warehouse modernisation", cost: 2.2, reach: 6, impact: 2, conf: 60, effort: 9, bv: 6, tc: 3, rr: 4, size: 8, moscow: "Could" },
  { name: "Clinician chatbot (GenAI)", cost: 0.9, reach: 4, impact: 2, conf: 40, effort: 3, bv: 5, tc: 5, rr: 1, size: 3, moscow: "Could" },
  { name: "Supply-chain visibility", cost: 0.7, reach: 4, impact: 1, conf: 70, effort: 3, bv: 5, tc: 4, rr: 3, size: 3, moscow: "Won't" },
  { name: "Network refresh (3 hospitals)", cost: 0.6, reach: 8, impact: 1, conf: 90, effort: 3, bv: 4, tc: 7, rr: 6, size: 3, moscow: "Should" },
];

const MC: Record<M, string> = { Must: "bg-rose-100 text-rose-700", Should: "bg-amber-100 text-amber-800", Could: "bg-sky-100 text-sky-700", "Won't": "bg-slate-100 text-slate-500" };

export default function PrioritizeLab({ onExport, accent }: LabProps) {
  const [items, setItems] = useState(INIT);
  const [method, setMethod] = useState<"RICE" | "WSJF">("WSJF");
  const [budget, setBudget] = useState(11);
  const [mustFirst, setMustFirst] = useState(true);

  const ranked = useMemo(() => {
    const s = items.map((i) => ({ ...i, rice: (i.reach * i.impact * (i.conf / 100)) / i.effort, wsjf: (i.bv + i.tc + i.rr) / i.size }));
    const key = method === "RICE" ? "rice" : "wsjf";
    s.sort((a, b) => (mustFirst ? Number(b.moscow === "Must") - Number(a.moscow === "Must") : 0) || b[key] - a[key]);
    let spent = 0;
    return s.map((i) => {
      const funded = i.moscow !== "Won't" && spent + i.cost <= budget;
      if (funded) spent += i.cost;
      return { ...i, score: i[key], funded };
    });
  }, [items, method, budget, mustFirst]);

  const funded = ranked.filter((r) => r.funded);
  const spent = funded.reduce((a, b) => a + b.cost, 0);
  const value = funded.reduce((a, b) => a + b.bv, 0);
  const scatter = ranked.map((r) => ({ x: r.effort, y: r.reach * r.impact * (r.conf / 100), z: r.cost * 100, name: r.name.split(" ")[0], funded: r.funded }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl bg-slate-100 p-1">
          {(["RICE", "WSJF"] as const).map((m) => (
            <button key={m} onClick={() => setMethod(m)} className={`rounded-lg px-4 py-1.5 text-sm font-bold ${method === m ? "bg-white shadow" : "text-slate-500"}`}>{m}</button>
          ))}
        </div>
        <div className="w-64"><Slider label="Budget" value={budget} min={4} max={19} step={0.5} onChange={setBudget} suffix=" ₹Cr" /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={mustFirst} onChange={(e) => setMustFirst(e.target.checked)} /> Fund MoSCoW “Must” first</label>
        <div className="ml-auto rounded-xl bg-slate-900 px-3 py-2 font-mono text-xs text-white">{method === "RICE" ? "RICE = Reach × Impact × Confidence ÷ Effort" : "WSJF = (Value + Time-criticality + Risk-reduction) ÷ Job size"}</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Funded" value={`${funded.length} / ${items.length}`} color={accent} />
        <Stat label="Spent" value={`₹${spent.toFixed(1)} / ${budget} Cr`} color="#0ea5e9" />
        <Stat label="Business value funded" value={String(value)} sub="sum of value points" color="#10b981" />
      </div>
      <div className="grid gap-5 lg:grid-cols-5">
        <Panel title={`Ranked by ${method} · cut-line at ₹${budget} Cr`} className="lg:col-span-3">
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white text-left uppercase text-slate-500"><tr><th className="p-1.5">#</th><th>Initiative</th><th>MoSCoW</th><th>₹Cr</th><th>{method}</th><th>Value</th><th>Size</th></tr></thead>
              <tbody>
                {ranked.map((r, i) => {
                  const cut = i > 0 && ranked[i - 1].funded && !r.funded;
                  return (
                    <tr key={r.name} className={`${r.funded ? "" : "opacity-50"} ${cut ? "border-t-4 border-dashed border-rose-400" : "border-t border-slate-100"}`}>
                      <td className="p-1.5 font-bold">{i + 1}</td>
                      <td className="font-semibold">{r.funded ? "✅ " : "⏸ "}{r.name}</td>
                      <td>
                        <select className={`rounded px-1 font-bold ${MC[r.moscow]}`} value={r.moscow} onChange={(e) => setItems(items.map((x) => (x.name === r.name ? { ...x, moscow: e.target.value as M } : x)))}>
                          {(["Must", "Should", "Could", "Won't"] as M[]).map((m) => <option key={m}>{m}</option>)}
                        </select>
                      </td>
                      <td>{r.cost}</td>
                      <td className="font-bold" style={{ color: accent }}>{r.score.toFixed(2)}</td>
                      <td><input type="number" className="w-12 rounded border border-slate-200 px-1" value={r.bv} min={1} max={10} onChange={(e) => setItems(items.map((x) => (x.name === r.name ? { ...x, bv: +e.target.value } : x)))} /></td>
                      <td><input type="number" className="w-12 rounded border border-slate-200 px-1" value={r.size} min={1} max={21} onChange={(e) => setItems(items.map((x) => (x.name === r.name ? { ...x, size: +e.target.value, effort: +e.target.value } : x)))} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Impact–Effort matrix" className="lg:col-span-2">
          <div className="relative h-[380px]">
            <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2 grid-rows-2 p-10 pl-14 text-[11px] font-bold uppercase text-slate-400">
              <div>⭐ Quick wins</div><div className="text-right">🚀 Big bets</div><div className="self-end">🧩 Fill-ins</div><div className="self-end text-right">🕳 Money pits</div>
            </div>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Effort" label={{ value: "Effort →", position: "insideBottom", offset: -10, fontSize: 11 }} />
                <YAxis type="number" dataKey="y" name="Impact" label={{ value: "Impact →", angle: -90, position: "insideLeft", fontSize: 11 }} />
                <ZAxis dataKey="z" range={[60, 400]} />
                <ReferenceLine x={7} stroke="#cbd5e1" /><ReferenceLine y={3} stroke="#cbd5e1" />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={scatter}>
                  {scatter.map((s, i) => <Cell key={i} fill={s.funded ? accent : "#cbd5e1"} />)}
                  <LabelList dataKey="name" position="top" fontSize={9} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <ExportBtn
        onClick={() =>
          onExport(
            `Budget: ₹${budget} Cr. Method: ${method}. Musts funded first: ${mustFirst}\nInitiative | MoSCoW | Cost ₹Cr | Reach | Impact | Confidence% | Effort | BizValue | TimeCrit | RiskRed | JobSize | RICE | WSJF | Funded\n${ranked.map((r) => `${r.name} | ${r.moscow} | ${r.cost} | ${r.reach} | ${r.impact} | ${r.conf} | ${r.effort} | ${r.bv} | ${r.tc} | ${r.rr} | ${r.size} | ${r.rice.toFixed(2)} | ${r.wsjf.toFixed(2)} | ${r.funded ? "YES" : "no"}`).join("\n")}`,
            `Which initiatives should Brightpath fund with ₹${budget} Cr, and how should we communicate the deferrals?`,
          )
        }
      />
    </div>
  );
}
