import React from 'react';
import { validatePortfolioData } from '../lib/schemas';

// Icon helper function preserving standard devicons
const getIconUrl = (name) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;

export const PERSONAL_INFO = {
  name: "William",
  title: "Data & Automation Analyst",
  role: "Data & Automation Analyst", // Backward-compatible alias
  email: "wiliamzwili135@gmail.com",
  location: "Jakarta, Indonesia",
  github: "https://github.com/GaneshArwan",
  linkedin: "https://www.linkedin.com/in/william-oo00/",
  bio: "Turning high-volume enterprise operations into governed, automated pipelines: delivering >99% master data accuracy, 30% faster SLA turnaround, and 3x request capacity without added headcount.",
  about: `I am a Data & Automation Analyst with 2 years of corporate experience in enterprise master data management, workflow automation, and operational analytics at Kawan Lama Group. A 2024 Informatics Engineering graduate from Tarumanagara University (GPA 3.89, graduated with High Distinction), I combine disciplined data governance (Google Workspace scripting, Looker, SQL, SAP GUI automation) with hands-on applied AI engineering (LangGraph.js, ChromaDB, Gemini API) to build reliable, auditable systems.\n\nAcross 5 core enterprise domains (Site, Vendor, Customer, Article, Finance), I improved master data SLA turnaround by 30%, automated ~70% of repetitive intake and validation tasks via Google Apps Script and SAP GUI scripting, and maintained >99% data accuracy while tripling daily request handling capacity with the existing operational team.`,
  education: [
    {
      institution: "Tarumanagara University (Untar)",
      degree: "Bachelor of Informatics Engineering (S.Kom)",
      gpa: "3.89 / 4.00",
      period: "2021 – 2024",
      honors: "Graduated with High Distinction (Top Percentile)",
      location: "Jakarta, Indonesia",
      relevantCourses: [
        "Data Structures & Algorithms",
        "Database Systems & Design",
        "Machine Learning & Artificial Intelligence",
        "Software Engineering",
        "Probability & Statistics",
        "Data Warehousing"
      ]
    }
  ],
  telemetryStats: [
    {
      label: "Master Data Accuracy",
      value: ">99.0%",
      detail: "Across 5 core enterprise domains (Site, Vendor, Customer, Article, Finance)"
    },
    {
      label: "SLA Efficiency",
      value: "+30%",
      detail: "Turnaround time improvement via workflow standardization and pre-validation"
    },
    {
      label: "Tasks Automated",
      value: "~70%",
      detail: "Rule-based master data activities automated via workflow triggers & SAP RPA"
    },
    {
      label: "Request Capacity",
      value: "3x",
      detail: "Daily handling volume scaled with zero additional operational headcount"
    }
  ]
};

export const EXPERIENCE = [
  {
    id: 1,
    company: "Kawan Lama Group",
    role: "Master Data Management Data Analyst Officer",
    type: "Full-time",
    period: "Jan 2025 – Mar 2026",
    date: "Jan 2025 – Mar 2026", // Backward compatibility
    location: "Jakarta, Indonesia",
    summary: "Governed enterprise master data integrity, standardized cross-departmental intake workflows using Google Workspace, automated SAP data entry, and built operational Looker dashboards across 5 core domains.",
    description: (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
        <ul className="list-disc pl-5 space-y-3">
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">Improved master data SLA by 30%:</strong> by transitioning unstructured email submissions into standardized Google Forms and automated validation spreadsheets, eliminating back-and-forth communication.
          </li>
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">Increased master data completeness and accuracy to &gt;99%:</strong> across 5 key enterprise domains (Site, Vendor, Customer, Article, Finance).
          </li>
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">Digital Integration:</strong> Centralized 10+ manual master data processes into auditable Google Sheets and Google Apps Script pipelines with automated status tracking and stakeholder notifications.
          </li>
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">Reduced operational bottlenecks by ~35% and automated ~70% of repetitive tasks:</strong> rule-based master data activities through SAP GUI Scripting and automated validation logic, increasing daily request handling capacity by ~3x with the same headcount.
          </li>
          <li>
            <strong className="text-emerald-700 dark:text-emerald-400">Enabled reliable business intelligence:</strong> engineered operational Looker dashboards and SQL reporting queries to monitor MDM SLA performance and provide real-time request status visibility for business units.
          </li>
        </ul>
      </div>
    ),
    domains: [
      {
        name: "Site",
        label: "Store & Branch Topology",
        description: "Location hierarchy, store metadata governance, and opening/renovation lifecycle tracking.",
        metrics: "100% store hierarchy integrity"
      },
      {
        name: "Vendor",
        label: "Supplier & Partner Master",
        description: "Onboarding compliance, tax verification, banking details, and payment terms synchronization.",
        metrics: "Zero duplicate vendor entries"
      },
      {
        name: "Customer",
        label: "B2B & Retail Client Graph",
        description: "Entity deduplication, credit limit parameters, national identity and branch relationship mapping.",
        metrics: ">99% customer record completeness"
      },
      {
        name: "Article",
        label: "SKU Catalog & Merchandise",
        description: "Product classification hierarchy, barcode validation, tariff codes, and unit conversion formulas.",
        metrics: "Automated classification for 10k+ SKUs"
      },
      {
        name: "Finance",
        label: "Cost Centers & General Ledger",
        description: "GL account validation, cost-center routing, and financial statement aggregation hierarchies.",
        metrics: "Audit-ready reconciliation"
      }
    ],
    achievements: [
      "Improved master data SLA turnaround by 30% by transitioning unstructured email submissions into standardized Google Forms and automated validation spreadsheets, eliminating back-and-forth communication.",
      "Maintained >99% data completeness and integrity across 5 core enterprise domains (Site, Vendor, Customer, Article, Finance).",
      "Centralized 10+ manual master data processes into auditable Google Sheets and Google Apps Script pipelines with automated status tracking and stakeholder notifications.",
      "Reduced operational bottlenecks by ~35% and automated ~70% of repetitive data entry via SAP GUI Scripting and automated validation logic, tripling daily request processing capacity (3x) with the same headcount.",
      "Engineered operational Looker dashboards and SQL reporting queries to monitor MDM SLA performance and provide real-time request status visibility for business units."
    ],
    tech: ["Google Apps Script", "Google Forms", "Google Sheets", "Looker", "SQL", "SAP GUI Scripting", "Process Automation"],
    certificate: null,
    highlight: null,
    link: null
  },
  {
    id: 2,
    company: "Kawan Lama Group",
    role: "Master Data Management Data Analyst Officer",
    type: "Internship",
    period: "Jan 2024 – Jan 2025",
    date: "Jan 2024 – Jan 2025", // Backward compatibility
    location: "Jakarta, Indonesia",
    summary: "Automated operational data workflows, developed intake forms with pre-validation logic, and mapped promotional data across retail business units.",
    description: (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
        <p>Architected workflow automation, data governance tooling, and internal validation scripting to enhance operational throughput.</p>
        <div>
          <strong className="block text-emerald-700 dark:text-emerald-400 mb-1 text-base">Workflow Optimization</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Standardized intake workflows by replacing email-based requests with structured Google Forms and Sheets pipelines.</li>
            <li>Engineered custom intake forms with automated validation logic for operational task management.</li>
            <li>Implemented Google Apps Script for automated form creation, approvals, and notifications.</li>
          </ul>
        </div>
        <div>
          <strong className="block text-emerald-700 dark:text-emerald-400 mb-1 text-base">Data Management & Governance</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Utilized Google Sheets and Looker for data visualization.</li>
            <li>Built automated master data mapping and reconciliation scripts.</li>
          </ul>
        </div>
        <div>
          <strong className="block text-emerald-700 dark:text-emerald-400 mb-1 text-base">Operational Support</strong>
          <ul className="list-disc pl-5 space-y-1">
            <li>Monitored promotional and merchandise processes.</li>
            <li>Automated promotional merchandise tracking and operational inventory audits.</li>
          </ul>
        </div>
      </div>
    ),
    achievements: [
      "Awarded Best Intern (Certificate of Excellence) for outstanding contribution to workflow modernization and departmental automation.",
      "Standardized fragmented email intake into structured Google Forms and automated Google Sheets pipelines with trigger-based notifications.",
      "Developed Looker and spreadsheet dashboards to monitor merchandise tracking and operational request turnaround in real-time.",
      "Engineered master data mapping and reconciliation scripts to eliminate manual cross-referencing errors across retail campaigns."
    ],
    highlight: "Awarded Best Intern",
    award: {
      title: "Awarded Best Intern (Certificate of Excellence)",
      issuer: "Kawan Lama Group",
      date: "Jan 2025",
      credentialUrl: "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E"
    },
    link: "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E",
    tech: ["Google Apps Script", "Google Forms", "Google Sheets", "Looker", "SQL", "Data Mapping"]
  }
];

