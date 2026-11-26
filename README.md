# Decision Intelligence Lab — for Technology Leaders

A hands-on, industry-use-case web app for the 6-hour (3 × 2h) executive programme.
Next.js 15 · Tailwind · Recharts · **LangGraph JS** agents · **BYOK Groq**.

## Run
```bash
npm install
npm run dev          # http://localhost:3000
# or for the session:
npm run build && npm start
```
Each participant/table clicks **Add Groq key** (top-right) and pastes a key from https://console.groq.com/keys.
The key stays in the browser (session storage by default) and is forwarded only with that user's own requests.

## What's inside
- `/` — programme home, DI ecosystem infographic, 3-day journey (16 use cases)
- `/agenda` — minute-by-minute agenda + module→use-case coverage map
- `/usecase/[id]` — every use case: Definition · Why · What · How AI · Impact & time saved · Hands-on lab · LangGraph agent · Implement · Discuss
- `/playbook` — reference architecture, 90-day roadmap, readiness check, **custom agent builder**
- Floating **DI Coach** — context-aware AI assistant (single-node LangGraph)

## Architecture
- `lib/content/day{1,2,3}.ts` — all use-case content (edit here to customise)
- `lib/graph.ts` — builds a LangGraph `StateGraph` from stage config (parallel fan-out/fan-in, `retrieve` tool node, `human` node using `interrupt()` + `MemorySaver`)
- `app/api/agent` — streams node updates as NDJSON; resumes HITL with `Command({ resume })`
- `components/labs/*` — 16 interactive labs; "Send to agent" pushes lab results into the graph state

Note: HITL resume uses an in-memory checkpointer, so run a single server instance (fine for a classroom).
