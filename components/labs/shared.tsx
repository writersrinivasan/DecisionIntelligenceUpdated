"use client";
import { Send } from "lucide-react";
import type { UseCase } from "@/lib/types";

export interface LabProps {
  uc: UseCase;
  accent: string;
  onExport: (data: string, question?: string) => void;
}

export function ExportBtn({ onClick, label = "Send lab results to the AI agent" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="btn bg-slate-900 text-white hover:bg-slate-800">
      <Send size={16} /> {label}
    </button>
  );
}

export function Stat({ label, value, sub, color = "#7c3aed" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="font-display text-2xl font-bold" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, suffix = "" }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <label className="block text-sm">
      <div className="flex justify-between">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{value}{suffix}</span>
      </div>
      <input type="range" className="w-full" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      {title && <div className="mb-3 font-display font-bold">{title}</div>}
      {children}
    </div>
  );
}

export const PALETTE = ["#7c3aed", "#ec4899", "#f97316", "#10b981", "#0ea5e9", "#eab308", "#ef4444", "#14b8a6", "#6366f1", "#84cc16"];

export const ragColor = (v: number, amber: number, red: number, lowerIsBetter = true) => {
  const bad = lowerIsBetter ? v >= red : v <= red;
  const warn = lowerIsBetter ? v >= amber : v <= amber;
  return bad ? "bg-rose-100 text-rose-700" : warn ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700";
};

/** Deterministic PRNG so every participant sees the same synthetic data. */
export function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const fmtCr = (v: number) => `₹${v.toFixed(1)} Cr`;
