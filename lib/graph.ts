import "server-only";
import { Annotation, StateGraph, START, END, MemorySaver, interrupt } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { AgentNode, KbDoc } from "./types";
import { retrieve } from "./retrieval";

export const DecisionState = Annotation.Root({
  question: Annotation<string>(),
  data: Annotation<string>(),
  company: Annotation<string>(),
  outputs: Annotation<Record<string, string>>({
    reducer: (a, b) => ({ ...a, ...b }),
    default: () => ({}),
  }),
  human: Annotation<{ decision: string; note: string } | null>({
    reducer: (a, b) => b ?? a,
    default: () => null,
  }),
});

type S = typeof DecisionState.State;

// One shared checkpointer so a graph paused at interrupt() can be resumed by a later request.
const g = globalThis as unknown as { __diSaver?: MemorySaver };
export const checkpointer = g.__diSaver ?? (g.__diSaver = new MemorySaver());

const BASE = `You are one agent inside a LangGraph Decision Intelligence workflow used in an executive masterclass for CTOs/CIOs.
Rules: be concise and executive-ready; use markdown headings, bullets and small tables; quantify wherever the data allows;
never invent numbers that are not derivable from the data — say "assumption" when you estimate; keep under 230 words unless asked for a table or slides.`;

export interface BuildOpts {
  stages: AgentNode[][];
  apiKey: string;
  model: string;
  kb?: KbDoc[];
}

function upstreamText(state: S, stages: AgentNode[][], uptoStage: number) {
  const parts: string[] = [];
  for (let i = 0; i < uptoStage; i++) {
    for (const n of stages[i]) {
      const o = state.outputs[n.id];
      if (o) parts.push(`### From ${n.label}\n${o}`);
    }
  }
  if (state.human) parts.push(`### HUMAN DECISION (binding)\nDecision: ${state.human.decision}\nNotes: ${state.human.note || "none"}`);
  return parts.join("\n\n");
}

export function buildGraph({ stages, apiKey, model, kb }: BuildOpts) {
  const llm = new ChatGroq({ apiKey, model, temperature: 0.3, maxTokens: 900 });
  const graph = new StateGraph(DecisionState);

  stages.forEach((stage, si) => {
    for (const node of stage) {
      const kind = node.kind ?? "llm";
      if (kind === "retrieve") {
        graph.addNode(node.id, async (state: S) => {
          const hits = retrieve(`${state.question} ${state.data}`, kb ?? [], 3);
          const text = hits
            .map((h) => `**[${h.doc.id}] ${h.doc.title}** (score ${h.score.toFixed(2)})\n> ${h.doc.text}`)
            .join("\n\n");
          return { outputs: { [node.id]: text || "No documents retrieved." } };
        });
      } else if (kind === "human") {
        graph.addNode(node.id, async (state: S) => {
          const proposal = stages[si - 1]?.map((n) => state.outputs[n.id]).filter(Boolean).join("\n\n") ?? "";
          const answer = interrupt({ node: node.id, label: node.label, proposal }) as { decision: string; note: string };
          return {
            human: answer,
            outputs: { [node.id]: `**Decision:** ${answer.decision}\n\n**Approver notes:** ${answer.note || "—"}` },
          };
        });
      } else {
        graph.addNode(node.id, async (state: S) => {
          const ctx = upstreamText(state, stages, si);
          const res = await llm.invoke([
            new SystemMessage(`${BASE}\n\nYOUR ROLE — ${node.label}: ${node.prompt ?? node.role}`),
            new HumanMessage(
              `Organisation: ${state.company}\n\nDECISION QUESTION:\n${state.question}\n\nDATA:\n${state.data}` +
                (ctx ? `\n\nINPUTS FROM UPSTREAM AGENTS:\n${ctx}` : ""),
            ),
          ]);
          const text = typeof res.content === "string" ? res.content : JSON.stringify(res.content);
          return { outputs: { [node.id]: text } };
        });
      }
    }
  });

  // Wire stages: START -> stage0 (fan-out), stage i -> stage i+1 (fan-in barrier), last -> END
  const anyG = graph as unknown as {
    addEdge: (a: string | string[], b: string) => void;
  };
  for (const n of stages[0]) anyG.addEdge(START, n.id);
  for (let i = 0; i < stages.length - 1; i++) {
    const from = stages[i].map((n) => n.id);
    for (const to of stages[i + 1]) anyG.addEdge(from.length > 1 ? from : from[0], to.id);
  }
  for (const n of stages[stages.length - 1]) anyG.addEdge(n.id, END);

  return graph.compile({ checkpointer });
}
