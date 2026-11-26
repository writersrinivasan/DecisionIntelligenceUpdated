import { day1 } from "./content/day1";
import { day2 } from "./content/day2";
import { day3 } from "./content/day3";
import type { UseCase } from "./types";

export const USE_CASES: UseCase[] = [...day1, ...day2, ...day3];

export const getUseCase = (id: string) => USE_CASES.find((u) => u.id === id);

export const byDay = (d: 1 | 2 | 3) => USE_CASES.filter((u) => u.day === d);

export const MODULES = [
  { n: 1, title: "Foundations of Decision Intelligence", min: 45 },
  { n: 2, title: "Data-Driven Decision Making for Technology Leaders", min: 50 },
  { n: 3, title: "Strategic Technology Decision Frameworks", min: 55 },
  { n: 4, title: "AI-Powered Decision Intelligence", min: 60 },
  { n: 5, title: "Decision Intelligence in Technology Operations", min: 55 },
  { n: 6, title: "Risk, Governance and Responsible Decision Making", min: 45 },
  { n: 7, title: "Hands-on Executive Case Study", min: 50 },
];

export const OUTCOMES = [
  "Explain the principles and architecture of Decision Intelligence",
  "Apply structured decision frameworks to complex technology challenges",
  "Evaluate investments using ROI, TCO and cost-benefit analysis",
  "Use analytics and KPIs to make evidence-based decisions",
  "Leverage Generative AI and Agentic AI for executive decision support",
  "Apply DI to IT operations, software engineering and cloud",
  "Identify risks associated with AI-driven decision-making",
  "Design a basic AI-powered technology decision support workflow",
  "Communicate strategic technology recommendations to senior leadership",
];
