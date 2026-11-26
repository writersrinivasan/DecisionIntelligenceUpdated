"use client";
import { useMemo, useState } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Cell } from "recharts";
import { ExportBtn, LabProps, Panel, Stat, rng, PALETTE } from "./shared";

const SERVICES = ["checkout", "payments-gateway", "inventory", "search", "cdn-edge"];
const CAUSES = ["Config change (unreviewed)", "DB connection pool", "3rd-party provider timeout", "Capacity / autoscaling", "Bad deploy (code bug)", "Certificate / secret expiry", "Data / cache corruption"];
const CAUSE_W = [9, 7, 6, 7, 8, 2, 2];
const SVC_FOR: Record<string, string[]> = {
  "Config change (unreviewed)": ["checkout", "cdn-edge", "search"],
  "DB connection pool": ["payments-gateway", "checkout"],
  "3rd-party provider timeout": ["payments-gateway"],
  "Capacity / autoscaling": ["checkout", "search", "inventory"],
  "Bad deploy (code bug)": ["checkout", "inventory", "search"],
  "Certificate / secret expiry": ["cdn-edge"],
  "Data / cache corruption": ["inventory"],
};

function makeIncidents() {
  const r = rng(42);
  const out: { id: string; day: number; service: string; cause: string; sev: "P1" | "P2"; mins: number; afterDeploy: boolean }[] = [];
  let n = 1;
  CAUSES.forEach((c, ci) => {
    for (let i = 0; i < CAUSE_W[ci]; i++) {
      const svcs = SVC_FOR[c];
      const sev = r() < 0.35 ? "P1" : "P2";
      out.push({
        id: `INC-${(1000 + n++).toString()}`,
        day: Math.floor(r() * 90) + 1,
        service: svcs[Math.floor(r() * svcs.length)],
        cause: c,
        sev,
        mins: Math.round((sev === "P1" ? 70 : 25) + r() * (sev === "P1" ? 150 : 60)),
        afterDeploy: c.includes("deploy") || c.includes("Config") ? true : r() < 0.3,
      });
    }
  });
  return out.sort((a, b) => a.day - b.day);
}

export default function IncidentLab({ onExport, accent }: LabProps) {
  const all = useMemo(makeIncidents, []);
  const [sev, setSev] = useState<"all" | "P1" | "P2">("all");
  const [svc, setSvc] = useState("all");
  const [rpm, setRpm] = useState(30000);
  const list = all.filter((i) => (sev === "all" || i.sev === sev) && (svc === "all" || i.service === svc));

  const pareto = useMemo(() => {
    const m: Record<string, number> = {};
    list.forEach((i) => (m[i.cause] = (m[i.cause] ?? 0) + i.mins));
    const rows = Object.entries(m).sort((a, b) => b[1] - a[1]);
    const total = rows.reduce((s, r) => s + r[1], 0) || 1;
    let cum = 0;
    return rows.map(([cause, mins]) => {
      cum += mins;
      return { cause: cause.split(" (")[0], mins, cum: Math.round((cum / total) * 100) };
    });
  }, [list]);

  const bySvc = SERVICES.map((s) => ({ s, mins: list.filter((i) => i.service === s).reduce((a, b) => a + b.mins, 0) }));
  const totalMins = list.reduce((a, b) => a + b.mins, 0);
  const afterDeployPct = Math.round((list.filter((i) => i.afterDeploy).length / (list.length || 1)) * 100);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select className="input w-auto" value={sev} onChange={(e) => setSev(e.target.value as "all")}><option value="all">All severities</option><option>P1</option><option>P2</option></select>
        <select className="input w-auto" value={svc} onChange={(e) => setSvc(e.target.value)}><option value="all">All services</option>{SERVICES.map((s) => <option key={s}>{s}</option>)}</select>
        <label className="flex items-center gap-2 text-sm">Revenue/min ₹<input type="number" className="input w-28" value={rpm} onChange={(e) => setRpm(+e.target.value)} /></label>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Incidents" value={String(list.length)} color={accent} />
        <Stat label="Downtime" value={`${(totalMins / 60).toFixed(1)}h`} color="#ef4444" />
        <Stat label="Revenue at risk" value={`₹${((totalMins * rpm) / 1e7).toFixed(2)} Cr`} color="#f97316" />
        <Stat label="Within 2h of a change" value={`${afterDeployPct}%`} color="#7c3aed" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Pareto · downtime minutes by root cause">
          <div className="h-72">
            <ResponsiveContainer>
              <ComposedChart data={pareto} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cause" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                <YAxis yAxisId="l" />
                <YAxis yAxisId="r" orientation="right" domain={[0, 100]} unit="%" />
                <Tooltip />
                <Bar yAxisId="l" dataKey="mins" fill={accent} radius={[6, 6, 0, 0]} />
                <Line yAxisId="r" dataKey="cum" stroke="#0f172a" strokeWidth={2} dot />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500">The line shows cumulative %. The first 2–3 causes usually explain ~60–80% of downtime.</p>
        </Panel>
        <Panel title="Downtime by service (minutes)">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={bySvc}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="s" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mins" radius={[6, 6, 0, 0]}>{bySvc.map((_, i) => <Cell key={i} fill={PALETTE[i + 1]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <Panel title={`Incident log (${list.length})`}>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white text-left uppercase text-slate-500"><tr><th className="p-1.5">ID</th><th>Day</th><th>Service</th><th>Cause</th><th>Sev</th><th>Mins</th><th>After change?</th></tr></thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id} className="border-t border-slate-100">
                  <td className="p-1.5 font-mono">{i.id}</td><td>{i.day}</td><td>{i.service}</td><td>{i.cause}</td>
                  <td><span className={`rounded px-1.5 font-bold ${i.sev === "P1" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}>{i.sev}</span></td>
                  <td>{i.mins}</td><td>{i.afterDeploy ? "yes" : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <ExportBtn
        onClick={() =>
          onExport(
            `Revenue per minute during sale: ₹${rpm}\nFilter: severity=${sev}, service=${svc}\nIncidents: ${list.length}; downtime ${totalMins} min; ${afterDeployPct}% within 2h of a change\nPareto (cause: minutes, cumulative%): ${pareto.map((p) => `${p.cause}: ${p.mins} (${p.cum}%)`).join("; ")}\nBy service (min): ${bySvc.map((b) => `${b.s} ${b.mins}`).join(", ")}\n\nIncident log:\nID | day | service | cause | sev | mins | afterChange\n${list.map((i) => `${i.id} | ${i.day} | ${i.service} | ${i.cause} | ${i.sev} | ${i.mins} | ${i.afterDeploy ? "Y" : "N"}`).join("\n")}`,
          )
        }
      />
    </div>
  );
}
