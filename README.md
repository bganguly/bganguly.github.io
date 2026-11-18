# bganguly.github.io — Portfolio

**[See Live Portfolio](https://bganguly.github.io/)**

A sample walkthrough of one of the live apps is below.

https://github.com/user-attachments/assets/fb263e97-e164-49ca-a91c-bf76a050f79e

Run `scripts/deploy.sh` for local dev (serves on `:9090`, seeds EmailJS credentials). Remote publish is automatic — GitHub Actions deploys to Pages on every push to main.

## Tracking dashboards

- [Portfolio Infra Cost Audit](https://bganguly.github.io/infra-costs/) — per-project cost, status, and open/API-explorer availability
- [Portfolio Issues Tracker](https://claude.ai/code/artifact/902f18e5-5edf-43b2-893f-87b7710f7e1c) — modal bugs and missing back-button fixes across all repos

---

## Project cards — tech stack reference

15 cards · **9 live** (links below) · **6 on demand** (access request) · order matches UI grid

| # | Project | Stack / Infra | Links |
|---|---------|---------------|-------|
| 1 | **RAG + pgvector — GCP** | Python · FastAPI · pgvector · LangChain · Next.js 15 · SSE · LLMs: Claude/OpenAI/NIM · GCP Cloud Run · `bganguly/wikipedia-rag-pgvector-demo` | [App](https://frontend-sigma-ten-30.vercel.app) · [API](https://frontend-sigma-ten-30.vercel.app/api-explorer.html) |
| 2 | **ClickHouse Dashboard (50M rows) — AWS** | TypeScript · Next.js 16.2 · React 19 · ClickHouse Cloud · SSE · AWS App Runner + CloudFront · `bganguly/clickhouse-dashboard` | [App](https://d1n8zhx1j8oymk.cloudfront.net) · [API](https://d1n8zhx1j8oymk.cloudfront.net/api-explorer) |
| 3 | **EDGAR 10-K Agent — GCP** | Python · FastAPI · agentic loop · tool use · SEC EDGAR · React · Vite · LLMs: Claude/NIM · GCP Cloud Run · `bganguly/edgar-agent` | [App](https://edgar-frontend-77y7e2wykq-uc.a.run.app) · [API](https://edgar-frontend-77y7e2wykq-uc.a.run.app/api-explorer) |
| 4 | **Multi-Agent Orchestration — GCP** | Python · FastAPI · LangGraph (17-node) · MCP · Next.js 15 · React Flow · SSE · GCP Cloud Run · `bganguly/agent-orchestration-demo` | [App](https://agent-frontend-77y7e2wykq-uc.a.run.app) |
| 5 | **React + Go (4M rows) — AWS** | Go 1.23 · Gin · pgx · React 19.2 · Vite 6 · AWS App Runner · `bganguly/react-go-dashboard` | [App](https://rk2yd5fmyd.us-east-1.awsapprunner.com) · [API](https://rk2yd5fmyd.us-east-1.awsapprunner.com/api-explorer) |
| 6 | **React + Rust (4M rows) — AWS** | Rust · Actix-web 4 · sqlx · Neon Postgres · React 19.2 · AWS App Runner · `bganguly/react-rust-dashboard` | [App](https://9vicazj2md.us-east-1.awsapprunner.com) · [API](https://9vicazj2md.us-east-1.awsapprunner.com/api-explorer) |
| 7 | **Angular 19 + Spring Boot (4M rows) — Azure** | Java 21 · Spring Boot 4.1 · Angular 19 · Chart.js · Nginx BFF · Azure Static Web Apps · `bganguly/fastapi-angular-dashboard-frontend` | [App](https://salmon-wave-01f721c0f.6.azurestaticapps.net) · [API](https://dash-angular-frontend-77y7e2wykq-uc.a.run.app/api-explorer) |
| 8 | **Next.js + Spring Boot (4M rows) — GCP** | Java 21 · Spring Boot 4.1 · Neon Postgres · Next.js 16.3 · RSC · GCP Cloud Run · `bganguly/springboot-dashboard-backend` | [App](https://dash-nextjs-full-frontend-77y7e2wykq-uc.a.run.app/) · [API](https://dash-nextjs-full-frontend-77y7e2wykq-uc.a.run.app/api-explorer) |
| 9 | **React + Spring Boot (4M rows) — GCP** | Java 21 · Spring Boot 4.1 · PostgreSQL 16 · React 19.2 · Recharts · Pulumi · GCP Cloud Run · `bganguly/springboot-dashboard-backend` | [App](https://dash-react-frontend-77y7e2wykq-uc.a.run.app) · [API](https://dash-react-frontend-77y7e2wykq-uc.a.run.app/api-explorer) |
| 10 | **SEC EDGAR RAG — AWS** _(on demand)_ | Python · FastAPI · LangChain · pgvector · Next.js 15 · LLMs: Anthropic/OpenAI/Google/NIM · AWS Lambda + Vercel · `bganguly/edgar-rag-demo` | — |
| 11 | **Next.js + PostgreSQL 16 (4M rows) — AWS** _(on demand)_ | TypeScript · Next.js 16.2 · RSC · Prisma ORM · PostgreSQL 16 (RDS) · AWS App Runner · `bganguly/nextjs-dashboard` | — |
| 12 | **NL-to-SQL — Vercel** | TypeScript · React 19 · DuckDB-WASM · H1B LCA Parquet · LLMs: Anthropic/OpenAI · Vercel · `bganguly/natural-language-to-llm-query-comparison` | [App](https://natural-language-to-llm-query-comparison.vercel.app/nl-to-sql/) |
| 13 | **PHI De-identification — AWS** _(on demand)_ | Python · spaCy NER · Claude Haiku fallback · Celery + Redis · OTel · AWS · `bganguly/phi-deidentification-pipeline` | — |
| 14 | **Event Pipeline — AWS** _(on demand)_ | TypeScript · Lambda · SNS → SQS · DynamoDB · Serverless Framework · React 19.2 · `bganguly/react-typescript-serverless` | — |
| 15 | **Job Runner — AWS** _(on demand)_ | Java 21 · Spring Boot 4.1 · ECS Fargate · DynamoDB · SQS · React 19.2 · CloudFront · `bganguly/react-springboot-fargate` | — |
