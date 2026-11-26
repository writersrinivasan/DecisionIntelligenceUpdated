"use client";
import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { Upload } from "lucide-react";
import { ExportBtn, LabProps, Panel, Stat } from "./shared";

const SAMPLE = `category,line_item,type,budget_cr,actual_cr
Infrastructure,Data centre & colocation,Run,9.5,10.2
Infrastructure,Cloud (AWS) streaming,Run,22,27.8
Infrastructure,Network & CDN,Run,8,8.4
Applications,ERP & finance systems,Run,7.5,7.1
Applications,Content management platform,Run,6,6.3
Applications,Recommendation engine v2,Grow,5,3.1
Applications,Ad-tech platform,Grow,6.5,5.9
Security,SOC & managed security,Run,5,5.2
Security,Zero-trust programme,Transform,3,1.4
Data & AI,Data platform,Grow,6,6.8
Data & AI,GenAI content tagging,Transform,4,1.2
Data & AI,Personalisation ML,Transform,3.5,2.0
People,IT staff (run),Run,18,18.6
People,Product engineering,Grow,12,12.9
Vendors,Managed services & AMC,Run,4,4.4
`;

const TYPE_COL: Record<string, string> = { Run: "#94a3b8", Grow: "#0ea5e9", Transform: "#d946ef" };

function parse(csv: string) {
  const lines = csv.trim().split(/\r?\n/);
  const head = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (k: string) => head.indexOf(k);
  return lines.slice(1).map((l) => {
    const c = l.split(",");
    return { category: c[idx("category")] ?? "Other", item: c[idx("line_item")] ?? "", type: (c[idx("type")] ?? "Run").trim(), budget: +c[idx("budget_cr")] || 0, actual: +c[idx("actual_cr")] || 0 };
  }).filter((r) => r.item);
}

export default function BudgetLab({ onExport, accent }: LabProps) {
  const [csv, setCsv] = useState(SAMPLE);
  const rows = useMemo(() => parse(csv), [csv]);
  const tb = rows.reduce((a, r) => a + r.budget, 0);
  const ta = rows.reduce((a, r) => a + r.actual, 0);
  const mix = ["Run", "Grow", "Transform"].map((t) => ({ name: t, value: +rows.filter((r) => r.type === t).reduce((a, r) => a + r.actual, 0).toFixed(1) }));
  const cats = Array.from(new Set(rows.map((r) => r.category))).map((c) => ({ c, Budget: +rows.filter((r) => r.category === c).reduce((a, r) => a + r.budget, 0).toFixed(1), Actual: +rows.filter((r) => r.category === c).reduce((a, r) => a + r.actual, 0).toFixed(1) }));
  const variances = [...rows].map((r) => ({ ...r, v: r.actual - r.budget })).sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 6);

  const upload = (f?: File) => f && f.text().then(setCsv);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Budget" value={`₹${tb.toFixed(1)} Cr`} color="#64748b" />
        <Stat label="Actual / forecast" value={`₹${ta.toFixed(1)} Cr`} color={accent} />
        <Stat label="Variance" value={`${ta > tb ? "+" : ""}${(((ta - tb) / tb) * 100).toFixed(1)}%`} color={ta > tb ? "#ef4444" : "#10b981"} />
        <Stat label="Run share" value={`${Math.round((mix[0].value / (ta || 1)) * 100)}%`} sub="Run / Grow / Transform" color="#94a3b8" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Budget CSV (edit or upload)">
          <textarea className="input h-72 font-mono text-[11px]" value={csv} onChange={(e) => setCsv(e.target.value)} />
          <label className="btn-ghost mt-2 cursor-pointer"><Upload size={16} /> Upload CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label>
          <p className="mt-1 text-[11px] text-slate-400">Columns: category,line_item,type(Run/Grow/Transform),budget_cr,actual_cr</p>
        </Panel>
        <Panel title="Run · Grow · Transform mix (actual)">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3} label={(p: { name?: string; percent?: number }) => `${p.name} ${Math.round((p.percent ?? 0) * 100)}%`}>
                  {mix.map((m) => <Cell key={m.name} fill={TYPE_COL[m.name]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500">Benchmark: leading digital firms target ≤ 60% Run.</p>
        </Panel>
        <Panel title="Budget vs actual by category">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={cats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="c" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={50} /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="Budget" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill={accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <Panel title="Largest variances">
        <div className="grid gap-2 md:grid-cols-3">
          {variances.map((v) => (
            <div key={v.item} className={`rounded-xl p-3 ${v.v > 0 ? "bg-rose-50" : "bg-emerald-50"}`}>
              <div className="text-sm font-semibold">{v.item}</div>
              <div className="text-xs text-slate-500">{v.category} · {v.type}</div>
              <div className={`font-display text-xl font-bold ${v.v > 0 ? "text-rose-600" : "text-emerald-600"}`}>{v.v > 0 ? "+" : ""}₹{v.v.toFixed(1)} Cr</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Notice: Transform lines are <b>under</b>-spent while Run lines overrun — a classic pattern.</p>
      </Panel>
      <ExportBtn onClick={() => onExport(`Totals computed in code (use these exactly): budget ₹${tb.toFixed(1)} Cr, actual ₹${ta.toFixed(1)} Cr. Mix (actual): ${mix.map((m) => `${m.name} ₹${m.value} Cr`).join(", ")}.\n\n${csv}`)} />
    </div>
  );
}
