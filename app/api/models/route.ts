import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { apiKey } = await req.json();
  if (!apiKey) return NextResponse.json({ ok: false, error: "No key" }, { status: 400 });
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" });
  if (!r.ok) return NextResponse.json({ ok: false, error: `Groq returned ${r.status}` }, { status: 200 });
  const j = (await r.json()) as { data: { id: string; active?: boolean }[] };
  const models = j.data
    .map((m) => m.id)
    .filter((id) => !/whisper|tts|guard|prompt-guard|playai|orpheus|distil|safeguard/i.test(id))
    .sort();
  return NextResponse.json({ ok: true, models });
}
