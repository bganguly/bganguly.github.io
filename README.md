# bganguly.github.io — Portfolio

**[Live demo →](https://bganguly.github.io/)**

Run `scripts/deploy.sh` for local dev (serves on `:9090`, seeds EmailJS credentials). Remote publish is automatic — GitHub Actions deploys to Pages on every push to main.

## Tracking dashboards

- [Portfolio Infra Cost Audit](https://bganguly.github.io/infra-costs/) — per-project cost, status, and open/API-explorer availability
- [Portfolio Issues Tracker](https://claude.ai/code/artifact/902f18e5-5edf-43b2-893f-87b7710f7e1c) — modal bugs and missing back-button fixes across all repos

---

## Project cards — tech stack reference

The portfolio is a single-page grid of 15 project cards. **8 cards are immediately available** (live URLs below); **7 cards are available on demand** (require an access request). Order matches the UI grid layout.

---

### Immediately Available · Featured · AI/LLM + Full Stack

#### 1. RAG + pgvector Demo — GCP
[Open App](https://frontend-sigma-ten-30.vercel.app) · [Open API Explorer](https://frontend-sigma-ten-30.vercel.app/api-explorer.html)
- **Language:** Python (backend), TypeScript (frontend)
- **Backend:** FastAPI, asyncio, LangChain (RecursiveCharacterTextSplitter), pgvector (cosine similarity), OpenAI `text-embedding-3-small`, Redis
- **Frontend:** Next.js 15, Vercel AI SDK (`streamText`), SSE, Tailwind CSS
- **LLM providers (runtime toggle):** Anthropic Claude, OpenAI, NVIDIA NIM (Nemotron) — same interface, base\_url swap
- **Infra:** GCP Cloud Run
- **GitHub:** `bganguly/rag-pgvector-demo`

#### 2. ClickHouse Dashboard (50M rows) — AWS
[Open App](https://d1n8zhx1j8oymk.cloudfront.net) · [Open API Explorer](https://d1n8zhx1j8oymk.cloudfront.net/api-explorer)
- **Language:** TypeScript
- **Stack:** Next.js 16.2, React 19, TypeScript 5.9, Tailwind CSS v4, Recharts
- **Database:** ClickHouse Cloud — four Materialized Views into SummingMergeTree for zero-worker aggregation; full-text search via `positionCaseInsensitive` on a denormalized column; keyset cursor pagination
- **Realtime:** in-process Node.js EventEmitter → SSE (no external broker)
- **Infra:** AWS App Runner (scale-to-zero) + CloudFront, Terraform, GitHub Actions; ClickHouse Cloud service lifecycle via CH Cloud API
- **GitHub:** `bganguly/clickhouse-dashboard`

#### 3. EDGAR 10-K Agent — GCP
[Open App](https://edgar-frontend-77y7e2wykq-uc.a.run.app) · [Open API Explorer](https://edgar-frontend-77y7e2wykq-uc.a.run.app/api-explorer)
- **Language:** Python (backend), TypeScript (frontend)
- **Backend:** FastAPI, custom agentic loop (no LangChain), tool use, SEC EDGAR API (live 10-K/10-Q retrieval), eval harness (faithfulness, completeness, citation accuracy)
- **Frontend:** React, Vite, TypeScript, SSE (streams every tool-call event and token)
- **LLM providers (runtime toggle):** Anthropic Claude, NVIDIA NIM — same loop, same tools
- **Infra:** GCP Cloud Run
- **GitHub:** `bganguly/edgar-agent`

#### 4. Multi-Agent Orchestration — GCP
[Open App](https://agent-frontend-77y7e2wykq-uc.a.run.app)
- **Language:** Python (backend), TypeScript (frontend)
- **Backend:** FastAPI, LangGraph (17-node pipeline), MCP server (stdio) for Claude Desktop, Wikipedia + DuckDuckGo tools, Anthropic tool use
- **Pipeline:** classify → 10 parallel specialist researchers → collect barrier → 4 domain synthesizers → fact-check → report writer; simple queries short-circuit to 4 nodes
- **Frontend:** Next.js 15, React Flow DAG (live SSE updates — nodes pulse while running, turn green on completion), TypeScript
- **Infra:** GCP Cloud Run (primary) + GKE (available)
- **GitHub:** `bganguly/agent-orchestration-demo`

#### 5. React + Go (4M rows) — AWS
[Open App](https://rk2yd5fmyd.us-east-1.awsapprunner.com) · [Open API Explorer](https://rk2yd5fmyd.us-east-1.awsapprunner.com/api-explorer)
- **Language:** Go (backend), TypeScript (frontend)
- **Backend:** Go 1.23, Gin, pgx — same 4M-order analytics problem as the Spring Boot card
- **Frontend:** React 19.2, Vite 6
- **Infra:** AWS App Runner (two services) via CodeBuild → ECR; no IaC framework
- **GitHub:** `bganguly/react-go-dashboard`

#### 6. React + Rust (4M rows) — AWS
[Open App](https://9vicazj2md.us-east-1.awsapprunner.com) · [Open API Explorer](https://9vicazj2md.us-east-1.awsapprunner.com/api-explorer)
- **Language:** Rust (backend), TypeScript (frontend)
- **Backend:** Actix-web 4, sqlx, tokio — same problem as Go card; identical API surface, Neon Postgres read models, in-process `Arc<RwLock>` aggregates cache
- **Frontend:** React 19.2, Vite 6
- **Infra:** AWS App Runner (two services) via CodeBuild → ECR
- **GitHub:** `bganguly/react-rust-dashboard`

#### 7. Next.js + Spring Boot (4M rows) — GCP
[Open App](https://dash-nextjs-full-frontend-77y7e2wykq-uc.a.run.app/) · [Open API Explorer](https://dash-nextjs-full-frontend-77y7e2wykq-uc.a.run.app/api-explorer)
- **Language:** Java (backend), TypeScript (frontend)
- **Backend:** Spring Boot 4.1, Java 21, Neon PostgreSQL
- **Frontend:** Next.js 16.3, App Router, React Server Components
- **Infra:** GCP Cloud Run
- **GitHub:** `bganguly/springboot-dashboard-backend` + `bganguly/dashboard-frontend`

#### 8. React + Spring Boot (4M rows) — GCP
[Open App](https://dash-react-frontend-77y7e2wykq-uc.a.run.app) · [Open API Explorer](https://dash-react-frontend-77y7e2wykq-uc.a.run.app/api-explorer)
- **Language:** Java (backend), TypeScript (frontend)
- **Backend:** Spring Boot 4.1, Java 21, Flyway 12.4, PostgreSQL 16 (GCE VM); GIN trigram index for sub-second full-text search; pre-aggregated tables for chart queries
- **Frontend:** React 19.2, TypeScript 5.9, Vite 6.4, Recharts 3.9; Nginx BFF proxies `/api/*` to Spring Boot
- **Infra:** GCP Cloud Run (two independent services), Pulumi TypeScript IaC, GCP Secret Manager, Artifact Registry
- **GitHub:** `bganguly/springboot-dashboard-backend` + `bganguly/dashboard-frontend`

---

### Available on Demand

#### 9. SEC EDGAR RAG — AWS
- **Language:** Python (backend), TypeScript (frontend)
- **Backend:** FastAPI 0.115, LangChain, pgvector (Neon), OpenAI `text-embedding-3-small`, Mangum (Lambda-compatible — same image runs on Cloud Run or AWS Lambda)
- **Frontend:** Next.js 15, React 19, Vercel AI SDK (`streamText`), TypeScript 5.7, Tailwind CSS
- **LLM providers (runtime toggle):** Anthropic, OpenAI, Google, NVIDIA NIM
- **Data source:** SEC EDGAR API — index 10-K/10-Q filings by ticker and date range
- **Infra:** AWS Lambda + Neon pgvector + Vercel, Terraform, GitHub Actions
- **GitHub:** `bganguly/edgar-rag-demo`

#### 10. Next.js + PostgreSQL 16 Dashboard (4M rows) — AWS
- **Language:** TypeScript
- **Stack:** Next.js 16.2, TypeScript 5.9, Tailwind CSS 4.3, React Server Components, SSE
- **Database:** PostgreSQL 16 (AWS RDS), Prisma ORM
- **Pattern:** full-stack monolith (API routes + server components + SSE in one deployment) — architectural contrast to the split-service GCP model
- **Infra:** AWS App Runner (scale-to-zero), Terraform, GitHub Actions
- **GitHub:** `bganguly/nextjs-dashboard`

#### 11. NL-to-SQL — Vercel
[Open App](https://natural-language-to-llm-query-comparison.vercel.app/nl-to-sql/)
- **Language:** TypeScript
- **Stack:** React 19, Vite — entirely client-side, no backend
- **Query engine:** DuckDB-WASM (in-browser); schema auto-detected from Parquet metadata
- **Data:** DOL H1B LCA disclosures (Parquet snapshot)
- **LLM providers (side-by-side comparison):** Anthropic, OpenAI
- **Infra:** Vercel static deploy
- **GitHub:** `bganguly/natural-language-to-llm-query-comparison`

#### 12. PHI De-identification — AWS
- **Language:** Python
- **Pipeline (two-tier):**
  - Tier 1: spaCy `en_core_sci_md` biomedical NER (~90% of records)
  - Tier 2 fallback: Anthropic Claude Haiku 4.5 for ambiguous entities
- **Entity types:** name, SSN, MRN, date, phone, email, location — replaced with Faker-generated synthetic equivalents (not blank redactions)
- **Audit:** SHA-256 hashes of originals stored in PostgreSQL redaction log
- **Async processing:** Celery workers + Redis broker
- **Observability:** structured JSON logs, Prometheus metrics, OpenTelemetry traces → Jaeger
- **GitHub:** `bganguly/phi-deidentification-pipeline`

#### 13. Event Pipeline — AWS
- **Language:** TypeScript (frontend + Lambda)
- **Backend:** AWS Lambda, API Gateway, SNS fan-out → SQS consumption, DynamoDB state tracking (submitted → processing → complete → failed), Serverless Framework 4.13
- **Frontend:** React 19.2, TypeScript 5.8, Vite 5.4 — polls job status endpoint
- **Infra:** AWS Serverless (Lambda + API Gateway + SNS + SQS + DynamoDB)
- **GitHub:** `bganguly/react-typescript-serverless`

#### 14. Job Runner — AWS
- **Language:** Java (backend), TypeScript (frontend)
- **Backend:** Spring Boot 4.1, Java 21, ECS Fargate, DynamoDB persistence, SQS async job queue
- **Frontend:** React 19.2, TypeScript 5.8 — served via CloudFront + S3
- **CI/CD:** GitHub Actions builds and pushes container images to ECR on every commit
- **Infra:** AWS ECS Fargate (no EC2 cluster management), CloudFront CDN, ECR
- **GitHub:** `bganguly/react-springboot-fargate`

#### 15. Angular 19 + Spring Boot (4M rows) — Azure
[Open App](https://salmon-wave-01f721c0f.6.azurestaticapps.net) · [Open API Explorer](https://dash-angular-frontend-77y7e2wykq-uc.a.run.app/api-explorer)
- **Language:** Java (backend), TypeScript (frontend)
- **Backend:** Spring Boot 4.1, Java 21, GCP Cloud Run — same 4M-order dataset as the React frontend
- **Frontend:** Angular 19, Bootstrap 5.3, Chart.js 4.4 (ng2-charts); multi-stage Docker build (Angular → Nginx); Nginx proxies `/api/*` to Cloud Run backend
- **Features:** stacked bar chart, full-text orders search, cursor-based customer pagination, dark-mode toggle
- **Infra:** Azure Static Web Apps + Terraform IaC
- **GitHub:** `bganguly/fastapi-angular-dashboard-frontend`
