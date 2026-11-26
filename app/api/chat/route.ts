import { NextRequest, NextResponse } from "next/server";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const runtime = "nodejs";

const SYSTEM = `You are "DI Coach", the AI assistant inside a hands-on executive masterclass "Decision Intelligence for Technology Leaders" (CTOs, CIOs, VPs Engineering, architects).
Answer like a sharp, pragmatic CTO advisor: short paragraphs, bullets, concrete numbers/examples, and always end with one practical "Try this Monday" action.
You know: decision lifecycle, KPIs/DORA, 4 levels of analytics, build/buy/partner, weighted scoring, TCO/ROI/NPV/payback, RICE/WSJF/MoSCoW, scenario & sensitivity analysis, ML forecasting/anomaly detection, GenAI, RAG, agentic AI with LangGraph, AIOps, FinOps, portfolio intelligence, AI governance, HITL, decision effectiveness.`;

export async function POST(req: NextRequest) {
  const { apiKey, model, messages, context } = await req.json();
  if (!apiKey) return NextResponse.json({ error: "Add your Groq API key first (top bar)." }, { status: 400 });
  const llm = new ChatGroq({ apiKey, model: model || "llama-3.3-70b-versatile", temperature: 0.4, maxTokens: 900 });

  // A single-node LangGraph — the same framework as the decision agents.
  const graph = new StateGraph(MessagesAnnotation)
    .addNode("coach", async (state) => ({
      messages: [await llm.invoke([new SystemMessage(`${SYSTEM}\n\nThe participant is currently viewing: ${String(context || "the home page").slice(0, 1500)}`), ...state.messages])],
    }))
    .addEdge(START, "coach")
    .addEdge("coach", END)
    .compile();

  try {
    const hist = (Array.isArray(messages) ? messages : []).slice(-12).map((m: { role: string; content: string }) =>
      m.role === "user" ? new HumanMessage(String(m.content).slice(0, 6000)) : new AIMessage(String(m.content).slice(0, 6000)),
    );
    const out = await graph.invoke({ messages: hist });
    const last = out.messages[out.messages.length - 1];
    return NextResponse.json({ reply: typeof last.content === "string" ? last.content : JSON.stringify(last.content) });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg.includes("401") ? "Groq rejected the API key." : msg }, { status: 500 });
  }
}
