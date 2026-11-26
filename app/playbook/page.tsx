"use client";
import { useState } from "react";
import { Plus, Trash2, Wand2, Database, BrainCircuit, Bot, ShieldCheck, MonitorSmartphone, RefreshCcw, Plug, AlertOctagon, CheckCircle2 } from "lucide-react";
import AgentRunner from "@/components/AgentRunner";
import type { AgentNode } from "@/lib/types";

const LAYERS = [
  { t: "Experience", i: MonitorSmartphone, c: "from-pink-500 to-rose-500", items: ["Executive copilot (chat)", "Decision dashboards (Power BI)", "Teams / Slack approvals", "Board-pack generator"] },
  { t: "Governance", i: ShieldCheck, c: "from-amber-500 to-orange-500", items: ["HITL interrupt & escalation", "Guardrails & policy checks", "Immutable audit log", "RAI: bias, explainability"] },
  { t: "Agents (LangGraph)", i: Bot, c: "from-violet-600 to-fuchsia-500", items: ["Stateful graphs & checkpointer", "Specialist agents (fan-out/in)", "Tool calling (APIs, SQL, RAG)", "n8n for workflow triggers"] },
  { t: "Intelligence", i: BrainCircuit, c: "from-sky-500 to-indigo-500", items: ["KPIs & analytics (4 levels)", "ML: forecast, anomaly, classify", "RAG knowledge base (policies, ADRs)", "LLMs via Groq / Bedrock"] },
  { t: "Data", i: Database, c: "from-emerald-500 to-teal-500", items: ["Lakehouse / warehouse", "Semantic KPI layer", "Data quality & lineage", "Access control & masking"] },
  { t: "Sources", i: Plug, c: "from-slate-500 to-slate-700", items: ["Jira · Git · CI/CD", "ServiceNow · PagerDuty", "Cloud billing (CUR)", "Datadog · Splunk · ERP"] },
];

const ROADMAP = [
  { d: "Days 0–30", t: "Foundation", c: "#8b5cf6", items: ["Pick 3 high-value recurring decisions", "Name decision owners", "Decision register + brief template", "Connect 2–3 data sources; baseline KPIs", "Approve AI usage & data policy (BYOK / private tenant)"], kpi: "Baseline decision cycle time" },
  { d: "Days 31–60", t: "Pilot", c: "#ec4899", items: ["Build first LangGraph workflow (e.g. incident RCA or capacity)", "HITL on every recommendation", "Shadow-mode: compare AI vs human decision", "Evaluation set of 30 past decisions"], kpi: "Agreement rate, hours saved" },
  { d: "Days 61–90", t: "Scale", c: "#f97316", items: ["Add RAG over policies/ADRs", "Autonomy levels per decision class", "Executive scorecard live", "Quarterly decision-effectiveness review"], kpi: "Decisions with tracked outcomes ≥ 80%" },
];

const READY = [
  "We can name our 5 most important recurring technology decisions",
  "Each has a named decision owner",
  "Key data (delivery, incidents, cloud cost) is accessible via API/export",
  "We have agreed KPI definitions across teams",
  "We have an approved policy for using LLMs with company data",
  "We have someone who can build/maintain a LangGraph or n8n workflow",
  "We review outcomes of major decisions after the fact",
  "Leadership will accept AI recommendations as one input, with human sign-off",
];

const PITFALLS = [
  "Starting with the technology instead of a specific decision",
  "Letting the LLM compute numbers (compute in code; let the LLM explain)",
  "No human accountability ('the AI decided')",
  "Dashboards nobody uses because no decision depends on them",
  "Skipping the feedback loop, so nothing is learned",
];

type Draft = AgentNode & { kind: "llm" | "human" };

const TEMPLATES: Record<string, { question: string; data: string; stages: Draft[][] }> = {
  "Vendor renewal decision": {
    question: "Should we renew our observability vendor contract (₹3.2 Cr/yr) for 3 years or switch?",
    data: "Current vendor: ₹3.2 Cr/yr, 3-year renewal discount 18%. Usage: 40% of features used. MTTR improved 25% since adoption. Alternative open-source stack (Grafana/Prometheus/OTel): est. ₹1.1 Cr/yr infra + 4 FTE. Migration 6 months. Team satisfaction 7/10.",
    stages: [
      [
        { id: "finance", label: "Finance Analyst", emoji: "💰", kind: "llm", role: "3-yr TCO comparison", prompt: "Compare 3-year TCO of renew vs switch including people and migration costs." },
        { id: "eng", label: "Engineering Lead", emoji: "🛠️", kind: "llm", role: "Technical & migration risk", prompt: "Assess technical capability gap, migration risk and impact on MTTR." },
      ],
      [{ id: "advisor", label: "CIO Advisor", emoji: "👔", kind: "llm", role: "Recommendation", prompt: "Recommend renew / switch / renegotiate with rationale, negotiation levers and conditions." }],
      [{ id: "approve", label: "CIO Approval", emoji: "🙋", kind: "human", role: "Human sign-off", prompt: "" }],
      [{ id: "memo", label: "Memo Writer", emoji: "📝", kind: "llm", role: "Final decision memo", prompt: "Write the final decision memo reflecting the human decision and notes." }],
    ],
  },
  "Blank (2 agents)": {
    question: "",
    data: "",
    stages: [
      [{ id: "analyst", label: "Analyst", emoji: "🔍", kind: "llm", role: "Analyses the data", prompt: "Analyse the data and list key insights with numbers." }],
      [{ id: "advisor", label: "Advisor", emoji: "🧭", kind: "llm", role: "Recommends", prompt: "Recommend a decision with rationale, risks and KPIs." }],
    ],
  },
};

