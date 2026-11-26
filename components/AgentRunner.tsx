"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Loader2, RotateCcw, Code2, CheckCircle2, Hand, AlertTriangle, Timer, Copy, Workflow, Download } from "lucide-react";
import type { AgentNode } from "@/lib/types";
import { useGroq } from "./KeyProvider";
import Markdown from "./Markdown";

type Status = "idle" | "running" | "done" | "waiting" | "error";

export interface RunnerProps {
  title: string;
  pattern: string;
  stages: AgentNode[][];
  question: string;
  data: string;
  useCaseId?: string;
  custom?: boolean;
  company?: string;
  accent?: string; // hex
  manualHours?: number;
  onFinal?: (text: string) => void;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function AgentRunner(p: RunnerProps) {
  const { apiKey, model, ready, open } = useGroq();
  const [question, setQuestion] = useState(p.question);
  const [data, setData] = useState(p.data);
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [ms, setMs] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [interruptInfo, setInterruptInfo] = useState<{ node: string; label: string; proposal: string } | null>(null);
  const [note, setNote] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const threadRef = useRef("");
  const t0 = useRef(0);

  useEffect(() => setData(p.data), [p.data]);
  useEffect(() => setQuestion(p.question), [p.question]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(Date.now() - t0.current), 200);
    return () => clearInterval(t);
  }, [running]);

  const allNodes = useMemo(() => p.stages.flat(), [p.stages]);
  const lastStage = p.stages[p.stages.length - 1];
  const finalNode = lastStage[lastStage.length - 1];

  const stageOf = (id: string) => p.stages.findIndex((s) => s.some((n) => n.id === id));

  const advance = (st: Record<string, Status>, doneId: string) => {
    const si = stageOf(doneId);
    const stage = p.stages[si];
    if (stage.every((n) => st[n.id] === "done") && p.stages[si + 1]) {
      for (const n of p.stages[si + 1]) st[n.id] = n.kind === "human" ? "waiting" : "running";
    }
    return st;
  };

  async function call(body: Record<string, unknown>) {
    setRunning(true);
    setError("");
    try {
      const r = await fetch("/api/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey, model, ...body }) });
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${r.status}`);
      }
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "node") {
            setOutputs((o) => ({ ...o, [ev.node]: ev.output }));
            setMs((m) => ({ ...m, [ev.node]: ev.ms }));
            setStatus((s) => advance({ ...s, [ev.node]: "done" }, ev.node));
            setSelected(ev.node);
            if (ev.node === finalNode.id) p.onFinal?.(ev.output);
          } else if (ev.type === "interrupt") {
            setInterruptInfo(ev.payload);
            setStatus((s) => ({ ...s, [ev.payload.node]: "waiting" }));
          } else if (ev.type === "error") {
            throw new Error(ev.error);
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus((s) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v === "running" ? "error" : v])));
    }
    setRunning(false);
  }

  const run = () => {
    if (!ready) return open();
    threadRef.current = uid();
    const init: Record<string, Status> = {};
    for (const n of allNodes) init[n.id] = "idle";
    for (const n of p.stages[0]) init[n.id] = "running";
    setStatus(init);
    setOutputs({});
    setMs({});
    setInterruptInfo(null);
    setSelected(null);
    t0.current = Date.now();
    setElapsed(0);
    call({ threadId: threadRef.current, useCaseId: p.useCaseId, question, data, custom: p.custom ? { stages: p.stages } : undefined, company: p.company });
  };

  const resume = (decision: string) => {
    if (!interruptInfo) return;
    const id = interruptInfo.node;
    setInterruptInfo(null);
    setStatus((s) => ({ ...s, [id]: "running" }));
    call({ threadId: threadRef.current, useCaseId: p.useCaseId, resume: { decision, note }, custom: p.custom ? { stages: p.stages } : undefined, company: p.company });
    setNote("");
  };

  const reset = () => {
    setStatus({});
    setOutputs({});
    setInterruptInfo(null);
    setSelected(null);
    setError("");
    setElapsed(0);
  };

  const finished = !!outputs[finalNode.id];
  const sel = selected ? allNodes.find((n) => n.id === selected) : null;
  const accent = p.accent ?? "#7c3aed";

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4" style={{ background: `linear-gradient(90deg, ${accent}14, transparent)` }}>
        <Workflow style={{ color: accent }} />
        <div>
          <div className="font-display text-lg font-bold">{p.title}</div>
          <div className="text-xs text-slate-500">LangGraph · {p.pattern} · {allNodes.length} nodes</div>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={() => setShowCode((v) => !v)}><Code2 size={16} /> {showCode ? "Hide" : "Show"} LangGraph code</button>
          <button className="btn-ghost" onClick={reset} disabled={running}><RotateCcw size={16} /> Reset</button>
          <button className="btn-primary" onClick={run} disabled={running}>
            {running ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />} {running ? "Agents working…" : "Run agents"}
          </button>
        </div>
      </div>

      {/* Graph visual */}
      <div className="overflow-x-auto bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_0)] [background-size:18px_18px] px-5 py-6">
        <div className="flex min-w-max items-center gap-0">
          <Pill label="START" />
          {p.stages.map((stage, si) => (
            <div key={si} className="flex items-center">
              <Arrow active={stage.some((n) => status[n.id] === "running" || status[n.id] === "done")} color={accent} />
              <div className="flex flex-col gap-2">
                {stage.length > 1 && <div className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">parallel</div>}
                {stage.map((n) => (
                  <NodeCard key={n.id} n={n} st={status[n.id] ?? "idle"} ms={ms[n.id]} selected={selected === n.id} onClick={() => outputs[n.id] && setSelected(n.id)} accent={accent} />
                ))}
              </div>
            </div>
          ))}
          <Arrow active={finished} color={accent} />
          <Pill label="END" done={finished} />
        </div>
      </div>

      {showCode && (
        <div className="relative border-y border-slate-800 bg-slate-950">
          <button className="absolute right-3 top-3 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20" onClick={() => navigator.clipboard.writeText(codeFor(p.stages))} title="Copy"><Copy size={14} /></button>
          <pre className="max-h-96 overflow-auto p-4 text-[12px] leading-relaxed text-emerald-200">{codeFor(p.stages)}</pre>
        </div>
      )}

      <div className="grid gap-0 lg:grid-cols-5">
        <div className="space-y-3 border-slate-100 p-5 lg:col-span-2 lg:border-r">
          <div>
            <div className="label mb-1">Decision question</div>
            <textarea className="input min-h-[70px]" value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div>
            <div className="label mb-1">Data / evidence fed to the graph state</div>
            <textarea className="input min-h-[220px] font-mono text-[12px]" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-violet-50 p-3">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold text-violet-700"><Timer size={14} /> AI time</div>
              <div className="font-display text-2xl font-bold text-violet-700">{(elapsed / 1000).toFixed(1)}s</div>
            </div>
            <div className="rounded-xl bg-orange-50 p-3">
              <div className="text-xs font-semibold text-orange-700">Manual equivalent</div>
              <div className="font-display text-2xl font-bold text-orange-600">~{p.manualHours ?? 8}h</div>
            </div>
          </div>
        </div>

        <div className="p-5 lg:col-span-3">
          {error && (
            <div className="mb-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"><AlertTriangle size={16} className="mt-0.5 shrink-0" /> {error}</div>
          )}
          {interruptInfo && (
            <div className="mb-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
              <div className="flex items-center gap-2 font-display font-bold text-amber-800"><Hand size={18} /> Human-in-the-loop · graph paused at “{interruptInfo.label}”</div>
              <p className="mt-1 text-xs text-amber-700">LangGraph <code>interrupt()</code> has checkpointed the state. Nothing executes until an accountable human decides.</p>
              <div className="mt-3 max-h-52 overflow-y-auto rounded-xl bg-white p-3 ring-1 ring-amber-200"><Markdown>{interruptInfo.proposal || "(see upstream outputs)"}</Markdown></div>
              <textarea className="input mt-3" placeholder="Approver notes / conditions (e.g. 'Approve only with masked data & session recording')" value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="btn bg-emerald-600 text-white" onClick={() => resume("APPROVED")}>Approve</button>
                <button className="btn bg-amber-500 text-white" onClick={() => resume("APPROVED WITH CONDITIONS")}>Approve with conditions</button>
                <button className="btn bg-rose-600 text-white" onClick={() => resume("REJECTED")}>Reject</button>
              </div>
            </div>
          )}
          {!sel && !interruptInfo && (
            <div className="grid h-full min-h-[260px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              <div>
                <Workflow className="mx-auto mb-2 text-slate-300" size={40} />
                Press <b>Run agents</b>. Each node lights up as it completes — click any finished node to read its reasoning.
                {!ready && <div className="mt-2 font-semibold text-orange-600">Add your Groq key first (top-right).</div>}
              </div>
            </div>
          )}
          {sel && outputs[sel.id] && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-2xl">{sel.emoji}</span>
                <div>
                  <div className="font-display font-bold">{sel.label}{sel.id === finalNode.id && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">FINAL OUTPUT</span>}</div>
                  <div className="text-xs text-slate-500">{sel.role}</div>
                </div>
                <button className="btn-ghost ml-auto px-2 py-1 text-xs" onClick={() => download(`${sel.id}.md`, outputs[sel.id])}><Download size={14} /> .md</button>
              </div>
              <div className="max-h-[480px] overflow-y-auto rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200"><Markdown>{outputs[sel.id]}</Markdown></div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {allNodes.filter((n) => outputs[n.id]).map((n) => (
                  <button key={n.id} onClick={() => setSelected(n.id)} className={`rounded-full px-3 py-1 text-xs font-semibold ${selected === n.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{n.emoji} {n.label}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function download(name: string, text: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
  a.download = name;
  a.click();
}

function Pill({ label, done }: { label: string; done?: boolean }) {
  return <div className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wider ${done ? "bg-emerald-500 text-white" : "bg-slate-800 text-white"}`}>{label}</div>;
}

function Arrow({ active, color }: { active: boolean; color: string }) {
  return (
    <svg width="44" height="14" className="mx-1 shrink-0" aria-hidden>
      <line x1="0" y1="7" x2="36" y2="7" stroke={active ? color : "#cbd5e1"} strokeWidth="2.5" strokeDasharray="5 5" className={active ? "animate-dash" : ""} />
      <path d="M34 2 L42 7 L34 12 Z" fill={active ? color : "#cbd5e1"} />
    </svg>
  );
}

function NodeCard({ n, st, ms, selected, onClick, accent }: { n: AgentNode; st: Status; ms?: number; selected: boolean; onClick: () => void; accent: string }) {
  const base = "w-48 rounded-2xl bg-white p-3 text-left ring-2 transition";
  const ring =
    st === "done" ? "ring-emerald-400" : st === "running" ? "ring-violet-400 animate-pulseRing" : st === "waiting" ? "ring-amber-400 animate-pulse" : st === "error" ? "ring-rose-400" : "ring-slate-200";
  return (
    <button onClick={onClick} className={`${base} ${ring} ${selected ? "scale-[1.03] shadow-lg" : "shadow-sm"}`} style={selected ? { boxShadow: `0 8px 24px ${accent}33` } : undefined}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{n.emoji}</span>
        <span className="text-[13px] font-bold leading-tight">{n.label}</span>
      </div>
      <div className="mt-1 text-[11px] leading-snug text-slate-500">{n.role}</div>
      <div className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
        {n.kind === "human" && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">HITL</span>}
        {n.kind === "retrieve" && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">TOOL</span>}
        {st === "running" && <span className="flex items-center gap-1 text-violet-600"><Loader2 size={11} className="animate-spin" /> thinking</span>}
        {st === "done" && <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={11} /> {ms ? `${(ms / 1000).toFixed(1)}s` : "done"}</span>}
        {st === "waiting" && <span className="text-amber-600">awaiting human</span>}
        {st === "error" && <span className="text-rose-600">error</span>}
      </div>
    </button>
  );
}

export function codeFor(stages: AgentNode[][]) {
  const lines: string[] = [];
  lines.push(`import { StateGraph, Annotation, START, END, MemorySaver, interrupt } from "@langchain/langgraph";`);
  lines.push(`import { ChatGroq } from "@langchain/groq";\n`);
  lines.push(`const State = Annotation.Root({`);
  lines.push(`  question: Annotation<string>(),`);
  lines.push(`  data: Annotation<string>(),`);
  lines.push(`  outputs: Annotation<Record<string, string>>({ reducer: (a, b) => ({ ...a, ...b }), default: () => ({}) }),`);
  lines.push(`});\n`);
  lines.push(`const llm = new ChatGroq({ apiKey: userKey /* BYOK */, model: "llama-3.3-70b-versatile" });\n`);
  lines.push(`const agent = (id: string, role: string) => async (s: typeof State.State) => {`);
  lines.push(`  const res = await llm.invoke([["system", role], ["human", \`\${s.question}\\n\${s.data}\\n\${JSON.stringify(s.outputs)}\`]]);`);
  lines.push(`  return { outputs: { [id]: res.content as string } };`);
  lines.push(`};\n`);
  lines.push(`const graph = new StateGraph(State)`);
  for (const n of stages.flat()) {
    if (n.kind === "human") lines.push(`  .addNode("${n.id}", (s) => { const d = interrupt({ proposal: s.outputs }); return { outputs: { ${n.id}: d.decision } }; })`);
    else if (n.kind === "retrieve") lines.push(`  .addNode("${n.id}", async (s) => ({ outputs: { ${n.id}: await vectorStore.search(s.question) } }))`);
    else lines.push(`  .addNode("${n.id}", agent("${n.id}", ${JSON.stringify((n.prompt ?? n.role).slice(0, 70) + "…")}))`);
  }
  for (const n of stages[0]) lines.push(`  .addEdge(START, "${n.id}")`);
  for (let i = 0; i < stages.length - 1; i++) {
    const from = stages[i].map((n) => `"${n.id}"`);
    for (const to of stages[i + 1]) lines.push(`  .addEdge(${from.length > 1 ? `[${from.join(", ")}]` : from[0]}, "${to.id}")${from.length > 1 ? "   // fan-in: waits for all" : ""}`);
  }
  for (const n of stages[stages.length - 1]) lines.push(`  .addEdge("${n.id}", END)`);
  lines.push(`  .compile({ checkpointer: new MemorySaver() });\n`);
  lines.push(`for await (const update of await graph.stream({ question, data }, { configurable: { thread_id }, streamMode: "updates" })) {`);
  lines.push(`  render(update); // each node's output streams to the UI`);
  lines.push(`}`);
  return lines.join("\n");
}
