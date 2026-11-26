export type NodeKind = "llm" | "retrieve" | "human";

export interface AgentNode {
  id: string;
  label: string;
  emoji: string;
  kind?: NodeKind; // default llm
  role: string; // one-line description shown on the graph
  prompt?: string; // system prompt for llm nodes
}

export interface AgentConfig {
  title: string;
  pattern: string; // e.g. "Sequential pipeline", "Fan-out / fan-in"
  stages: AgentNode[][]; // each inner array runs in parallel
  question: string;
  data: string;
}

export interface KbDoc {
  id: string;
  title: string;
  text: string;
}

export interface Metric {
  label: string;
  before: number;
  after: number;
  unit: string;
  better: "lower" | "higher";
}

export interface TimeSaving {
  task: string;
  before: number; // hours per cycle
  after: number;
  cadence: string; // per week / per incident ...
}

export interface UseCase {
  id: string;
  num: number;
  day: 1 | 2 | 3;
  minutes: number;
  module: number;
  subtopics: string[];
  title: string;
  tagline: string;
  industry: string;
  company: string;
  theme: ThemeKey;
  icon: string;
  scenario: string;
  definition: string;
  why: string[];
  what: string[];
  howAI: { step: string; detail: string; ai: "ML" | "GenAI" | "Agent" | "RAG" | "Analytics" | "Human" }[];
  metrics: Metric[];
  timeSavings: TimeSaving[];
  valueStatement: string;
  lab: string;
  labIntro: string;
  agent: AgentConfig;
  kb?: KbDoc[];
  implement: { phase: string; weeks: string; actions: string[] }[];
  tools: string[];
  discuss: string[];
}

export type ThemeKey =
  | "violet"
  | "pink"
  | "orange"
  | "emerald"
  | "sky"
  | "amber"
  | "rose"
  | "teal"
  | "indigo"
  | "lime"
  | "fuchsia"
  | "cyan";
