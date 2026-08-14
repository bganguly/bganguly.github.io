    // ── Access-gate config (EmailJS) ─────────────────────────────────────
    // IDs live in localStorage only — nothing is ever committed to source.
    // One-time setup: visit this page with ?setup in the URL, fill the prompts.
    // Template variables: {{from_email}}, {{project}}, {{requested}}
    (function () {
      const params = new URLSearchParams(location.search);
      const s = params.get('s'); if (s) localStorage.setItem('ejs_service',  s);
      const t = params.get('t'); if (t) localStorage.setItem('ejs_template', t);
      const k = params.get('k'); if (k) localStorage.setItem('ejs_key',      k);
      const e = params.get('e'); if (e) localStorage.setItem('ejs_contact',  e);
      if (s || t || k || e) history.replaceState({}, '', location.pathname);
      const key = localStorage.getItem('ejs_key');
      if (key) emailjs.init({ publicKey: key });
    })();

    function _ejsCfg() {
      return {
        service:  localStorage.getItem('ejs_service')  || '',
        template: localStorage.getItem('ejs_template') || '',
        key:      localStorage.getItem('ejs_key')      || '',
        contact:  localStorage.getItem('ejs_contact')  || '',
      };
    }

    const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);

    const LOCAL_LIVE = {};

    async function requestAccess(event, projectKey, label) {
      event.preventDefault();
      const form  = event.target;
      const btn   = form.querySelector('button[type="submit"]');
      const email = form.querySelector('input[type="email"]').value.trim();
      const cfg   = _ejsCfg();
      if (!cfg.service || !cfg.template || !cfg.key) {
        const addr = cfg.contact ? `Email me at ${cfg.contact}` : 'Contact me directly';
        form.innerHTML = `<p style="font-size:0.72rem;color:#6ee7b7;padding:4px 0">${addr} to request access.</p>`;
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending…';
      try {
        await emailjs.send(cfg.service, cfg.template, {
          from_email: email, project: projectKey, requested: label,
        });
        form.innerHTML = `<p style="font-size:0.72rem;color:#6ee7b7;padding:4px 0">Request sent — I'll reach out directly.</p>`;
      } catch {
        btn.disabled = false;
        btn.textContent = 'Try again';
        const addr = cfg.contact ? `email me at ${cfg.contact}` : 'contact me directly';
        form.insertAdjacentHTML('beforeend',
          `<p style="font-size:0.68rem;color:#f87171;margin-top:4px">Could not send — ${addr}</p>`);
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    const GH = 'https://github.com/bganguly';

    const projects = {
      rag_pgvector: {
        title: 'RAG + pgvector Demo (GCP)',        subtitle: 'LangChain · pgvector · Vercel AI SDK · NVIDIA NIM',
        description: 'Ingest any unstructured text → chunk via LangChain RecursiveCharacterTextSplitter → embed via OpenAI → store in pgvector. Questions trigger cosine-similarity retrieval; answers stream token-by-token via Vercel AI SDK streamText. Provider toggle in the UI switches between Anthropic, OpenAI, and NVIDIA NIM (Nemotron) — same interface, just a base_url swap. FastAPI handles all vector operations; Next.js API routes handle LLM streaming.',
        accentClass: 'text-blue-400',
        frontend: {
          label: 'App',          color: 'blue',
          title: 'Next.js 15 · Vercel AI SDK · Token SSE',
          chips: ['Next.js 15', 'Vercel AI SDK', 'streamText', 'Provider toggle', 'Tailwind'],
          localUrl: 'http://localhost:3010',
          liveLabel: 'Open App',
          remoteUrl: 'https://frontend-sigma-ten-30.vercel.app',
          healthPath: '/api/health',
          githubUrl: GH + '/rag-pgvector-demo',
        },
        backend: {
          label: 'API',          color: 'emerald',
          title: 'FastAPI · LangChain · pgvector · Redis',
          chips: ['FastAPI', 'LangChain', 'pgvector', 'OpenAI embeddings', 'Redis', 'Docker'],
          localUrl: 'http://localhost:8001/docs',
          liveLabel: 'API Explorer',
          remoteUrl: 'https://frontend-sigma-ten-30.vercel.app/api-explorer.html',
          githubUrl: GH + '/rag-pgvector-demo',
        },
        githubUrl: GH + '/rag-pgvector-demo',
      },
      clickhouse: {
        title: 'ClickHouse Dashboard — AWS',        subtitle: 'Next.js 16 · ClickHouse Cloud · Materialized Views · SSE · App Runner',
        description: 'Full-stack Next.js dashboard backed by ClickHouse Cloud. Aggregates maintained at INSERT time by four Materialized Views into SummingMergeTree tables — no worker process, no dual-write gap. Full-text search via positionCaseInsensitive on a denormalized searchText column; keyset cursor pagination for efficient deep pages. Real-time order events via in-process Node.js EventEmitter → SSE. Infra: App Runner (scale-to-zero) + CloudFront managed by Terraform; ClickHouse Cloud service lifecycle managed by deploy.sh via CH Cloud API.',
        accentClass: 'text-sky-400',
        cloud: {
          label: 'Cloud Provider',
          color: 'aws',
          title: 'AWS · App Runner + CloudFront',
          chips: ['App Runner', 'CloudFront', 'Terraform', 'GitHub Actions'],
          liveLabel: 'Open Live App',
        },
        backend: {
          label: 'API',          color: 'sky',
          title: 'Next.js API routes · ClickHouse Cloud',
          chips: ['ClickHouse Cloud', '@clickhouse/client', 'Materialized Views', 'SSE · EventEmitter'],
          liveLabel: 'API Explorer',
          remoteUrl: 'https://d1n8zhx1j8oymk.cloudfront.net/api-explorer',
          localUrl: 'http://localhost:3004/api-explorer',
          githubUrl: GH + '/clickhouse-dashboard',
        },
        frontend: {
          label: 'App',          color: 'indigo',
          title: 'Next.js 16.2 · TypeScript 5.9 · Recharts',
          chips: ['Next.js 16.2', 'React 19', 'TypeScript 5.9', 'Tailwind CSS v4', 'Recharts', 'SSE'],
          liveLabel: 'Open App',
          remoteUrl: 'https://d1n8zhx1j8oymk.cloudfront.net',
          healthPath: '/api/ch-warmup',
          localUrl: 'http://localhost:3004',
          githubUrl: GH + '/clickhouse-dashboard',
        },
        githubUrl: GH + '/clickhouse-dashboard',
      },
      edgar_10k_agent: {
        title: 'EDGAR 10-K Agent',        subtitle: 'Agent Loop · Tool Use · live EDGAR retrieval · Anthropic Claude · NVIDIA NIM · Eval',
        description: 'Agentic loop written from scratch — no LangChain, no pre-ingested data. The model decides at runtime when and how to invoke SEC EDGAR tools; each call fetches live 10-K filings, extracts specific sections (Risk Factors, MD&A, financials), and parses structured figures. Multi-turn reasoning continues until a final answer is emitted. An eval harness benchmarks answer quality (faithfulness, completeness, citation accuracy) across providers. FastAPI streams every tool-call event and token to the React UI via SSE. Provider toggle switches between Anthropic Claude and NVIDIA NIM — same agent loop, same tools, different model.',
        accentClass: 'text-indigo-400',
        frontend: {
          label: 'App',          color: 'indigo',
          title: 'React · Vite · live tool-call stream',
          chips: ['React', 'Vite', 'SSE', 'tool-call events', 'TypeScript'],
          localUrl: 'http://localhost:5173',
          liveLabel: 'Open App',
          remoteUrl: 'https://edgar-frontend-77y7e2wykq-uc.a.run.app',
          githubUrl: GH + '/edgar-agent',
        },
        backend: {
          label: 'API',          color: 'emerald',
          title: 'FastAPI · agent loop · EDGAR tools · Eval',
          chips: ['FastAPI', 'Agent Loop', 'Tool Use', 'SEC EDGAR API', 'Anthropic', 'NVIDIA NIM', 'Eval harness'],
          localUrl: 'http://localhost:5173/api-explorer.html',
          liveLabel: 'API Explorer',
          remoteUrl: 'https://edgar-frontend-77y7e2wykq-uc.a.run.app/api-explorer',
          githubUrl: GH + '/edgar-agent',
        },
        githubUrl: GH + '/edgar-agent',
      },
      multi_agent: {
        title: 'Multi-Agent Orchestration (GCP)',        subtitle: 'LangGraph · 20-agent pipeline · React Flow DAG · MCP server',
        description: '17-node LangGraph pipeline for complex queries: planner → 10 parallel specialist researchers → collect barrier → 4 domain synthesizers → fact-check → report writer. Simple queries short-circuit to 4 nodes. Each SSE event carries node/label/layer/parent for live React Flow DAG layout — nodes pulse while running, turn green on completion. Tools exposed as an MCP server (stdio) for Claude Desktop. GKE mode available alongside Cloud Run.',
        accentClass: 'text-amber-400',
        frontend: {
          label: 'App',          color: 'amber',
          title: 'Next.js 15 · React Flow DAG · SSE',
          chips: ['Next.js 15', 'React Flow', 'SSE live DAG', 'TypeScript'],
          localUrl: 'http://localhost:3011',
          liveLabel: 'Open App',
          remoteUrl: 'https://agent-frontend-77y7e2wykq-uc.a.run.app',
          githubUrl: GH + '/agent-orchestration-demo',
        },
        backend: {
          label: 'API',          color: 'emerald',
          title: 'FastAPI · LangGraph · MCP server',
          chips: ['FastAPI', 'LangGraph', 'MCP server', 'Wikipedia', 'DuckDuckGo', 'Anthropic'],
          localUrl: 'http://localhost:8002/docs',
          liveLabel: 'API Explorer',
          requestAccessOnly: true,
          githubUrl: GH + '/agent-orchestration-demo',
        },
        githubUrl: GH + '/agent-orchestration-demo',
      },
      sec_edgar_rag: {
        title: 'SEC EDGAR RAG Demo',        subtitle: 'SEC 10-K / 10-Q · pgvector · LangChain · 4 LLM providers · Vercel AI SDK',
        description: 'Index SEC 10-K / 10-Q filings by ticker and date range, then ask cross-filing questions with grounded LLM answers. OpenAI text-embedding-3-small embeddings (fixed at ingest and query time) stored in pgvector via cosine similarity. Runtime provider toggle across Anthropic, OpenAI, Google, and NVIDIA NIM — same interface, just a base_url swap. FastAPI + Mangum handles all vector operations and is Lambda-compatible; Next.js API routes handle LLM streaming via Vercel AI SDK streamText.',
        accentClass: 'text-teal-400',
        cloud: {
          label: 'Cloud Provider',
          color: 'aws',
          title: 'AWS Lambda + Neon + Vercel',
          chips: ['Lambda', 'Neon pgvector', 'Vercel', 'Terraform', 'GitHub Actions'],
          liveLabel: 'Open Live App',
        },
        frontend: {
          label: 'App',          color: 'teal',
          title: 'Next.js 15 · Vercel AI SDK · Token SSE',
          chips: ['Next.js 15', 'React 19', 'Vercel AI SDK', 'streamText', 'TypeScript 5.7', 'Tailwind'],
          localUrl: 'http://localhost:3011',
          liveLabel: 'Open App',
          requestAccessOnly: true,
          githubUrl: GH + '/edgar-rag-demo',
        },
        backend: {
          label: 'API',          color: 'emerald',
          title: 'FastAPI · LangChain · pgvector · Mangum',
          chips: ['FastAPI 0.115', 'LangChain', 'pgvector', 'OpenAI embeddings', 'Mangum', 'SEC EDGAR API'],
          localUrl: 'http://localhost:8002/docs',
          liveLabel: 'API Explorer',
          requestAccessOnly: true,
          githubUrl: GH + '/edgar-rag-demo',
        },
        githubUrl: GH + '/edgar-rag-demo',
      },
      orders_dashboard: {
        title: 'Orders Dashboard — GCP',
        subtitle: 'millions of orders · sub-second search · serverless autoscaling',
        description: 'Two independent GCP Cloud Run services — a Vite/React 19.2 SPA proxying /api/* to a Spring Boot 4.1 REST API via Nginx BFF. Schema migrations in Flyway 12, secrets in GCP Secret Manager, all infra declared in Pulumi TypeScript.',
        accentClass: 'text-violet-400',
        cloud: {
          label: 'Cloud Provider',
          color: 'gcp',
          title: 'GCP · Cloud Run',
          chips: ['Cloud Run', 'GCE Postgres VM', 'Secret Manager', 'Artifact Registry', 'Pulumi IaC'],
          liveLabel: 'Open Live App',
        },
        // Local port assignments — all stored in project config, no CLI args needed:
        //   frontend  → 3006  (Vite strictPort in dashboard-frontend-gcp/vite.config.ts)
        //   backend   → 8080  (deploy.sh; run: ./scripts/deploy.sh)
        backend: {
          label: 'API',          color: 'emerald',
          title: 'Spring Boot 4.1 · Java 21',
          chips: ['Spring Boot 4.1', 'Java 21', 'Flyway 12.4', 'REST API'],
          liveLabel: 'API Explorer',          localUrl: 'http://localhost:8080/explorer.html',
          requestAccessOnly: true,
          githubUrl: GH + '/springboot-dashboard-backend',
        },
        frontend: {
          label: 'Frontend',          color: 'blue',
          title: 'React 19.2 + Vite 6.4',
          chips: ['React 19.2', 'TypeScript 5.9', 'Vite 6.4', 'Recharts 3.9'],
          liveLabel: 'Open App',          localUrl: 'http://localhost:3006',
          requestAccessOnly: true,
          githubUrl: GH + '/dashboard-frontend',
        },
        githubUrl: GH,
      },
      nextjs_dashboard: {
        title: 'Next.js Dashboard — AWS',
        subtitle: 'Full-stack · realtime · Postgres 16',
        description: 'Explores Next.js as a unified full-stack platform: UI, realtime updates, and database-backed search all in one AWS-hosted service. Acts as an architectural comparison to the split-service GCP approach. Hosted on App Runner (scale-to-zero, wakes in ~15–30 s).',
        accentClass: 'text-indigo-400',
        cloud: {
          label: 'Cloud Provider',
          color: 'aws',
          title: 'AWS · App Runner',
          chips: ['App Runner', 'AWS RDS PG 16', 'Terraform', 'GitHub Actions'],
          liveLabel: 'Open Live App',
        },
        backend: {
          label: 'API',          color: 'slate',
          title: 'PostgreSQL 16 · Prisma',
          chips: ['PostgreSQL 16', 'Prisma', 'SSE'],
          liveLabel: 'API Explorer',          localUrl: 'http://localhost:3004/api-explorer',
          requestAccessOnly: true,
          githubUrl: GH + '/nextjs-dashboard',
        },
        frontend: {
          label: 'Frontend',          color: 'indigo',
          title: 'Next.js 16.2 · TypeScript 5.9',
          chips: ['Next.js 16.2', 'TypeScript 5.9', 'Tailwind CSS 4.3', 'RSC'],
          liveLabel: 'Open App',          localUrl: 'http://localhost:3004',
          requestAccessOnly: true,
          githubUrl: GH + '/nextjs-dashboard',
        },
        githubUrl: GH + '/nextjs-dashboard',
      },
      nl_to_sql: {
        title: 'NL-to-SQL Comparison',        subtitle: 'Anthropic · OpenAI · DuckDB-WASM · H1B LCA data',
        description: 'Compares natural-language-to-SQL generation across Anthropic and OpenAI models, executing generated SQL in-browser via DuckDB-WASM against a Parquet dataset of DOL H1B LCA disclosures. Schema is auto-detected from Parquet metadata; no backend required.',
        accentClass: 'text-violet-400',
        frontend: {
          label: 'App',          color: 'violet',
          title: 'React 19 · Vite · DuckDB-WASM',
          chips: ['React 19', 'Vite', 'DuckDB-WASM', 'Anthropic', 'OpenAI', 'Parquet'],
          liveLabel: 'Open App',
          remoteUrl: 'https://natural-language-to-llm-query-comparison.vercel.app/nl-to-sql/',
          localUrl: 'http://localhost:5173/nl-to-sql/',
          githubUrl: GH + '/natural-language-to-llm-query-comparison',
          apiKeyNote: 'Requires Anthropic &amp; OpenAI API keys',
        },
        githubUrl: GH + '/natural-language-to-llm-query-comparison',
      },
      phi_deidentification: {
        title: 'PHI De-identification Pipeline',        subtitle: 'spaCy · Claude Haiku 4.5 · FastAPI · Celery · Redis · PostgreSQL',
        description: 'Healthcare PHI detection and synthetic substitution pipeline. spaCy biomedical NER (en_core_sci_md) handles ~90% of records as tier-1; Claude Haiku 4.5 covers ambiguous fallbacks. Each detected entity (name, SSN, MRN, date, phone, email, location) is replaced with a Faker-generated synthetic equivalent — not blank redaction — preserving analytical signal. SHA-256 hashes of originals stored in a PostgreSQL redaction log for auditing. Full observability: structured JSON logs, Prometheus metrics, OpenTelemetry traces → Jaeger. The browser demo runs Claude directly for PHI detection; full pipeline adds spaCy tier-1 + Celery workers.',
        accentClass: 'text-teal-400',
        frontend: {
          label: 'Pipeline',          color: 'teal',
          title: 'Architecture · Trace · Example',
          chips: ['spaCy tier-1', 'Claude Haiku 4.5', 'OTel → Jaeger', 'Synthetic substitution'],
          liveLabel: 'View Pipeline',
          requestAccessOnly: true,
          githubUrl: GH + '/phi-deidentification-pipeline',
        },
        backend: {
          label: 'Demo',          color: 'emerald',
          title: 'Browser Demo — Claude Haiku 4.5',
          chips: ['claude-haiku-4-5', 'PHI detection', 'SHA-256 audit log'],
          liveLabel: 'Open Demo',          localUrl: 'http://localhost:8000/docs',
          requestAccessOnly: true,
          githubUrl: GH + '/phi-deidentification-pipeline',
        },
        extra: {
          label: 'Batch Run',          color: 'amber',
          title: '50 Records · 3 Workers · Live',
          chips: ['real-time progress', 'parallel workers', 'fast vs Claude trace'],
          liveLabel: 'Run Batch',
          requestAccessOnly: true,
          githubUrl: GH + '/phi-deidentification-pipeline',
        },
        githubUrl: GH + '/phi-deidentification-pipeline',
      },
      event_pipeline: {
        title: 'Event Pipeline — AWS',
        subtitle: 'Lambda · SNS → SQS · DynamoDB · polling UI',
        description: 'Event-driven async pipeline deployed with Serverless Framework. React polls a job status endpoint while Lambda functions process jobs through SNS fan-out → SQS consumption, with DynamoDB tracking state transitions.',
        accentClass: 'text-teal-400',
        cloud: {
          label: 'Cloud Provider',
          color: 'aws',
          title: 'AWS Serverless',
          chips: ['Lambda', 'API Gateway', 'SNS', 'SQS', 'DynamoDB'],
          liveLabel: 'Open Live App',
        },
        // Local ports — frontend 3010 (Vite strictPort in vite.config.ts),
        // backend 3011 (serverless-offline httpPort in serverless.yml; run: npx sls offline).
        // Backend is event-driven (SNS→SQS→Lambda) — no directly testable HTTP artifact; no localUrl.
        backend: {
          label: 'API',          color: 'teal',
          title: 'Lambda · SNS/SQS',
          chips: ['AWS Lambda', 'SNS → SQS', 'Serverless 4.13'],
          liveLabel: 'API Explorer',
          remoteUrl: 'https://d3nbn0s3ea4m39.cloudfront.net/api-explorer.html',
          githubUrl: GH + '/react-typescript-serverless',
        },
        frontend: {
          label: 'Frontend',          color: 'blue',
          title: 'React 19.2 · Vite 5.4',
          chips: ['React 19.2', 'TypeScript 5.8', 'Vite 5.4', 'API Gateway', 'Job polling UI'],
          liveLabel: 'Open App',
          remoteUrl: 'https://d3nbn0s3ea4m39.cloudfront.net',
          localUrl: 'http://localhost:3010',
          githubUrl: GH + '/react-typescript-serverless',
        },
        githubUrl: GH + '/react-typescript-serverless',
      },
      job_runner: {
        title: 'Job Runner — AWS',
        subtitle: 'React 19.2 · Spring Boot 4.1 · CloudFront · GitHub Actions',
        description: 'AWS-native architecture: React SPA served via CloudFront, Spring Boot containerised on ECS Fargate, async job processing with DynamoDB + SQS. GitHub Actions builds and pushes container images to ECR on every commit.',
        accentClass: 'text-amber-400',
        cloud: {
          label: 'Cloud Provider',
          color: 'aws',
          title: 'AWS',
          chips: ['ECS Fargate', 'CloudFront', 'GitHub Actions', 'DynamoDB', 'SQS'],
          liveLabel: 'Open Live App',
        },
        // Local ports — frontend 3008 (Vite strictPort in vite.config.ts),
        // backend 3009 (application-local.yml; run: SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run).
        // Backend has no directly testable HTTP artifact — no localUrl.
        backend: {
          label: 'API',          color: 'amber',
          title: 'Spring Boot 4.1 · Java 21 · ECS Fargate',
          chips: ['Spring Boot 4.1', 'Java 21', 'ECS Fargate'],
          liveLabel: 'API Explorer',
          requestAccessOnly: true,
          githubUrl: GH + '/react-springboot-fargate',
        },
        frontend: {
          label: 'Frontend',          color: 'blue',
          title: 'React 19.2 · CloudFront',
          chips: ['React 19.2', 'TypeScript 5.8', 'S3', 'CloudFront'],
          liveLabel: 'Open App',
          remoteUrl: 'https://d3gn54w27kjodk.cloudfront.net',
          localUrl: 'http://localhost:3008',
          githubUrl: GH + '/react-springboot-fargate',
        },
        githubUrl: GH + '/react-springboot-fargate',
      },
    };

    // Probe each project's live URLs at page load (no-cors HEAD, 8 s timeout).
    (function () {
      function probe(url, onSuccess) {
        const ctrl   = new AbortController();
        const origin = new URL(url).origin;
        const timer  = setTimeout(() => ctrl.abort(), 5000);
        fetch(origin + '/?_=' + Date.now(), { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
          .then(onSuccess).catch(() => {}).finally(() => clearTimeout(timer));
      }

      // Local probes: keyed by origin (host+port) so a sub-path localUrl like
      // localhost:3004/api-explorer shares the same live status as localhost:3004.
      if (isLocal) {
        const seen = new Set();
        Object.values(projects).forEach(p => {
          [p.frontend?.localUrl, p.backend?.localUrl].filter(Boolean).forEach(url => {
            const origin = new URL(url).origin;
            if (seen.has(origin)) return;
            seen.add(origin);
            LOCAL_LIVE[origin] = false;
            probe(url, () => {
              LOCAL_LIVE[origin] = true;
              if (_mt === 'local' && _mk) { const el = document.getElementById('modal-body'); if (el) el.innerHTML = _tierBarHtml() + _panelsHtml(projects[_mk]); }
            });
          });
        });
      }

    })();

    const colorMap = {
      gcp:     { bg: 'rgba(251,146,60,0.08)',  border: 'rgba(251,146,60,0.25)',  chip: 'bg-orange-500/10 text-orange-300 border-orange-500/20',  btn: 'rgba(251,146,60,0.18)',  btnBorder: 'rgba(251,146,60,0.45)',  btnText: '#fdba74', label: 'text-orange-400' },
      aws:     { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  chip: 'bg-amber-500/10 text-amber-300 border-amber-500/20',    btn: 'rgba(245,158,11,0.18)',  btnBorder: 'rgba(245,158,11,0.45)',  btnText: '#fcd34d', label: 'text-amber-400' },
      blue:    { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)',   chip: 'bg-blue-500/10 text-blue-300 border-blue-500/20',        btn: 'rgba(59,130,246,0.15)',  btnBorder: 'rgba(59,130,246,0.35)',  btnText: '#93c5fd', label: 'text-blue-400' },
      emerald: { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',   chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',btn: 'rgba(16,185,129,0.15)', btnBorder: 'rgba(16,185,129,0.35)', btnText: '#6ee7b7', label: 'text-emerald-400' },
      indigo:  { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)',   chip: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',   btn: 'rgba(99,102,241,0.15)',  btnBorder: 'rgba(99,102,241,0.35)',  btnText: '#a5b4fc', label: 'text-indigo-400' },
      amber:   { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',   chip: 'bg-amber-500/10 text-amber-300 border-amber-500/20',     btn: 'rgba(245,158,11,0.15)',  btnBorder: 'rgba(245,158,11,0.35)',  btnText: '#fcd34d', label: 'text-amber-400' },
      teal:    { bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.2)',   chip: 'bg-teal-500/10 text-teal-300 border-teal-500/20',        btn: 'rgba(20,184,166,0.15)',  btnBorder: 'rgba(20,184,166,0.35)',  btnText: '#5eead4', label: 'text-teal-400' },
      slate:   { bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.2)',  chip: 'bg-slate-500/10 text-slate-300 border-slate-500/20',    btn: 'rgba(100,116,139,0.15)', btnBorder: 'rgba(100,116,139,0.35)', btnText: '#cbd5e1', label: 'text-slate-400' },
      violet:  { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.2)',   chip: 'bg-violet-500/10 text-violet-300 border-violet-500/20',  btn: 'rgba(139,92,246,0.15)',  btnBorder: 'rgba(139,92,246,0.35)',  btnText: '#c4b5fd', label: 'text-violet-400' },
      sky:     { bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.2)',   chip: 'bg-sky-500/10 text-sky-300 border-sky-500/20',           btn: 'rgba(14,165,233,0.15)',  btnBorder: 'rgba(14,165,233,0.35)',  btnText: '#7dd3fc', label: 'text-sky-400' },
      cyan:    { bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.2)',    chip: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',         btn: 'rgba(6,182,212,0.15)',   btnBorder: 'rgba(6,182,212,0.35)',   btnText: '#67e8f9', label: 'text-cyan-400' },
    };

    const githubIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`;
    const arrowIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>`;

    const _tierStyles = {
      remote: { bg: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.3)',  text: '#38bdf8' },
      local:  { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8' },
    };

    // ── Modal tier state ──────────────────────────────────────────────────────
    let _mk  = null;   // current modal project key
    let _mt  = null;   // selected tier: 'local' | 'remote'
    let _mht = null;   // available tiers: { local, remote }

    function _detectTiers(p) {
      const panels = [p.frontend, p.backend, p.extra].filter(Boolean);
      return {
        local:  panels.some(c => !!c.localUrl),
        remote: true,
      };
    }

    function _defaultTier(hasTier) {
      return hasTier.remote ? 'remote' : 'local';
    }

    function _tierBarHtml() {
      const defs = [
        { key: 'local',  label: 'LOCAL'  },
        { key: 'remote', label: 'REMOTE' },
      ];
      const tabs = defs.map(({ key, label }) => {
        const selected = _mt === key;
        const ts = _tierStyles[key] || _tierStyles.remote;
        const bg  = selected ? ts.bg     : 'transparent';
        const bdr = selected ? ts.border  : 'rgba(255,255,255,0.1)';
        const clr = selected ? ts.text    : '#71717a';
        const dot = selected ? ts.text    : '#3f3f46';
        return `<button onclick="switchModalTier('${key}')" style="display:inline-flex;align-items:center;gap:5px;padding:5px 14px;border-radius:6px;font-size:0.65rem;font-weight:700;letter-spacing:0.08em;background:${bg};border:1px solid ${bdr};color:${clr};cursor:pointer;transition:all 0.12s"><span style="width:5px;height:5px;border-radius:50%;background:${dot};flex-shrink:0"></span>${label}</button>`;
      }).join('');
      return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:14px;padding:5px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;flex-wrap:wrap">${tabs}</div>`;
    }

    function _panelsHtml(p) {
      const all = [
        p.frontend ? { c: p.frontend, id: _mk + '-frontend' } : null,
        p.backend  ? { c: p.backend,  id: _mk + '-backend'  } : null,
        p.extra    ? { c: p.extra,    id: _mk + '-extra'    } : null,
      ].filter(Boolean);
      const localMode = _mt === 'local';
      return `<div class="flex gap-3 mb-4">${all.map(({ c, id }) => smallPanelHtml(c, id, localMode)).join('')}</div>`;
    }

    // Re-probe this project's local origins; calls cb() once all settle
    function _reprobe(key, cb) {
      const p = projects[key];
      const urls = [p.frontend?.localUrl, p.backend?.localUrl, p.extra?.localUrl].filter(Boolean);
      const origins = [...new Set(urls.map(u => new URL(u).origin))];
      if (!origins.length) return;
      let pending = origins.length;
      origins.forEach(origin => {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        fetch(origin + '/?_=' + Date.now(), { method: 'GET', mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
          .then(() => { LOCAL_LIVE[origin] = true; })
          .catch(() => { LOCAL_LIVE[origin] = false; })
          .finally(() => { clearTimeout(t); if (--pending === 0) cb(); });
      });
    }

    function _renderModalBody() {
      const el = document.getElementById('modal-body');
      if (!el) return;
      el.innerHTML = _tierBarHtml() + _panelsHtml(projects[_mk]);
      const cl = document.getElementById('modal-cloud');
      if (!cl) return;
      const p = projects[_mk];
      if (_mt === 'local') {
        cl.innerHTML = `<div style="border-radius:12px;padding:14px 16px;background:rgba(100,116,139,0.08);border:1px solid rgba(100,116,139,0.2)"><p style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;margin-bottom:4px">Local</p><p style="font-size:0.8rem;color:#94a3b8">All services run on your machine — no cloud account needed.</p></div>`;
      } else {
        cl.innerHTML = p.cloud ? cloudPanelHtml(p.cloud) : '';
      }
    }

    function switchModalTier(tier) {
      _mt = tier;
      _renderModalBody();
      // Re-probe on LOCAL select so link activates as soon as server is confirmed up
      if (tier === 'local' && isLocal) {
        _reprobe(_mk, () => { if (_mt === 'local') _renderModalBody(); });
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

    function _inScheduleWindow(_w) { return true; }

    function _nextScheduleSlot(_w) { return '';
    }

    function _reqAccessHtml(projectKey, c, col) {
      if (!c.liveLabel) return '';
      const inputStyle  = `background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e4e4e7;border-radius:6px;padding:5px 9px;font-size:0.75rem;outline:none;min-width:0;flex:1`;
      const submitStyle = `background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText};border-radius:6px;padding:5px 11px;font-size:0.72rem;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0`;
      const headingStyle = `font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${col.btnText};opacity:0.7;margin-bottom:2px`;
      return `<form onsubmit="requestAccess(event,'${projectKey}','${c.liveLabel}')" style="display:flex;flex-direction:column;gap:4px;width:100%;margin-top:6px">
        <p style="${headingStyle}">Request Access</p>
        <div style="display:flex;gap:6px;align-items:center">
          <input type="email" placeholder="your@company.com" required style="${inputStyle}"
            onfocus="this.style.borderColor='${col.btnBorder}'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'" />
          <button type="submit" style="${submitStyle}">${arrowIcon}</button>
        </div>
      </form>`;
    }

    function liveBtn(c, col, panelId, localMode) {
      const useLocal = localMode !== undefined ? localMode : isLocal;

      // ── Local / local-view mode ───────────────────────────────────────────
      if (useLocal) {
        const base = 'flex items-center justify-center w-full py-2 rounded-lg text-xs font-mono mt-auto';
        if (!c.localUrl) {
          return `<span class="${base} opacity-20 cursor-default select-none" style="background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText}">no local port</span>`;
        }
        const live = isLocal ? (LOCAL_LIVE[new URL(c.localUrl).origin] ?? false) : false;
        const addr = c.localUrl.replace('http://', '');
        if (live) {
          const navAttrs = panelId.endsWith('-backend') ? '' : 'target="_blank" rel="noopener"';
          return `<a href="${c.localUrl}" ${navAttrs} class="${base} transition-opacity hover:opacity-90" style="background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText}">${addr}</a>`;
        }
        return `<span class="${base} opacity-30 cursor-not-allowed select-none" style="background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText}">${addr}</span>`;
      }

      // ── Remote mode ──────────────────────────────────────────────────────────
      const projectKey = panelId.replace(/-(?:frontend|backend|extra)$/, '');
      const cls = 'flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90 mt-auto';
      const effectiveLiveUrl = c.remoteUrl ?? '#';

      // requestAccessOnly: always show the access form, never the live button
      if (c.requestAccessOnly && c.liveLabel) {
        const _inputStyle  = `background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e4e4e7;border-radius:6px;padding:5px 9px;font-size:0.75rem;outline:none;min-width:0;flex:1`;
        const _submitStyle = `background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText};border-radius:6px;padding:5px 11px;font-size:0.72rem;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0`;
        const _headStyle   = `font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${col.btnText};opacity:0.7;margin-bottom:2px`;
        return `<form onsubmit="requestAccess(event,'${projectKey}','${c.liveLabel}')" style="display:flex;flex-direction:column;gap:4px;width:100%;margin-top:auto">
          <p style="${_headStyle}">Request Access</p>
          <div style="display:flex;gap:6px;align-items:center">
            <input type="email" placeholder="your@company.com" required style="${_inputStyle}"
              onfocus="this.style.borderColor='${col.btnBorder}'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'" />
            <button type="submit" style="${_submitStyle}">${arrowIcon}</button>
          </div>
        </form>`;
      }

      // Live URL known — show button directly
      if (effectiveLiveUrl && effectiveLiveUrl !== '#') {
        const _tgt = effectiveLiveUrl.startsWith('http') ? 'target="_blank" rel="opener"' : '';
        return `<a href="${effectiveLiveUrl}" ${_tgt} class="${cls}" style="background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText}">${arrowIcon}${c.liveLabel}</a>`;
      }

      // Suppress Request Access on non-frontend panels when the frontend is already live for this tier
      if (!panelId.endsWith('-frontend')) {
        const projFe = projects[projectKey]?.frontend;
        const projFeUrl = projFe && (projFe.remoteUrl ?? '#');
        if (projFeUrl && projFeUrl !== '#') return '';
      }

      // No live URL — Request Access
      const gcpHint = '';
      const inputStyle  = `background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#e4e4e7;border-radius:6px;padding:5px 9px;font-size:0.75rem;outline:none;min-width:0;flex:1`;
      const submitStyle = `background:${col.btn};border:1px solid ${col.btnBorder};color:${col.btnText};border-radius:6px;padding:5px 11px;font-size:0.72rem;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0`;
      const headingStyle = `font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${col.btnText};opacity:0.7;margin-bottom:2px`;
      return `<form onsubmit="requestAccess(event,'${projectKey}','${c.liveLabel}')" style="display:flex;flex-direction:column;gap:4px;width:100%;margin-top:auto">
        <p style="${headingStyle}">Request Access</p>
        ${gcpHint}
        <div style="display:flex;gap:6px;align-items:center">
          <input type="email" placeholder="your@company.com" required style="${inputStyle}"
            onfocus="this.style.borderColor='${col.btnBorder}'" onblur="this.style.borderColor='rgba(255,255,255,0.12)'" />
          <button type="submit" style="${submitStyle}">${arrowIcon}</button>
        </div>
      </form>`;
    }

    function cloudPanelHtml(c) {
      const col   = colorMap[c.color];
      const chips = c.chips.map(t => `<span class="chip border ${col.chip}">${t}</span>`).join(' ');
      return `
        <div class="rounded-xl p-5 mb-3" style="background:${col.bg};border:1px solid ${col.border}">
          <p class="text-[10px] font-semibold tracking-widest uppercase mb-1 ${col.label}">${c.label}</p>
          <p class="font-bold text-base text-zinc-100 mb-3">${c.title}</p>
          <div class="flex flex-wrap gap-1.5">${chips}</div>
        </div>`;
    }

    function smallPanelHtml(c, panelId, localMode) {
      const col    = colorMap[c.color];
      const chips  = c.chips.map(t => `<span class="chip border ${col.chip}">${t}</span>`).join(' ');
      const hasGH  = c.githubUrl && c.githubUrl !== '#';
      const ghLink = hasGH
        ? `<a href="${c.githubUrl}" target="_blank" rel="noopener" class="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors mt-2" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)">${githubIcon} GitHub</a>`
        : '';
      return `
        <div class="flex-1 min-w-0 rounded-xl p-4 flex flex-col" style="background:${col.bg};border:1px solid ${col.border}">
          <p class="text-[10px] font-semibold tracking-widest uppercase mb-1 ${col.label}">${c.label}</p>
          <p class="font-semibold text-sm text-zinc-100 mb-2 break-words">${c.title}</p>
          <div class="flex flex-wrap gap-1 mb-3">${chips}</div>
          ${liveBtn(c, col, panelId, localMode)}
          ${(localMode && !isLocal && c.localUrl) ? `<p style="font-size:0.62rem;color:#52525b;margin-top:4px">if you have this running, try <a href="${c.localUrl}" target="_blank" rel="noopener" style="color:#71717a;text-decoration:underline">${c.localUrl.replace('http://', '')}</a></p>` : ''}
          ${c.apiKeyNote ? `<p class="text-[10px] mt-2 text-zinc-600" style="line-height:1.4">🔑 ${c.apiKeyNote}</p>` : ''}
          ${ghLink}
        </div>`;
    }

    function openModal(key) {
      const modal = document.getElementById('modal');
      if (_mk === key && modal && !modal.classList.contains('hidden')) return;
      const p = projects[key];
      _mk  = key;
      _mht = _detectTiers(p);
      _mt  = _defaultTier(_mht);

      const content = document.getElementById('modal-content');
      content.innerHTML = `
        <div class="p-6">
          <div class="flex items-start justify-between mb-1">
            <h2 class="font-bold text-lg text-zinc-100">${p.title}</h2>
            <button onclick="closeModal()" class="ml-4 text-zinc-500 hover:text-zinc-200 transition-colors flex-shrink-0 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p class="text-xs ${p.accentClass} mb-2">${p.subtitle}</p>
          <p class="text-sm text-zinc-400 leading-relaxed mb-4">${p.description}</p>
          <div id="modal-body"></div>
          <div id="modal-cloud"></div>
        </div>`;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      switchModalTier(_mt);
    }

    function closeModal() {
      const modal = document.getElementById('modal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    }

    function closeModalOnBackdrop(e) {
      if (e.target === document.getElementById('modal')) closeModal();
    }

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Push hash when modal opens so browser back restores it
    const _origOpenModal = openModal;
    openModal = function(key) {
      const modal = document.getElementById('modal');
      const alreadyOpen = _mk === key && modal && !modal.classList.contains('hidden');
      _origOpenModal(key);
      if (!alreadyOpen) history.pushState({modal: key}, '', '#' + key);
    };

    window.addEventListener('popstate', function() {
      const key = location.hash.slice(1);
      if (key && projects[key]) {
        const modal = document.getElementById('modal');
        if (modal.classList.contains('hidden')) { history.back(); return; }
        _origOpenModal(key);
      } else {
        const modal = document.getElementById('modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });

    // Auto-open modal from ?open=<key> (api-explorer back buttons) or #<key> (hash routing)
    (function() {
      const openKey = new URLSearchParams(location.search).get('open') || location.hash.slice(1);
      if (openKey && projects[openKey]) {
        history.replaceState({modal: openKey}, '', '#' + openKey);
        _origOpenModal(openKey);
      }
    })();
