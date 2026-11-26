"use client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { ExportBtn, LabProps, Panel, Slider, Stat, ragColor } from "./shared";

const TEAMS = [
  { team: "Payments", eng: 14, deploys: 2, cfr: 18, mttr: 9, util: 96, build: 3.5, review: 5.2, qa: 4.3, env: 3.0 },
  { team: "Search", eng: 11, deploys: 9, cfr: 7, mttr: 2, util: 81, build: 2.6, review: 0.8, qa: 1.6, env: 1.0 },
  { team: "Mobile", eng: 13, deploys: 3, cfr: 12, mttr: 5, util: 90, build: 3.2, review: 3.1, qa: 3.7, env: 2.0 },
  { team: "Platform", eng: 12, deploys: 6, cfr: 9, mttr: 3, util: 98, build: 4.6, review: 1.2, qa: 1.7, env: 1.5 },
  { team: "Data", eng: 12, deploys: 1, cfr: 22, mttr: 11, util: 74, build: 3.0, review: 2.0, qa: 3.0, env: 10.0 },
];

const lead = (t: (typeof TEAMS)[number]) => t.build + t.review + t.qa + t.env;

export default function KpiLab({ onExport, accent, uc }: LabProps) {
  const [sel, setSel] = useState(0);
  const [hires, setHires] = useState(2);
  const [fixReview, setFixReview] = useState(false);
  const [fixEnv, setFixEnv] = useState(false);
  const t = TEAMS[sel];

  // Simple, transparent model: new hires only speed up hands-on build time (with ramp-up/comm overhead);
  // flow fixes remove waiting time.
  const hireFactor = t.eng / (t.eng + hires * 0.55);
  const onboardingDrag = hires > 0 ? 1 + hires * 0.03 : 1;
  const hiredLead = t.build * hireFactor * onboardingDrag + t.review + t.qa + t.env;
  const fixedLead = t.build + t.review * (fixReview ? 0.3 : 1) + t.qa + t.env * (fixEnv ? 0.35 : 1);
  const now = lead(t);
  const chart = TEAMS.map((x) => ({ team: x.team, Build: x.build, "Review wait": x.review, "QA queue": x.qa, "Env / deploy wait": x.env }));
  const flowEff = (x: (typeof TEAMS)[number]) => Math.round((x.build / lead(x)) * 100);

  return (
    <div className="space-y-5">
      <Panel title="Team KPI scorecard (DORA + flow)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th className="p-2">Team</th><th>Eng</th><th>Lead time (d)</th><th>Deploys/wk</th><th>Change fail %</th><th>MTTR (h)</th><th>Flow eff.</th><th>Utilisation</th>
              </tr>
            </thead>
            <tbody>
              {TEAMS.map((x, i) => (
                <tr key={x.team} onClick={() => setSel(i)} className={`cursor-pointer border-t border-slate-100 ${i === sel ? "bg-violet-50" : "hover:bg-slate-50"}`}>
                  <td className="p-2 font-semibold">{x.team}</td>
                  <td>{x.eng}</td>
                  <td><span className={`rounded px-2 py-0.5 font-bold ${ragColor(lead(x), 9, 14)}`}>{lead(x).toFixed(1)}</span></td>
                  <td><span className={`rounded px-2 py-0.5 font-bold ${ragColor(x.deploys, 4, 2, false)}`}>{x.deploys}</span></td>
                  <td><span className={`rounded px-2 py-0.5 font-bold ${ragColor(x.cfr, 10, 15)}`}>{x.cfr}</span></td>
                  <td><span className={`rounded px-2 py-0.5 font-bold ${ragColor(x.mttr, 4, 8)}`}>{x.mttr}</span></td>
                  <td><span className={`rounded px-2 py-0.5 font-bold ${ragColor(flowEff(x), 30, 20, false)}`}>{flowEff(x)}%</span></td>
                  <td>{x.util}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Where does the lead time go? (days)">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chart} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="team" width={70} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Build" stackId="a" fill={accent} />
              <Bar dataKey="Review wait" stackId="a" fill="#f97316" />
              <Bar dataKey="QA queue" stackId="a" fill="#eab308" />
              <Bar dataKey="Env / deploy wait" stackId="a" fill="#94a3b8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500">Only the coloured “Build” segment is hands-on work. Everything else is waiting — and more people don&apos;t reduce waiting.</p>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={`Simulator · ${t.team} team`}>
          <div className="mb-3 flex flex-wrap gap-2">
            {TEAMS.map((x, i) => (
              <button key={x.team} onClick={() => setSel(i)} className={`rounded-full px-3 py-1 text-xs font-semibold ${i === sel ? "text-white" : "bg-slate-100"}`} style={i === sel ? { background: accent } : undefined}>{x.team}</button>
            ))}
          </div>
          <Slider label="Option A · Hire engineers" value={hires} min={0} max={6} onChange={setHires} suffix=" eng" />
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={fixReview} onChange={(e) => setFixReview(e.target.checked)} /> Option B · Fix review bottleneck (reviewer rota, small PRs) — cuts review wait 70%</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={fixEnv} onChange={(e) => setFixEnv(e.target.checked)} /> Option C · Self-service environments — cuts env wait 65%</label>
          </div>
        </Panel>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Lead time today" value={`${now.toFixed(1)}d`} color="#64748b" />
          <Stat label={`A: +${hires} hires`} value={`${hiredLead.toFixed(1)}d`} sub={`₹${(hires * 0.35).toFixed(1)} Cr/yr · ${(((now - hiredLead) / now) * 100).toFixed(0)}% faster`} color="#f97316" />
          <Stat label="B/C: flow fixes" value={`${fixedLead.toFixed(1)}d`} sub={`~₹0.2 Cr · ${(((now - fixedLead) / now) * 100).toFixed(0)}% faster`} color="#10b981" />
          <div className="col-span-3 rounded-2xl bg-slate-900 p-4 text-sm text-white">
            <b>Insight:</b>{" "}
            {fixedLead < hiredLead
              ? `For ${t.team}, flow fixes beat hiring. Waiting is ${Math.round(((now - t.build) / now) * 100)}% of lead time.`
              : `For ${t.team}, capacity is the real constraint — hiring helps more than flow fixes here.`}
          </div>
        </div>
      </div>

      <ExportBtn
        onClick={() =>
          onExport(
            `${uc.agent.data}\n\nLead-time breakdown (days): ${TEAMS.map((x) => `${x.team}: build ${x.build}, review ${x.review}, QA ${x.qa}, env ${x.env}`).join("; ")}\nSimulation for ${t.team}: today ${now.toFixed(1)}d; +${hires} hires → ${hiredLead.toFixed(1)}d; flow fixes (review=${fixReview}, env=${fixEnv}) → ${fixedLead.toFixed(1)}d. Cost per engineer ≈ ₹0.35 Cr/yr.`,
          )
        }
      />
    </div>
  );
}
