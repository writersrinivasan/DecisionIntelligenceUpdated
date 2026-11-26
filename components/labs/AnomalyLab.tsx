"use client";
import { useMemo, useState } from "react";
import { ComposedChart, Line, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend, Area } from "recharts";
import { ExportBtn, LabProps, Panel, Slider, Stat, rng } from "./shared";

function series(drift: number) {
  const r = rng(7);
  return Array.from({ length: 72 }, (_, i) => {
    const base = 210 + 18 * Math.sin(i / 9) + (r() - 0.5) * 22;
    const d = i >= 50 ? Math.pow(i - 49, 1.45) * drift : 0;
    const spike = i === 23 ? 70 : 0;
    return Math.round(base + d + spike);
  });
}

export default function AnomalyLab({ onExport, accent }: LabProps) {
  const [z, setZ] = useState(2.5);
  const [slo, setSlo] = useState(400);
  const [win, setWin] = useState(12);
  const [drift, setDrift] = useState(1.6);
  const s = useMemo(() => series(drift), [drift]);

  const { rows, anomalies, breachIn, slope } = useMemo(() => {
    const rows: { t: string; i: number; latency?: number; mean?: number; upper?: number; anomaly?: number; forecast?: number }[] = [];
    const anomalies: number[] = [];
    s.forEach((v, i) => {
      const w = s.slice(Math.max(0, i - win), i);
      const m = w.length ? w.reduce((a, b) => a + b, 0) / w.length : v;
      const sd = w.length > 2 ? Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / w.length) : 20;
      const isA = w.length >= 4 && (v - m) / (sd || 1) > z;
      if (isA) anomalies.push(i);
      rows.push({ t: `${String(Math.floor(i / 6)).padStart(2, "0")}:${(i % 6) * 10}`.replace(/:0$/, ":00"), i, latency: v, mean: Math.round(m), upper: Math.round(m + z * sd), anomaly: isA ? v : undefined });
    });
    // linear trend on last 8 points → forecast
    const last = s.slice(-8);
    const n = last.length, xs = last.map((_, i) => i);
    const mx = xs.reduce((a, b) => a + b, 0) / n, my = last.reduce((a, b) => a + b, 0) / n;
    const slope = xs.reduce((a, x, i) => a + (x - mx) * (last[i] - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);
    let breachIn: number | null = null;
    for (let k = 1; k <= 24; k++) {
      const f = Math.round(s[s.length - 1] + slope * k);
      rows.push({ t: `+${k * 10}m`, i: 71 + k, forecast: f });
      if (breachIn === null && f >= slo) breachIn = k * 10;
    }
    rows[71].forecast = s[71];
    return { rows, anomalies, breachIn, slope };
  }, [s, z, win, slo]);

  const staticAlerts = s.filter((v) => v >= slo).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-4">
        <Panel title="Detector settings">
          <Slider label="Sensitivity (z-score)" value={z} min={1.5} max={4} step={0.1} onChange={setZ} suffix="σ" />
          <Slider label="Rolling window" value={win} min={6} max={24} onChange={setWin} suffix=" pts" />
          <Slider label="SLO p95 latency" value={slo} min={300} max={500} step={10} onChange={setSlo} suffix="ms" />
          <Slider label="Scenario: drift strength" value={drift} min={0} max={3} step={0.1} onChange={setDrift} />
          <p className="mt-2 text-xs text-slate-500">Lower σ = more sensitive (more noise). Higher σ = quieter (may miss things).</p>
        </Panel>
        <div className="space-y-3 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="ML anomalies flagged" value={String(anomalies.length)} color="#ef4444" />
            <Stat label="Static-threshold alerts" value={String(staticAlerts)} sub={`fires only ≥ ${slo}ms`} color="#64748b" />
            <Stat label="Trend" value={`${slope > 0 ? "+" : ""}${slope.toFixed(1)} ms/10m`} color={accent} />
            <Stat label="Predicted SLO breach" value={breachIn === null ? "none (4h)" : `in ${breachIn} min`} color={breachIn !== null && breachIn <= 60 ? "#ef4444" : "#f59e0b"} />
          </div>
          <Panel title="Mobile API p95 latency (ms) · last 12h + 4h forecast">
            <div className="h-80">
              <ResponsiveContainer>
                <ComposedChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="t" interval={11} tick={{ fontSize: 10 }} />
                  <YAxis domain={[150, "auto"]} />
                  <Tooltip /><Legend />
                  <Area dataKey="upper" name={`Normal band (μ+${z}σ)`} fill={`${accent}22`} stroke="none" />
                  <Line dataKey="mean" name="Rolling mean" stroke="#94a3b8" dot={false} strokeDasharray="4 4" />
                  <Line dataKey="latency" name="p95 latency" stroke={accent} dot={false} strokeWidth={2} />
                  <Line dataKey="forecast" name="Forecast" stroke="#f97316" dot={false} strokeWidth={2} strokeDasharray="6 4" />
                  <Scatter dataKey="anomaly" name="Anomaly" fill="#ef4444" />
                  <ReferenceLine y={slo} stroke="#ef4444" strokeWidth={2} label={{ value: `SLO ${slo}ms`, fill: "#ef4444", fontSize: 11, position: "insideTopLeft" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
      <Panel title="The AIOps decision policy (what the agent will apply)">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-sm"><b className="text-emerald-700">AUTO-REMEDIATE</b><br />Reversible (rollback/scale), small blast radius, cause confidence &gt; 80%.</div>
          <div className="rounded-xl bg-amber-50 p-3 text-sm"><b className="text-amber-700">HUMAN-ON-THE-LOOP</b><br />Agent acts, on-call notified and can veto within 5 min.</div>
          <div className="rounded-xl bg-rose-50 p-3 text-sm"><b className="text-rose-700">ESCALATE</b><br />Irreversible, data-affecting, customer-visible or low-confidence cause.</div>
        </div>
      </Panel>
      <ExportBtn onClick={() => onExport(`Telemetry (p95 latency ms, last 8 x 10min): ${s.slice(-8).join(", ")}; SLO = ${slo}ms\nML detector: ${anomalies.length} anomalies at z>${z} (window ${win}); last anomaly index ${anomalies[anomalies.length - 1] ?? "none"} of 72\nTrend +${slope.toFixed(1)} ms per 10 min → predicted SLO breach ${breachIn === null ? "not within 4h" : `in ${breachIn} minutes`}\nStatic threshold alerts so far: ${staticAlerts}\nError rate: 0.4% → 1.1%\nChange log: 13:05 deploy api-gateway v4.12 (connection pool 200→120); 13:40 CDN config change (cache TTL)\nInfra: DB CPU 58% stable; gateway pods 12 (HPA max 12)\nTraffic: +8% vs same day last week`)} />
    </div>
  );
}
