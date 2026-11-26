import type { ThemeKey } from "./types";

export const THEMES: Record<ThemeKey, { grad: string; soft: string; text: string; ring: string; hex: string; chip: string }> = {
  violet: { grad: "from-violet-600 via-purple-500 to-fuchsia-500", soft: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-300", hex: "#7c3aed", chip: "bg-violet-100 text-violet-700" },
  pink: { grad: "from-pink-500 via-rose-500 to-orange-400", soft: "bg-pink-50", text: "text-pink-700", ring: "ring-pink-300", hex: "#db2777", chip: "bg-pink-100 text-pink-700" },
  orange: { grad: "from-orange-500 via-amber-500 to-yellow-400", soft: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-300", hex: "#ea580c", chip: "bg-orange-100 text-orange-700" },
  emerald: { grad: "from-emerald-500 via-teal-500 to-cyan-500", soft: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-300", hex: "#059669", chip: "bg-emerald-100 text-emerald-700" },
  sky: { grad: "from-sky-500 via-blue-500 to-indigo-500", soft: "bg-sky-50", text: "text-sky-700", ring: "ring-sky-300", hex: "#0284c7", chip: "bg-sky-100 text-sky-700" },
  amber: { grad: "from-amber-500 via-orange-500 to-red-500", soft: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-300", hex: "#d97706", chip: "bg-amber-100 text-amber-800" },
  rose: { grad: "from-rose-500 via-pink-500 to-fuchsia-500", soft: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-300", hex: "#e11d48", chip: "bg-rose-100 text-rose-700" },
  teal: { grad: "from-teal-500 via-emerald-500 to-lime-500", soft: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-300", hex: "#0d9488", chip: "bg-teal-100 text-teal-700" },
  indigo: { grad: "from-indigo-600 via-violet-500 to-purple-500", soft: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-300", hex: "#4f46e5", chip: "bg-indigo-100 text-indigo-700" },
  lime: { grad: "from-lime-500 via-green-500 to-emerald-500", soft: "bg-lime-50", text: "text-lime-800", ring: "ring-lime-300", hex: "#65a30d", chip: "bg-lime-100 text-lime-800" },
  fuchsia: { grad: "from-fuchsia-600 via-purple-500 to-indigo-500", soft: "bg-fuchsia-50", text: "text-fuchsia-700", ring: "ring-fuchsia-300", hex: "#c026d3", chip: "bg-fuchsia-100 text-fuchsia-700" },
  cyan: { grad: "from-cyan-500 via-sky-500 to-blue-600", soft: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-300", hex: "#0891b2", chip: "bg-cyan-100 text-cyan-700" },
};

export const DAY_META = {
  1: { title: "Day 1 · See the decision clearly", sub: "Foundations, data-driven decisions & strategic choices", grad: "from-violet-600 to-fuchsia-500", modules: "Modules 1 · 2 · 3.1–3.2" },
  2: { title: "Day 2 · Let AI do the heavy lifting", sub: "Financial frameworks, GenAI, RAG, ML & agentic AI", grad: "from-sky-500 to-emerald-500", modules: "Modules 3.3–3.6 · 4 · 5.1, 5.3, 5.4" },
  3: { title: "Day 3 · Govern it and ship it", sub: "Portfolio intelligence, governance, HITL & capstone", grad: "from-orange-500 to-rose-500", modules: "Modules 5.2, 5.5, 5.6 · 6 · 7" },
} as const;

export const AI_BADGE: Record<string, string> = {
  ML: "bg-sky-100 text-sky-700",
  GenAI: "bg-fuchsia-100 text-fuchsia-700",
  Agent: "bg-violet-100 text-violet-700",
  RAG: "bg-emerald-100 text-emerald-700",
  Analytics: "bg-amber-100 text-amber-800",
  Human: "bg-rose-100 text-rose-700",
};
