import type { UseCase } from "../types";

export const day1: UseCase[] = [
  {
    id: "decision-lifecycle",
    num: 1,
    day: 1,
    minutes: 45,
    module: 1,
    subtopics: ["1.1", "1.2", "1.3", "1.4", "1.5"],
    title: "Decision Lifecycle Studio",
    tagline: "Take one real decision from gut feel to an AI-augmented, measurable decision.",
    industry: "Fintech · Payments",
    company: "Pyxora Payments",
    theme: "violet",
    icon: "Compass",
    scenario:
      "Pyxora's checkout platform missed 3 of its last 5 release dates. The VP Engineering wants 2 more squads (₹4.2 Cr/yr). The CFO asks: is headcount really the problem? You have 10 days to decide.",
    definition:
      "Decision Intelligence (DI) is the discipline of engineering decisions: it joins data, analytics, AI and human judgement into a repeatable loop — frame → generate options → evaluate → decide → execute → measure → learn. Gartner calls it the practice of 'explicitly understanding and engineering how decisions are made and how outcomes are evaluated, managed and improved by feedback.'",
    why: [
      "Most technology decisions are still made in meetings, on slides, from memory — and nobody checks the outcome 6 months later.",
      "Decision volume has exploded (cloud, vendors, AI, security) while leadership attention has not.",
      "Intuition is fast but biased (anchoring, sunk cost, HiPPO). Pure data is slow and misses context. AI-augmented decisions combine both.",
      "Without a lifecycle, organisations cannot learn which decisions worked — so they repeat expensive mistakes.",
    ],
    what: [
      "Intuition-driven vs data-driven vs AI-augmented: the three decision modes and when each is right.",
      "The DI ecosystem: data · analytics · AI · human expertise · business context · feedback loops.",
      "The 6-step decision lifecycle and the artefact produced at each step (decision brief, option set, evaluation, memo, KPI, review).",
      "The modern technology leader: from running operations to running a decision system.",
    ],
    howAI: [
      { step: "Frame", detail: "LLM rewrites a vague ask ('we need more people') into a crisp decision statement with success criteria.", ai: "GenAI" },
      { step: "Generate options", detail: "Agent proposes 4–6 alternatives humans usually miss (e.g. fix review bottleneck, contract, de-scope).", ai: "Agent" },
      { step: "Evaluate", detail: "Analytics scores options on cost, risk, time-to-impact using delivery data.", ai: "Analytics" },
      { step: "Decide", detail: "The leader owns the call; AI drafts the decision memo and dissent.", ai: "Human" },
      { step: "Measure & learn", detail: "KPIs tracked automatically; the outcome is fed back to calibrate future decisions.", ai: "ML" },
    ],
    metrics: [
      { label: "Decision cycle time", before: 21, after: 7, unit: "days", better: "lower" },
      { label: "Options considered", before: 2, after: 5, unit: "options", better: "higher" },
      { label: "Decisions with tracked outcome", before: 10, after: 80, unit: "%", better: "higher" },
    ],
    timeSavings: [
      { task: "Assemble decision brief & data", before: 16, after: 3, cadence: "per major decision" },
      { task: "Draft options & memo", before: 8, after: 1.5, cadence: "per major decision" },
      { task: "Post-decision review", before: 6, after: 1, cadence: "per decision" },
    ],
    valueStatement:
      "A leadership team making ~40 significant tech decisions a year reclaims ~1,000 hours and, more importantly, starts learning from outcomes.",
    lab: "maturity",
    labIntro:
      "Rate your organisation on six DI capabilities, see your maturity radar, then walk the Pyxora decision through the lifecycle.",
    agent: {
      title: "Decision Lifecycle Agent",
      pattern: "Sequential pipeline (one node per lifecycle step)",
      stages: [
        [{ id: "framer", label: "Decision Framer", emoji: "🎯", role: "Turns the ask into a crisp decision statement", prompt: "You are a decision framing coach. Rewrite the request as a single precise decision statement, list the decision owner, deadline, 3 success criteria (measurable) and 3 key unknowns." }],
        [{ id: "options", label: "Options Generator", emoji: "🧭", role: "Generates non-obvious alternatives", prompt: "You generate decision alternatives. Propose 5 distinct options including at least 2 non-obvious ones (not just yes/no). For each: one-line description, rough cost, time-to-impact." }],
        [{ id: "evaluator", label: "Evidence Evaluator", emoji: "⚖️", role: "Scores options against the data", prompt: "You are an evidence-based evaluator. Using ONLY the data given, score each option 1-5 on impact, cost, risk and speed in a markdown table. Point out which data is missing and how it lowers confidence." }],
        [{ id: "memo", label: "Decision Memo Writer", emoji: "📝", role: "Writes the executive decision memo + KPIs", prompt: "You write a one-page executive decision memo: Recommendation, Why (3 bullets with numbers), Risks & mitigations, Dissenting view, KPIs to track at 30/60/90 days, and the date to review the outcome." }],
      ],
      question: "Should Pyxora add 2 engineering squads (₹4.2 Cr/yr) to recover checkout release predictability?",
      data: `Checkout platform — last 6 sprints
- Planned vs delivered story points: 120/84, 118/80, 125/91, 122/79, 119/88, 121/83
- Engineers: 34 (5 squads). Utilisation 92%.
- Cycle time breakdown (avg 11.4 days): coding 2.6d, waiting for review 4.1d, QA queue 2.9d, deploy 1.8d
- 38% of PRs wait > 3 days for review; only 6 senior reviewers
- Unplanned work (incidents, escalations): 27% of capacity
- Release dates missed: 3 of last 5
- Attrition last 12 months: 14%`,
    },
    implement: [
      { phase: "Pick", weeks: "Week 1", actions: ["Choose 3 recurring, high-value decisions (e.g. hiring, vendor, release go/no-go)", "Name a decision owner for each"] },
      { phase: "Instrument", weeks: "Weeks 2–4", actions: ["Create a 1-page decision brief template", "Log every decision in a decision register (owner, options, data used, expected outcome)"] },
      { phase: "Augment", weeks: "Weeks 4–8", actions: ["Add the LangGraph lifecycle agent to draft briefs and memos", "Hold human review on every recommendation"] },
      { phase: "Learn", weeks: "Quarterly", actions: ["Review outcomes vs expected", "Update templates, data sources and prompts"] },
    ],
    tools: ["Groq LLM", "LangGraph", "Confluence/Notion decision register", "Power BI"],
    discuss: [
      "Which of your last 5 big decisions had a measured outcome?",
      "Where does intuition still beat data in your org — and why?",
      "Who owns the decision when AI drafted the recommendation?",
    ],
  },
  {
    id: "engineering-capacity",
    num: 2,
    day: 1,
    minutes: 20,
    module: 2,
    subtopics: ["2.1", "2.2", "2.4"],
    title: "Engineering Capacity: Hire or Unblock?",
    tagline: "Use delivery KPIs (DORA, flow, utilisation) to decide whether more engineers will actually help.",
    industry: "SaaS · B2B Software",
    company: "Cloudvane SaaS",
    theme: "pink",
    icon: "Users",
    scenario:
      "Five product teams, 62 engineers. Roadmap is slipping. Three directors each ask for +4 engineers. Your budget allows +6 at most. Where do they go — or is the money better spent elsewhere?",
    definition:
      "Technology performance intelligence turns engineering telemetry (Git, CI/CD, Jira, incidents) into decision-grade KPIs: deployment frequency, lead time, change failure rate, MTTR (the DORA four), plus flow efficiency, WIP and utilisation.",
    why: [
      "Headcount is the most expensive and least reversible engineering decision.",
      "Brooks's law: adding people to a late, bottlenecked system often makes it later.",
      "Flow efficiency in most teams is 15–25% — work spends most of its life waiting, not being built.",
      "KPIs make the conversation objective across competing directors.",
    ],
    what: [
      "Structured data (Jira, Git, CI), unstructured (retros, incident notes), operational (uptime, MTTR) and business data (revenue per feature).",
      "Core KPIs: velocity, cycle time, flow efficiency, DORA four, SLA, uptime, cost per team, ROI.",
      "Performance dashboards: trend, distribution and bottleneck views — not vanity counts.",
    ],
    howAI: [
      { step: "Collect", detail: "Pull Git/Jira/CI data into one model of the delivery flow.", ai: "Analytics" },
      { step: "Diagnose", detail: "ML clusters where time is lost (review, QA, environments, dependencies).", ai: "ML" },
      { step: "Simulate", detail: "What-if: +N engineers vs removing a bottleneck — projected throughput.", ai: "Analytics" },
      { step: "Recommend", detail: "Agent writes an allocation recommendation per team with evidence.", ai: "Agent" },
      { step: "Decide", detail: "CTO approves; KPIs re-checked in 60 days.", ai: "Human" },
    ],
    metrics: [
      { label: "Lead time for change", before: 14, after: 6, unit: "days", better: "lower" },
      { label: "Flow efficiency", before: 22, after: 41, unit: "%", better: "higher" },
      { label: "Hiring spend avoided", before: 0, after: 2.4, unit: "₹ Cr", better: "higher" },
    ],
    timeSavings: [
      { task: "Build monthly engineering KPI pack", before: 12, after: 1, cadence: "per month" },
      { task: "Investigate why a team is slow", before: 10, after: 2, cadence: "per investigation" },
      { task: "Prepare headcount business case", before: 8, after: 2, cadence: "per request" },
    ],
    valueStatement: "Fixing one review bottleneck typically yields the throughput of 3–4 new hires at near-zero cost.",
    lab: "kpi",
    labIntro: "Explore Cloudvane's team KPIs. Use the simulator to compare 'hire N engineers' with 'fix the bottleneck'.",
    agent: {
      title: "Capacity Intelligence Agent",
      pattern: "Sequential pipeline",
      stages: [
        [{ id: "metrics", label: "KPI Analyst", emoji: "📊", role: "Reads DORA & flow KPIs per team", prompt: "You are an engineering metrics analyst. For each team, summarise health using DORA metrics, flow efficiency and utilisation. Flag the top 3 anomalies with numbers." }],
        [{ id: "bottleneck", label: "Bottleneck Diagnoser", emoji: "🔍", role: "Finds where work waits", prompt: "You diagnose delivery bottlenecks. For each team say whether the constraint is capacity (people) or flow (waiting, review, QA, environments, dependencies). Justify with data." }],
        [{ id: "allocator", label: "Allocation Advisor", emoji: "🧮", role: "Recommends where +6 heads (or fixes) go", prompt: "You are a CTO advisor. Given a budget of at most 6 new engineers, recommend allocation per team OR non-hiring fixes. Give a table: team, action, expected impact on lead time, cost. End with a 3-line executive summary." }],
      ],
      question: "Where should the +6 engineer budget go, if anywhere?",
      data: `Team | Engineers | Lead time (d) | Deploys/wk | Change fail % | MTTR (h) | Flow eff % | Utilisation % | Review wait (d)
Payments | 14 | 16 | 2 | 18 | 9 | 14 | 96 | 5.2
Search | 11 | 6 | 9 | 7 | 2 | 38 | 81 | 0.8
Mobile | 13 | 12 | 3 | 12 | 5 | 21 | 90 | 3.1
Platform | 12 | 9 | 6 | 9 | 3 | 30 | 98 | 1.2
Data | 12 | 18 | 1 | 22 | 11 | 12 | 74 | 2.0
Notes: Data team blocked on Platform for environments 40% of sprint. Platform runs on-call for all teams.`,
    },
    implement: [
      { phase: "Connect", weeks: "Weeks 1–2", actions: ["Export Jira + Git + CI data (or use DX/LinearB/Jellyfish)", "Agree KPI definitions with directors"] },
      { phase: "Baseline", weeks: "Weeks 3–4", actions: ["Publish DORA + flow dashboard per team", "Identify top bottleneck per team"] },
      { phase: "Decide", weeks: "Week 5", actions: ["Run the capacity agent before every headcount request", "Require 'bottleneck fix first' evidence"] },
      { phase: "Track", weeks: "60/90 days", actions: ["Compare predicted vs actual lead time", "Feed back into allocation model"] },
    ],
    tools: ["Jira / Azure DevOps", "GitHub/GitLab APIs", "Power BI", "LangGraph + Groq"],
    discuss: ["Which KPI would your directors game first?", "When IS headcount the right answer?", "Who should see team-level KPIs?"],
  },
  {
    id: "incident-rca",
    num: 3,
    day: 1,
    minutes: 15,
    module: 2,
    subtopics: ["2.3 (Diagnostic)", "5.3"],
    title: "Recurring Incident Root-Cause Intelligence",
    tagline: "Mine 90 days of incidents to find the 20% of causes behind 80% of downtime.",
    industry: "E-commerce · Retail",
    company: "Kestrel Retail",
    theme: "orange",
    icon: "Siren",
    scenario:
      "Kestrel had 41 P1/P2 incidents last quarter during the festive sale. Every post-mortem was 'closed'. Yet the same services keep failing. The board asks: what will you change before the next sale?",
    definition:
      "Diagnostic analytics answers 'why did it happen?'. Applied to incidents, it combines structured fields (service, severity, MTTR) with unstructured post-mortem text, using AI to cluster incidents into root-cause themes and rank them by business impact.",
    why: [
      "Individual post-mortems fix symptoms; patterns across incidents reveal systemic causes.",
      "Engineers spend 20–30% of time on unplanned work driven by repeat incidents.",
      "Every minute of checkout downtime during a sale is directly lost revenue.",
    ],
    what: [
      "Pareto analysis of incident causes and services.",
      "NLP clustering of post-mortem text into themes (config change, capacity, dependency, data).",
      "Impact weighting: downtime × revenue per minute.",
      "Problem management: turn clusters into funded problem tickets.",
    ],
    howAI: [
      { step: "Ingest", detail: "Pull incidents + post-mortems from ServiceNow/Jira/PagerDuty.", ai: "Analytics" },
      { step: "Classify", detail: "LLM tags each incident with a root-cause category and contributing factor.", ai: "GenAI" },
      { step: "Cluster", detail: "Pattern mining finds repeat combinations (e.g. Friday deploy + config change + payments).", ai: "ML" },
      { step: "Prioritise", detail: "Agent ranks problems by revenue impact and fix effort.", ai: "Agent" },
      { step: "Approve", detail: "Problem board funds the top 3 fixes.", ai: "Human" },
    ],
    metrics: [
      { label: "Repeat incidents / quarter", before: 26, after: 9, unit: "incidents", better: "lower" },
      { label: "MTTR (P1)", before: 142, after: 58, unit: "min", better: "lower" },
      { label: "Unplanned work", before: 28, after: 14, unit: "% capacity", better: "lower" },
    ],
    timeSavings: [
      { task: "Quarterly incident trend review", before: 24, after: 2, cadence: "per quarter" },
      { task: "Write post-mortem summary", before: 3, after: 0.5, cadence: "per incident" },
      { task: "Triage & categorise incident", before: 0.75, after: 0.1, cadence: "per incident" },
    ],
    valueStatement: "At ₹18 lakh/hour of sale-time revenue, cutting 30 hours of repeat downtime protects ~₹5.4 Cr per season.",
    lab: "incidents",
    labIntro: "Filter Kestrel's 90-day incident log. The Pareto chart shows which causes dominate. Export to the agent for an RCA.",
    agent: {
      title: "Incident Pattern Agent",
      pattern: "Fan-out / fan-in (parallel analysts → synthesiser)",
      stages: [
        [
          { id: "classifier", label: "Root-Cause Classifier", emoji: "🏷️", role: "Tags incidents into cause themes", prompt: "You are an SRE analyst. Group the incidents into root-cause themes. Give a table: theme, count, total downtime minutes, example incident IDs." },
          { id: "impact", label: "Business Impact Analyst", emoji: "💸", role: "Quantifies revenue & customer impact", prompt: "You quantify business impact of incidents. Estimate revenue lost per service using the revenue-per-minute figure given. Rank services by impact." },
        ],
        [{ id: "rca", label: "Problem Manager", emoji: "🛠️", role: "Recommends top 3 systemic fixes", prompt: "You are a problem manager. Combine the analyses into the top 3 systemic problems, each with: root cause, evidence, fix, owner role, effort (S/M/L), expected reduction in incidents. End with what to do before the next sale." }],
      ],
      question: "What are the top 3 systemic fixes Kestrel must fund before the next sale?",
      data: "(Use the lab's 'Send to agent' button to load the incident log, or keep this summary.)\nRevenue per minute during sale: ₹30,000\nTop services: checkout, payments-gateway, inventory, search\n41 P1/P2 incidents in 90 days; 63% occurred within 2 hours of a deployment; 9 linked to config changes without review; 7 to DB connection pool exhaustion on payments; 6 to third-party payment provider timeouts.",
    },
    implement: [
      { phase: "Export", weeks: "Week 1", actions: ["Export 6–12 months of incidents + post-mortems", "Standardise severity and service fields"] },
      { phase: "Classify", weeks: "Weeks 2–3", actions: ["LLM-tag root causes; have SREs review a 10% sample", "Build Pareto + impact dashboard"] },
      { phase: "Fund", weeks: "Week 4", actions: ["Monthly problem board funds top 3 clusters", "Track repeat-incident rate"] },
    ],
    tools: ["ServiceNow / PagerDuty", "Splunk / Datadog", "Groq LLM", "LangGraph"],
    discuss: ["Do your post-mortems ever get read again?", "Who owns cross-team problems?", "What's your revenue per minute of downtime?"],
  },
  {
    id: "delivery-delay",
    num: 4,
    day: 1,
    minutes: 15,
    module: 2,
    subtopics: ["2.3 (Predictive)", "2.5"],
    title: "Delivery Delay Predictor",
    tagline: "Predict which programmes will miss their date — and know how much to trust the prediction.",
    industry: "Telecom · Programme Office",
    company: "Ondra Telecom",
    theme: "emerald",
    icon: "CalendarClock",
    scenario:
      "Ondra's PMO runs 8 major programmes (5G core, BSS migration, etc.). All report 'green' until they turn red a month before go-live. Can historical data warn you 8 weeks earlier?",
    definition:
      "Predictive analytics uses historical patterns to estimate the probability of a future event. A delay-risk model scores each project from leading indicators (scope churn, velocity variance, dependency count, team churn). Decision confidence depends on data quality: accuracy, completeness, bias and lineage.",
    why: [
      "Status reports are lagging and optimistic ('watermelon projects': green outside, red inside).",
      "Leading indicators show risk 6–10 weeks before milestones slip.",
      "A prediction is only as good as its data — leaders must ask 'how confident?' not just 'what's the score?'.",
    ],
    what: [
      "Four levels of analytics: Descriptive (what happened) → Diagnostic (why) → Predictive (what will) → Prescriptive (what to do).",
      "Risk scoring from leading indicators; logistic-style probability.",
      "Data quality dimensions and a confidence band on every prediction.",
    ],
    howAI: [
      { step: "Descriptive", detail: "Dashboard of schedule variance and burn-up.", ai: "Analytics" },
      { step: "Diagnostic", detail: "Which indicators historically preceded slips?", ai: "Analytics" },
      { step: "Predictive", detail: "ML model gives P(delay) per project with confidence.", ai: "ML" },
      { step: "Prescriptive", detail: "Agent recommends interventions for high-risk projects.", ai: "Agent" },
      { step: "Escalate", detail: "PMO reviews before steering committee.", ai: "Human" },
    ],
    metrics: [
      { label: "Early warning lead time", before: 2, after: 8, unit: "weeks", better: "higher" },
      { label: "Projects delivered on time", before: 48, after: 71, unit: "%", better: "higher" },
      { label: "Status-report prep", before: 6, after: 1, unit: "h/week/PM", better: "lower" },
    ],
    timeSavings: [
      { task: "Weekly programme status consolidation", before: 10, after: 1, cadence: "per week" },
      { task: "Steering committee pack", before: 8, after: 1.5, cadence: "per month" },
    ],
    valueStatement: "One avoided 3-month slip on a ₹40 Cr programme saves roughly ₹6–8 Cr in run-over cost and deferred benefit.",
    lab: "delay",
    labIntro: "Tune the model weights and the data-quality sliders. Watch both risk and confidence change.",
    agent: {
      title: "Delivery Risk Agent",
      pattern: "Sequential pipeline with data-quality gate",
      stages: [
        [{ id: "quality", label: "Data Quality Auditor", emoji: "🧪", role: "Rates completeness, bias & lineage", prompt: "You audit data quality. For the data given, rate accuracy, completeness, timeliness, bias and lineage (High/Med/Low) and state the overall confidence we can place in any prediction." }],
        [{ id: "predictor", label: "Risk Predictor", emoji: "🔮", role: "Explains which projects will slip", prompt: "You are a delivery risk analyst. Rank projects by probability of delay, explaining the leading indicators driving each score." }],
        [{ id: "prescriber", label: "Intervention Planner", emoji: "💊", role: "Prescribes actions for top risks", prompt: "You are a PMO director. For the top 3 at-risk projects prescribe concrete interventions (scope, people, dependencies, governance) with expected effect. Write a 4-line steering committee note." }],
      ],
      question: "Which programmes will miss go-live and what should the steering committee do this month?",
      data: `Project | Scope change % | Velocity variance % | Open dependencies | Team churn % | Test coverage % | Reported status
5G Core | 32 | 41 | 9 | 18 | 54 | Green
BSS Migration | 18 | 22 | 12 | 9 | 61 | Amber
Digital Onboarding | 6 | 9 | 2 | 4 | 82 | Green
Fibre Rollout App | 24 | 35 | 5 | 22 | 47 | Green
Billing Re-platform | 41 | 28 | 7 | 15 | 50 | Amber
Data Lake | 12 | 14 | 3 | 6 | 70 | Green
Note: dependency data is manually entered monthly (last updated 5 weeks ago). Team churn for 2 projects missing.`,
    },
    implement: [
      { phase: "History", weeks: "Weeks 1–3", actions: ["Collect 2–3 years of completed projects + outcomes", "Define 'late' consistently"] },
      { phase: "Model", weeks: "Weeks 4–6", actions: ["Start with a transparent weighted/logistic model", "Validate on past projects"] },
      { phase: "Operate", weeks: "Week 7+", actions: ["Weekly scoring + agent narrative to PMO", "Show confidence next to every score"] },
    ],
    tools: ["Jira / MS Project", "Python scikit-learn", "Power BI", "LangGraph"],
    discuss: ["What would you do differently with 8 weeks warning?", "Which of your data would fail a quality audit?", "Should a model ever override a PM's status?"],
  },
  {
    id: "build-buy-partner",
    num: 5,
    day: 1,
    minutes: 20,
    module: 3,
    subtopics: ["3.1", "3.2"],
    title: "Build vs Buy vs Partner: Enterprise AI Platform",
    tagline: "A transparent weighted scoring matrix for the decision every CIO is facing right now.",
    industry: "Insurance",
    company: "Corvane Insurance",
    theme: "sky",
    icon: "Scale",
    scenario:
      "Corvane wants GenAI for claims, underwriting and customer service. Options: build an internal AI platform, buy a SaaS AI suite, or partner with a systems integrator on a co-built platform. The board meets in 3 weeks.",
    definition:
      "A weighted scoring model (decision matrix) evaluates alternatives against explicit criteria, each with a weight reflecting strategic importance. It turns a political debate into a transparent, auditable trade-off — and sensitivity testing shows how robust the winner is.",
    why: [
      "Build/buy debates are often won by the loudest voice or the best vendor demo.",
      "Explicit weights force leaders to agree on what matters before looking at options.",
      "Sensitivity analysis reveals whether the decision flips with small weight changes.",
    ],
    what: [
      "Build vs Buy vs Partner criteria: strategic differentiation, time-to-value, TCO, control, talent, vendor lock-in, compliance.",
      "Weighted scoring, decision matrices and technology assessment.",
      "Robustness: what weight change flips the winner?",
    ],
    howAI: [
      { step: "Criteria", detail: "LLM proposes criteria and definitions from strategy documents.", ai: "GenAI" },
      { step: "Evidence", detail: "Agents research each option's cost, capability and risk.", ai: "Agent" },
      { step: "Score", detail: "Transparent matrix; weights agreed by humans.", ai: "Analytics" },
      { step: "Challenge", detail: "Red-team agent argues against the leading option.", ai: "Agent" },
      { step: "Decide", detail: "Executive committee signs off with recorded rationale.", ai: "Human" },
    ],
    metrics: [
      { label: "Evaluation duration", before: 12, after: 4, unit: "weeks", better: "lower" },
      { label: "Criteria agreed upfront", before: 0, after: 100, unit: "%", better: "higher" },
      { label: "Consultant spend on evaluation", before: 60, after: 15, unit: "₹ L", better: "lower" },
    ],
    timeSavings: [
      { task: "Vendor/option research", before: 40, after: 8, cadence: "per evaluation" },
      { task: "Board paper drafting", before: 16, after: 3, cadence: "per evaluation" },
    ],
    valueStatement: "A wrong platform choice locks in 3–5 years of cost; a robust, documented decision de-risks a ₹20–50 Cr commitment.",
    lab: "matrix",
    labIntro: "Adjust criteria weights and option scores. Watch the winner — and the robustness check — update live.",
    agent: {
      title: "Sourcing Strategy Agent",
      pattern: "Fan-out (3 advocates) → red team → chair",
      stages: [
        [
          { id: "build", label: "Build Advocate", emoji: "🏗️", role: "Best case for building", prompt: "Make the strongest evidence-based case for BUILDING the platform in-house. Include cost, time, talent and risk realities. Max 150 words." },
          { id: "buy", label: "Buy Advocate", emoji: "🛒", role: "Best case for buying", prompt: "Make the strongest evidence-based case for BUYING a SaaS AI suite. Include lock-in, cost and compliance realities. Max 150 words." },
          { id: "partner", label: "Partner Advocate", emoji: "🤝", role: "Best case for partnering", prompt: "Make the strongest evidence-based case for PARTNERING with a systems integrator. Include IP, dependency and cost realities. Max 150 words." },
        ],
        [{ id: "redteam", label: "Red Team", emoji: "🛡️", role: "Attacks each case's weakest assumption", prompt: "You are a red team. Identify the single weakest assumption in each of the three cases and how it could fail." }],
        [{ id: "chair", label: "Committee Chair", emoji: "👔", role: "Recommends with a weighted matrix", prompt: "You chair the investment committee. Produce a weighted decision matrix (criteria, weight, scores for Build/Buy/Partner), the recommendation, conditions for success, and what would make you change your mind." }],
      ],
      question: "Should Corvane build, buy, or partner for its enterprise AI platform?",
      data: `Corvane context:
- 1,800 IT staff; 6 ML engineers; no LLMOps experience
- Use cases: claims triage (12k claims/month), underwriting summaries, customer service
- Regulatory: IRDAI data residency; PII heavy
- Budget envelope: ₹35 Cr over 3 years
- Build estimate: ₹28 Cr / 3 yrs, 14 months to first use case
- Buy (SaaS suite): ₹22 Cr / 3 yrs, 3 months to first use case, data leaves region unless premium tier (+₹6 Cr)
- Partner (SI co-build): ₹30 Cr / 3 yrs, 6 months, shared IP, knowledge transfer clause
- Strategy says AI is a differentiator in underwriting, NOT in customer service`,
    },
    implement: [
      { phase: "Align", weeks: "Week 1", actions: ["Agree criteria & weights with CXOs BEFORE seeing vendors", "Define must-have gates (e.g. data residency)"] },
      { phase: "Evidence", weeks: "Weeks 2–3", actions: ["Agents gather evidence; humans verify", "Score independently, then reconcile"] },
      { phase: "Decide", weeks: "Week 4", actions: ["Run sensitivity & red team", "Record decision + conditions to revisit"] },
    ],
    tools: ["Excel / Power BI", "Groq LLM", "LangGraph multi-agent"],
    discuss: ["Is it ever one option — or a hybrid per use case?", "Who set the weights last time?", "What's your exit cost from a SaaS AI vendor?"],
  },
];