export default function Playbook() {
  const [checks, setChecks] = useState<boolean[]>(READY.map(() => false));
  const score = checks.filter(Boolean).length;
  const [tpl, setTpl] = useState("Vendor renewal decision");
  const [stages, setStages] = useState<Draft[][]>(TEMPLATES[tpl].stages);
  const [question, setQuestion] = useState(TEMPLATES[tpl].question);
  const [data, setData] = useState(TEMPLATES[tpl].data);
  const [company, setCompany] = useState("Your organisation");
  const [version, setVersion] = useState(0);

  const loadTpl = (k: string) => { setTpl(k); setStages(TEMPLATES[k].stages); setQuestion(TEMPLATES[k].question); setData(TEMPLATES[k].data); setVersion((v) => v + 1); };
  const updNode = (si: number, ni: number, patch: Partial<Draft>) => setStages(stages.map((s, i) => (i === si ? s.map((n, j) => (j === ni ? { ...n, ...patch } : n)) : s)));
  const addNode = (si: number) => setStages(stages.map((s, i) => (i === si && s.length < 4 ? [...s, { id: `agent${Date.now() % 100000}`, label: "New agent", emoji: "🤖", kind: "llm", role: "Describe role", prompt: "You are..." }] : s)));
  const delNode = (si: number, ni: number) => setStages(stages.map((s, i) => (i === si ? s.filter((_, j) => j !== ni) : s)).filter((s) => s.length));
  const addStage = () => stages.length < 5 && setStages([...stages, [{ id: `step${Date.now() % 100000}`, label: "Next agent", emoji: "🧠", kind: "llm", role: "Describe role", prompt: "You are..." }]]);

  return (
    <div className="pb-24">
      <section className="bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-xs font-bold uppercase tracking-widest text-fuchsia-200">End-to-end implementation</div>
          <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Implementation Playbook</h1>
          <p className="mt-2 max-w-3xl text-lg text-white/80">How to take Decision Intelligence from this room into your organisation: reference architecture, a 90-day roadmap, a readiness check, and an agent builder for designing your own workflow.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 pt-10">
        {/* Architecture */}
        <section>
          <h2 className="font-display text-2xl font-bold">1 · Reference architecture</h2>
          <p className="mb-4 text-slate-600">Six layers, with a feedback loop that carries outcomes back to the data.</p>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              {LAYERS.map((l) => (
                <div key={l.t} className={`flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r ${l.c} p-3 text-white shadow`}>
                  <div className="flex w-48 items-center gap-2 font-display font-bold"><l.i size={20} /> {l.t}</div>
                  <div className="flex flex-1 flex-wrap gap-2">{l.items.map((x) => <span key={x} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">{x}</span>)}</div>
                </div>
              ))}
            </div>
            <div className="hidden w-24 flex-col items-center justify-center rounded-2xl bg-teal-50 p-2 text-center ring-2 ring-teal-300 md:flex">
              <RefreshCcw className="text-teal-600" />
              <div className="mt-2 text-xs font-bold text-teal-700">Feedback loop</div>
              <div className="text-[10px] text-teal-600">outcomes → data → better decisions</div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <h2 className="mb-4 font-display text-2xl font-bold">2 · 90-day roadmap</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {ROADMAP.map((r, i) => (
              <div key={r.d} className="card relative overflow-hidden p-5">
                <div className="absolute inset-x-0 top-0 h-2" style={{ background: r.c }} />
                <div className="text-xs font-bold uppercase" style={{ color: r.c }}>{r.d}</div>
                <div className="font-display text-xl font-bold">{i + 1}. {r.t}</div>
                <ul className="mt-2 space-y-1.5 text-sm">{r.items.map((x) => <li key={x} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: r.c }} />{x}</li>)}</ul>
                <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs"><b>Success KPI:</b> {r.kpi}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Readiness */}
        <section className="grid gap-5 lg:grid-cols-3">
          <div className="card p-5 lg:col-span-2">
            <h2 className="mb-3 font-display text-2xl font-bold">3 · Readiness check</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {READY.map((q, i) => (
                <button key={q} onClick={() => setChecks(checks.map((c, j) => (j === i ? !c : c)))} className={`flex items-start gap-2 rounded-xl p-3 text-left text-sm ring-1 transition ${checks[i] ? "bg-emerald-50 ring-emerald-300" : "bg-white ring-slate-200 hover:bg-slate-50"}`}>
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md text-xs text-white ${checks[i] ? "bg-emerald-500" : "bg-slate-300"}`}>{checks[i] ? "✓" : ""}</span>{q}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className={`rounded-3xl p-6 text-white shadow-lg ${score >= 6 ? "bg-gradient-to-br from-emerald-500 to-teal-600" : score >= 3 ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-rose-500 to-pink-600"}`}>
              <div className="text-xs font-bold uppercase opacity-80">Readiness</div>
              <div className="font-display text-5xl font-bold">{score}/8</div>
              <div className="mt-2 text-sm">{score >= 6 ? "Ready to pilot. Start the Days 31–60 phase with one agentic workflow." : score >= 3 ? "Foundations first: decision owners, KPI definitions and an AI policy." : "Start with a decision register and 3 named decisions. No tooling yet."}</div>
            </div>
            <div className="card p-5">
              <div className="mb-2 flex items-center gap-2 font-display font-bold"><AlertOctagon className="text-rose-500" size={18} /> Pitfalls to avoid</div>
              <ul className="space-y-1.5 text-sm text-slate-600">{PITFALLS.map((p) => <li key={p}>✗ {p}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* Builder */}
        <section>
          <h2 className="font-display text-2xl font-bold">4 · Agent builder: design your own decision workflow</h2>
          <p className="mb-4 text-slate-600">Pick a template or build from scratch. Agents placed in the same stage run in parallel. A <b>Human</b> node pauses the graph for approval. Up to 5 stages with 4 agents each.</p>
          <div className="card space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Wand2 className="text-violet-600" />
              {Object.keys(TEMPLATES).map((k) => <button key={k} onClick={() => loadTpl(k)} className={`rounded-full px-3 py-1.5 text-sm font-semibold ${tpl === k ? "bg-violet-600 text-white" : "bg-slate-100"}`}>{k}</button>)}
              <input className="input ml-auto w-60" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Organisation name" />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {stages.map((s, si) => (
                <div key={si} className="w-72 shrink-0 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase text-slate-500">Stage {si + 1}{s.length > 1 && " · parallel"}<button onClick={() => addNode(si)} className="rounded-lg bg-white p-1 ring-1 ring-slate-200" title="Add parallel agent"><Plus size={14} /></button></div>
                  {s.map((n, ni) => (
                    <div key={ni} className="mb-2 space-y-1.5 rounded-xl bg-white p-2 ring-1 ring-slate-200">
                      <div className="flex gap-1">
                        <input className="w-10 rounded-lg border border-slate-200 text-center" value={n.emoji} onChange={(e) => updNode(si, ni, { emoji: e.target.value })} />
                        <input className="flex-1 rounded-lg border border-slate-200 px-2 text-sm font-semibold" value={n.label} onChange={(e) => updNode(si, ni, { label: e.target.value })} />
                        <button onClick={() => delNode(si, ni)} className="text-slate-400 hover:text-rose-600"><Trash2 size={14} /></button>
                      </div>
                      <div className="flex gap-1 text-xs">
                        {(["llm", "human"] as const).map((k) => <button key={k} onClick={() => updNode(si, ni, { kind: k })} className={`rounded-full px-2 py-0.5 font-bold ${n.kind === k ? (k === "human" ? "bg-amber-500 text-white" : "bg-violet-600 text-white") : "bg-slate-100"}`}>{k === "llm" ? "LLM agent" : "Human (HITL)"}</button>)}
                      </div>
                      <input className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs" value={n.role} onChange={(e) => updNode(si, ni, { role: e.target.value })} placeholder="Short role" />
                      {n.kind === "llm" && <textarea className="h-20 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs" value={n.prompt} onChange={(e) => updNode(si, ni, { prompt: e.target.value })} placeholder="System prompt" />}
                    </div>
                  ))}
                </div>
              ))}
              {stages.length < 5 && <button onClick={addStage} className="grid w-40 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-slate-300 text-sm font-semibold text-slate-500 hover:bg-slate-50"><span><Plus className="mx-auto" /> Add stage</span></button>}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <textarea className="input min-h-[70px]" placeholder="Decision question" value={question} onChange={(e) => setQuestion(e.target.value)} />
              <textarea className="input min-h-[70px] font-mono text-xs" placeholder="Paste your data / evidence" value={data} onChange={(e) => setData(e.target.value)} />
            </div>
          </div>
          <div className="mt-5">
            <AgentRunner key={version + JSON.stringify(stages.map((s) => s.map((n) => n.id + n.kind)))} title="Your custom decision workflow" pattern="Custom graph" stages={stages} question={question} data={data} custom company={company} manualHours={10} />
          </div>
        </section>
      </div>
    </div>
  );
}
