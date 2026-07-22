# BAPI AI Chatbot — Architecture & Implementation

**Last Updated:** July 21, 2026  
**Status:** Live on staging

---

## Overview

The BAPI website includes an AI-powered product advisor chatbot built on **Anthropic's Claude API**. It answers technical questions about BAPI products, helps customers find the right sensor for their application, and escalates to a human via email when needed.

---

## Is It Free?

**No — it uses a paid Anthropic API, not the free Claude.ai consumer app.**

The Anthropic API is billed per token (roughly per word sent and received). There is no fixed monthly fee — you pay for what you use.

| Tier | Cost (as of 2026) |
|------|-------------------|
| Claude Haiku 4.5 (what we use) | ~$0.80 / 1M input tokens, ~$4.00 / 1M output tokens |
| Claude Sonnet (higher quality) | ~$3.00 / 1M input tokens, ~$15.00 / 1M output tokens |

For context: a typical chat conversation (10 back-and-forth messages) costs roughly **$0.001–$0.005** — less than a penny. At 1,000 conversations/month that's roughly **$1–$5/month** at current usage patterns.

We chose **Claude Haiku 4.5** because it's the fastest and most cost-efficient model while still being highly capable for product Q&A.

---

## How It Works

```
User types message
       ↓
ChatWidget (browser) → POST /api/chat
       ↓
Rate limit check (per IP)
       ↓
Anthropic API call (Claude Haiku 4.5)
  ├── System prompt: BAPI product expert context
  ├── Tool: search_products (searches our WooCommerce catalog via GraphQL)
  └── B2B: filters products by customer group if logged in
       ↓
Streaming response (SSE) back to browser
       ↓
ChatWidget displays response word-by-word
```

### Key Capabilities

- **Product search** — Claude can query our live WooCommerce catalog (608 products) in real-time
- **Technical Q&A** — specifications, installation guidance, application recommendations
- **B2B pricing awareness** — filters product results by the logged-in user's customer group
- **11 languages** — auto-detects language and responds in: English, German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic, Thai, Polish, Hindi
- **Human handoff** — "Talk to a person" button triggers an email to our support team with the full conversation transcript

### Rate Limiting

Each IP address is limited to a set number of requests per minute to prevent abuse and control API costs. Exceeding the limit returns a friendly retry message.

---

## API & Environment Variable

The chatbot requires one environment variable:

```
ANTHROPIC_API_KEY=sk-ant-...
```

This key is set in Vercel's environment variables (not in the codebase). The key is obtained from [console.anthropic.com](https://console.anthropic.com).

---

## Key Files

| File | Purpose |
|------|---------|
| `web/src/app/api/chat/route.ts` | Main API endpoint — handles Claude API call, streaming, rate limiting |
| `web/src/app/api/chat/handoff/route.ts` | Human escalation — sends email with conversation transcript |
| `web/src/app/api/chat/feedback/route.ts` | Thumbs up/down feedback collection |
| `web/src/app/api/chat/analytics/route.ts` | Admin analytics data |
| `web/src/components/chat/ChatWidget.tsx` | Frontend chat bubble and conversation UI |
| `web/src/lib/chat/productSearch.ts` | GraphQL query that searches the live product catalog |
| `web/src/lib/chat/analytics.ts` | Logs conversation metadata for the admin dashboard |

### Admin Dashboard

Conversation analytics are available at `/admin/chat-analytics` (requires admin login). Shows message volume, feedback ratings, products recommended, and handoff frequency.

---

## Adding the Chatbot to the Blü-View Mobile App


1. The chatbot is a **REST API endpoint** (`POST /api/chat`) — any app that can make an HTTP request can use it
2. The Blü-View app would simply send the user's message to our API and display the streamed response
3. No separate Anthropic account or API key needed for the app — it calls our website's endpoint, which handles the Anthropic call server-side

**What the app would need to send:**
```json
{
  "messages": [
    { "role": "user", "content": "What probe should I use for cleanroom temp?" }
  ],
  "locale": "en",
  "pageContext": "blu-view-app"
}
```

**Complexity level:** Low — the hard part (AI logic, product search, rate limiting) is already done on the server. The app just needs a chat UI and an HTTP client.

---

## Costs at Scale

| Monthly Conversations | Estimated Cost |
|-----------------------|---------------|
| 500 | ~$0.50–$2.50 |
| 2,000 | ~$2–$10 |
| 10,000 | ~$10–$50 |

These are rough estimates. Actual cost depends on message length and whether product search is triggered. The admin dashboard tracks token usage over time.

To move to a higher-quality model (Claude Sonnet), change one line in `route.ts`:
```typescript
model: 'claude-sonnet-4-5',  // ~5x more expensive, noticeably smarter
```
