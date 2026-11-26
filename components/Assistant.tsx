"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircleQuestion, Send, X, Loader2, Sparkles } from "lucide-react";
import { useGroq } from "./KeyProvider";
import { getUseCase } from "@/lib/usecases";
import Markdown from "./Markdown";

type Msg = { role: "user" | "assistant"; content: string };

export default function Assistant() {
  const { apiKey, model, ready, open: openKey } = useGroq();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const path = usePathname();
  const end = useRef<HTMLDivElement>(null);

  const uc = path.startsWith("/usecase/") ? getUseCase(path.split("/")[2]) : undefined;
  const context = uc
    ? `Use case #${uc.num} "${uc.title}" (${uc.industry}, Module ${uc.module}, subtopics ${uc.subtopics.join(", ")}). Scenario: ${uc.scenario} Definition: ${uc.definition}`
    : path;
  const suggestions = uc
    ? [`Explain "${uc.title}" in 3 bullets for my CEO`, `What could go wrong implementing this at a ${uc.industry} company?`, `Give me a 30-day pilot plan for this`]
    : ["What is Decision Intelligence in one paragraph?", "How is DI different from BI?", "Where should a CIO start with agentic AI?"];

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, busy]);

  const send = async (q: string) => {
    if (!q.trim()) return;
    if (!ready) return openKey();
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setText("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey, model, messages: next, context }) });
      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: j.reply ?? `⚠️ ${j.error}` }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: "⚠️ Network error" }]);
    }
    setBusy(false);
  };

  return (
    <div className="no-print">
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-5 py-3 font-semibold text-white shadow-xl shadow-fuchsia-500/30 hover:scale-105 transition">
          <MessageCircleQuestion size={20} /> DI Coach
        </button>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[560px] w-[min(420px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-4 py-3 text-white">
            <div>
              <div className="flex items-center gap-2 font-display font-bold"><Sparkles size={18} /> DI Coach</div>
              <div className="text-[11px] opacity-90">LangGraph · Groq · {model}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close"><X /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Ask anything about {uc ? <b>{uc.title}</b> : "Decision Intelligence"}. I know which page you are on.</p>
                {suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)} className="block w-full rounded-xl bg-white px-3 py-2 text-left text-sm text-violet-700 ring-1 ring-violet-100 hover:bg-violet-50">{s}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-8 rounded-2xl rounded-br-sm bg-violet-600 px-3 py-2 text-sm text-white" : "mr-4 rounded-2xl rounded-bl-sm bg-white px-3 py-2 ring-1 ring-slate-200"}>
                {m.role === "user" ? m.content : <Markdown>{m.content}</Markdown>}
              </div>
            ))}
            {busy && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="animate-spin" size={16} /> thinking…</div>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2 border-t border-slate-200 p-2">
            <input className="input" placeholder={ready ? "Ask the DI Coach…" : "Add your Groq key to chat"} value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn-primary px-3" disabled={busy}><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