export const PROJECTS = [
  {
    id: "rag-document-chat",
    title: "RAG Document Chat",
    category: "ai",
    flagship: true,
    technicalBadge: "ChromaDB + Redis Cache",
    technicalMetric: "<50ms Latency",
    metricBadgeLabel: "Vector Cache",
    description: "Stateless document question-answering platform using ChromaDB vector embeddings, dynamic token chunking, and Redis hash caching to eliminate redundant LLM invocations.",
    highlights: [
      "Dynamic document chunking using @langchain/textsplitters for recursive token splitting across PDF and Word documents",
      "Local ChromaDB vector store runner with strict similarity-threshold context gating before LLM prompt assembly",
      "Upstash Redis and ioredis hash caching for document hashes and query embeddings, eliminating redundant LLM API invocations",
      "Client-side zero-persistence security ensuring API keys and session context remain strictly inside volatile client memory"
    ],
    technicalIndicators: [
      { label: "Vector Store", value: "Local ChromaDB", detail: "Cosine-similarity threshold gating" },
      { label: "Embedding Cache", value: "Redis Hash", detail: "Eliminates duplicate LLM queries" },
      { label: "Security", value: "Volatile BYOK", detail: "Zero server-side persistence" },
      { label: "Chunking", value: "Dynamic Recursive", detail: "PDF & DOCX parsing via mammoth" }
    ],
    tech: ["TypeScript", "Next.js 15", "ChromaDB", "LangChain", "Redis", "Tailwind CSS 4", "Zod"],
    repoUrl: "https://github.com/GaneshArwan/RAGChat",
    liveUrl: null,
    link: "https://github.com/GaneshArwan/RAGChat",
    liveLink: null,
    image: "/assets/projects/rag-document-chat/chat-interface.png",
    media: [
      { type: "image", src: "/assets/projects/rag-document-chat/chat-interface.png", caption: "RAG Document Chat interface with grounded citations" },
      { type: "image", src: "/assets/projects/rag-document-chat/config-sidebar.png", caption: "Vector retrieval & model configuration sidebar" },
    ],
    workflowSteps: [
      { step: "01", title: "Ingest & Chunk", detail: "Parse uploaded documents into overlapping semantic chunks." },
      { step: "02", title: "Vector Index", detail: "Generate embeddings and store in searchable vector index." },
      { step: "03", title: "Semantic Retrieval", detail: "Match user queries against top-k relevant document chunks." },
      { step: "04", title: "Grounded Answer", detail: "Synthesize cited responses strictly from retrieved context." },
    ],
    workflowMermaid: "graph TD\n    A[Upload Document PDF / DOCX] --> B(Recursive Chunking & mammoth)\n    B --> C[(Local ChromaDB Vector Store)]\n    D[User Query] --> E(Cosine Similarity Gating)\n    E --> C\n    C --> F(Retrieve Relevant Context Chunks)\n    F --> G(Prompt Assembly & Redis Cache)\n    G --> H[Stream Grounded Response]",
    caseStudy: {
      problem: "Ingesting enterprise PDFs and Word documents into general LLMs introduces high latency, cost duplication from repeated queries, and severe privacy exposure if proprietary records persist on third-party servers.",
      architecture: "Stateless RAG pipeline combining LangChain recursive semantic chunking, local ChromaDB with cosine-similarity gating, and Upstash Redis hash caching for sub-50ms repeat query responses.",
      keyDecisions: [
        "Adopted client-side BYOK memory architecture with zero server-side persistence for enterprise privacy",
        "Placed Redis query hash-caching ahead of embedding generation to achieve sub-50ms cache hits on identical queries",
        "Used mammoth.js for clean DOCX structure extraction alongside PDF parsing"
      ],
      outcomes: [
        "<50ms query latency on cached lookups with 100% elimination of redundant LLM API invocations",
        "Strict similarity-threshold gating preventing hallucinated answers from low-confidence chunks",
        "Zero server-side persistence verified under enterprise security audits"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "TypeScript",
      topics: ["chromadb", "llm", "nextjs", "rag", "typescript", "zero-persistence"]
    }
  },
  {
    id: "ai-code-review-agent",
    title: "Autonomous Code Review Agent",
    category: "ai",
    flagship: true,
    technicalBadge: "Stateful 4-Node LangGraph",
    technicalMetric: ">5k Line Diffs",
    metricBadgeLabel: "AST Security",
    description: "Autonomous pull request review agent built with LangGraph.js, featuring chunked diff analysis for pull requests over 5,000 lines and automated AST security checks.",
    highlights: [
      "LangGraph.js stateful 4-node execution graph (fetch_pr -> analyze_chunks -> security_check -> synthesize)",
      "Automatic diff batching handling pull requests exceeding 5,000 lines with p-limit concurrent workers",
      "Dedicated AST security audit node detecting hardcoded credentials, SSRF vectors, SQL injection, and vulnerable dependencies",
      "NextAuth GitHub OAuth app integration with automated structured verdict generation (Approve, Request Changes, Comment)"
    ],
    technicalIndicators: [
      { label: "Execution Model", value: "LangGraph.js", detail: "Cyclic 4-node state graph" },
      { label: "Diff Throughput", value: ">5,000 Lines", detail: "p-limit concurrent chunk workers" },
      { label: "Security Gate", value: "AST Analysis", detail: "Credential & injection vector audit" },
      { label: "Deployment", value: "Vercel Live", detail: "Production OAuth integration" }
    ],
    tech: ["TypeScript", "Next.js 16", "LangGraph.js", "GitHub API", "Octokit", "Zod", "Tailwind CSS 4"],
    repoUrl: "https://github.com/GaneshArwan/AICodeReviewAgent",
    liveUrl: "https://ai-code-review-agent-sigma.vercel.app/",
    link: "https://github.com/GaneshArwan/AICodeReviewAgent",
    liveLink: "https://ai-code-review-agent-sigma.vercel.app/",
    image: "/assets/projects/ai-code-review-agent/preview-1.png",
    media: [
      { type: "video", src: "/assets/projects/ai-code-review-agent/walkthrough.webm", poster: "/assets/projects/ai-code-review-agent/preview-1.png", caption: "Live AI Code Review Agent walkthrough" },
      { type: "image", src: "/assets/projects/ai-code-review-agent/preview-1.png", caption: "Code review analysis workspace" },
      { type: "image", src: "/assets/projects/ai-code-review-agent/preview-2.png", caption: "Structured diff & severity findings view" },
    ],
    workflowSteps: [
      { step: "01", title: "Diff Ingestion", detail: "Accept repository PR diffs or pasted source files." },
      { step: "02", title: "Context Parsing", detail: "Extract changed hunks, language rules, and dependency scope." },
      { step: "03", title: "Agent Evaluation", detail: "Audit code for bugs, security risks, and anti-patterns." },
      { step: "04", title: "Review Report", detail: "Return prioritized, line-referenced remediation guidance." },
    ],
    workflowMermaid: "graph TD\n    A[Start: PR Review Request] --> B[Node 1: fetch_pr]\n    B --> C{Check Diff Size}\n    C -->|\"Diff > 5,000 lines\"| D[p-limit Batch Slicing]\n    C -->|\"Diff <= 5,000 lines\"| E[Node 2: analyze_chunks]\n    D --> E\n    E --> F[Node 3: security_check AST Audit]\n    F --> G[Node 4: synthesize Verdict]\n    G --> H[End: GitHub PR Verdict & Comment]",
    caseStudy: {
      problem: "Manual code review of large pull requests (>5,000 line diffs) causes critical delivery bottlenecks, missed AST-level security vulnerabilities, and inconsistent enforcement of team conventions.",
      architecture: "Cyclic 4-node state graph built with LangGraph.js (fetch_pr -> analyze_chunks -> security_check -> synthesize), orchestrating parallel chunk workers via p-limit and GitHub Octokit.",
      keyDecisions: [
        "Separated deterministic AST heuristic security audits from LLM synthesis to catch secrets before generation",
        "Partitioned massive pull request diffs dynamically using token-budget chunking instead of arbitrary line splits",
        "Enforced structured JSON review verdicts (Approve, Request Changes, Comment) with direct line-anchor references"
      ],
      outcomes: [
        "Analyzes >5,000 line diffs within 45 seconds with automated detection of SSRF, SQLi, and secret leaks",
        "Direct GitHub OAuth integration enabling automated PR review comments in live CI/CD pipelines",
        "Deployed to production on Vercel with active webhook event handling"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "TypeScript",
      topics: ["ai", "autonomous-agent", "code-review", "langgraph", "llm"]
    }
  },
  {
    id: "ai-writing-assistant-saas",
    title: "AI Writing Assistant SaaS",
    category: "ai",
    flagship: true,
    technicalBadge: "Atomic RPC Quotas",
    technicalMetric: "Gemini 3 Flash",
    metricBadgeLabel: "HarmBlock Guard",
    description: "Multi-tenant text generation application powered by Google Gemini 3 Flash, featuring low-latency token streaming, HarmBlock content safety filters, Midtrans QRIS payments, and atomic PostgreSQL quota transactions.",
    highlights: [
      "Google Gemini 3 Flash integration delivering low-latency token streaming directly to a brutalist terminal interface",
      "HarmBlock safety guardrails enforcing BLOCK_MEDIUM_AND_ABOVE across harassment, hate speech, and dangerous content",
      "PostgreSQL atomic RPC quota management (increment_generation_count) with automated rollback compensation",
      "Midtrans QRIS payment integration with timingSafeEqual signature validation and 6-month account recreation cool-off triggers"
    ],
    technicalIndicators: [
      { label: "Quota Engine", value: "Atomic RPC", detail: "PostgreSQL compensation rollback" },
      { label: "Guardrails", value: "HarmBlock", detail: "Strict harmful content filtering" },
      { label: "Streaming", value: "Gemini 3 Flash", detail: "Low-latency token delivery" },
      { label: "Payments", value: "Midtrans QRIS", detail: "timingSafeEqual HMAC validation" }
    ],
    tech: ["TypeScript", "Next.js 15", "Google Gemini", "Supabase", "Midtrans QRIS", "Cloudflare Turnstile", "Tailwind CSS 4"],
    repoUrl: "https://github.com/GaneshArwan/AIWritingAssistantSaaS",
    liveUrl: null,
    link: "https://github.com/GaneshArwan/AIWritingAssistantSaaS",
    liveLink: null,
    image: "/assets/projects/ai-writing-assistant-saas/preview-1.png",
    media: [
      { type: "video", src: "/assets/projects/ai-writing-assistant-saas/walkthrough.webm", poster: "/assets/projects/ai-writing-assistant-saas/preview-1.png", caption: "AI Writing Assistant SaaS workflow recording" },
      { type: "image", src: "/assets/projects/ai-writing-assistant-saas/preview-1.png", caption: "Content editor & prompt studio" },
      { type: "image", src: "/assets/projects/ai-writing-assistant-saas/preview-2.png", caption: "Generated output & tone controls" },
    ],
    workflowSteps: [
      { step: "01", title: "Template & Tone", detail: "Select writing workflow, audience, and tone parameters." },
      { step: "02", title: "Prompt Assembly", detail: "Build structured system constraints and context variables." },
      { step: "03", title: "Streaming Draft", detail: "Stream formatted output with real-time progress feedback." },
      { step: "04", title: "Refine & Export", detail: "Iterate on sections and export ready-to-publish copy." },
    ],
    workflowMermaid: "graph TD\n    A[Client Request + Timezone Header] --> B[Firewall: Turnstile + IP Gate]\n    B --> C{Atomic PostgreSQL Quota RPC}\n    C -->|Exceeded| D[Reject Transaction 429]\n    C -->|Allowed| E[Google Gemini 3 Flash API]\n    E -->|\"Error / Timeout\"| F[Compensation RPC: Refund Quota]\n    E -->|Success| G[Low-Latency Token Streaming]\n    G --> H[Async Persistence to generations Table]",
    caseStudy: {
      problem: "Multi-tenant generative writing applications suffer from payment fraud, race conditions during quota checks, API timeout costs, and content safety liability.",
      architecture: "Next.js 15 application utilizing Google Gemini 3 Flash with low-latency token streaming, Supabase atomic PostgreSQL RPC functions (increment_generation_count), and Midtrans QRIS integration.",
      keyDecisions: [
        "Implemented database-level atomic RPC quota deduction with automated rollback compensation upon Gemini timeouts",
        "Enforced BLOCK_MEDIUM_AND_ABOVE HarmBlock safety guardrails across harassment, hate speech, and dangerous content",
        "Secured webhook endpoints with timingSafeEqual HMAC validation to prevent timing-attack payment forgery"
      ],
      outcomes: [
        "Real-time token streaming to a brutalist interface with sub-800ms time to first token (TTFT)",
        "Zero quota leakage under simulated concurrent multi-tab generation requests",
        "Production deployment with live Midtrans QRIS payment workflows"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "TypeScript",
      topics: ["brutalist", "gemini", "nextjs", "saas", "stripe", "tailwindcss"]
    }
  },
  {
    id: "voice-ai-assistant",
    title: "Voice AI Assistant",
    category: "ai",
    flagship: false,
    technicalBadge: "Sub-500ms WebRTC Pipeline",
    technicalMetric: "<500ms Latency",
    metricBadgeLabel: "Real-Time VAD",
    description: "Real-time conversational voice web application operating under 500ms latency, featuring WebRTC audio streaming, client-side voice activity detection (VAD), and multi-provider BYOK architecture.",
    highlights: [
      "Sub-500ms turn-taking conversational voice latency using WebRTC and real-time streaming audio protocols",
      "Multi-provider BYOK architecture supporting Google Gemini, OpenAI, Anthropic, and ElevenLabs speech models",
      "Real-time voice activity detection (VAD) and client-side barge-in playback cancellation",
      "Production deployment on Vercel with active real-time microphone stream processing"
    ],
    technicalIndicators: [
      { label: "Latency", value: "<500ms Pipeline", detail: "Turn-taking conversational speed" },
      { label: "Interaction", value: "Barge-in VAD", detail: "Instant audio playback termination" },
      { label: "Modality", value: "STT + LLM + TTS", detail: "Whisper, Claude/Gemini, ElevenLabs" },
      { label: "Deployment", value: "Vercel Live", detail: "Live speech-to-speech demo" }
    ],
    tech: ["TypeScript", "WebRTC", "Audio Streaming", "Gemini API", "ElevenLabs", "Node.js"],
    repoUrl: "https://github.com/GaneshArwan/VoiceAIAssistant",
    liveUrl: "https://voice-ai-assistant-theta.vercel.app/",
    link: "https://github.com/GaneshArwan/VoiceAIAssistant",
    liveLink: "https://voice-ai-assistant-theta.vercel.app/",
    image: "/assets/projects/voice-ai-assistant/preview-2.png",
    media: [
      { type: "video", src: "/assets/projects/voice-ai-assistant/walkthrough.webm", poster: "/assets/projects/voice-ai-assistant/preview-2.png", caption: "VoiceAI console live walkthrough" },
      { type: "image", src: "/assets/projects/voice-ai-assistant/preview-2.png", caption: "Main VoiceAI real-time console" },
      { type: "image", src: "/assets/projects/voice-ai-assistant/preview-1.png", caption: "System Core configuration modal" },
    ],
    workflowSteps: [
      { step: "01", title: "Audio Capture", detail: "Capture microphone stream with voice activity detection." },
      { step: "02", title: "Transcription", detail: "Convert live speech frames into structured text intents." },
      { step: "03", title: "Core Reasoning", detail: "Process conversational state via System Core model config." },
      { step: "04", title: "Voice Response", detail: "Stream synthesized audio reply back to the console." },
    ],
    workflowMermaid: "graph TD\n    A[Microphone Audio Input] --> B[STT: Whisper Transcription]\n    B --> C[LLM Reasoning: GPT-5.2 / Gemini]\n    C --> D[TTS Synthesis: ElevenLabs]\n    D --> E[Real-Time WebRTC Audio Playback]\n    E -.->|\"Barge-In Interruption\"| A",
    caseStudy: {
      problem: "Conversational voice agents suffer from high roundtrip latency (>2s) and rigid turn-taking, causing awkward user interruptions and broken conversational flow.",
      architecture: "Low-latency streaming audio pipeline using WebRTC frames, client-side Voice Activity Detection (VAD), chunked Whisper transcription, and ElevenLabs/Gemini speech synthesis.",
      keyDecisions: [
        "Engineered instant client-side barge-in detection that cuts audio playback and cancels LLM context on speech onset",
        "Multi-provider BYOK routing allowing dynamic switching between Google Gemini, OpenAI, and ElevenLabs engines",
        "Implemented WebRTC audio streaming to avoid HTTP connection handshake overhead"
      ],
      outcomes: [
        "Sub-500ms conversational turn-taking latency with natural barge-in speech interruption",
        "Zero server audio storage ensuring volatile, private audio processing",
        "Live production deployment on Vercel with responsive mobile and desktop microphone support"
      ]
    },
    githubStats: {
      stars: 2,
      forks: 0,
      language: "TypeScript",
      topics: ["voice-ai", "real-time", "assistant", "conversational-ai"]
    }
  },
  {
    id: "enterprise-process-automation",
    title: "ProcessPilot Enterprise Automation",
    category: "automation",
    flagship: false,
    technicalBadge: "Distributed Key-Locking & SAP RPA",
    technicalMetric: "Distributed Locking",
    metricBadgeLabel: "SAP GUI RPA",
    description: "Enterprise workflow management system deployed for Kawan Lama Group MDM, featuring distributed key-locking for request concurrency and automated SAP GUI batch entry scripting.",
    highlights: [
      "Engineered distributed key-lock concurrency preventing race conditions across multi-departmental master data requests",
      "Scaled round-robin allocation engine distributing workload evenly across corporate MDM analysts",
      "Automated SAP GUI VBScript generation for high-volume batch data entry, cutting manual input time by ~70%",
      "Centralized audit logging replacing email chains with end-to-end transparent ticket state tracking"
    ],
    technicalIndicators: [
      { label: "Concurrency", value: "Key-Locking", detail: "Zero race conditions across departments" },
      { label: "Throughput", value: "3x Capacity", detail: "Scaled volume with same headcount" },
      { label: "Automation", value: "~70% Tasks", detail: "SAP GUI RPA batch execution" },
      { label: "Domains", value: "5 Enterprise MDM", detail: "Site, Vendor, Customer, Article, Finance" }
    ],
    tech: ["JavaScript", "Google Apps Script", "SAP GUI Scripting", "REST API", "Distributed Systems"],
    repoUrl: "https://github.com/GaneshArwan/enterprise-process-automation",
    liveUrl: null,
    link: "https://github.com/GaneshArwan/enterprise-process-automation",
    liveLink: null,
    image: "/assets/projects/enterprise-process-automation/preview-1.png",
    media: [
      { type: "image", src: "/assets/projects/enterprise-process-automation/preview-1.png", caption: "Enterprise Process Automation repository & architecture" },
      { type: "image", src: "/assets/projects/enterprise-process-automation/preview-2.png", caption: "Automated workflow modules & execution scripts" },
    ],
    workflowSteps: [
      { step: "01", title: "Trigger Intake", detail: "Receive scheduled or event-driven operational payloads." },
      { step: "02", title: "Schema Guard", detail: "Validate enterprise records against strict data contracts." },
      { step: "03", title: "Task Execution", detail: "Run idempotent automation pipelines across target systems." },
      { step: "04", title: "Audit & Alert", detail: "Record execution telemetry and notify on exceptions." },
    ],
    workflowMermaid: "graph TD\n    A[Form / Sheet Request Intake] --> B[Validate & Distributed Key-Lock]\n    B --> C{Approval Engine & Gate}\n    C -->|Approved| D[Intelligent Workload Allocator]\n    C -->|Rejected| R[Revision Queue & Key Unlock]\n    R -.->|Resubmit| A\n    D --> E[Agent Claim & Task Queue]\n    E --> F[Script Factory: SAP GUI VBScript RPA]\n    F --> G[Execution & Child Sync]\n    G --> H[Close, Audit Log & Cache Invalidate]",
    caseStudy: {
      problem: "Master data requests across 5 enterprise departments at Kawan Lama Group suffered from race conditions during concurrent updates, fragmented email approvals, and manual SAP entry.",
      architecture: "Enterprise workflow automation platform built on Google Apps Script with distributed key-locking concurrency, round-robin analyst workload allocation, and automated SAP GUI VBScript generation.",
      keyDecisions: [
        "Utilized atomic property key-locking to prevent concurrent write collisions on identical master data entities",
        "Built deterministic SAP GUI VBScript generation for operator-verified batch execution",
        "Automated multi-departmental approval chains with real-time audit logging to replace email threads"
      ],
      outcomes: [
        "Reduced repetitive manual SAP transaction entry time by ~70%",
        "Tripled daily ticket throughput capacity without increasing department headcount",
        "Eliminated 100% of concurrent overwrite collisions across Site, Vendor, and Customer domains"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "JavaScript",
      topics: ["enterprise-automation", "sap-integration", "workload-distribution"]
    }
  },
  {
    id: "corporate-kpi-sla-dashboard",
    title: "Corporate KPI & SLA Dashboard",
    category: "data",
    flagship: false,
    technicalBadge: "Holiday-Aware SLA Engine",
    technicalMetric: "SLA Engine",
    metricBadgeLabel: "Indonesian Calendar",
    description: "Operational BI dashboard for master data ticket tracking, featuring an automated SLA engine aligned with the Indonesian business and public holiday calendar.",
    highlights: [
      "Automated SLA tracking engine incorporating Indonesian business calendar and national public holidays",
      "Interactive multi-dimensional visualization suite built with Streamlit and Plotly for MDM processing metrics",
      "Automated ETL pipelines extracting data from operational Google Sheets into analytical dataframes",
      "Deployed live on Streamlit Cloud for executive operations monitoring and ticket resolution velocity analysis"
    ],
    technicalIndicators: [
      { label: "SLA Engine", value: "Holiday-Aware", detail: "Indonesian national calendar parity" },
      { label: "ETL Pipeline", value: "Automated Sheets", detail: "Normalized data ingestion" },
      { label: "Visualization", value: "Plotly Interactive", detail: "Multidimensional SLA velocity" },
      { label: "Deployment", value: "Streamlit Cloud", detail: "Live executive dashboard" }
    ],
    tech: ["Python", "Streamlit", "Plotly", "Pandas", "ETL Pipelines", "Google API"],
    repoUrl: "https://github.com/GaneshArwan/kpi-dashboard",
    liveUrl: "https://kpi-dashboard-ganesh.streamlit.app/",
    link: "https://github.com/GaneshArwan/kpi-dashboard",
    liveLink: "https://kpi-dashboard-ganesh.streamlit.app/",
    image: "/assets/projects/corporate-kpi-sla-dashboard/preview-1.png",
    media: [
      { type: "video", src: "/assets/projects/corporate-kpi-sla-dashboard/walkthrough.webm", poster: "/assets/projects/corporate-kpi-sla-dashboard/preview-1.png", caption: "Live Streamlit KPI & SLA dashboard walkthrough" },
      { type: "image", src: "/assets/projects/corporate-kpi-sla-dashboard/preview-1.png", caption: "Executive KPI & SLA overview" },
      { type: "image", src: "/assets/projects/corporate-kpi-sla-dashboard/preview-2.png", caption: "Interactive SLA trend & breakdown charts" },
    ],
    workflowSteps: [
      { step: "01", title: "Data Ingestion", detail: "Load ticket and operational SLA logs into normalized frames." },
      { step: "02", title: "SLA Rule Engine", detail: "Compute breach thresholds, response times, and compliance rates." },
      { step: "03", title: "KPI Aggregation", detail: "Roll up metrics by department, priority, and time window." },
      { step: "04", title: "Streamlit UI", detail: "Render interactive executive filters and drill-down charts." },
    ],
    workflowMermaid: "graph TD\n    A[Google Drive / Sheets API] --> B[ETL Ingestion & Normalization]\n    C[Synthetic Data Generator] -.-> B\n    B --> D[Holiday-Aware SLA Calculation Engine]\n    D --> E[Multi-Dimensional Metric Processing]\n    E --> F[Overview Trend Analytics]\n    E --> G[Requester & Approver Bottlenecks]\n    E --> H[MDM Team Velocity & SLA Compliance]\n    F --> I[Interactive Plotly Visualizations]\n    G --> I\n    H --> I",
    caseStudy: {
      problem: "Standard business BI tools distorted ticket SLA metrics by failing to account for Indonesian national public holidays and collective leave (cuti bersama).",
      architecture: "Automated Python ETL pipeline extracting operational ticket logs into normalized dataframes, evaluated by an Indonesian holiday-aware SLA calculation engine and rendered via Streamlit and Plotly.",
      keyDecisions: [
        "Built dynamic calendar synchronization for Indonesian public holidays and corporate working hours",
        "Engineered multi-dimensional aggregation across requester bottlenecks, approver velocity, and team compliance",
        "Designed interactive Plotly visualizations with drill-down views for executive stakeholders"
      ],
      outcomes: [
        "100% accurate SLA compliance reporting calibrated to Indonesian corporate calendar rules",
        "Live deployment on Streamlit Cloud providing real-time executive visibility into MDM velocity",
        "Direct identification of departmental approval bottlenecks, reducing ticket cycle time"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "Python",
      topics: ["dashboard", "kpi", "data-visualization", "streamlit"]
    }
  },
  {
    id: "telco-customer-churn-prediction",
    title: "Telco Customer Churn Prediction ML Pipeline",
    category: "data",
    flagship: false,
    technicalBadge: "79% Recall & 23 Pytest Tests",
    technicalMetric: "79% Churn Recall",
    metricBadgeLabel: "23 Pytest Tests",
    description: "End-to-end production ML pipeline for customer churn with class-imbalance recall optimization, automated IEEE two-column PDF paper generation, and 23 pytest tests.",
    highlights: [
      "Class-imbalance recall optimization achieving 79% recall for high-risk customer churn identification vs 48% baseline",
      "Automated IEEE two-column PDF research paper compilation generating publication-ready experimental reports via ReportLab",
      "Automated test suite with 23 pytest unit and integration tests executing in GitHub Actions CI/CD (56% coverage gate)",
      "Dockerized container pipeline with interactive Streamlit web portal for real-time model inference"
    ],
    technicalIndicators: [
      { label: "Model Recall", value: "79% Churn Recall", detail: "Balanced Logistic Regression vs 48% RF" },
      { label: "Test Suite", value: "23 Pytest Tests", detail: "56% coverage enforced in CI/CD" },
      { label: "Paper Engine", value: "IEEE PDF Report", detail: "Auto-compiled ReportLab two-column" },
      { label: "Packaging", value: "Docker + Streamlit", detail: "Containerized inference portal" }
    ],
    tech: ["Python", "Scikit-Learn", "Streamlit", "Pandas", "ReportLab", "Pytest", "GitHub Actions"],
    repoUrl: "https://github.com/GaneshArwan/customer_churn_prediction",
    liveUrl: null,
    link: "https://github.com/GaneshArwan/customer_churn_prediction",
    liveLink: null,
    image: "/assets/projects/telco-customer-churn-prediction/roc_curve.png",
    media: [
      { type: "image", src: "/assets/projects/telco-customer-churn-prediction/roc_curve.png", caption: "ROC-AUC model evaluation curve" },
      { type: "image", src: "/assets/projects/telco-customer-churn-prediction/confusion_matrix.png", caption: "Classification confusion matrix" },
      { type: "image", src: "/assets/projects/telco-customer-churn-prediction/rf_fi.png", caption: "Random Forest feature importance ranking" },
    ],
    workflowSteps: [
      { step: "01", title: "Feature Prep", detail: "Clean telco subscriber attributes and encode tenure signals." },
      { step: "02", title: "Class Balance", detail: "Address churn class skew during cross-validated splits." },
      { step: "03", title: "Model Training", detail: "Train and benchmark Random Forest & classification models." },
      { step: "04", title: "Risk Scoring", detail: "Output ROC-AUC diagnostics and top churn drivers." },
    ],
    workflowMermaid: "graph TD\n    A[Raw Data fetch_data.py] --> B[Exploratory Data Analysis eda.py]\n    B --> C[Data Preprocessing data_preprocessing.py]\n    C --> D[Model Training train_model.py]\n    D --> E[Serialized Model rf_model.pkl]\n    C --> F[Model Benchmarking experiment.py]\n    E --> G[Evaluation evaluate.py]\n    F --> H[IEEE Research Report generate_report.py]\n    G --> I[Streamlit & Docker Inference Portal]\n    H --> I",
    caseStudy: {
      problem: "Extreme class imbalance in telco subscriber datasets caused standard classifiers to miss more than half of high-risk churners (baseline Random Forest recall ~48%).",
      architecture: "Production ML pipeline with exploratory data analysis, class-imbalance recall optimization, automated IEEE two-column PDF paper generation via ReportLab, and 23 pytest tests in CI/CD.",
      keyDecisions: [
        "Prioritized recall over raw accuracy using balanced class weights and threshold tuning to catch false negatives",
        "Automated experimental reporting with ReportLab generating publication-ready IEEE two-column PDFs",
        "Enforced 56% test coverage gate with 23 unit/integration tests running in GitHub Actions"
      ],
      outcomes: [
        "Boosted customer churn identification recall from 48% to 79%",
        "Automated end-to-end research report generation from raw model output to PDF in seconds",
        "Dockerized inference portal with Streamlit interface for live subscriber risk scoring"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "Python",
      topics: ["data-science", "ci-cd", "deep-learning", "machine-learning"]
    }
  },
  {
    id: "ai-data-analyst-agent",
    title: "AI Data Analyst Agent",
    category: "data",
    flagship: false,
    technicalBadge: "Self-Healing SQL State Machine",
    technicalMetric: "Self-Healing SQL",
    metricBadgeLabel: "Read-Only Sandbox",
    description: "Automated SQL analytics agent with schema discovery, self-healing query retry loop, Drizzle ORM, read-only transaction sandbox, and Recharts visualization.",
    highlights: [
      "Stateful LangGraph.js execution graph coordinating schema inspection, query generation, self-healing retry, and chart synthesis",
      "Automated self-healing retry engine detecting SQL syntax errors and re-prompting with execution traces",
      "Strict read-only PostgreSQL transaction isolation sandbox preventing data mutation during ad-hoc analytics",
      "Dynamic data visualization generation rendering responsive Recharts charts from analytical SQL query results"
    ],
    technicalIndicators: [
      { label: "Execution Model", value: "LangGraph.js", detail: "Self-healing SQL retry loop" },
      { label: "Safety Sandbox", value: "Read-Only Tx", detail: "Mutation-proof execution" },
      { label: "ORM Layer", value: "Drizzle ORM", detail: "Type-safe PostgreSQL schema" },
      { label: "Visualization", value: "Recharts Engine", detail: "Automated chart synthesis" }
    ],
    tech: ["TypeScript", "Next.js 16", "LangGraph.js", "Drizzle ORM", "PostgreSQL", "Recharts"],
    repoUrl: "https://github.com/GaneshArwan/AIDataAnalystAgent",
    liveUrl: null,
    link: "https://github.com/GaneshArwan/AIDataAnalystAgent",
    liveLink: null,
    image: "/assets/projects/ai-data-analyst-agent/analytics-engine-preview.webp",
    media: [
      { type: "image", src: "/assets/projects/ai-data-analyst-agent/analytics-engine-preview.webp", caption: "AI Data Analyst Agent analytics engine preview" },
    ],
    workflowSteps: [
      { step: "01", title: "Schema Profiling", detail: "Inspect PostgreSQL tables and dataset column distributions." },
      { step: "02", title: "NL-to-SQL Graph", detail: "Plan and validate read-only SQL queries via LangGraph.js." },
      { step: "03", title: "Statistical Run", detail: "Execute aggregations and anomaly checks over queried rows." },
      { step: "04", title: "Chart Synthesis", detail: "Render interactive Recharts visualizations with summary notes." },
    ],
    workflowMermaid: "graph TD\n    A[User Query] --> B(Schema Discovery)\n    B --> C(Query Synthesis)\n    C --> D{Execute Query in Read-Only Sandbox}\n    D -->|Syntax Error| E(Self-Healing SQL Auto-Fix)\n    E -.->|Retry SQL| C\n    D -->|Success| F(Recharts Synthesis & Analytics)\n    F --> G[Final Output, Tables & Visual Charts]",
    caseStudy: {
      problem: "Non-technical stakeholders require ad-hoc analytical queries, but direct database access risks SQL injection, accidental table mutations, or syntax errors.",
      architecture: "Stateful LangGraph.js cyclic graph featuring automatic PostgreSQL schema discovery via Drizzle ORM, read-only transaction sandboxing, self-healing query retry loop, and Recharts rendering.",
      keyDecisions: [
        "Implemented self-healing retry state machine that detects SQL syntax errors and re-prompts with execution traces",
        "Enforced strict read-only PostgreSQL transaction isolation to make data mutations mathematically impossible",
        "Integrated dynamic Recharts visualization generation from validated query result sets"
      ],
      outcomes: [
        "100% mutation-proof analytics execution via read-only transactions",
        "Autonomous self-healing recovery from SQL dialect and syntax discrepancies",
        "Automated generation of executive charts and summary tables from natural language prompts"
      ]
    },
    githubStats: {
      stars: 0,
      forks: 0,
      language: "TypeScript",
      topics: ["ai-agent", "data-analyst", "langgraph", "sql", "typescript"]
    }
  }
];

export const DISCOVERED_PROJECTS = [
  {
    id: "multi-model-benchmark-suite",
    title: "Multi-Model AI Benchmark Suite",
    category: "ai",
    technicalBadge: "TTFT Latency & Visual Diff",
    technicalMetric: "TTFT Telemetry",
    metricBadgeLabel: "Visual Diff",
    description: "Multi-model comparative benchmarking environment capturing Time To First Token (TTFT) streaming latency and rendering word-level visual diffs between frontier LLMs.",
    workflowMermaid: "graph TD\n    A[Define System Protocol] --> B(Select Engines)\n    B --> C(Tune Hyperparameters)\n    C --> D[Execute & Monitor Stream]\n    D --> E[Visual Diff Engine]\n    E --> F(Analyze Word-Level Differences)\n    F --> G[Save to Chronicle & Refine]",
    repoUrl: "https://github.com/GaneshArwan/MultiModelAI",
    liveUrl: "https://multi-model-ai-ganesh.vercel.app/",
    tech: ["TypeScript", "Next.js 16", "React 19", "Vercel AI SDK", "Tailwind CSS 4", "Diff Algorithm"]
  },
  {
    id: "ai-data-analyst-agent",
    title: "AI Data Analyst Agent",
    category: "data",
    technicalBadge: "Self-Healing SQL State Machine",
    technicalMetric: "Self-Healing SQL",
    metricBadgeLabel: "Read-Only Sandbox",
    description: "Automated SQL analytics agent with schema discovery, self-healing query retry loop, Drizzle ORM, read-only transaction sandbox, and Recharts.",
    repoUrl: "https://github.com/GaneshArwan/AIDataAnalystAgent",
    liveUrl: null,
    tech: ["TypeScript", "Next.js 16", "LangGraph.js", "Drizzle ORM", "PostgreSQL", "Recharts"]
  }
];

export const SKILL_CATEGORIES = [
  {
    category: "Data Warehousing & Analytics Infrastructure",
    description: "Enterprise data modeling, BigQuery transformations, Looker BI, and SQL pipeline governance.",
    skills: [
      { name: "Google BigQuery", level: "Advanced", context: "Enterprise data warehouse querying, partitioning, and aggregation" },
      { name: "SQL & Query Optimization", level: "Advanced", context: "Complex joins, window functions, indexing, and CTE optimization" },
      { name: "Looker & BI Dashboards", level: "Advanced", context: "Executive dashboards, MDM SLA tracking, and operational metrics" },
      { name: "ETL & Data Pipelines", level: "Proficient", context: "Automated ingestion, validation, and multi-domain normalization" },
      { name: "Python (Pandas / NumPy)", level: "Advanced", context: "Data manipulation, exploratory analysis, and profiling" },
      { name: "Scikit-Learn", level: "Proficient", context: "Supervised classification, clustering, and recall tuning" }
    ]
  },
  {
    category: "AI & Autonomous LLM Systems",
    description: "Vector retrieval (ChromaDB), LangGraph.js multi-agent graphs, Gemini streaming, and AST security audit gates.",
    skills: [
      { name: "LangGraph.js & Multi-Agent State", level: "Advanced", context: "Stateful agent graphs, cyclical nodes, and multi-step synthesis" },
      { name: "ChromaDB & Vector Storage", level: "Advanced", context: "Local persistent vector runners, embeddings, similarity filtering" },
      { name: "Google Gemini 3 Flash / 1.5", level: "Advanced", context: "Streaming tokens, function calling, HarmBlock guardrails" },
      { name: "LangChain (LCEL)", level: "Proficient", context: "Chains, recursive text splitting, dynamic prompt templates" },
      { name: "Prompt Architecture & Guardrails", level: "Advanced", context: "AST security, prompt-injection defense, zero-persistence BYOK" },
      { name: "Redis & Hash Caching", level: "Proficient", context: "Upstash Redis, query embedding cache, rate limiting" }
    ]
  },
  {
    category: "Enterprise Automation & Integration",
    description: "Distributed concurrency locking, SAP GUI automation, automated SLA escalation engines, and Google Apps Script.",
    skills: [
      { name: "Google Apps Script", level: "Advanced", context: "Custom enterprise intake portals, automated triggers, approval routing" },
      { name: "SAP GUI RPA & Scripting", level: "Proficient", context: "VBScript generation for high-volume automated batch entries" },
      { name: "Distributed Key-Locking", level: "Proficient", context: "Concurrency safety and atomic lock contention prevention" },
      { name: "Master Data Governance", level: "Advanced", context: "Site, Vendor, Customer, Article, and Finance domain integrity" },
      { name: "REST APIs & Webhooks", level: "Advanced", context: "Secure payload verification, timingSafeEqual HMAC, idempotent events" }
    ]
  },
  {
    category: "Frontend Engineering & Tooling",
    description: "React 19, TypeScript, Next.js App Router, Tailwind CSS 4, Zod schema validation, and Git CI/CD hygiene.",
    skills: [
      { name: "React 19 & Next.js 15/16", level: "Advanced", context: "App Router, client hydration, server components, SPA architecture" },
      { name: "TypeScript", level: "Advanced", context: "Strict typing, generics, schema inference, type-safe interfaces" },
      { name: "Tailwind CSS v4", level: "Advanced", context: "WCAG AA contrast tokens, responsive layouts, 8px spatial rhythm" },
      { name: "Zod Schema Validation", level: "Advanced", context: "Runtime schema validation, form parsing, contract enforcement" },
      { name: "Git & CI/CD Pipelines", level: "Proficient", context: "GitHub Actions, automated test suites, conventional commits" }
    ]
  }
];

// Flat skills array for backward compatibility with existing MarqueeSection in M1
export const SKILLS = [
  { name: "Python", image: getIconUrl("python"), category: "Language" },
  { name: "TypeScript", image: getIconUrl("typescript"), category: "Language" },
  { name: "SQL", image: getIconUrl("mysql"), category: "Language" },
  { name: "BigQuery", image: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg", category: "Data Warehouse" },
  { name: "Looker", image: "https://img.icons8.com/color/48/000000/google-logo.png", category: "Analytics" },
  { name: "Machine Learning", image: getIconUrl("tensorflow"), category: "AI" },
  { name: "Generative AI", image: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg", category: "AI" },
  { name: "LangGraph", image: "https://avatars.githubusercontent.com/u/126733545?s=200&v=4", category: "AI" },
  { name: "ChromaDB", image: getIconUrl("python"), category: "Vector Database" },
  { name: "Next.js", image: getIconUrl("nextjs"), category: "Framework" },
  { name: "React 19", image: getIconUrl("react"), category: "Frontend" },
  { name: "Pandas", image: getIconUrl("pandas"), category: "Analytics" },
  { name: "Power BI", image: "https://img.icons8.com/color/48/000000/power-bi.png", category: "Analytics" },
  { name: "Google Apps Script", image: "https://img.icons8.com/color/48/000000/google-logo.png", category: "Automation" },
  { name: "Git", image: getIconUrl("git"), category: "Version Control" },
  { name: "Scikit-Learn", image: getIconUrl("scikitlearn"), category: "AI" },
];

export const CERTIFICATIONS = [
  {
    "id": 1,
    "title": "Agentic AI",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/S5I6BCYSILIY",
    "date": "Issued Sep 2026",
    "credentialId": "S5I6BCYSILIY"
  },
  {
    "id": 2,
    "title": "AI For Everyone",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/3CVVRLWGSUE0",
    "date": "Issued Sep 2026",
    "credentialId": "3CVVRLWGSUE0"
  },
  {
    "id": 3,
    "title": "Databases and SQL for Data Science with Python",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/OYC5TJBUO838",
    "date": "Issued Sep 2026",
    "credentialId": "OYC5TJBUO838"
  },
  {
    "id": 4,
    "title": "Python Project for Data Science",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/ZZ2FOIYCMHSD",
    "date": "Issued Sep 2026",
    "credentialId": "ZZ2FOIYCMHSD"
  },
  {
    "id": 5,
    "title": "Data Scientist Career Guide and Interview Preparation",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/YM099LB4SAA1",
    "date": "Issued Sep 2026",
    "credentialId": "YM099LB4SAA1"
  },
  {
    "id": 6,
    "title": "IBM Data Science",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/specialization/2FSRZALPXGGB",
    "date": "Issued Sep 2026",
    "credentialId": "2FSRZALPXGGB"
  },
  {
    "id": 7,
    "title": "Generative AI: Elevate Your Data Science Career",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/BZ98M46MFIGS",
    "date": "Issued Sep 2026",
    "credentialId": "BZ98M46MFIGS"
  },
  {
    "id": 8,
    "title": "Applied Data Science Capstone",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/B3SHKQHULHPO",
    "date": "Issued Sep 2026",
    "credentialId": "B3SHKQHULHPO"
  },
  {
    "id": 9,
    "title": "Data Visualization with Python",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/ROUFY7G700EG",
    "date": "Issued Sep 2026",
    "credentialId": "ROUFY7G700EG"
  },
  {
    "id": 10,
    "title": "Data Science Methodology",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/SLH9XS2AECAK",
    "date": "Issued Sep 2026",
    "credentialId": "SLH9XS2AECAK"
  },
  {
    "id": 11,
    "title": "Tools for Data Science",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/J7M4KNSNBW06",
    "date": "Issued Sep 2026",
    "credentialId": "J7M4KNSNBW06"
  },
  {
    "id": 12,
    "title": "AI Capstone Project with Deep Learning",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/UHSLGZTRRN55",
    "date": "Issued Sep 2026",
    "credentialId": "UHSLGZTRRN55"
  },
  {
    "id": 13,
    "title": "IBM AI Engineering",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/specialization/A6ZAKYWXF1N1",
    "date": "Issued Sep 2026",
    "credentialId": "A6ZAKYWXF1N1"
  },
  {
    "id": 14,
    "title": "Project: Generative AI Applications with RAG and LangChain",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/1GG2H0S0T0G2",
    "date": "Issued Sep 2026",
    "credentialId": "1GG2H0S0T0G2"
  },
  {
    "id": 15,
    "title": "Fundamentals of AI Agents Using RAG and LangChain",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/NJQQ3NSJA2RX",
    "date": "Issued Sep 2026",
    "credentialId": "NJQQ3NSJA2RX"
  },
  {
    "id": 16,
    "title": "Generative AI Advanced Fine-Tuning for LLMs",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/0A55KYD1AGYX",
    "date": "Issued Sep 2026",
    "credentialId": "0A55KYD1AGYX"
  },
  {
    "id": 17,
    "title": "Generative AI Engineering and Fine-Tuning Transformers",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/68TEQT2V64NV",
    "date": "Issued Sep 2026",
    "credentialId": "68TEQT2V64NV"
  },
  {
    "id": 18,
    "title": "Generative AI Language Modeling with Transformers",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/FNXI4Z2M1T2D",
    "date": "Issued Sep 2026",
    "credentialId": "FNXI4Z2M1T2D"
  },
  {
    "id": 19,
    "title": "Deep Learning with PyTorch",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/XIWK2ZSH9E0O",
    "date": "Issued Sep 2026",
    "credentialId": "XIWK2ZSH9E0O"
  },
  {
    "id": 20,
    "title": "Deep Learning with Keras and Tensorflow",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/D9AJ69BJTVXY",
    "date": "Issued Sep 2026",
    "credentialId": "D9AJ69BJTVXY"
  },
  {
    "id": 21,
    "title": "Introduction to Neural Networks and PyTorch",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/O6VN32HDO2YD",
    "date": "Issued Sep 2026",
    "credentialId": "O6VN32HDO2YD"
  },
  {
    "id": 22,
    "title": "Software Developer Career Guide and Interview Preparation",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/11K550AWLSIU",
    "date": "Issued Sep 2026",
    "credentialId": "11K550AWLSIU"
  },
  {
    "id": 23,
    "title": "Generative AI: Elevate your Software Development Career",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/ERB5IG6P3AVE",
    "date": "Issued Sep 2026",
    "credentialId": "ERB5IG6P3AVE"
  },
  {
    "id": 24,
    "title": "IBM Generative AI Engineering",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/specialization/8BPUAPJ8KX35",
    "date": "Issued Sep 2026",
    "credentialId": "8BPUAPJ8KX35"
  },
  {
    "id": 25,
    "title": "What is Data Science?",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/ZL9TUQA45HYD",
    "date": "Issued Sep 2026",
    "credentialId": "ZL9TUQA45HYD"
  },
  {
    "id": 26,
    "title": "Introduction to HTML, CSS, & JavaScript",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/0O8HU2SIOZY7",
    "date": "Issued Sep 2026",
    "credentialId": "0O8HU2SIOZY7"
  },
  {
    "id": 27,
    "title": "Introduction to Software Engineering",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/JWKG8VUSNC8N",
    "date": "Issued Sep 2026",
    "credentialId": "JWKG8VUSNC8N"
  },
  {
    "id": 28,
    "title": "Gen AI Foundational Models for NLP & Language Understanding",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/NALB1GJ5S3JN",
    "date": "Issued Sep 2026",
    "credentialId": "NALB1GJ5S3JN"
  },
  {
    "id": 29,
    "title": "Generative AI and LLMs: Architecture and Data Preparation",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/019KVKXI76VZ",
    "date": "Issued Sep 2026",
    "credentialId": "019KVKXI76VZ"
  },
  {
    "id": 30,
    "title": "Introduction to Deep Learning & Neural Networks with Keras",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/DUJMI26R9LX1",
    "date": "Issued Sep 2026",
    "credentialId": "DUJMI26R9LX1"
  },
  {
    "id": 31,
    "title": "Machine Learning with Python",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/9I4BFFNN3BQ0",
    "date": "Issued Sep 2026",
    "credentialId": "9I4BFFNN3BQ0"
  },
  {
    "id": 32,
    "title": "Data Analysis with Python",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/DCXYG8K5HHI4",
    "date": "Issued Sep 2026",
    "credentialId": "DCXYG8K5HHI4"
  },
  {
    "id": 33,
    "title": "Building Generative AI-Powered Applications with Python",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/PQ4LC8AJUIF3",
    "date": "Issued Sep 2026",
    "credentialId": "PQ4LC8AJUIF3"
  },
  {
    "id": 34,
    "title": "Developing AI Applications with Python and Flask",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/EWE1IA5DGGOX",
    "date": "Issued Sep 2026",
    "credentialId": "EWE1IA5DGGOX"
  },
  {
    "id": 35,
    "title": "Python for Data Science, AI & Development",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/HOK9BUH4F1VA",
    "date": "Issued Sep 2026",
    "credentialId": "HOK9BUH4F1VA"
  },
  {
    "id": 36,
    "title": "Generative AI: Prompt Engineering Basics",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/TOM33CP3L63Y",
    "date": "Issued Sep 2026",
    "credentialId": "TOM33CP3L63Y"
  },
  {
    "id": 37,
    "title": "Generative AI: Introduction and Applications",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/LYVVUEDA5HV2",
    "date": "Issued Sep 2026",
    "credentialId": "LYVVUEDA5HV2"
  },
  {
    "id": 38,
    "title": "Introduction to Artificial Intelligence (AI)",
    "issuer": "IBM",
    "image": "/logos/ibm.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/LTJIBU7Z5FU8",
    "date": "Issued Sep 2026",
    "credentialId": "LTJIBU7Z5FU8"
  },
  {
    "id": 39,
    "title": "Machine Learning Specialization",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/specialization/IG0XL4KNPSX1",
    "date": "Issued Sep 2026",
    "credentialId": "IG0XL4KNPSX1"
  },
  {
    "id": 40,
    "title": "Unsupervised Learning, Recommenders, Reinforcement Learning",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/EDDU99ED43EL",
    "date": "Issued Sep 2026",
    "credentialId": "EDDU99ED43EL"
  },
  {
    "id": 41,
    "title": "Advanced Learning Algorithms",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/GCD3H3009SGN",
    "date": "Issued Aug 2026",
    "credentialId": "GCD3H3009SGN"
  },
  {
    "id": 42,
    "title": "Supervised Machine Learning: Regression and Classification",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/825NJZXPVYX3",
    "date": "Issued Aug 2026",
    "credentialId": "825NJZXPVYX3"
  },
  {
    "id": 43,
    "title": "AI Fundamentals",
    "issuer": "Google",
    "image": "/logos/google.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/PHU39HLJPI2B",
    "date": "Issued Aug 2026",
    "credentialId": "PHU39HLJPI2B"
  },
  {
    "id": 44,
    "title": "Deep Learning Specialization",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/specialization/K3SWSSCECWON",
    "date": "Issued Aug 2026",
    "credentialId": "K3SWSSCECWON"
  },
  {
    "id": 45,
    "title": "Sequence Models",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/62TK2LTOBY4S",
    "date": "Issued Aug 2026",
    "credentialId": "62TK2LTOBY4S"
  },
  {
    "id": 46,
    "title": "Convolutional Neural Networks",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/KLHTZV4DRDM0",
    "date": "Issued Aug 2026",
    "credentialId": "KLHTZV4DRDM0"
  },
  {
    "id": 47,
    "title": "Structuring Machine Learning Projects",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/JIW25PKDJ676",
    "date": "Issued Aug 2026",
    "credentialId": "JIW25PKDJ676"
  },
  {
    "id": 48,
    "title": "Improving Deep Neural Networks: Hyperparameter Tuning, Regularization and Optimization",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/64ZF3D0IGOAO",
    "date": "Issued Aug 2026",
    "credentialId": "64ZF3D0IGOAO"
  },
  {
    "id": 49,
    "title": "Neural Networks and Deep Learning",
    "issuer": "DeepLearning.AI",
    "image": "/logos/deeplearning-ai.svg",
    "link": "https://www.coursera.org/account/accomplishments/records/7K7GW4JJ1G13",
    "date": "Issued Aug 2026",
    "credentialId": "7K7GW4JJ1G13"
  },
  {
    "id": 50,
    "title": "Prompt Engineering untuk Software Developer",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/QLZ9NDOMDZ5D",
    "date": "Issued Aug 2026",
    "credentialId": "QLZ9NDOMDZ5D"
  },
  {
    "id": 51,
    "title": "Belajar Penerapan Data Science dengan Microsoft Fabric",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/MRZMW2NOLPYQ",
    "date": "Issued Jul 2026",
    "credentialId": "MRZMW2NOLPYQ"
  },
  {
    "id": 52,
    "title": "Membangun Aplikasi Gen AI dengan Microsoft Azure",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/JLX1VN9JGZ72",
    "date": "Issued Jul 2026",
    "credentialId": "JLX1VN9JGZ72"
  },
  {
    "id": 53,
    "title": "Teaching the AI Fluency Framework",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/8gxdnvs7yvzu",
    "date": "Issued Jul 2026",
    "credentialId": "8gxdnvs7yvzu"
  },
  {
    "id": 54,
    "title": "Model Context Protocol: Advanced Topics",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/ug6vrg6nubsm",
    "date": "Issued Jul 2026",
    "credentialId": "ug6vrg6nubsm"
  },
  {
    "id": 55,
    "title": "Introduction to subagents",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/r85nvqp3n82g",
    "date": "Issued Jul 2026",
    "credentialId": "r85nvqp3n82g"
  },
  {
    "id": 56,
    "title": "Introduction to Model Context Protocol",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/ffcpwqn5nsms",
    "date": "Issued Jul 2026",
    "credentialId": "ffcpwqn5nsms"
  },
  {
    "id": 57,
    "title": "Introduction to Claude Cowork",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/fb9dby4zm4po",
    "date": "Issued Jul 2026",
    "credentialId": "fb9dby4zm4po"
  },
  {
    "id": 58,
    "title": "Introduction to agent skills",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/3mffh9ot6cfp",
    "date": "Issued Jul 2026",
    "credentialId": "3mffh9ot6cfp"
  },
  {
    "id": 59,
    "title": "Claude in Amazon Bedrock",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/6wt47bpyaifg",
    "date": "Issued Jul 2026",
    "credentialId": "6wt47bpyaifg"
  },
  {
    "id": 60,
    "title": "Claude Platform 101",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/oo6v4evrccpv",
    "date": "Issued Jul 2026",
    "credentialId": "oo6v4evrccpv"
  },
  {
    "id": 61,
    "title": "Claude on Google Cloud",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/m6p8ipzeqb9w",
    "date": "Issued Jul 2026",
    "credentialId": "m6p8ipzeqb9w"
  },
  {
    "id": 62,
    "title": "Claude Code in Action",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/7zqsxsrha62f",
    "date": "Issued Jul 2026",
    "credentialId": "7zqsxsrha62f"
  },
  {
    "id": 63,
    "title": "Claude Code 101",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/cs5zn2saqw3s",
    "date": "Issued Jul 2026",
    "credentialId": "cs5zn2saqw3s"
  },
  {
    "id": 64,
    "title": "Claude 101",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/m9hep9gaqqgn",
    "date": "Issued Jul 2026",
    "credentialId": "m9hep9gaqqgn"
  },
  {
    "id": 65,
    "title": "Building with the Claude API",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/pyh9a6sqb482",
    "date": "Issued Jul 2026",
    "credentialId": "pyh9a6sqb482"
  },
  {
    "id": 66,
    "title": "AI Fluency Framework & Foundations",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/m5cm3kejsubr",
    "date": "Issued Jul 2026",
    "credentialId": "m5cm3kejsubr"
  },
  {
    "id": 67,
    "title": "AI Fluency for students",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/gwafnew6wh7u",
    "date": "Issued Jul 2026",
    "credentialId": "gwafnew6wh7u"
  },
  {
    "id": 68,
    "title": "AI Fluency for Small Businesses",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/nw73bjcbzmbg",
    "date": "Issued Jul 2026",
    "credentialId": "nw73bjcbzmbg"
  },
  {
    "id": 69,
    "title": "AI Fluency for K-12 Educators",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/67j2icg5n8t6",
    "date": "Issued Jul 2026",
    "credentialId": "67j2icg5n8t6"
  },
  {
    "id": 70,
    "title": "AI Fluency for nonprofits",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/vynyfgka9kuv",
    "date": "Issued Jul 2026",
    "credentialId": "vynyfgka9kuv"
  },
  {
    "id": 71,
    "title": "AI Fluency for educators",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/2qtiqtwimyvg",
    "date": "Issued Jul 2026",
    "credentialId": "2qtiqtwimyvg"
  },
  {
    "id": 72,
    "title": "AI Fluency for Builders",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/oyguwu9enjbs",
    "date": "Issued Jul 2026",
    "credentialId": "oyguwu9enjbs"
  },
  {
    "id": 73,
    "title": "AI Capabilities and Limitations",
    "issuer": "Anthropic",
    "image": "/logos/anthropic.svg",
    "link": "https://verify.skilljar.com/c/sf7v22hhqjz2",
    "date": "Issued Jul 2026",
    "credentialId": "sf7v22hhqjz2"
  },
  {
    "id": 74,
    "title": "Career Management Essentials",
    "issuer": "Pijak in collaboration with IBM SkillsBuild",
    "image": "/logos/ibm.svg",
    "link": "https://www.credly.com/badges/4a7e62b2-5d6d-44c3-8e93-cf5cb7087b4b",
    "date": "Issued Dec 2025",
    "credentialId": "4a7e62b2-5d6d-44c3-8e93-cf5cb7087b4b"
  },
  {
    "id": 75,
    "title": "AI Security & Governance",
    "issuer": "Securiti AI",
    "image": "/logos/securiti-ai.svg",
    "link": "https://education.securiti.ai/verification/14B13C7E8-14B13A32F-144EF8768/",
    "date": "Issued Jul 2026",
    "credentialId": "14B13C7E8-14B13A32F-144EF8768"
  },
  {
    "id": 76,
    "title": "Belajar Dasar Visualisasi Data",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/QLZ941NY7P5D",
    "date": "Issued Dec 2023",
    "credentialId": "QLZ941NY7P5D"
  },
  {
    "id": 77,
    "title": "Belajar Analisis Data dengan Python",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/GRX52E7ERX0M",
    "date": "Issued Oct 2023",
    "credentialId": "GRX52E7ERX0M"
  },
  {
    "id": 78,
    "title": "Microsoft Excel",
    "issuer": "MySkill",
    "image": "/logos/myskill.svg",
    "link": "https://storage.googleapis.com/myskill-v2-certificates/learning-path-kpIIH7ZvWgW3muNNmC1V/1L3U2pxG95SYDqJeWU826bAsGLn2-iJSQ2XkoAtkIt8JfWW9v.pdf",
    "date": "Issued Aug 2023",
    "credentialId": "MS-12/8/2023-iJSQ2XkoAtkIt8JfWW9v"
  },
  {
    "id": 79,
    "title": "Google Analytics Certification",
    "issuer": "Google Digital Academy (Skillshop)",
    "image": "/logos/google.svg",
    "link": "https://skillshop.exceedlms.com/student/award/a31oSo7NkTXipXtJfDb5eR3E",
    "date": "Issued Oct 2023",
    "credentialId": "177278382"
  },
  {
    "id": 80,
    "title": "Belajar Machine Learning untuk Pemula",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/98XWV4O7LPM3",
    "date": "Issued Sep 2023",
    "credentialId": "98XWV4O7LPM3"
  },
  {
    "id": 81,
    "title": "Memulai Pemrograman dengan Python",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/98XWVRM4LPM3",
    "date": "Issued Sep 2023",
    "credentialId": "98XWVRM4LPM3"
  },
  {
    "id": 82,
    "title": "Belajar Dasar Data Science",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/QLZ9RK5QEP5D",
    "date": "Issued Sep 2023",
    "credentialId": "QLZ9RK5QEP5D"
  },
  {
    "id": 83,
    "title": "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/JMZV98G6NPN9",
    "date": "Issued Jul 2023",
    "credentialId": "JMZV98G6NPN9"
  },
  {
    "id": 84,
    "title": "Belajar Dasar Structured Query Language",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/81P23MG9YXOY",
    "date": "Issued Jul 2023",
    "credentialId": "81P23MG9YXOY"
  },
  {
    "id": 85,
    "title": "Belajar Dasar Pemrograman JavaScript",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/RVZKO5KO4PD5",
    "date": "Issued Jul 2023",
    "credentialId": "RVZKO5KO4PD5"
  },
  {
    "id": 86,
    "title": "Belajar Dasar Manajemen Proyek",
    "issuer": "Dicoding Indonesia",
    "image": "/logos/dicoding.svg",
    "link": "https://www.dicoding.com/certificates/EYX46M2LWPDL",
    "date": "Issued Jul 2023",
    "credentialId": "EYX46M2LWPDL"
  },
  {
    "id": 87,
    "title": "Certificate of Excellence (Awarded Best Intern)",
    "issuer": "Kawan Lama Group",
    "image": "/logos/kawan-lama.svg",
    "link": "https://www.linkedin.com/in/william-oo00/overlay/1743496220514/single-media-viewer/?profileId=ACoAAD2slAoBjkl94d--TrheKOVwxTXqS41kD8E",
    "date": "Issued Feb 2025",
    "credentialId": "KLG-MDM-BEST-INTERN-2025"
  }
];

export const REMOTE_BACKGROUNDS = {
  hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", 
  about: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop", 
  skills: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", 
  experience: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", 
  projects: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
  certifications: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop", 
  contact: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=2071&auto=format&fit=crop" 
};

export const LOCAL_BACKGROUNDS = {
  hero: "/assets/hero.jpg",
  about: "/assets/about.jpg",
  skills: "/assets/skills.jpg",
  experience: "/assets/experience.jpg",
  projects: "/assets/projects.jpg",
  certifications: "/assets/certifications.jpg",
  contact: "/assets/contact.jpg"
};

export const HERO_VIDEOS = {
  light: "/assets/hero-light.mp4",
  dark: "/assets/hero-dark.mp4"
};

// Execute runtime validation check to detect any data schema drift
try {
  validatePortfolioData({
    PERSONAL_INFO,
    EXPERIENCE,
    PROJECTS,
    SKILL_CATEGORIES,
    SKILLS,
    CERTIFICATIONS,
    REMOTE_BACKGROUNDS,
    LOCAL_BACKGROUNDS,
    HERO_VIDEOS
  });
} catch (error) {
  const isDev = Boolean(
    (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
    (typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV !== 'production')
  );
  if (isDev) {
    console.warn("Portfolio data validation notice:", error.message);
  }
}
