"use client";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Trophy, ShieldAlert } from "lucide-react";
import { PALETTE } from "./shared";

export interface Criterion { name: string; weight: number }

export default function WeightedMatrix({
  criteria: c0,
  options,
  scores: s0,
  accent,
  onChange,
}: {
  criteria: Criterion[];
  options: string[];
  scores: number[][]; // [criterion][option] 1-5
  accent: string;
  onChange?: (summary: string, winner: string) => void;
}) {
  const [criteria, setCriteria] = useState(c0);
  const [scores, setScores] = useState(s0);

  const totalW = criteria.reduce((a, c) => a + c.weight, 0) || 1;
  const totals = options.map((_, oi) => criteria.reduce((s, c, ci) => s + (c.weight / totalW) * scores[ci][oi], 0));
  const winnerIdx = totals.indexOf(Math.max(...totals));

  // Robustness: for each criterion, find the smallest weight change (±) that flips the winner.
  const flips = useMemo(() => {
    const res: { crit: string; change: number; newWinner: string }[] = [];
    criteria.forEach((c, ci) => {
      for (let d = 1; d <= 40; d++) {
        for (const sign of [1, -1]) {
          const nw = c.weight + sign * d;
          if (nw < 0) continue;
          const ws = criteria.map((x, j) => (j === ci ? nw : x.weight));
          const tw = ws.reduce((a, b) => a + b, 0) || 1;
          const t = options.map((_, oi) => ws.reduce((s, w, j) => s + (w / tw) * scores[j][oi], 0));
          const wi = t.indexOf(Math.max(...t));
          if (wi !== winnerIdx) {
            res.push({ crit: c.name, change: sign * d, newWinner: options[wi] });
            return;
          }
        }
      }
    });
    return res.sort((a, b) => Math.abs(a.change) - Math.abs(b.change));
  }, [criteria, scores, options, winnerIdx]);

  const summary = () =>
    `Criteria (weight) and scores 1-5 for ${options.join(" / ")}:\n` +
    criteria.map((c, ci) => `${c.name} (${Math.round((c.weight / totalW) * 100)}%): ${scores[ci].join(" / ")}`).join("\n") +
    `\nWeighted totals: ${options.map((o, i) => `${o} ${totals[i].toFixed(2)}`).join(", ")}\nWinner: ${options[winnerIdx]}` +
    `\nRobustness: ${flips.length ? flips.slice(0, 3).map((f) => `${f.crit} ${f.change > 0 ? "+" : ""}${f.change} pts → ${f.newWinner}`).join("; ") : "winner stable for ±40 pt weight changes"}`;

  return (
    <div className="space-y-4">
      <div className="card overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500">
              <th className="p-2">Criterion</th>
              <th className="w-48">Weight</th>
              {options.map((o, i) => <th key={o} className="text-center" style={{ color: PALETTE[i] }}>{o}</th>)}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, ci) => (
              <tr key={c.name} className="border-t border-slate-100">
                <td className="p-2 font-medium">{c.name}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <input type="range" min={0} max={40} value={c.weight} onChange={(e) => setCriteria(criteria.map((x, j) => (j === ci ? { ...x, weight: +e.target.value } : x)))} />
                    <span className="w-10 text-xs font-bold">{Math.round((c.weight / totalW) * 100)}%</span>
                  </div>
                </td>
                {options.map((o, oi) => (
                  <td key={o} className="text-center">
                    <select
                      className="rounded-lg border border-slate-200 px-2 py-1 font-bold"
                      style={{ background: `${PALETTE[oi]}${["10", "20", "35", "55", "80"][scores[ci][oi] - 1]}` }}
                      value={scores[ci][oi]}
                      onChange={(e) => setScores(scores.map((row, r) => (r === ci ? row.map((v, k) => (k === oi ? +e.target.value : v)) : row)))}
                    >
                      {[1, 2, 3, 4, 5].map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 border-slate-300 font-bold">
              <td className="p-2">Weighted score</td><td />
              {totals.map((t, i) => <td key={i} className="text-center text-lg" style={{ color: i === winnerIdx ? accent : undefined }}>{t.toFixed(2)}{i === winnerIdx && " 🏆"}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={options.map((o, i) => ({ o, score: +totals[i].toFixed(2) }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="o" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>{options.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl p-4 text-white" style={{ background: accent }}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase"><Trophy size={14} /> Current winner</div>
            <div className="font-display text-2xl font-bold">{options[winnerIdx]}</div>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-800"><ShieldAlert size={14} /> Robustness check</div>
            {flips.length === 0 ? (
              <p className="mt-1 text-sm">Winner is stable for any single weight change up to ±40 pts. Robust decision.</p>
            ) : (
              <ul className="mt-1 space-y-1 text-sm">
                {flips.slice(0, 3).map((f) => <li key={f.crit}><b>{f.crit}</b> {f.change > 0 ? "+" : ""}{f.change} pts → <b>{f.newWinner}</b> wins</li>)}
              </ul>
            )}
          </div>
          {onChange && <button className="btn bg-slate-900 text-white w-full justify-center" onClick={() => onChange(summary(), options[winnerIdx])}>Send matrix to the AI agent</button>}
        </div>
      </div>
    </div>
  );
}
