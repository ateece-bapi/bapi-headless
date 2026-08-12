# BAPI AI Chatbot — Next Steps

**Created:** August 12, 2026  
**Current State:** PR #670 merged; reliability and public PDF retrieval pilot live in `main`  
**Purpose:** Production roadmap for storage, retrieval, evaluation, security, and operations

---

## Current Baseline

The chatbot now has:

- Bounded server, Anthropic, and browser timeouts
- Live WooCommerce product search with customer-group filtering
- Curated handling for known unavailable product families
- WordPress application-note, page, and PDF metadata retrieval
- A bundled public PDF body index with page-level citations
- Reliability, tool-use, empty-search, and unsupported-product metrics
- An admin analytics dashboard

The WordPress backend has been verified:

- Active URL: `https://bapiheadlessstaging.kinsta.cloud`
- PDF endpoint: `/wp-json/bapi/v1/all-pdfs`
- Available PDF records: 918
- Current pilot: 73 documents, 339 indexed pages, approximately 933 KB

## Two Different JSON Storage Concerns

These should be planned independently.

### 1. Conversation Analytics JSONL

Current file:

```text
web/data/chat-analytics/conversations.jsonl
```

The application appends analytics to the local filesystem. This is not durable on Vercel because instances are ephemeral and requests may run on different instances. Feedback updates also rewrite the complete file, which will become slower and less reliable as usage grows.

**Priority:** Immediate

### 2. Bundled PDF Search Index

Current file:

```text
web/src/data/chat/pdf-index.json
```

This file is committed and bundled into the server application. That is acceptable for the 933 KB pilot, but indexing all 918 PDFs could materially increase repository size, build memory, deployment size, and cold-start cost.

**Priority:** Before expanding beyond the pilot

---

## Phase 1 — Durable Analytics

**Target:** Next chatbot PR

Move analytics and feedback to a managed PostgreSQL database or an approved observability platform. PostgreSQL is preferred if the admin dashboard must continue querying structured conversation records.

### Proposed Data Model

`chat_conversations`

- `conversation_id`
- `created_at`
- `language`
- `outcome`
- `response_time_ms`
- `tokens_used`
- `tool_iterations`
- `empty_searches`
- `tools_used`
- `products_recommended`
- `unsupported_product_categories`
- `feedback`
- `feedback_comment`

### Privacy Decision Required

The current analytics type includes full `userMessage` and `assistantResponse` values. Before migration, decide whether BAPI needs to retain complete transcripts.

Recommended default:

- Store aggregate metrics by default
- Store full transcripts only with an explicit business purpose
- Redact email addresses, phone numbers, order numbers, and other identifiable data
- Define a retention period, such as 30 or 90 days
- Restrict transcript access to approved administrators
- Document deletion and customer-data request procedures

### Implementation Tasks

- Add a storage interface so route code is independent of the database vendor
- Implement database-backed create, feedback update, summary, and recent-conversation methods
- Use indexed queries for dashboard date ranges and outcomes
- Add idempotency on `conversation_id`
- Add a retention cleanup job
- Add structured error metrics for failed analytics writes
- Remove filesystem writes after production verification

### Acceptance Criteria

- Metrics survive redeployments and scale across Vercel instances
- Feedback updates do not rewrite all conversation history
- Dashboard totals are consistent across repeated requests
- Analytics failure never breaks the customer chat response
- PII handling and retention are documented and approved

---

## Phase 2 — Externalize the PDF Index

**Target:** Before indexing all 918 documents

Move generated index artifacts to object storage such as Vercel Blob, Amazon S3, or Cloudflare R2. Keep index generation offline; do not download and parse PDFs during customer requests.

### Recommended Artifact Layout

```text
chat-search/
  manifest.json
  public/
    index-v2.json.gz
  restricted/
    alc-index-v2.json.gz
    acs-index-v2.json.gz
    emc-index-v2.json.gz
    ccg-index-v2.json.gz
    ccga-index-v2.json.gz
```

The manifest should include:

- Schema version
- Generation timestamp
- WordPress source URL
- Document and page counts
- Artifact checksums
- Failed and skipped document counts
- Generator version

### Runtime Strategy

- Load only the public index for guest requests
- Load restricted partitions only after server-side authorization
- Cache parsed indexes in the warm server process
- Set a short fetch timeout and retain the last known good artifact
- Continue using WordPress application notes/pages if the PDF artifact is unavailable
- Never expose a restricted index URL as a public client asset

### When to Adopt a Search Service

Object storage plus Fuse.js is sufficient while the corpus remains modest. Evaluate Typesense, Meilisearch, OpenSearch, or a managed vector/hybrid service when:

