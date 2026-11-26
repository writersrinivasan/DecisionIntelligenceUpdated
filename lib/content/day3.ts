import type { UseCase } from "../types";

export const day3: UseCase[] = [
  {
    id: "portfolio-health",
    num: 13,
    day: 3,
    minutes: 20,
    module: 5,
    subtopics: ["5.2", "5.5"],
    title: "Project Health & Agentic Resource Allocation",
    tagline: "Predict project health, spot over-allocated people, and let an agent propose reallocations.",
    industry: "IT Services",
    company: "Veltrix Consulting",
    theme: "teal",
    icon: "Network",
    scenario:
      "Veltrix runs 7 client programmes with 120 engineers. Two programmes are drifting, four key architects are on 3 projects each, and technical debt is slowing the flagship. Who should move where?",
    definition:
      "Project & portfolio decision intelligence combines health indicators (schedule, budget, scope, quality, team) with resource utilisation and engineering signals (code quality, tech debt, delivery forecast) to decide where people and money should go next.",
    why: [
      "Key people are spread across too many projects — context switching silently kills throughput.",
      "Technical debt is invisible to portfolio decisions until velocity collapses.",
      "Reallocation decisions are usually made by escalation, not evidence.",
    ],
    what: ["Project health index (schedule, budget, scope, quality, team)", "Resource utilisation & over-allocation", "Tech debt and code quality signals", "Agent-recommended reallocation with human approval"],
    howAI: [
      { step: "Score", detail: "Health index computed per project from 5 dimensions.", ai: "Analytics" },
      { step: "Predict", detail: "ML forecasts delivery date range from velocity & debt trend.", ai: "ML" },
      { step: "Allocate", detail: "Agent proposes people moves that maximise portfolio health.", ai: "Agent" },
      { step: "Approve", detail: "Delivery heads approve moves.", ai: "Human" },
    ],
    metrics: [
      { label: "People on 3+ projects", before: 18, after: 5, unit: "people", better: "lower" },
      { label: "Projects in red", before: 2, after: 0, unit: "projects", better: "lower" },
      { label: "Billable utilisation", before: 71, after: 82, unit: "%", better: "higher" },
    ],
    timeSavings: [{ task: "Weekly resourcing meeting prep", before: 8, after: 1, cadence: "per week" }],
    valueStatement: "+11 pts utilisation on 120 engineers ≈ 13 FTE of capacity unlocked without hiring.",
    lab: "health",
    labIntro: "See the portfolio health grid and people heatmap. Move allocation sliders and watch over-allocation and health shift.",
    agent: {
      title: "Resource Allocation Agent",
      pattern: "Sequential with human approval node",
      stages: [
        [{ id: "health", label: "Health Assessor", emoji: "🩺", role: "Ranks project health & drivers", prompt: "Assess each project's health (Green/Amber/Red) from the data with the driving factor, including technical debt and code quality signals." }],
        [{ id: "allocator", label: "Allocation Agent", emoji: "🔀", role: "Proposes people moves", prompt: "Propose up to 5 specific resource moves (person/role from → to, % allocation) that improve the at-risk projects without breaking others. Reduce people on 3+ projects. Show expected impact." }],
        [{ id: "approval", label: "Delivery Head Approval", emoji: "🙋", kind: "human", role: "Human-in-the-loop approval" }],
        [{ id: "plan", label: "Execution Planner", emoji: "📋", role: "Turns approved moves into a plan", prompt: "Using the human decision and notes, produce the final execution plan: approved moves, communication to clients/teams, and KPIs to watch for 4 weeks. If the human rejected, propose a revised, more conservative plan." }],
      ],
      question: "How should Veltrix reallocate people to rescue the at-risk programmes?",
      data: `Project | Schedule var % | Budget var % | Scope churn % | Defect escape % | Tech debt (days) | Team size
Atlas (flagship) | -18 | +22 | 14 | 9 | 180 | 28
Borealis | -4 | +3 | 6 | 3 | 40 | 16
Cobalt | -26 | +31 | 25 | 12 | 95 | 14
Delta | +2 | -5 | 3 | 2 | 20 | 18
Ember | -6 | +8 | 9 | 5 | 60 | 15
Fjord | 0 | -2 | 4 | 3 | 30 | 12
Granite | -9 | +11 | 11 | 6 | 70 | 17
Over-allocated: Priya (Architect: Atlas 40, Cobalt 40, Delta 40), Arjun (Architect: Atlas 50, Granite 50, Fjord 30), Meera (QA lead: Cobalt 50, Ember 40, Borealis 30), Kiran (DevOps: Atlas 60, Delta 30, Fjord 30)`,
    },
    implement: [
      { phase: "Data", weeks: "Weeks 1–2", actions: ["Unify PPM + timesheet + Jira + SonarQube", "Define health index weights"] },
      { phase: "Insight", weeks: "Weeks 3–4", actions: ["Weekly health + people heatmap", "Flag >2 project allocations"] },
      { phase: "Agent", weeks: "Weeks 5–8", actions: ["Agent proposes moves before resourcing meeting", "Human approval mandatory"] },
    ],
    tools: ["ServiceNow SPM / Planview", "SonarQube", "Power BI", "LangGraph (interrupt)"],
    discuss: ["How many projects is your best architect on?", "Should AI ever move people automatically?"],
  },
  {
    id: "governance-hitl",
    num: 14,
    day: 3,
    minutes: 35,
    module: 6,
    subtopics: ["6.1", "6.2", "6.3", "6.4"],
    title: "Responsible AI Decision Gate (Human-in-the-Loop)",
    tagline: "Risk heatmap, autonomy classifier and a live LangGraph interrupt where YOU approve the AI's decision.",
    industry: "Banking · Lending",
    company: "Halvorn Bank",
    theme: "rose",
    icon: "ShieldCheck",
    scenario:
      "Halvorn wants an AI agent to auto-approve IT change requests and vendor access for its digital lending stack. Regulators, the CISO and the CRO all want to know: which decisions can AI make alone, and who is accountable?",
    definition:
      "Responsible decision-making ensures AI-assisted decisions are transparent, fair, accountable, explainable, secure and privacy-preserving. Human-in-the-Loop (HITL) means the workflow pauses for human approval at defined risk points; human-on-the-loop means humans monitor and can intervene.",
    why: [
      "Speed without governance creates regulatory, reputational and security risk.",
      "Not all decisions are equal: reversibility and impact should drive autonomy level.",
      "Accountability stays with a named human — always.",
    ],
    what: [
      "Technology decision risks: operational, financial, technical, strategic, reputational.",
      "Responsible AI pillars: transparency, fairness, accountability, explainability, human oversight.",
      "Data privacy & security: access control, compliance, confidentiality.",
      "HITL: approval, escalation and decision accountability.",
    ],
    howAI: [
      { step: "Classify", detail: "Each decision gets an autonomy level from its risk profile.", ai: "Analytics" },
      { step: "Assess", detail: "Risk agent scores the specific request.", ai: "Agent" },
      { step: "Pause", detail: "LangGraph interrupt() stops the graph for human approval.", ai: "Human" },
      { step: "Execute & log", detail: "Decision, approver and rationale stored for audit.", ai: "Agent" },
    ],
    metrics: [
      { label: "Low-risk changes auto-approved", before: 0, after: 65, unit: "%", better: "higher" },
      { label: "CAB approval lead time", before: 5, after: 1, unit: "days", better: "lower" },
      { label: "Decisions with audit trail", before: 55, after: 100, unit: "%", better: "higher" },
    ],
    timeSavings: [{ task: "Change Advisory Board review", before: 6, after: 1.5, cadence: "per week" }],
    valueStatement: "Automating the safe 65% lets the CAB spend its time on the 35% that actually carries risk.",
    lab: "governance",
    labIntro: "Plot risks on the heatmap, run the autonomy classifier, then run the agent — it will PAUSE and wait for your approval.",
    agent: {
      title: "Governed Change-Approval Agent",
      pattern: "Assess → risk → HUMAN INTERRUPT → execute & audit",
      stages: [
        [
          { id: "assessor", label: "Change Assessor", emoji: "🔎", role: "Summarises request & blast radius", prompt: "Summarise the change request: what changes, systems affected, reversibility, blast radius, data touched." },
          { id: "risk", label: "Risk & Compliance Agent", emoji: "⚠️", role: "Scores risks & RAI checks", prompt: "Score operational, financial, technical, strategic, reputational and privacy/security risk (1-5 each). Check RBI/regulatory concerns. Recommend an autonomy level: AUTO / HUMAN-ON-LOOP / HUMAN-IN-LOOP / HUMAN-ONLY, with reason." },
        ],
        [{ id: "approval", label: "Human Approver", emoji: "🙋", kind: "human", role: "Accountable human decision" }],
        [{ id: "audit", label: "Execution & Audit Logger", emoji: "🧾", role: "Executes per decision & writes audit record", prompt: "Produce the audit record: request, AI recommendation, human decision, approver rationale, conditions, timestamp placeholder, and next review. If rejected, state what must change for resubmission." }],
      ],
      question: "Approve change CR-2291: grant the vendor's support team production read access to the loan-decisioning database for 14 days.",
      data: `CR-2291
Requester: Vendor (LendTech credit-scoring provider) via IT Ops
Change: Production READ access to loan_decision DB (contains PAN, income, credit score) for 14 days to debug a scoring bug
Proposed controls: VPN + named accounts; no export controls; session recording not enabled
Business urgency: bug causes 3% of loan applications to be wrongly declined (~420/week)
Alternative: provide masked data copy in staging (2 days effort)`,
    },
    implement: [
      { phase: "Policy", weeks: "Weeks 1–2", actions: ["Define decision classes & autonomy levels", "Name accountable owners per class"] },
      { phase: "Controls", weeks: "Weeks 3–6", actions: ["LangGraph interrupt for HITL classes", "Immutable audit log of AI + human decisions"] },
      { phase: "Assure", weeks: "Quarterly", actions: ["Sample-audit auto decisions", "Bias / drift review; update thresholds"] },
    ],
    tools: ["LangGraph interrupt + checkpointer", "ServiceNow change mgmt", "SIEM / audit log", "NIST AI RMF, ISO 42001"],
    discuss: [
      "Can technology leaders trust AI-generated recommendations?",
      "Who is accountable when an AI-assisted decision produces an undesirable outcome?",
      "How should organisations balance decision speed with governance?",
      "When should a decision remain exclusively human-driven?",
    ],
  },
  {
    id: "decision-effectiveness",
    num: 15,
    day: 3,
    minutes: 10,
    module: 6,
    subtopics: ["6.5"],
    title: "Decision Effectiveness Tracker",
    tagline: "Separate decision quality from outcome luck — and build an organisation that learns.",
    industry: "Cross-industry",
    company: "Your organisation",
    theme: "violet",
    icon: "Target",
    scenario: "You made 20 big technology decisions last year. Which were good decisions — not just lucky outcomes? This decision journal makes the feedback loop real.",
    definition:
      "Decision effectiveness separates the quality of the decision process (information, options, reasoning) from the quality of the outcome. Good process + bad outcome = bad luck; bad process + good outcome = dumb luck. Tracking both builds calibration.",
    why: ["Judging decisions by outcome alone ('resulting') teaches the wrong lessons.", "Feedback loops are the missing piece in most organisations' DI ecosystem.", "Calibration — how often your 70% confident calls come true — improves with tracking."],
    what: ["Decision journal: expected outcome, confidence, process quality", "Process × outcome 2×2 matrix", "Calibration and continuous improvement"],
    howAI: [
      { step: "Capture", detail: "Every decision logged with confidence & expected KPI.", ai: "Human" },
      { step: "Track", detail: "KPIs pulled automatically at review date.", ai: "Analytics" },
      { step: "Learn", detail: "AI summarises patterns across decisions (where we're over-confident).", ai: "GenAI" },
    ],
    metrics: [
      { label: "Decisions reviewed post-hoc", before: 5, after: 85, unit: "%", better: "higher" },
      { label: "Calibration error", before: 30, after: 12, unit: "pts", better: "lower" },
    ],
    timeSavings: [{ task: "Quarterly decision retrospective", before: 12, after: 3, cadence: "per quarter" }],
    valueStatement: "Organisations that review decisions systematically improve forecast accuracy and stop repeating costly patterns.",
    lab: "journal",
    labIntro: "Log decisions (saved in your browser), rate process & outcome, and see your decision quality matrix.",
    agent: {
      title: "Decision Retrospective Agent",
      pattern: "Sequential",
      stages: [
        [{ id: "patterns", label: "Pattern Finder", emoji: "🧩", role: "Finds patterns across decisions", prompt: "Analyse the decision journal: classify each into the process×outcome 2×2, and find patterns (over-confidence, types of decisions that go wrong)." }],
        [{ id: "coach", label: "Leadership Coach", emoji: "🎓", role: "Recommends process improvements", prompt: "Recommend 5 specific improvements to this leadership team's decision process, with the KPI that would show improvement." }],
      ],
      question: "What does our decision history say about how we decide?",
      data: "(Use 'Send to agent' in the lab to load your journal.)",
    },
    implement: [
      { phase: "Start", weeks: "Week 1", actions: ["Decision register with confidence %", "Set review date on every decision"] },
      { phase: "Review", weeks: "Quarterly", actions: ["Retro using the 2×2", "Update decision templates"] },
    ],
    tools: ["Decision register (Notion/Confluence/SharePoint)", "Power BI", "Groq LLM"],
    discuss: ["Name a good decision with a bad outcome.", "Would you publish your calibration score?"],
  },
  {
    id: "capstone",
    num: 16,
    day: 3,
    minutes: 55,
    module: 7,
    subtopics: ["5.6", "7.1", "7.2", "7.3", "7.4", "7.5", "7.6"],
    title: "Capstone: Altora Group Decision Support System",
    tagline: "End-to-end: problem → data → AI analysis → decision matrix → executive dashboard → board presentation.",
    industry: "Diversified Enterprise",
    company: "Altora Group",
    theme: "pink",
    icon: "Trophy",
    scenario:
      "Altora Group (₹6,000 Cr revenue, 2,400 IT staff) has rising IT costs (+19% YoY), 5 of 9 strategic projects delayed, and recurring P1 incidents on its customer platform. The new CEO gives the CIO 30 days and ₹25 Cr to present a turnaround decision. You are the CIO.",
    definition:
      "A Technology Decision Support System (DSS) integrates data, analytics, AI agents and human governance into one workflow that produces an auditable executive decision. This capstone combines every module into a single end-to-end flow.",
    why: ["Real decisions cut across cost, delivery and reliability simultaneously.", "Executives need one integrated story, not six disconnected dashboards.", "This is the blueprint you take back to implement on Monday."],
    what: ["7.1 Problem definition", "7.2 Data analysis (projects, ops, cloud, incidents)", "7.3 AI-powered analysis with LangGraph", "7.4 Weighted decision matrix", "7.5 Executive dashboard (5.6 scorecard)", "7.6 Board presentation"],
    howAI: [
      { step: "Define", detail: "Frame the decision and success KPIs.", ai: "Human" },
      { step: "Analyse", detail: "Dashboards across 4 data domains.", ai: "Analytics" },
      { step: "AI analysis", detail: "Parallel domain agents + strategist (LangGraph).", ai: "Agent" },
      { step: "Evaluate", detail: "Weighted matrix of 4 strategic options.", ai: "Analytics" },
      { step: "Approve", detail: "CEO-proxy human approval (interrupt).", ai: "Human" },
      { step: "Present", detail: "AI drafts the board presentation.", ai: "GenAI" },
    ],
    metrics: [
      { label: "Time to board-ready decision", before: 8, after: 1, unit: "weeks", better: "lower" },
      { label: "Data domains integrated", before: 1, after: 4, unit: "domains", better: "higher" },
    ],
    timeSavings: [
      { task: "Cross-domain analysis", before: 80, after: 8, cadence: "per strategic decision" },
      { task: "Board deck & dashboard", before: 30, after: 4, cadence: "per strategic decision" },
    ],
    valueStatement: "The deliverables: decision matrix, AI insights, prioritisation, risk assessment, recommendation, executive summary.",
    lab: "capstone",
    labIntro: "Work through the six steps as a team. Each step builds the deliverables for your final board presentation.",
    agent: {
      title: "Altora Decision Support System",
      pattern: "Parallel domain agents → strategist → HUMAN (CEO) → board writer",
      stages: [
        [
          { id: "costs", label: "Cloud & Cost Agent", emoji: "☁️", role: "IT cost drivers", prompt: "Analyse IT/cloud cost data: main drivers of the 19% growth and savings potential in ₹." },
          { id: "delivery", label: "Delivery Agent", emoji: "📅", role: "Project delays", prompt: "Analyse project data: why 5 of 9 projects are delayed, which to stop/fix/accelerate." },
          { id: "reliability", label: "Reliability Agent", emoji: "🚨", role: "Incident patterns", prompt: "Analyse incident data: recurring patterns, root causes and business impact." },
        ],
        [{ id: "strategist", label: "Chief Strategist", emoji: "♟️", role: "Integrated options & recommendation", prompt: "Integrate the three analyses. Evaluate the 4 strategic options with a weighted matrix (cost, delivery, reliability, risk, time-to-value) and recommend how to deploy ₹25 Cr. Include risk assessment and investment prioritisation." }],
        [{ id: "ceo", label: "CEO Approval", emoji: "🙋", kind: "human", role: "Human-in-the-loop sign-off" }],
        [{ id: "board", label: "Board Presentation Writer", emoji: "🎤", role: "Executive decision summary", prompt: "Write the final board presentation as 6 slides in markdown (## Slide N: title, bullets): situation, insights, options evaluated, recommendation & ₹ allocation, risks & governance, 90-day plan & KPIs. Respect the CEO's decision and notes." }],
      ],
      question: "How should Altora deploy ₹25 Cr to reverse rising IT cost, project delays and recurring incidents?",
      data: `IT COST: Total IT ₹410 Cr (+19% YoY). Cloud ₹96 Cr (+48%), avg CPU util 21%, commitment coverage 22%. Licences ₹88 Cr (31 overlapping SaaS tools). Outsourcing ₹120 Cr across 7 vendors.
PROJECTS (9 strategic): 5 delayed. Avg schedule variance -21%. ERP upgrade -35% & +40% budget. 3 projects share the same 4 architects. Scope churn avg 23%.
INCIDENTS (90d): 58 P1/P2. Customer platform 24 of them. 60% within 2h of deployment. MTTR P1 128 min. Revenue impact est. ₹14 Cr.
OPTIONS:
1) Cloud FinOps + vendor consolidation (₹6 Cr, saves ₹38 Cr/yr, 6 months)
2) Platform engineering + CI/CD & SRE (₹9 Cr, incidents -50%, lead time -40%, 9 months)
3) PMO reset + portfolio cut (stop 2 projects) (₹2 Cr, frees ₹30 Cr budget, 3 months)
4) AIOps + AI-assisted ITSM (₹8 Cr, MTTR -45%, 6 months)`,
    },
    implement: [
      { phase: "Week 1", weeks: "Frame", actions: ["Decision statement & KPIs agreed with CEO", "Data owners named for 4 domains"] },
      { phase: "Weeks 2–3", weeks: "Analyse", actions: ["Dashboards + agent analysis", "Weighted matrix workshop with CXOs"] },
      { phase: "Week 4", weeks: "Decide", actions: ["Human approval + audit record", "Board presentation"] },
      { phase: "Day 30–120", weeks: "Execute & learn", actions: ["Scorecard monthly", "Decision review at day 120"] },
    ],
    tools: ["Everything from Days 1–3", "LangGraph + Groq", "Power BI", "Decision register"],
    discuss: ["Which option did your team pick and why?", "What would change your mind?", "What will you implement on Monday?"],
  },
];
