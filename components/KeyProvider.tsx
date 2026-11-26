"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { KeyRound, X, ExternalLink, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

const DEFAULT_MODELS = ["llama-3.3-70b-versatile", "openai/gpt-oss-120b", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];

interface Ctx {
  apiKey: string;
  model: string;
  models: string[];
  setModel: (m: string) => void;
  open: () => void;
  ready: boolean;
}
const KeyCtx = createContext<Ctx | null>(null);
export const useGroq = () => {
  const c = useContext(KeyCtx);
  if (!c) throw new Error("useGroq outside KeyProvider");
  return c;
};

export function KeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModelState] = useState(DEFAULT_MODELS[0]);
  const [models, setModels] = useState<string[]>(DEFAULT_MODELS);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const k = sessionStorage.getItem("di_groq_key") || localStorage.getItem("di_groq_key") || "";
    const m = localStorage.getItem("di_groq_model");
    const ms = localStorage.getItem("di_groq_models");
    if (k) setApiKey(k);
    if (m) setModelState(m);
    if (ms) try { setModels(JSON.parse(ms)); } catch {}
  }, []);

  const setModel = useCallback((m: string) => {
    setModelState(m);
    localStorage.setItem("di_groq_model", m);
  }, []);

  return (
    <KeyCtx.Provider value={{ apiKey, model, models, setModel, open: () => setShow(true), ready: !!apiKey }}>
      {children}
      {show && (
        <KeyModal
          initial={apiKey}
          onClose={() => setShow(false)}
          onSave={(k, remember, list) => {
            setApiKey(k);
            sessionStorage.setItem("di_groq_key", k);
            if (remember) localStorage.setItem("di_groq_key", k);
            else localStorage.removeItem("di_groq_key");
            if (list.length) {
              setModels(list);
              localStorage.setItem("di_groq_models", JSON.stringify(list));
              if (!list.includes(model)) setModel(list.includes(DEFAULT_MODELS[0]) ? DEFAULT_MODELS[0] : list[0]);
            }
            setShow(false);
          }}
          onClear={() => {
            setApiKey("");
            sessionStorage.removeItem("di_groq_key");
            localStorage.removeItem("di_groq_key");
          }}
        />
      )}
    </KeyCtx.Provider>
  );
}

function KeyModal({ initial, onClose, onSave, onClear }: { initial: string; onClose: () => void; onSave: (k: string, remember: boolean, models: string[]) => void; onClear: () => void }) {
  const [k, setK] = useState(initial);
  const [remember, setRemember] = useState(false);
  const [state, setState] = useState<"idle" | "testing" | "ok" | "bad">("idle");
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<string[]>([]);

  const test = async () => {
    setState("testing");
    try {
      const r = await fetch("/api/models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey: k.trim() }) });
      const j = await r.json();
      if (j.ok) {
        setState("ok");
        setList(j.models);
        setMsg(`Key works · ${j.models.length} chat models available`);
      } else {
        setState("bad");
        setMsg(j.error || "Key rejected");
      }
    } catch {
      setState("bad");
      setMsg("Network error");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 text-white">
          <div className="flex items-center gap-2 font-display text-lg font-bold"><KeyRound size={20} /> Bring Your Own Key · Groq</div>
          <button onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="space-y-4 p-5">
          <ol className="space-y-1 text-sm text-slate-600">
            <li>1. Create a free key at <a className="inline-flex items-center gap-1 font-semibold text-violet-700 underline" href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys <ExternalLink size={12} /></a></li>
            <li>2. Paste it below and press <b>Test</b>.</li>
            <li>3. Every LangGraph agent and the DI Coach will use it.</li>
          </ol>
          <input className="input font-mono" type="password" placeholder="gsk_..." value={k} onChange={(e) => { setK(e.target.value); setState("idle"); }} />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember on this device (otherwise cleared when the tab closes)
          </label>
          {state !== "idle" && (
            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${state === "ok" ? "bg-emerald-50 text-emerald-700" : state === "bad" ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-600"}`}>
              {state === "testing" ? <Loader2 className="animate-spin" size={16} /> : state === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {state === "testing" ? "Testing key with Groq…" : msg}
            </div>
          )}
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
            Your key stays in your browser and is sent only with your own requests, through this app&apos;s server to Groq. It is never stored on the server. Use a training key you can revoke after the session.
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {initial && <button className="btn-ghost" onClick={() => { onClear(); setK(""); setState("idle"); }}>Remove key</button>}
            <button className="btn-ghost" disabled={!k.trim() || state === "testing"} onClick={test}>Test</button>
            <button className="btn-primary" disabled={!k.trim()} onClick={() => onSave(k.trim(), remember, list)}>Save key</button>
          </div>
        </div>
      </div>
    </div>
  );
}