- Compressed artifacts become too large for reliable server loading
- Search latency exceeds the agreed target
- Full-corpus updates become frequent
- Ranking quality requires fielded, semantic, or multilingual retrieval
- Multiple applications need the same search API

### Acceptance Criteria

- PDF corpus updates no longer require a frontend code commit
- A failed index refresh does not replace the last good artifact
- Guest requests cannot fetch or search restricted partitions
- Search results preserve exact document title, URL, and page citation
- Runtime retrieval meets a defined latency target, initially p95 under 500 ms

---

## Phase 3 — Automated Index Refresh

Add a controlled CI workflow or content-publishing job.

### Proposed Workflow

1. Fetch the WordPress PDF manifest.
2. Compare document URLs, modification dates, and checksums with the previous manifest.
3. Download and extract only new or changed PDFs.
4. Preserve unchanged page records.
5. Validate access-group classification before publishing.
6. Run retrieval smoke tests for representative product families.
7. Upload versioned artifacts.
8. Atomically update the active manifest only after validation passes.
9. Retain at least one previous artifact for rollback.

### Operational Requirements

- Manual dispatch for the first production iterations
- Scheduled refresh after stability is proven
- Failure summary listing inaccessible, scanned, oversized, and malformed PDFs
- Alert when indexed document count drops unexpectedly
- No `PDF_INDEX_INCLUDE_RESTRICTED=true` run until partitioning and authorization tests are complete

### Known Content Work

- Repair or remove PDF records returning HTTP 404
- Identify scanned PDFs with no extractable text
- Decide whether high-value scanned documents need OCR
- Normalize inconsistent document titles to improve exact SKU/model matching

---

## Phase 4 — Retrieval Quality & Evaluation

Create a maintained evaluation set before changing models or adding embeddings.

### Evaluation Categories

- Exact SKU and part-number questions
- Product-family recommendations
- Installation and wiring questions
- Specification and measurement-range questions
- NO2 versus CO2 disambiguation
- Unsupported Current Sensor questions
- Questions requiring application-note citations
- No-result and ambiguous questions
- OEM/customer-group authorization cases
- Multilingual questions across supported locales

### Required Measurements

- Correct product or document in the top results
- Citation accuracy and page correctness
- Unsupported-product precision
- Empty-search rate
- Tool-limit and timeout rate
- Response latency
- Human-rated helpfulness
- Hallucinated product or specification rate

### Ranking Improvements

- Tokenize model numbers and preserve punctuation variants
- Boost exact title, SKU, part number, and filename matches
- Add document-type and recency fields
- Collapse near-duplicate pages from the same PDF
- Consider hybrid lexical and semantic retrieval only after the baseline evaluation exists

---

## Phase 5 — Production Operations

### Monitoring

- Alert on timeout-rate increases
- Alert on Anthropic API failures and rate-limit responses
- Track p50, p95, and p99 response times
- Track tool rounds and empty results by tool
- Track index age and active artifact version
- Track unsupported-product demand for roadmap input

### Cost Controls

- Record input, output, and cache-read tokens separately
- Validate estimated cost against Anthropic billing
- Add per-conversation and daily usage thresholds
- Preserve prompt caching where effective
- Review model choice using measured quality, latency, and cost rather than assumptions

### Customer Experience

- Add a clear retry path after timeout or tool failure
- Improve human handoff context for unresolved technical questions
- Show citations consistently for technical claims
- Do not expose internal planning, raw tool output, or storage errors

---

## Recommended Execution Order

1. Approve analytics privacy and retention requirements.
2. Move analytics from JSONL to durable storage.
3. Define PDF artifact schema and object-storage provider.
4. Build incremental, versioned index publishing with rollback.
5. Repair 404 and scanned-document gaps.
6. Establish the retrieval evaluation set.
7. Expand from 73 documents toward the full public corpus in measured batches.
8. Add restricted document partitions only after authorization review.
9. Evaluate a dedicated search service when measured scale or quality requires it.

## Decisions Needed

- Which approved durable database or observability platform should store analytics?
- Are full chat transcripts required, and for how long?
- Which object-storage provider should host index artifacts?
- Who owns document quality and 404 remediation in WordPress?
- What latency and answer-quality thresholds define production success?
- Should restricted OEM documents ever be available through the chatbot?

## Definition of Done for the Next Milestone

The next milestone is complete when:

- Analytics are durable across deploys and instances
- Transcript privacy and retention are approved and enforced
- Dashboard metrics read from the durable store
- The current bundled public PDF pilot continues to work unchanged
- Migration and rollback procedures are documented
- Tests cover storage failures, duplicate events, feedback updates, and retention behavior