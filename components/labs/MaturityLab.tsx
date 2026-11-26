"use client";
import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ExportBtn, LabProps, Panel, Slider } from "./shared";

const DIMS = [
  { k: "Data availability", hint: "Can you get decision data in < 1 day?" },
  { k: "Analytics use", hint: "Are KPIs used in decision meetings?" },
  { k: "AI adoption", hint: "Do AI tools draft analysis / options?" },
  { k: "Human expertise", hint: "Are domain experts consulted systematically?" },
  { k: "Business context", hint: "Are decisions tied to business outcomes?" },
  { k: "Feedback loops", hint: "Do you review outcomes of past decisions?" },
];
const LEVELS = ["", "Ad-hoc (gut feel)", "Reactive (some data)", "Defined (data-driven)", "Augmented (AI-assisted)", "Intelligent (closed-loop DI)"];

const MODES = [
  { mode: "Intuition-driven", speed: 5, accuracy: 2, scale: 1, explain: 1, color: "#f97316", when: "Novel crises, no data, reversible calls" },
  { mode: "Data-driven", speed: 2, accuracy: 4, scale: 3, explain: 4, color: "#0ea5e9", when: "Recurring decisions with good data" },
  { mode: "AI-augmented", speed: 4, accuracy: 4, scale: 5, explain: 3, color: "#a855f7", when: "High-volume, multi-source, time-critical" },
];

const LIFECYCLE = [
  { s: "Identify", art: "Decision brief", py: "Is headcount the constraint for checkout predictability?", ai: "LLM reframes the ask into a testable decision" },
  { s: "Alternatives", art: "Option set", py: "Hire 2 squads · fix review bottleneck · cut unplanned work · contract QA · de-scope", ai: "Agent generates non-obvious options" },
  { s: "Evaluate", art: "Scored matrix", py: "Review wait = 4.1 of 11.4 days → flow, not capacity", ai: "Analytics scores options on the data" },
  { s: "Decide", art: "Decision memo", py: "Fix review + 1 squad in Q2 if lead time > 8d", ai: "Human decides; AI drafts memo & dissent" },
  { s: "Execute", art: "Plan + owners", py: "Reviewer rota, PR size limit, on-call rotation", ai: "Agent tracks actions" },
  { s: "Measure", art: "KPI review", py: "Lead time, delivered/planned, release dates hit", ai: "Auto KPI pull at 30/60/90d → learn" },
];

export default function MaturityLab({ onExport, accent, uc }: LabProps) {
  const [scores, setScores] = useState<number[]>([2, 3, 1, 4, 3, 1]);
  const [step, setStep] = useState(0);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const level = LEVELS[Math.max(1, Math.min(5, Math.round(avg)))];
  const data = DIMS.map((d, i) => ({ dim: d.k, you: scores[i], target: 4 }));
  const weakest = DIMS[scores.indexOf(Math.min(...scores))].k;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="① Rate your organisation (1–5)">
          <div className="space-y-3">
            {DIMS.map((d, i) => (
              <div key={d.k}>
                <Slider label={d.k} value={scores[i]} min={1} max={5} onChange={(v) => setScores((s) => s.map((x, j) => (j === i ? v : x)))} />
                <div className="-mt-1 text-[11px] text-slate-400">{d.hint}</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="② Your DI maturity radar">
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
                <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <Radar name="You" dataKey="you" stroke={accent} fill={accent} fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 p-4 text-white">
            <div className="text-xs font-bold uppercase opacity-80">Maturity level · {avg.toFixed(1)} / 5</div>
            <div className="font-display text-xl font-bold">{level}</div>
            <div className="text-sm opacity-90">Biggest lever: <b>{weakest}</b></div>
          </div>
        </Panel>
      </div>

      <Panel title="③ Three decision modes — when to use which">
        <div className="grid gap-3 md:grid-cols-3">
          {MODES.map((m) => (
            <div key={m.mode} className="rounded-2xl p-4 ring-2" style={{ borderColor: m.color, boxShadow: `inset 0 4px 0 ${m.color}` }}>
              <div className="font-display text-lg font-bold" style={{ color: m.color }}>{m.mode}</div>
              {(["speed", "accuracy", "scale", "explain"] as const).map((k) => (
                <div key={k} className="mt-2 flex items-center gap-2 text-xs">
                  <span className="w-20 capitalize text-slate-500">{k === "explain" ? "explainable" : k}</span>
                  <div className="flex gap-1">{[1, 2, 3, 4, 5].map((i) => <span key={i} className="h-2.5 w-5 rounded" style={{ background: i <= m[k] ? m.color : "#e2e8f0" }} />)}</div>
                </div>
              ))}
              <div className="mt-3 text-xs text-slate-600"><b>Best for:</b> {m.when}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="④ Walk the Pyxora decision through the lifecycle">
        <div className="flex flex-wrap gap-2">
          {LIFECYCLE.map((l, i) => (
            <button key={l.s} onClick={() => setStep(i)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${i === step ? "text-white shadow-lg" : i < step ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`} style={i === step ? { background: accent } : undefined}>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-xs">{i + 1}</span>{l.s}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4"><div className="label">Artefact</div><div className="mt-1 font-semibold">{LIFECYCLE[step].art}</div></div>
          <div className="rounded-xl bg-violet-50 p-4"><div className="label">Pyxora example</div><div className="mt-1 text-sm">{LIFECYCLE[step].py}</div></div>
          <div className="rounded-xl bg-fuchsia-50 p-4"><div className="label">Where AI helps</div><div className="mt-1 text-sm">{LIFECYCLE[step].ai}</div></div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
          <button className="btn-ghost" disabled={step === LIFECYCLE.length - 1} onClick={() => setStep(step + 1)}>Next step</button>
        </div>
      </Panel>

      <ExportBtn
        label="Send my maturity profile to the agent"
        onClick={() =>
          onExport(
            `${uc.agent.data}\n\nOUR DI MATURITY (1-5):\n${data.map((d) => `${d.dim}: ${d.you}/5`).join("\n")}\nOverall maturity: ${avg.toFixed(1)} (${level}); weakest: ${weakest}\n\nDecision under review (Pyxora):\n${LIFECYCLE.map((l) => `- ${l.s}: ${l.py}`).join("\n")}`,
            "Given our DI maturity profile, how should we run the Pyxora headcount decision and what should we improve first in our decision process?",
          )
        }
      />
    </div>
  );
}
