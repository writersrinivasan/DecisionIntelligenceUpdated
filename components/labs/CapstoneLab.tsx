"use client";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, ReferenceLine } from "recharts";
import { Printer, ArrowDown, CheckCircle2, Circle } from "lucide-react";
import WeightedMatrix from "./WeightedMatrix";
import Markdown from "../Markdown";
import { ExportBtn, LabProps, Panel, PALETTE } from "./shared";

const STEPS = ["7.1 Problem", "7.2 Data analysis", "7.3 AI analysis", "7.4 Option evaluation", "7.5 Exec dashboard", "7.6 Presentation"];
const COST = [{ q: "Q1", it: 82 }, { q: "Q2", it: 88 }, { q: "Q3", it: 97 }, { q: "Q4", it: 104 }, { q: "Q1'", it: 112 }];
const PROJ = [
  { p: "ERP upg", v: -35 }, { p: "CX app", v: -28 }, { p: "Data plat", v: -22 }, { p: "IAM", v: -18 }, { p: "WMS", v: -15 },
  { p: "HR SaaS", v: -4 }, { p: "Network", v: 2 }, { p: "Billing", v: -6 }, { p: "Mobile", v: 1 },
];
const INC = Array.from({ length: 13 }, (_, i) => ({ w: `W${i + 1}`, p1: [3, 4, 5, 4, 6, 5, 4, 7, 5, 6, 3, 5, 6][i] }));
const CLOUD = [{ n: "Compute", v: 44 }, { n: "Storage", v: 18 }, { n: "Data/DB", v: 16 }, { n: "Network", v: 10 }, { n: "Other", v: 8 }];

