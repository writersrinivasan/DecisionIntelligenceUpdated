import { NextRequest } from "next/server";
import { Command } from "@langchain/langgraph";
import { buildGraph } from "@/lib/graph";
import { getUseCase } from "@/lib/usecases";
import type { AgentNode } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESERVED = new Set(["question", "data", "company", "outputs", "human", "__start__", "__end__"]);

function sanitizeCustom(stages: unknown): AgentNode[][] | null {
  if (!Array.isArray(stages) || stages.length === 0 || stages.length > 5) return null;
  const seen = new Set<string>();
  const out: AgentNode[][] = [];
  for (const st of stages) {
    if (!Array.isArray(st) || st.length === 0 || st.length > 4) return null;
    const row: AgentNode[] = [];
    for (const n of st as Record<string, unknown>[]) {
      let id = String(n.id ?? "").replace(/[^a-z0-9_]/gi, "").slice(0, 24) || `n${seen.size}`;
      if (RESERVED.has(id) || seen.has(id)) id = `n${seen.size}_${id}`;
      seen.add(id);
      const kind = n.kind === "human" ? "human" : "llm";
      row.push({
        id,
        kind,
        label: String(n.label ?? id).slice(0, 40),
        emoji: String(n.emoji ?? "🤖").slice(0, 4),
        role: String(n.role ?? "").slice(0, 120),
        prompt: String(n.prompt ?? "").slice(0, 1500),
      });
    }
    out.push(row);
  }
  return out;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { useCaseId, apiKey, model, threadId, resume, question, data, custom, company } = body ?? {};
  if (!apiKey || typeof apiKey !== "string") {
    return new Response(JSON.stringify({ error: "Missing Groq API key. Click 'Groq key' in the top bar." }), { status: 400 });
  }
  if (!threadId || typeof threadId !== "string") {
    return new Response(JSON.stringify({ error: "Missing threadId" }), { status: 400 });
  }

  let stages: AgentNode[][] | null = null;
  let kb = undefined;
  let org = "Fictional enterprise";
  if (custom) {
    stages = sanitizeCustom(custom.stages);
    org = String(company || "Your organisation").slice(0, 80);
  } else {
    const uc = getUseCase(String(useCaseId));
    if (uc) {
      stages = uc.agent.stages;
      kb = uc.kb;
      org = `${uc.company} (${uc.industry})`;
    }
  }
  if (!stages) return new Response(JSON.stringify({ error: "Unknown use case or invalid custom graph" }), { status: 400 });

  const graph = buildGraph({ stages, apiKey, model: model || "llama-3.3-70b-versatile", kb });
  const config = { configurable: { thread_id: threadId }, streamMode: "updates" as const };
  const input = resume
    ? new Command({ resume: { decision: String(resume.decision ?? "Approved"), note: String(resume.note ?? "").slice(0, 2000) } })
    : { question: String(question ?? "").slice(0, 4000), data: String(data ?? "").slice(0, 16000), company: org };

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      const t0 = Date.now();
      try {
        const it = await graph.stream(input as never, config);
        for await (const chunk of it as AsyncIterable<Record<string, unknown>>) {
          for (const [key, val] of Object.entries(chunk)) {
            if (key === "__interrupt__") {
              const arr = val as { value: unknown }[];
              send({ type: "interrupt", payload: arr[0]?.value, ms: Date.now() - t0 });
            } else {
              const v = val as { outputs?: Record<string, string> } | null;
              send({ type: "node", node: key, output: v?.outputs?.[key] ?? "", ms: Date.now() - t0 });
            }
          }
        }
        send({ type: "done", ms: Date.now() - t0 });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        send({ type: "error", error: msg.includes("401") || /invalid api key/i.test(msg) ? "Groq rejected the API key (401). Check your key." : msg });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
