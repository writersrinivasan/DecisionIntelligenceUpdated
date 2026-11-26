"use client";
import { useMemo, useState } from "react";
import { Search, FileText } from "lucide-react";
import { retrieve, tokenize } from "@/lib/retrieval";
import { ExportBtn, LabProps, Panel } from "./shared";

const PRESETS = [
  "Can we use a US-hosted SaaS analytics tool to analyse clinical trial data?",
  "Can our team use a public GenAI chatbot to summarise patient adverse-event reports?",
  "Do we need Architecture Board approval to deploy in eu-west as a primary region?",
  "What DR requirements apply to the clinical trial system?",
];

export default function RagLab({ uc, onExport, accent }: LabProps) {
  const kb = uc.kb ?? [];
  const [q, setQ] = useState(PRESETS[0]);
  const [open, setOpen] = useState<string | null>(null);
  const hits = useMemo(() => retrieve(q, kb, kb.length), [q, kb]);
  const max = Math.max(...hits.map((h) => h.score), 0.0001);
  const qTokens = new Set(tokenize(q));

  const highlight = (text: string) =>
    text.split(/(\s+)/).map((w, i) => (qTokens.has(w.toLowerCase().replace(/[^a-z0-9-]/g, "")) ? <mark key={i} className="rounded bg-yellow-200 px-0.5">{w}</mark> : w));

  return (
    <div className="space-y-5">
      <Panel title="How RAG works">
        <div className="grid gap-2 text-center text-sm md:grid-cols-5">
          {["❓ Question", "🔎 Retrieve top-k passages", "🧩 Stuff into prompt as context", "🤖 LLM answers ONLY from context", "📎 Cite sources + confidence"].map((s, i) => (
            <div key={i} className="rounded-xl p-3 font-semibold text-white" style={{ background: `hsl(${150 + i * 18} 70% ${42 - i * 2}%)` }}>{s}</div>
          ))}
        </div>
      </Panel>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="input pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => <button key={p} onClick={() => setQ(p)} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100">{p}</button>)}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={`Retrieval scores (TF-IDF) · ${kb.length} policy documents`}>
          <div className="space-y-2">
            {hits.map((h, i) => (
              <button key={h.doc.id} onClick={() => setOpen(h.doc.id)} className={`block w-full rounded-xl p-2 text-left hover:bg-slate-50 ${open === h.doc.id ? "ring-2 ring-emerald-300" : ""}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{i < 3 && "📎 "}{h.doc.id} · {h.doc.title}</span>
                  <span className="font-mono text-xs">{h.score.toFixed(2)}</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full" style={{ width: `${(h.score / max) * 100}%`, background: i < 3 ? accent : "#cbd5e1" }} /></div>
                <div className="mt-1 text-[11px] text-slate-500">matched: {h.matched.join(", ") || "—"}</div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">The top 3 (📎) are passed to the LLM by the LangGraph retriever node. Production systems use vector embeddings + re-ranking.</p>
        </Panel>
        <Panel title="Document viewer">
          {(open ? hits.filter((h) => h.doc.id === open) : hits.slice(0, 3)).map((h) => (
            <div key={h.doc.id} className="mb-3 rounded-xl bg-slate-50 p-3">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold"><FileText size={14} /> [{h.doc.id}] {h.doc.title}</div>
              <p className="text-sm leading-relaxed text-slate-700">{highlight(h.doc.text)}</p>
            </div>
          ))}
        </Panel>
      </div>
      <ExportBtn label="Ask the RAG agent this question" onClick={() => onExport(uc.agent.data, q)} />
    </div>
  );
}
