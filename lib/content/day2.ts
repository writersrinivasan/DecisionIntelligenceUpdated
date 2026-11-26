import type { UseCase } from "../types";

export const day2: UseCase[] = [
  {
    id: "cloud-migration-roi",
    num: 6,
    day: 2,
    minutes: 25,
    module: 3,
    subtopics: ["3.3", "3.4", "3.6"],
    title: "Legacy-to-AWS Migration Business Case",
    tagline: "TCO, ROI, NPV, payback and scenarios — the numbers your CFO will actually ask for.",
    industry: "Banking",
    company: "Halvorn Bank",
    theme: "amber",
    icon: "CloudUpload",
    scenario:
      "Halvorn runs its core lending platform on ageing on-prem hardware due for a ₹14 Cr refresh. The cloud team proposes migrating to AWS (re-platform + microservices for 3 domains). The CFO wants NPV, payback and a worst case.",
    definition:
      "Cost-benefit analysis compares the full Total Cost of Ownership (TCO) of alternatives over a horizon and converts future cash flows to today's value (NPV) using a discount rate. Scenario analysis (best/expected/worst) and sensitivity analysis show which assumptions the decision depends on most.",
    why: [
      "Cloud business cases often compare cloud run-cost to on-prem hardware only — ignoring people, licences, dual-running and egress.",
      "NPV and payback speak the CFO's language; 'agility' alone does not get funded.",
      "Sensitivity analysis tells you which single assumption to validate before committing.",
    ],
    what: [
      "TCO, ROI = (benefit − cost)/cost, NPV, payback period and opportunity cost.",
      "Architecture choices: monolith vs microservices, cloud vs on-prem, multi-cloud vs hybrid.",
      "Best / worst / expected scenarios and a tornado chart for sensitivity.",
    ],
    howAI: [
      { step: "Discover", detail: "AI parses CMDB and invoices to build the as-is TCO.", ai: "GenAI" },
      { step: "Model", detail: "Financial model computes NPV, ROI, payback per scenario.", ai: "Analytics" },
      { step: "Stress-test", detail: "Sensitivity analysis ranks assumptions by impact.", ai: "Analytics" },
      { step: "Critique", detail: "Agent acts as a sceptical CFO and finds gaps.", ai: "Agent" },
      { step: "Approve", detail: "Investment committee decides with explicit risk appetite.", ai: "Human" },
    ],
    metrics: [
      { label: "Business case build time", before: 8, after: 2, unit: "weeks", better: "lower" },
      { label: "Cost assumptions documented", before: 40, after: 95, unit: "%", better: "higher" },
      { label: "Forecast vs actual variance (yr1)", before: 35, after: 12, unit: "%", better: "lower" },
    ],
    timeSavings: [
      { task: "Build TCO model from invoices/CMDB", before: 60, after: 10, cadence: "per business case" },
      { task: "Scenario & sensitivity runs", before: 16, after: 0.5, cadence: "per business case" },
    ],
    valueStatement: "Testing the 3 most sensitive assumptions first prevents the classic 30–40% cloud cost overrun in year one.",
    lab: "roi",
    labIntro: "Edit the assumptions. NPV, ROI, payback, cash-flow curve, scenarios and the sensitivity tornado recalculate live.",
    agent: {
      title: "Business Case Agent",
      pattern: "Sequential with critic loop",
      stages: [
        [{ id: "architect", label: "Cloud Architect", emoji: "☁️", role: "Recommends target architecture", prompt: "You are a principal cloud architect. Recommend a migration strategy per component (rehost/replatform/refactor/retain) and target architecture (monolith vs microservices, single vs hybrid cloud). Be pragmatic." }],
        [{ id: "finance", label: "Finance Analyst", emoji: "💰", role: "Explains TCO, NPV, payback", prompt: "You are a finance analyst. Using the numbers given, explain TCO comparison, NPV, ROI and payback in plain English, and list hidden costs that are often missed." }],
        [{ id: "cfo", label: "Sceptical CFO", emoji: "🧐", role: "Challenges & decides", prompt: "You are a sceptical CFO. Challenge the 3 weakest assumptions, state the worst case, and give a go / no-go / go-with-conditions decision with conditions." }],
      ],
      question: "Should Halvorn migrate its lending platform to AWS instead of the ₹14 Cr hardware refresh?",
      data: `As-is on-prem (annual): hardware amortisation ₹4.6 Cr, DC/power ₹1.2 Cr, licences ₹3.1 Cr, ops staff ₹2.4 Cr
Hardware refresh due: ₹14 Cr (one-time)
Migration one-time: ₹9.5 Cr (incl. 9 months dual-running)
AWS run cost (annual, expected): ₹6.8 Cr incl. reserved instances; ops staff falls to ₹1.6 Cr
Benefits: release frequency 1/month → 1/week; new loan product time-to-market 9 → 3 months (est. ₹3 Cr/yr revenue)
Discount rate 11%, horizon 5 years
Risks: RBI outsourcing guidelines; 40 legacy integrations; COBOL batch jobs`,
    },
    implement: [
      { phase: "As-is", weeks: "Weeks 1–2", actions: ["Full TCO incl. people, licences, DC", "Tag workloads by 6R strategy"] },
      { phase: "Model", weeks: "Weeks 3–4", actions: ["NPV/ROI with 3 scenarios", "Tornado on top 6 assumptions"] },
      { phase: "Validate", weeks: "Weeks 5–6", actions: ["Pilot one workload to validate most sensitive assumption", "Re-run model; decide"] },
    ],
    tools: ["AWS Migration Evaluator", "Excel / Python", "Groq LLM", "LangGraph"],
    discuss: ["Which assumption in your last cloud case was most wrong?", "Who owns the benefit — IT or the business?", "Is 'avoid hardware refresh' a benefit or a cost avoided?"],
  },
  {
    id: "portfolio-prioritisation",
    num: 7,
    day: 2,
    minutes: 10,
    module: 3,
    subtopics: ["3.5"],
    title: "Constrained-Budget Portfolio Prioritisation",
    tagline: "RICE, WSJF, MoSCoW and Impact–Effort — fund the right 6 of 12 initiatives.",
    industry: "Healthcare",
    company: "Brightpath Health",
    theme: "rose",
    icon: "ListOrdered",
    scenario:
      "Brightpath's IT budget was cut 25%. Twelve initiatives, ₹18 Cr requested, ₹11 Cr available. Every sponsor says theirs is critical. You need a defensible ranking by Friday.",
    definition:
      "Prioritisation frameworks rank work by value relative to cost or size. RICE = Reach × Impact × Confidence ÷ Effort. WSJF (Weighted Shortest Job First, SAFe) = Cost of Delay ÷ Job Size, where Cost of Delay = business value + time criticality + risk reduction. MoSCoW tags Must/Should/Could/Won't.",
    why: [
      "Without a shared model, budgets go to the most senior sponsor, not the most valuable work.",
      "WSJF surfaces small, urgent items that big programmes crowd out.",
      "A budget cut-line makes trade-offs visible and explainable.",
    ],
    what: ["RICE and WSJF scoring", "MoSCoW for regulatory/must-do items", "Impact–Effort quadrants: Quick wins, Big bets, Fill-ins, Money pits", "Budget cut-line"],
    howAI: [
      { step: "Normalise", detail: "LLM converts sponsor business cases into consistent scoring inputs.", ai: "GenAI" },
      { step: "Score", detail: "RICE/WSJF computed automatically.", ai: "Analytics" },
      { step: "Optimise", detail: "Agent fits the best value set under budget.", ai: "Agent" },
      { step: "Negotiate", detail: "Leaders adjust for strategy and dependencies.", ai: "Human" },
    ],
    metrics: [
      { label: "Portfolio planning cycle", before: 6, after: 2, unit: "weeks", better: "lower" },
      { label: "Value delivered per ₹ Cr", before: 1, after: 1.4, unit: "x", better: "higher" },
      { label: "Escalations to CEO", before: 9, after: 2, unit: "per cycle", better: "lower" },
    ],
    timeSavings: [{ task: "Annual/quarterly prioritisation workshops", before: 40, after: 10, cadence: "per cycle" }],
    valueStatement: "Funding by WSJF instead of sponsor seniority typically lifts delivered value 30–40% from the same budget.",
    lab: "prioritize",
    labIntro: "Switch between RICE and WSJF, move the budget slider and watch the cut-line and quadrant chart change.",
    agent: {
      title: "Portfolio Allocation Agent",
      pattern: "Sequential pipeline",
      stages: [
        [{ id: "scorer", label: "Portfolio Scorer", emoji: "🧮", role: "Ranks initiatives by RICE & WSJF", prompt: "Rank the initiatives using both RICE and WSJF from the data. Show a ranked table and note where the two methods disagree and why." }],
        [{ id: "optimiser", label: "Budget Optimiser", emoji: "📦", role: "Fits the best set under budget", prompt: "Select the set of initiatives that maximises value within the budget, respecting Must-have (regulatory) items. Show funded vs deferred and total cost." }],
        [{ id: "comms", label: "Sponsor Communicator", emoji: "📣", role: "Explains the decision to sponsors", prompt: "Write short, respectful messages to sponsors of 2 deferred initiatives explaining why, and what would bring them back into scope." }],
      ],
      question: "Which initiatives should Brightpath fund with ₹11 Cr?",
      data: "(Use 'Send to agent' in the lab to load the live portfolio table.)",
    },
    implement: [
      { phase: "Model", weeks: "Week 1", actions: ["Pick RICE (product) or WSJF (portfolio)", "Define scales with examples"] },
      { phase: "Score", weeks: "Week 2", actions: ["Sponsors submit inputs; AI normalises", "Publish ranking + cut-line"] },
      { phase: "Review", weeks: "Quarterly", actions: ["Re-score with actual outcomes", "Kill or continue at each gate"] },
    ],
    tools: ["Jira Align / ServiceNow SPM", "Excel", "LangGraph"],
    discuss: ["Which framework fits your culture?", "How do you handle 'regulatory = must' inflation?", "Who can override the ranking?"],
  },
  {
    id: "ai-investment-committee",
    num: 8,
    day: 2,
    minutes: 20,
    module: 4,
    subtopics: ["4.1", "4.3", "4.5"],
    title: "Multi-Agent AI Investment Committee",
    tagline: "Four AI executives (CFO, CTO, CISO, COO) debate three competing investments in parallel.",
    industry: "Manufacturing",
    company: "Forgeline Industries",
    theme: "indigo",
    icon: "Bot",
    scenario:
      "Forgeline has ₹15 Cr for one strategic tech bet: (A) predictive maintenance on 40 plants, (B) a new MES/ERP integration, or (C) a GenAI field-service assistant. You'll watch an agentic committee evaluate them.",
    definition:
      "Agentic AI uses multiple LLM-powered agents, each with a role, tools and memory, orchestrated as a graph. In LangGraph, each agent is a node; edges define the workflow; state carries evidence between agents. Decision modes: AI-assisted (AI informs), AI-augmented (AI recommends, human decides) and autonomous (AI decides within guardrails).",
    why: [
      "One LLM prompt gives one perspective; real decisions need diverse, structured viewpoints.",
      "Parallel agents compress days of stakeholder pre-reads into minutes.",
      "A graph makes the reasoning traceable — every agent's output is auditable.",
    ],
    what: [
      "AI-assisted vs augmented vs autonomous decisions.",
      "GenAI for analysis, summarisation and executive reporting.",
      "Multi-agent collaboration, workflow orchestration with LangGraph (fan-out / fan-in).",
    ],
    howAI: [
      { step: "Fan-out", detail: "CFO, CTO, CISO and COO agents analyse all options in parallel.", ai: "Agent" },
      { step: "Fan-in", detail: "Chair agent reconciles conflicting views.", ai: "Agent" },
      { step: "Report", detail: "GenAI produces a board-ready one-pager.", ai: "GenAI" },
      { step: "Decide", detail: "Human committee decides; AI view is one input.", ai: "Human" },
    ],
    metrics: [
      { label: "Time to committee-ready analysis", before: 15, after: 1, unit: "days", better: "lower" },
      { label: "Perspectives considered", before: 2, after: 5, unit: "functions", better: "higher" },
      { label: "Pre-read pages", before: 40, after: 3, unit: "pages", better: "lower" },
    ],
    timeSavings: [
      { task: "Stakeholder pre-analysis", before: 30, after: 2, cadence: "per investment cycle" },
      { task: "Board paper", before: 12, after: 2, cadence: "per decision" },
    ],
    valueStatement: "Executives get a 360° view in an hour instead of three weeks of meetings — and can spend the meeting deciding, not catching up.",
    lab: "committee",
    labIntro: "Edit the three investment options, then run the parallel committee. Watch the graph light up node by node.",
    agent: {
      title: "AI Investment Committee",
      pattern: "Parallel fan-out (4 agents) → fan-in chair",
      stages: [
        [
          { id: "cfo", label: "CFO Agent", emoji: "💰", role: "ROI, payback, cash", prompt: "You are the CFO. Evaluate each option on ROI, payback, cash flow and financial risk. Score each 1-10. Max 140 words." },
          { id: "cto", label: "CTO Agent", emoji: "🧠", role: "Feasibility & architecture", prompt: "You are the CTO. Evaluate each option on technical feasibility, architecture fit, talent and delivery risk. Score each 1-10. Max 140 words." },
          { id: "ciso", label: "CISO Agent", emoji: "🔐", role: "Security & compliance", prompt: "You are the CISO. Evaluate each option on security, OT/IT exposure, data privacy and compliance risk. Score each 1-10 (10 = lowest risk). Max 140 words." },
          { id: "coo", label: "COO Agent", emoji: "🏭", role: "Operational impact", prompt: "You are the COO. Evaluate each option on operational impact, adoption effort and change management. Score each 1-10. Max 140 words." },
        ],
        [{ id: "chair", label: "Committee Chair", emoji: "👔", role: "Reconciles & recommends", prompt: "You chair the committee. Build a table of all agent scores, highlight disagreements, give the recommendation with rationale, top 3 risks, and the next 90-day plan. Board-ready tone." }],
      ],
      question: "Which ONE investment should Forgeline fund with ₹15 Cr?",
      data: `A) Predictive maintenance (40 plants): ₹14 Cr, unplanned downtime -30% (worth ₹9 Cr/yr), 18 months full rollout, needs OT network sensors
B) MES–ERP integration: ₹12 Cr, inventory accuracy 82%→97%, working capital release ₹20 Cr one-time, 12 months, high change mgmt
C) GenAI field-service assistant: ₹6 Cr, first-time-fix 68%→80% (₹4 Cr/yr), 5 months, data in 20 years of PDFs/manuals`,
    },
    implement: [
      { phase: "Design", weeks: "Week 1", actions: ["Define agent roles mirroring your real committee", "Write evaluation rubrics per role"] },
      { phase: "Build", weeks: "Weeks 2–3", actions: ["LangGraph fan-out/fan-in graph", "Log every agent output for audit"] },
      { phase: "Pilot", weeks: "Weeks 4–8", actions: ["Run in shadow mode next to human committee", "Compare and calibrate"] },
    ],
    tools: ["LangGraph", "Groq (Llama / GPT-OSS)", "Amazon Bedrock (enterprise)", "n8n"],
    discuss: ["Would you let an agent vote?", "Which role is hardest to simulate?", "How do you stop agents agreeing too easily?"],
  },
  {
    id: "tech-budget-analysis",
    num: 9,
    day: 2,
    minutes: 10,
    module: 4,
    subtopics: ["4.3"],
    title: "Technology Budget → Executive Analysis",
    tagline: "Paste or upload a tech budget; get Run/Grow/Transform mix, variances and a CFO-ready narrative.",
    industry: "Media & Entertainment",
    company: "Stratawave Media",
    theme: "fuchsia",
    icon: "Wallet",
    scenario:
      "It's budget season. Stratawave's ₹120 Cr tech budget sits in a 400-line spreadsheet. The CEO wants to know in one page: are we spending to run the business or to grow it?",
    definition:
      "Generative AI for executive decision support uses LLMs to analyse, summarise and narrate structured data (like budgets) into decision-ready insight. Combined with deterministic calculations, it turns spreadsheets into narratives without hallucinating the numbers.",
    why: [
      "Executives don't read 400-line spreadsheets; they read one page.",
      "Most tech budgets are 70%+ 'Run' — invisible until someone classifies it.",
      "Rule: let code compute the numbers, let the LLM explain them.",
    ],
    what: ["Run / Grow / Transform classification", "Budget vs actual variance", "LLM narrative with explicit numbers"],
    howAI: [
      { step: "Parse", detail: "CSV parsed deterministically; totals computed in code.", ai: "Analytics" },
      { step: "Classify", detail: "LLM tags ambiguous lines into Run/Grow/Transform.", ai: "GenAI" },
      { step: "Narrate", detail: "Agent writes the CFO summary from computed figures.", ai: "GenAI" },
      { step: "Review", detail: "Finance partner validates before circulation.", ai: "Human" },
    ],
    metrics: [
      { label: "Budget pack preparation", before: 5, after: 1, unit: "days", better: "lower" },
      { label: "Transform share visibility", before: 0, after: 100, unit: "%", better: "higher" },
    ],
    timeSavings: [{ task: "Monthly budget variance commentary", before: 12, after: 1.5, cadence: "per month" }],
    valueStatement: "Shifting just 5 points from Run to Transform on a ₹120 Cr budget frees ₹6 Cr for growth.",
    lab: "budget",
    labIntro: "Edit the CSV (or upload your own). Charts and variances update; send it to the agent for the executive narrative.",
    agent: {
      title: "Budget Narrative Agent",
      pattern: "Sequential",
      stages: [
        [{ id: "analyst", label: "Budget Analyst", emoji: "📑", role: "Finds variances & mix", prompt: "Analyse the budget: Run/Grow/Transform mix, the 5 largest variances (budget vs actual) and anomalies. Use only numbers present in the data." }],
        [{ id: "narrator", label: "CFO Narrator", emoji: "🗞️", role: "One-page executive summary", prompt: "Write a one-page executive budget summary for the CEO: headline, 3 insights, 3 decisions required (e.g. reallocate X from Y to Z), and risks. Quote numbers exactly." }],
      ],
      question: "Summarise the technology budget for the CEO and recommend reallocations.",
      data: "(Use 'Send to agent' in the lab to load the budget table.)",
    },
    implement: [
      { phase: "Template", weeks: "Week 1", actions: ["Standard budget CSV with category & R/G/T tag", "Deterministic totals in code"] },
      { phase: "Narrate", weeks: "Week 2", actions: ["LLM summary with number-check guardrail", "Finance review step"] },
    ],
    tools: ["Excel / CSV", "Power BI", "Groq LLM", "Microsoft Copilot"],
    discuss: ["What's your Run/Grow/Transform split?", "Would you trust an AI-written budget narrative?"],
  },
  {
    id: "policy-rag-copilot",
    num: 10,
    day: 2,
    minutes: 20,
    module: 4,
    subtopics: ["4.4", "4.6"],
    title: "Policy-Grounded Decision Copilot (RAG)",
    tagline: "Answers grounded in your own policies, standards and past decisions — with citations.",
    industry: "Pharma · Regulated",
    company: "Zentara Pharma",
    theme: "emerald",
    icon: "BookOpenCheck",
    scenario:
      "Zentara's architects constantly ask: 'Can we use this SaaS tool with clinical data?', 'Which cloud region?', 'Do we need a validation plan?'. Answers live in 300 pages of policy. The architecture board is a bottleneck.",
    definition:
      "Retrieval-Augmented Generation (RAG) retrieves the most relevant passages from an enterprise knowledge base and gives them to the LLM as context, so answers are grounded and cited instead of invented. A decision copilot wraps RAG with role prompts, scenario analysis and memory.",
    why: [
      "LLMs don't know your policies — and confidently make things up.",
      "RAG gives traceable answers: every claim cites a source document.",
      "Architecture boards can focus on genuinely novel decisions.",
    ],
    what: ["Chunking, embedding/keyword retrieval, ranking", "Context-grounded reasoning with citations", "Copilot patterns: Q&A, compliance check, scenario analysis"],
    howAI: [
      { step: "Index", detail: "Policies chunked and indexed (TF-IDF here; vectors in production).", ai: "RAG" },
      { step: "Retrieve", detail: "Top-k passages for the question are selected (LangGraph tool node).", ai: "RAG" },
      { step: "Reason", detail: "LLM answers ONLY from retrieved passages with citations.", ai: "GenAI" },
      { step: "Verify", detail: "Compliance agent checks the answer against the sources.", ai: "Agent" },
      { step: "Escalate", detail: "Low-confidence answers go to the architecture board.", ai: "Human" },
    ],
    metrics: [
      { label: "Architecture board queue", before: 34, after: 9, unit: "requests", better: "lower" },
      { label: "Time to policy answer", before: 6, after: 0.1, unit: "days", better: "lower" },
      { label: "Answers with citation", before: 0, after: 100, unit: "%", better: "higher" },
    ],
    timeSavings: [{ task: "Policy look-up & interpretation", before: 3, after: 0.2, cadence: "per query" }],
    valueStatement: "200 policy queries a month × 3 hours = 600 hours of senior architect time returned.",
    lab: "rag",
    labIntro: "Ask a question. See which policy passages are retrieved and their relevance scores — then let the agent answer with citations.",
    agent: {
      title: "RAG Decision Copilot",
      pattern: "Retrieve (tool node) → reason → verify",
      stages: [
        [{ id: "retriever", label: "Policy Retriever", emoji: "📚", kind: "retrieve", role: "TF-IDF search over the knowledge base" }],
        [{ id: "advisor", label: "Copilot Advisor", emoji: "🧑‍⚖️", role: "Answers with citations", prompt: "Answer the question ONLY using the retrieved policy passages. Cite sources like [POL-ID]. If the passages don't cover it, say so clearly. Give a clear Yes/No/Conditional verdict first." }],
        [{ id: "verifier", label: "Compliance Verifier", emoji: "✅", role: "Checks grounding & confidence", prompt: "Verify that every claim in the advisor's answer is supported by the retrieved passages. List any unsupported claims, assign a confidence (High/Medium/Low), and say whether this must escalate to the architecture board." }],
      ],
      question: "Can we use a US-hosted SaaS analytics tool to analyse clinical trial data?",
      data: "Requester: Data Science team, Clinical Ops. Tool: SaaS analytics platform hosted in us-east. Data: pseudonymised trial data from EU and India sites.",
    },
    kb: [
      { id: "POL-DATA-01", title: "Data Classification Policy", text: "Clinical trial data, including pseudonymised patient data, is classified as Restricted. Restricted data must be encrypted at rest and in transit, and access must be role-based and logged. Pseudonymised data remains personal data under GDPR." },
      { id: "POL-RES-02", title: "Data Residency Standard", text: "Restricted data originating from EU sites must remain in EU regions unless a Transfer Impact Assessment and Standard Contractual Clauses are approved by the DPO. Data from India sites must comply with the DPDP Act; cross-border transfer requires Legal approval. US regions are not approved for Restricted EU data by default." },
      { id: "POL-SAAS-03", title: "SaaS Onboarding Standard", text: "Any SaaS tool processing Confidential or Restricted data requires a vendor security assessment, SOC 2 Type II report, a signed DPA, and SSO integration. Tools processing GxP data require a computer system validation (CSV) plan per GAMP 5." },
      { id: "POL-AI-04", title: "AI Usage Policy", text: "Generative AI tools may not be used with Restricted data unless deployed in an approved private tenant with no training on customer data. All AI-assisted decisions affecting patients or regulatory submissions require documented human review." },
      { id: "POL-CLOUD-05", title: "Cloud Region Policy", text: "Approved primary regions are eu-central and ap-south. Disaster recovery may use eu-west. New regions require Architecture Board approval and a cost and compliance review." },
      { id: "POL-ARB-06", title: "Architecture Board Charter", text: "The Architecture Board reviews exceptions to standards, new technology categories and any solution touching Restricted data in a non-approved region. Standard patterns already approved do not require board review." },
      { id: "POL-DR-07", title: "Resilience Standard", text: "Tier-1 systems require RPO of 15 minutes and RTO of 4 hours with tested DR twice a year. Clinical systems are Tier-1 during active trials." },
    ],
    implement: [
      { phase: "Corpus", weeks: "Weeks 1–2", actions: ["Collect policies, standards, ADRs, past board decisions", "Assign owners; remove stale docs"] },
      { phase: "Build", weeks: "Weeks 3–5", actions: ["Chunk + embed (Bedrock KB / pgvector)", "LangGraph retrieve→answer→verify graph"] },
      { phase: "Govern", weeks: "Week 6+", actions: ["Mandatory citations; low confidence → human", "Monthly evaluation set of 50 questions"] },
    ],
    tools: ["Amazon Bedrock Knowledge Bases", "pgvector / OpenSearch", "LangGraph", "Groq"],
    discuss: ["Which 20 documents would you index first?", "What happens when two policies conflict?", "Who maintains the knowledge base?"],
  },
  {
    id: "aiops-outage-prediction",
    num: 11,
    day: 2,
    minutes: 30,
    module: 5,
    subtopics: ["4.2", "5.1", "5.3"],
    title: "AIOps: Predict Outages Before They Happen",
    tagline: "Anomaly detection + forecasting on telemetry, with an agent that decides auto-remediate vs escalate.",
    industry: "Telecom · Digital Services",
    company: "Ondra Telecom",
    theme: "cyan",
    icon: "Activity",
    scenario:
      "Ondra's mobile-app API serves 9M users. Latency creeps up for hours before each outage, but static alert thresholds only fire when customers are already complaining. Can ML see it coming?",
    definition:
      "AIOps applies machine learning to IT operations data (metrics, logs, traces, events) for anomaly detection, event correlation, forecasting and automated remediation. Predictive intelligence turns 'we were paged' into 'we were warned'.",
    why: [
      "Static thresholds are either too noisy (alert fatigue) or too late.",
      "Most major outages show statistical drift 30–120 minutes in advance.",
      "Automating low-risk remediation cuts MTTR; humans focus on novel failures.",
    ],
    what: [
      "Anomaly detection (rolling z-score here; isolation forest / Prophet in production).",
      "Forecasting time-to-SLO-breach.",
      "Incident prioritisation and AI-powered root-cause correlation.",
      "Operational decision automation with guardrails.",
    ],
    howAI: [
      { step: "Detect", detail: "ML flags statistically abnormal latency/error behaviour.", ai: "ML" },
      { step: "Forecast", detail: "Trend projection estimates time to SLO breach.", ai: "ML" },
      { step: "Correlate", detail: "Agent links anomaly with recent deploys/config changes.", ai: "Agent" },
      { step: "Decide", detail: "Policy: auto-rollback if low-risk; else page on-call with a brief.", ai: "Agent" },
      { step: "Oversee", detail: "SRE approves high-impact actions.", ai: "Human" },
    ],
    metrics: [
      { label: "MTTD (mean time to detect)", before: 22, after: 4, unit: "min", better: "lower" },
      { label: "MTTR", before: 95, after: 38, unit: "min", better: "lower" },
      { label: "Alert noise", before: 1200, after: 180, unit: "alerts/wk", better: "lower" },
    ],
    timeSavings: [
      { task: "Alert triage", before: 25, after: 4, cadence: "per week (on-call)" },
      { task: "Incident correlation / war-room", before: 1.5, after: 0.4, cadence: "per incident" },
    ],
    valueStatement: "Each prevented 1-hour outage for 9M users avoids SLA penalties and churn worth ₹1–3 Cr.",
    lab: "anomaly",
    labIntro: "Adjust sensitivity (z-score) and SLO. See anomalies flagged and the forecasted breach time. Send the signal to the ops agent.",
    agent: {
      title: "AIOps Decision Agent",
      pattern: "Sequential with policy decision",
      stages: [
        [{ id: "signal", label: "Signal Analyst", emoji: "📈", role: "Interprets anomalies & forecast", prompt: "You are an SRE signal analyst. Interpret the anomaly and forecast data: severity, trend, time to SLO breach, blast radius." }],
        [{ id: "correlator", label: "Change Correlator", emoji: "🔗", role: "Links to deploys/config/infra", prompt: "Correlate the anomaly with the change log and infra events. Rank the 3 most likely causes with probability estimates and evidence." }],
        [{ id: "operator", label: "Ops Decision Policy", emoji: "🚦", role: "Auto-remediate or escalate?", prompt: "Decide the operational action per policy: AUTO-REMEDIATE (only if reversible, low blast radius, high-confidence cause) or ESCALATE to on-call with a 5-line brief. State the action, the reason, and the rollback plan." }],
      ],
      question: "Mobile API latency is drifting. What should operations do right now?",
      data: `Telemetry (p95 latency ms, last 6 x 10min): 210, 228, 251, 279, 312, 344; SLO = 400ms
Error rate: 0.4% → 1.1%
Change log: 13:05 deploy api-gateway v4.12 (connection pool 200→120); 13:40 CDN config change (cache TTL)
Infra: DB CPU 58% stable; gateway pods 12 (HPA max 12)
Traffic: +8% vs same day last week`,
    },
    implement: [
      { phase: "Observe", weeks: "Weeks 1–3", actions: ["Centralise metrics/logs/traces (Datadog/Splunk/OTel)", "Define SLOs for top 10 services"] },
      { phase: "Detect", weeks: "Weeks 4–6", actions: ["Enable ML anomaly detection on SLIs", "Tune to cut noise by 50%+"] },
      { phase: "Automate", weeks: "Weeks 7–12", actions: ["Runbooks as code; auto-rollback for reversible changes", "Agent briefs for everything else"] },
    ],
    tools: ["Datadog / Splunk ITSI", "Prometheus + OpenTelemetry", "Python (Prophet, scikit-learn)", "LangGraph", "n8n"],
    discuss: ["Which actions would you let AI take without a human?", "How much alert noise do your teams tolerate?", "Who is accountable for an auto-rollback?"],
  },
  {
    id: "cloud-finops",
    num: 12,
    day: 2,
    minutes: 10,
    module: 5,
    subtopics: ["5.4"],
    title: "Cloud FinOps Optimiser",
    tagline: "Rightsizing, commitments, idle cleanup and storage tiering — quantified and prioritised.",
    industry: "Media Streaming",
    company: "Stratawave Media",
    theme: "lime",
    icon: "PiggyBank",
    scenario:
      "Stratawave's AWS bill grew 64% YoY while subscribers grew 18%. The CFO wants 25% savings without hurting streaming quality. Where is the money?",
    definition:
      "FinOps is the operating model that brings financial accountability to variable cloud spend. Decision intelligence adds anomaly detection, rightsizing recommendations, commitment optimisation and unit economics (cost per stream / per customer).",
    why: [
      "Typically 25–35% of cloud spend is waste: idle, oversized or on-demand when it could be committed.",
      "Engineers make thousands of daily spend decisions without cost visibility.",
      "Unit cost, not total cost, tells you if growth is efficient.",
    ],
    what: ["Cost visibility & allocation (tagging)", "Optimisation levers: rightsizing, RIs/Savings Plans, idle, storage tiering, spot", "Capacity planning & workload placement", "Unit economics"],
    howAI: [
      { step: "Allocate", detail: "Spend mapped to teams/products via tags.", ai: "Analytics" },
      { step: "Detect", detail: "ML catches spend anomalies daily.", ai: "ML" },
      { step: "Recommend", detail: "Agent prioritises savings by value vs risk.", ai: "Agent" },
      { step: "Approve", detail: "Owners approve; low-risk actions automated.", ai: "Human" },
    ],
    metrics: [
      { label: "Monthly cloud spend", before: 4.2, after: 3.1, unit: "₹ Cr", better: "lower" },
      { label: "Commitment coverage", before: 28, after: 72, unit: "%", better: "higher" },
      { label: "Cloud cost per stream", before: 3.8, after: 2.6, unit: "₹", better: "lower" },
    ],
    timeSavings: [{ task: "Monthly cost review & recommendations", before: 30, after: 4, cadence: "per month" }],
    valueStatement: "₹1.1 Cr/month savings = ₹13 Cr/year redirected to product.",
    lab: "finops",
    labIntro: "Pull the optimisation levers. The savings chart and unit cost update; send the plan to the FinOps agent.",
    agent: {
      title: "FinOps Agent",
      pattern: "Fan-out (cost + risk) → planner",
      stages: [
        [
          { id: "cost", label: "Cost Analyst", emoji: "🧾", role: "Finds savings opportunities", prompt: "Identify savings opportunities by service with ₹ estimates. Rank by size." },
          { id: "risk", label: "Reliability Guardian", emoji: "🛡️", role: "Flags performance risk", prompt: "For each potential savings lever, assess risk to streaming quality and reliability (Low/Med/High) and the guardrail needed." },
        ],
        [{ id: "planner", label: "FinOps Planner", emoji: "🗓️", role: "90-day savings roadmap", prompt: "Create a 90-day savings roadmap: wave 1 quick wins, wave 2 commitments, wave 3 architecture. Include ₹ savings, owner, risk and the KPI (unit cost) to track." }],
      ],
      question: "How does Stratawave cut 25% of cloud spend without hurting streaming quality?",
      data: `Monthly AWS spend ₹4.2 Cr: EC2 compute ₹1.7 Cr (avg CPU 18%), S3 ₹0.8 Cr (61% objects not accessed in 90d), CloudFront ₹0.7 Cr, RDS ₹0.5 Cr (3 idle replicas), EKS ₹0.3 Cr, other ₹0.2 Cr
Commitment coverage: 28% (Savings Plans)
Dev/test environments run 24x7
Streams/month: 11M; subscribers +18% YoY; spend +64% YoY`,
    },
    implement: [
      { phase: "Inform", weeks: "Weeks 1–3", actions: ["Tag policy ≥ 90% coverage", "Showback by team; unit cost KPI"] },
      { phase: "Optimise", weeks: "Weeks 4–8", actions: ["Idle & dev schedules", "Rightsizing + Savings Plans"] },
      { phase: "Operate", weeks: "Ongoing", actions: ["Daily anomaly alerts", "Monthly FinOps council with agent report"] },
    ],
    tools: ["AWS Cost Explorer / CUR", "Kubecost", "Power BI", "LangGraph"],
    discuss: ["Who owns cloud cost in your org — finance or engineering?", "What is your unit-cost metric?"],
  },
];
