"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, KeyRound, CheckCircle2 } from "lucide-react";
import { useGroq } from "./KeyProvider";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/agenda", label: "6-Hour Agenda" },
  { href: "/playbook", label: "Implementation Playbook" },
];

export default function TopBar() {
  const { ready, open, model, models, setModel } = useGroq();
  const path = usePathname();
  return (
    <header className="no-print sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 text-white shadow-md">
            <BrainCircuit size={20} />
          </span>
          <span className="hidden font-display text-[15px] font-bold leading-tight sm:block">
            Decision Intelligence Lab
            <span className="block text-[11px] font-medium text-slate-500">for Technology Leaders</span>
          </span>
        </Link>
        <nav className="ml-4 hidden gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${path === l.href ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-100"}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <select className="hidden max-w-[210px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs lg:block" value={model} onChange={(e) => setModel(e.target.value)} title="Groq model">
            {models.map((m) => (<option key={m}>{m}</option>))}
          </select>
          <button onClick={open} className={`btn py-1.5 ${ready ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-gradient-to-r from-orange-500 to-pink-500 text-white animate-pulse"}`}>
            {ready ? <CheckCircle2 size={16} /> : <KeyRound size={16} />}
            {ready ? "Groq key set" : "Add Groq key"}
          </button>
        </div>
      </div>
    </header>
  );
}
