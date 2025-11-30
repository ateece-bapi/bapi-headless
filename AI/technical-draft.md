# Technical Draft — AI Chat Assistant for BAPI HVAC (Headless WP + Next.js)

Summary
- Goal: Add a retrieval-augmented AI chat assistant to the BAPI HVAC Next.js frontend using WordPress (WPGraphQL) as the knowledge source.
- Approach: Ingest content via WPGraphQL → create embeddings → store in a vector DB → at query time, retrieve relevant chunks and call an LLM to generate answers (RAG).
- Priorities: correctness, safety, cost control, privacy, and measurable business outcomes (lead capture, deflection, faster support).

1) High-level architecture (text)
- Content source: Headless WordPress via WPGraphQL.
- Ingestion:
  - Full crawl (bulk) indexing script for initial import.
  - Incremental indexing via WP publish/update webhook → GraphQL fetch single node → re-index.
  - Chunking and metadata tagging (url, title, post_type, date, author).
  - Compute embeddings and upsert to vector DB.
- Storage:
  - Vector DB for embeddings + metadata.
  - Optional persistent convo storage (Postgres/Supabase) for analytics and human handoff logs.
- Query-time:
  - Next.js API route (server-side): accept question + optional conversation context → embedding for query → vector DB nearest-neighbors → construct prompt with top-K chunks → call LLM → post-process + safety checks → return to client.
- Client:
  - Chat widget (React) integrated on public pages and contact pages, with fallback to contact form/live-agent.
- Observability:
  - Logging (requests, latencies), analytics (top queries, fail-rate), cost tracking.

2) Implementation details

2.1 Content ingestion (WPGraphQL)
- Use the site’s /graphql endpoint to fetch contentNodes with cursor pagination.
- Index content types: posts, pages, service CPTs. Filter out admin/private content.
- Chunking: 1,000–2,000 characters per chunk (experiment), overlapping windows (optional, +100–200 chars overlap).
- Metadata per vector: databaseId, uri, title, nodeType, chunk_index, source, lastUpdated.
- Re-indexing:
  - Webhook on publish/update -> re-index single node.
  - Scheduled full re-index nightly/weekly (depends on update frequency).

2.2 Embeddings
- Use an embeddings model from your chosen provider:
  - OpenAI (text-embedding-3-small / text-embedding-3-large).
  - Anthropic or vendor-specific equivalents.
- Batch requests for many chunks to reduce overhead.

2.3 Vector DB options (trade-offs)
- Pinecone
  - Pros: managed, easy, good performance. Good for quick prototypes.
  - Cons: cost can grow; hosted.
- Supabase (pgvector)
  - Pros: cost-effective, integrates with Postgres, easier to self-host.
  - Cons: less specialized vector features; may require tuning for scale.
- Weaviate / Milvus
  - Pros: advanced search features, on-prem/self-host options.
  - Cons: more operational overhead.
Recommendation for prototype: Pinecone (fastest), or Supabase if you want to keep everything in Postgres and reduce vendor lock.

2.4 LLM options (trade-offs)
- OpenAI (gpt-4o-mini / gpt-4 / gpt-4o):
  - Pros: high quality, good SDKs and embeddings + safety tooling.
  - Cons: recurring cost, data privacy considerations.
- Anthropic (Claude):
  - Pros: good for safety-sensitive outputs.
  - Cons: vendor lock-in, costs vary.
- Self-hosted (Llama 2, Mistral)
  - Pros: greater privacy and predictable cost at scale.
  - Cons: infra costs (GPUs), ops overhead, likely lower quality for complex prompts unless tuned.
Recommendation for prototype: OpenAI for speed and quality. Re-evaluate if monthly spend gets high.

2.5 Query-time prompt & safety
- Prompt structure: system instructions (brand voice + constraints) + Retrieved sources block (numbered, with urls) + user message + conversation history (short window).
- Safety: Use moderation API (OpenAI/Anthropic) or custom rules. Filter responses with escaped outputs, profanity, and PII blockers.
- Confidence threshold / hallucination policy: do not hallucinate facts. If the info is not in sources, reply with a fallback: "I don't know — would you like to contact support?"

2.6 Handoff and escalation
- "Connect to human" path: capture user context and route to CRM/email/Slack with a short summary + link to conversation logs.
- Optionally offer phone or appointment booking modal.