export default function CapstoneLab({ onExport, accent, uc, agentFinal }: LabProps & { agentFinal?: string }) {
  const [step, setStep] = useState(0);
  const [statement, setStatement] = useState("Deploy ₹25 Cr within 30 days to cut IT cost growth from +19% to ≤ +5%, bring ≥ 7 of 9 strategic projects on schedule, and halve P1 incidents on the customer platform within 2 quarters.");
  const [winner, setWinner] = useState<string | null>(null);
  const [matrix, setMatrix] = useState("");

  const kpis = [
    { k: "IT cost growth YoY", now: "+19%", target: "≤ +5%", rag: "R" },
    { k: "Strategic projects on time", now: "4 / 9", target: "7 / 9", rag: "R" },
    { k: "P1/P2 incidents (90d)", now: "58", target: "≤ 29", rag: "R" },
    { k: "MTTR (P1)", now: "128 min", target: "≤ 70 min", rag: "A" },
    { k: "Cloud commitment coverage", now: "22%", target: "70%", rag: "R" },
    { k: "Change failure rate", now: "21%", target: "≤ 12%", rag: "A" },
  ];

  return (
    <div className="space-y-5">
      {/* stepper */}
      <div className="card flex flex-wrap gap-2 p-3">
        {STEPS.map((s, i) => (
          <button key={s} onClick={() => setStep(i)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${i === step ? "text-white shadow-lg" : i < step ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"}`} style={i === step ? { background: accent } : undefined}>
            {i < step ? <CheckCircle2 size={16} /> : <Circle size={16} />} {s}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { t: "Rising IT cost", v: "+19%", d: "₹410 Cr total · cloud +48%", c: "from-rose-500 to-orange-500" },
            { t: "Delayed projects", v: "5 / 9", d: "avg schedule variance −21%", c: "from-amber-500 to-yellow-500" },
            { t: "Recurring incidents", v: "58", d: "P1/P2 in 90 days · ₹14 Cr impact", c: "from-fuchsia-500 to-purple-600" },
          ].map((x) => (
            <div key={x.t} className={`rounded-3xl bg-gradient-to-br ${x.c} p-6 text-white shadow-lg`}>
              <div className="text-sm font-bold uppercase opacity-80">{x.t}</div>
              <div className="font-display text-5xl font-bold">{x.v}</div>
              <div className="text-sm opacity-90">{x.d}</div>
            </div>
          ))}
          <Panel title="Your decision statement (edit as a team)" className="lg:col-span-3">
            <textarea className="input min-h-[80px] text-base" value={statement} onChange={(e) => setStatement(e.target.value)} />
            <p className="mt-1 text-xs text-slate-500">Good statements are specific, time-bound, and name measurable success criteria.</p>
          </Panel>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-5 md:grid-cols-2">
          <Panel title="IT cost per quarter (₹ Cr)">
            <div className="h-52"><ResponsiveContainer><LineChart data={COST}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="q" /><YAxis /><Tooltip /><Line dataKey="it" stroke="#ef4444" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
          </Panel>
          <Panel title="Project schedule variance (%)">
            <div className="h-52"><ResponsiveContainer><BarChart data={PROJ}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="p" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><ReferenceLine y={-10} stroke="#f59e0b" strokeDasharray="4 4" /><Bar dataKey="v">{PROJ.map((p, i) => <Cell key={i} fill={p.v < -10 ? "#ef4444" : p.v < 0 ? "#f59e0b" : "#10b981"} />)}</Bar></BarChart></ResponsiveContainer></div>
          </Panel>
          <Panel title="P1/P2 incidents per week (customer platform + others)">
            <div className="h-52"><ResponsiveContainer><BarChart data={INC}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="w" /><YAxis /><Tooltip /><Bar dataKey="p1" fill="#a855f7" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </Panel>
          <Panel title="Cloud spend mix (% of ₹96 Cr)">
            <div className="h-52"><ResponsiveContainer><PieChart><Pie data={CLOUD} dataKey="v" nameKey="n" innerRadius={45} outerRadius={80} label={(p: { name?: string }) => p.name}>{CLOUD.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
          </Panel>
          <div className="rounded-2xl bg-slate-900 p-4 text-sm text-white md:col-span-2">
            <b>Team prompt:</b> Name the ONE insight per chart that matters most for the decision. (e.g. “60% of incidents follow a deployment → this is a delivery-pipeline problem, not an ops-staffing problem.”)
          </div>
        </div>
      )}

      {step === 2 && (
        <Panel title="AI-powered decision analysis with LangGraph">
          <div className="grid gap-3 md:grid-cols-4">
            {["☁️ Cloud & Cost agent", "📅 Delivery agent", "🚨 Reliability agent"].map((a) => <div key={a} className="rounded-xl bg-pink-50 p-3 text-center text-sm font-semibold">{a}<div className="text-[11px] font-normal text-slate-500">runs in parallel</div></div>)}
            <div className="rounded-xl bg-violet-50 p-3 text-center text-sm font-semibold">♟️ Chief Strategist<div className="text-[11px] font-normal text-slate-500">fan-in → 🙋 CEO approval → 🎤 Board writer</div></div>
          </div>
          <p className="mt-3 text-sm text-slate-600">Send your decision statement and matrix (step 4) to the agent graph. It will pause for <b>your CEO approval</b> before writing the board presentation.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ExportBtn label="Load decision statement + matrix into the agent" onClick={() => onExport(`${uc.agent.data}\n\nDECISION STATEMENT: ${statement}${matrix ? `\n\nTEAM WEIGHTED MATRIX:\n${matrix}` : ""}`)} />
            <a href="#agent" className="btn-ghost"><ArrowDown size={16} /> Jump to the agent</a>
          </div>
        </Panel>
      )}

      {step === 3 && (
        <WeightedMatrix
          accent={accent}
          options={["FinOps+Vendors", "Platform Eng", "PMO reset", "AIOps+ITSM"]}
          criteria={[
            { name: "Cost reduction", weight: 25 },
            { name: "Delivery improvement", weight: 20 },
            { name: "Reliability improvement", weight: 20 },
            { name: "Time to value", weight: 15 },
            { name: "Execution risk (low = good)", weight: 10 },
            { name: "Strategic fit", weight: 10 },
          ]}
          scores={[
            [5, 2, 4, 2],
            [1, 4, 5, 2],
            [1, 5, 1, 4],
            [4, 2, 5, 3],
            [4, 3, 3, 3],
            [3, 5, 3, 4],
          ]}
          onChange={(s, w) => { setMatrix(s); setWinner(w); onExport(`${uc.agent.data}\n\nDECISION STATEMENT: ${statement}\n\nTEAM WEIGHTED MATRIX:\n${s}`); }}
        />
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.k} className="card p-4">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold">{k.k}</span><span className={`h-3 w-3 rounded-full ${k.rag === "R" ? "bg-rose-500" : k.rag === "A" ? "bg-amber-400" : "bg-emerald-500"}`} /></div>
                <div className="mt-2 flex items-end gap-3"><span className="font-display text-3xl font-bold">{k.now}</span><span className="pb-1 text-sm text-emerald-600">→ {k.target}</span></div>
                <div className="text-[11px] text-slate-400">current → 2-quarter target</div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4"><div className="label">Key insight</div><p className="mt-1 text-sm">Cost, delays and incidents share a root: under-governed delivery (no FinOps, overloaded architects, unsafe deployments).</p></div>
            <div className="rounded-2xl bg-rose-50 p-4"><div className="label">Top risk</div><p className="mt-1 text-sm">Stopping 2 projects triggers sponsor resistance; mitigate with CEO-backed portfolio criteria.</p></div>
            <div className="rounded-2xl bg-violet-50 p-4"><div className="label">Matrix winner</div><p className="mt-1 font-display text-xl font-bold">{winner ?? "Complete step 4"}</p></div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <div className="grid gap-2 md:grid-cols-6">
            {[["Decision matrix", !!matrix], ["AI insights", !!agentFinal], ["Prioritisation", !!winner], ["Risk assessment", !!agentFinal], ["Recommendation", !!agentFinal], ["Exec summary", !!agentFinal]].map(([d, ok]) => (
              <div key={d as string} className={`rounded-xl p-3 text-center text-xs font-bold ${ok ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>{ok ? "✅" : "⏳"} {d}</div>
            ))}
          </div>
          {!agentFinal ? (
            <div className="card p-6 text-center text-slate-500">Run the agent graph below (and approve as CEO). The Board Presentation Writer&apos;s slides will appear here, ready to present and print.</div>
          ) : (
            <>
              <div className="no-print flex justify-end"><button className="btn-primary" onClick={() => window.print()}><Printer size={16} /> Print / save as PDF</button></div>
              <div className="grid gap-4 md:grid-cols-2">
                {agentFinal.split(/\n(?=#{1,3}\s*Slide)/i).filter((s) => s.trim()).map((s, i) => (
                  <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
                    <div className="absolute inset-x-0 top-0 h-2" style={{ background: `linear-gradient(90deg, ${PALETTE[i % PALETTE.length]}, ${PALETTE[(i + 1) % PALETTE.length]})` }} />
                    <div className="h-full overflow-y-auto"><Markdown>{s}</Markdown></div>
                    <div className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-300">ALTORA · CIO · {i + 1}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
        <button className="btn-primary" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>Next: {STEPS[step + 1] ?? ""} →</button>
      </div>
    </div>
  );
}
