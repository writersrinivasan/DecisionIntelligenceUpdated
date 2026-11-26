"use client";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { LabProps } from "./shared";

const load = (f: () => Promise<{ default: ComponentType<LabProps & { agentFinal?: string }> }>) =>
  dynamic(f, { ssr: false, loading: () => <div className="card h-64 animate-pulse bg-slate-100" /> });

export const LABS: Record<string, ComponentType<LabProps & { agentFinal?: string }>> = {
  maturity: load(() => import("./MaturityLab")),
  kpi: load(() => import("./KpiLab")),
  incidents: load(() => import("./IncidentLab")),
  delay: load(() => import("./DelayLab")),
  matrix: load(() => import("./MatrixLab")),
  roi: load(() => import("./RoiLab")),
  prioritize: load(() => import("./PrioritizeLab")),
  committee: load(() => import("./CommitteeLab")),
  budget: load(() => import("./BudgetLab")),
  rag: load(() => import("./RagLab")),
  anomaly: load(() => import("./AnomalyLab")),
  finops: load(() => import("./FinopsLab")),
  health: load(() => import("./HealthLab")),
  governance: load(() => import("./GovernanceLab")),
  journal: load(() => import("./JournalLab")),
  capstone: load(() => import("./CapstoneLab")),
};