3) Minimal tech stack (prototype)
- Next.js app (existing)
- Node/TypeScript serverless API routes for chat & webhook
- WPGraphQL endpoint (existing)
- Vector DB: Pinecone or Supabase (choose)
- LLM & embeddings: OpenAI (or Anthropic)
- Optional persistent DB: Supabase / Postgres for logs and analytics
- Hosting: Vercel/Netlify for frontend + serverless, cloud provider for vector DB.

4) Environment variables (example)
- WP_GRAPHQL_ENDPOINT=https://www.bapihvac.com/graphql
- WP_GRAPHQL_AUTH_TOKEN (if needed)
- OPENAI_API_KEY
- VECTOR_DB_TYPE=pinecone|supabase|weaviate
- PINECONE_API_KEY / PINECONE_ENV OR SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
- WP_INGEST_WEBHOOK_SECRET
- INDEX_CHUNK_SIZE=1500

5) Cost estimate (ballpark, prototype -> small production)
Assumptions:
- 500 content pages, average 2k words/page → ~1M words → chunked into ~5000–8000 chunks.
- 5k monthly unique chat sessions, average 150 tokens input + 300 tokens output.

Rough monthly costs (example using OpenAI + Pinecone):
- Embeddings (initial index): one-time: embeddings for 8k chunks. If embedding cost = $0.0004 per 1k tokens (varies), this is small (tens of dollars). Re-indexing ongoing cost small.
- Generation cost: 5k sessions * 450 tokens * model rate. If model cost ~ $0.03 / 1k tokens -> 5,000 * 0.45k * $0.03 = $67.5/month (this is illustrative).
- Pinecone: depends on pod size and storage (~$50–$200/month for small usage).
- Hosting & monitoring: $0–$100s depending on scale.
Total prototype monthly: $100–$500. Production (more users): $500–$5k+ depending on traffic, retention, and chosen models.

6) Implementation phases, deliverables, and time estimates

Phase A — Research & Prototype (1–2 weeks)
- Deliverables:
  - Small index of top pages (FAQ, service pages).
  - Working Next.js API route (chat) + minimal chat widget.
  - Demo conversation flows.
- Success criteria:
  - Chat returns correct answers from sources ≥ 80% in manual checks.
  - End-to-end latency ≤ 1.5–2s for retrieval + generation (varies by model).

Phase B — Pilot (2–4 weeks)
- Deliverables:
  - Full site indexing + webhook incremental updates.
  - Persistent logs + analytics dashboard.
  - Safety filters + handoff to human path.
  - UI/UX improvements: proactive triggers, lead capture.
- Success criteria:
  - Deflection rate target (e.g., 20–40% of basic questions answered without human).
  - Conversion uplift measured (form fills, phone clicks).

Phase C — Production & Scale (ongoing)
- Deliverables:
  - Rate limiting, caching, SLA, fallback offline messages, monitoring.
  - Cost optimization (model selection, caching, summarization).
  - Optionally explore fine-tuning or retrieval augmentation improvements.

7) KPIs and monitoring
- Bot usage: queries/day, unique users.
- Deflection: % of questions resolved without human.
- Accuracy: human-evaluated response correctness (sampled).
- Lead generation: contact forms, appointment bookings driven by bot.
- Costs: $/query.
- Latency: median response time.

8) Security, privacy & compliance
- Never expose LLM or vector DB keys to client.
- Scrub PII from content before sending to third-party APIs when required.
- Inform users in privacy policy if messages are processed by third-party AI.
- Add data retention controls and opt-out for logged conversations.
- Use secrets for webhook validation and signing.

9) Risks & mitigations
- Hallucinations: mitigate via RAG and explicit instructions to LLM to only use sources; show source links; add fallback to human.
- Exposure of private data: vet content, add scrubbers, and exclude admin-only pages.
- Cost overruns: set budgets, rate limits, caching, and use smaller/cheaper models where acceptable.

10) Next technical steps (short actionable)
- Choose provider combo for prototype (OpenAI + Pinecone recommended).
- Run small index (FAQ + 10 service pages).
- Build chat API & widget on dev branch, demo to internal stakeholders.
- Instrument logging & sample-based manual QA for responses.
- Iterate on prompt engineering and chunk size.

Appendix: Example prompt template (short)
- System: “You are a BAPI HVAC assistant. Only answer from given sources. If not present, say you don’t know and offer contact info. Keep answers concise, friendly, and local to our service area. Provide source links after the answer.”
- Context: List top-K retrieved snippets with url metadata.
- User: [user question]

End of technical draft.