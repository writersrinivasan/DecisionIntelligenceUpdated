import type { KbDoc } from "./types";

const STOP = new Set(
  "a an the and or of to in on for with is are be can we our this that it as by from at use using any must may not no do does into than then their they which who whom what when where why how will would should could".split(" "),
);

export const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));

export interface Hit {
  doc: KbDoc;
  score: number;
  matched: string[];
}

/** Minimal TF-IDF retrieval — transparent so executives can see how RAG "chooses" context. */
export function retrieve(query: string, docs: KbDoc[], k = 3): Hit[] {
  const qTokens = Array.from(new Set(tokenize(query)));
  const docTokens = docs.map((d) => tokenize(d.title + " " + d.text));
  const N = docs.length;
  const idf = (t: string) => {
    const df = docTokens.filter((dt) => dt.includes(t)).length;
    return Math.log((N + 1) / (df + 1)) + 1;
  };
  const hits = docs.map((doc, i) => {
    const toks = docTokens[i];
    let score = 0;
    const matched: string[] = [];
    for (const q of qTokens) {
      const tf = toks.filter((t) => t === q).length;
      if (tf > 0) {
        score += (1 + Math.log(tf)) * idf(q);
        matched.push(q);
      }
    }
    return { doc, score: score / Math.sqrt(toks.length || 1), matched };
  });
  return hits.sort((a, b) => b.score - a.score).slice(0, k);
}
