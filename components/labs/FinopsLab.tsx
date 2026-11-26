"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from "recharts";
import { ExportBtn, LabProps, Panel, Slider, Stat } from "./shared";

const SPEND = { EC2: 1.7, S3: 0.8, CloudFront: 0.7, RDS: 0.5, EKS: 0.3, Other: 0.2 };
const STREAMS = 11; // million / month

export default function FinopsLab({ onExport, accent }: LabProps) {
  const [rightsize, setRightsize] = useState(40);
  const [commit, setCommit] = useState(70);
  const [schedule, setSchedule] = useState(true);
  const [tiering, setTiering] = useState(60);
  const [idleRds, setIdleRds] = useState(true);
  const [spot, setSpot] = useState(20);

  const total = Object.values(SPEND).reduce((a, b) => a + b, 0);
  const levers = [
    { lever: "Rightsize EC2", save: SPEND.EC2 * 0.45 * (rightsize / 100), risk: "Low" },
    { lever: "Dev/test schedules", save: schedule ? SPEND.EC2 * 0.12 : 0, risk: "Low" },
    { lever: "Savings Plans", save: (SPEND.EC2 + SPEND.EKS + SPEND.RDS) * 0.3 * Math.max(0, (commit - 28) / 100), risk: "Med" },
    { lever: "Spot for transcoding", save: SPEND.EC2 * 0.6 * (spot / 100) * 0.4, risk: "Med" },
    { lever: "S3 tiering (IA/Glacier)", save: SPEND.S3 * 0.61 * (tiering / 100) * 0.6, risk: "Low" },
    { lever: "Remove idle RDS replicas", save: idleRds ? SPEND.RDS * 0.35 : 0, risk: "Low" },
  ].map((l) => ({ ...l, save: +l.save.toFixed(3) }));
  const saved = levers.reduce((a, b) => a + b.save, 0);
  const after = total - saved;
  const pct = (saved / total) * 100;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Monthly spend today" value={`₹${total.toFixed(1)} Cr`} color="#64748b" />
        <Stat label="After optimisation" value={`₹${after.toFixed(2)} Cr`} color={accent} />
        <Stat label="Savings" value={`${pct.toFixed(0)}%`} sub={`₹${(saved * 12).toFixed(1)} Cr / year`} color={pct >= 25 ? "#10b981" : "#f59e0b"} />
        <Stat label="Unit cost per stream" value={`₹${((after * 1e7) / (STREAMS * 1e6)).toFixed(2)}`} sub={`was ₹${((total * 1e7) / (STREAMS * 1e6)).toFixed(2)}`} color="#0ea5e9" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Optimisation levers">
          <Slider label="Rightsizing adoption" value={rightsize} min={0} max={100} onChange={setRightsize} suffix="%" />
          <Slider label="Commitment coverage (now 28%)" value={commit} min={28} max={90} onChange={setCommit} suffix="%" />
          <Slider label="Spot share of transcoding" value={spot} min={0} max={80} onChange={setSpot} suffix="%" />
          <Slider label="Cold S3 objects tiered" value={tiering} min={0} max={100} onChange={setTiering} suffix="%" />
          <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} /> Switch off dev/test nights & weekends</label>
          <label className="mt-1 flex items-center gap-2 text-sm"><input type="checkbox" checked={idleRds} onChange={(e) => setIdleRds(e.target.checked)} /> Remove 3 idle RDS replicas</label>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-3 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" style={{ width: `${Math.min(100, (pct / 25) * 100)}%` }} /></div>
          <div className="mt-1 text-xs text-slate-500">Progress to CFO target of 25%</div>
        </Panel>
        <Panel title="Savings by lever (₹ Cr / month)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={levers} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" /><YAxis type="category" dataKey="lever" width={150} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="save" radius={[0, 6, 6, 0]}>
                  {levers.map((l, i) => <Cell key={i} fill={l.risk === "Low" ? "#84cc16" : "#f59e0b"} />)}
                  <LabelList dataKey="risk" position="right" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500">Green = low risk to streaming quality (automate). Amber = needs a reliability guardrail (human approval).</p>
        </Panel>
      </div>
      <ExportBtn onClick={() => onExport(`Monthly AWS spend ₹${total.toFixed(1)} Cr: ${Object.entries(SPEND).map(([k, v]) => `${k} ₹${v} Cr`).join(", ")}. EC2 avg CPU 18%; 61% of S3 objects not accessed in 90d; 3 idle RDS replicas; commitment coverage 28%; dev/test 24x7. Streams/month 11M.\n\nOUR LEVER PLAN: ${levers.map((l) => `${l.lever}: saves ₹${l.save.toFixed(2)} Cr/month (risk ${l.risk})`).join("; ")}\nTotal savings ${pct.toFixed(0)}% → ₹${after.toFixed(2)} Cr/month.`)} />
    </div>
  );
}
