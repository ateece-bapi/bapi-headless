# Live Chat Integration — Scope Decision

**Date:** 2026-07-07  
**Status:** Decided — AI Chatbot + Email Escalation  
**Phase:** Phase 1 (Go-live May 8, 2026)

---

## What Was Built

The Phase 1 "Live Chat Integration" requirement has been fulfilled with an **AI-powered product advisor** rather than a real-time human agent system. This document records the explicit scope decision to prevent stakeholder surprise during testing.

### Implementation Summary

| Component | Details |
|-----------|---------|
| **AI Engine** | Claude Haiku 4.5 via Anthropic API |
| **Capabilities** | Product search, technical Q&A, specifications, installation guidance |
| **Languages** | English, German, French, Spanish, Japanese, Chinese, Vietnamese, Arabic, Thai, Polish |
| **Product Access** | B2B customer-group-filtered catalog (608 products) |
| **Escalation Path** | Human handoff via email (`/api/chat/handoff`) |
| **Rate Limiting** | Per-IP rate limiting on `/api/chat` |
| **Analytics** | Conversation logging, feedback collection, admin dashboard |

### Key Files

- `web/src/app/api/chat/route.ts` — Main AI chat endpoint (SSE streaming)
- `web/src/app/api/chat/handoff/route.ts` — Email escalation to human support
- `web/src/app/api/chat/analytics/route.ts` — Admin analytics dashboard
- `web/src/app/api/chat/feedback/route.ts` — Thumbs up/down feedback collection
- `web/src/components/chat/ChatWidget.tsx` — Client-side chat UI
- `web/src/lib/chat/productSearch.ts` — GraphQL product search for AI context
- `web/src/lib/email/templates/chatHandoff.ts` — Handoff email template

---

## Scope Decision: AI Advisor vs. Real-Time Human Agent

### What "Live Chat" Means in This Implementation

> **AI chatbot with email escalation, not real-time human agent availability.**

When a user cannot get their question answered by the AI, they can submit a handoff request form. This sends an email notification to the BAPI support team. There is **no live messaging queue, no agent presence indicator, and no guaranteed response time SLA** beyond standard email response times.

### Why This Approach Was Chosen

1. **Timeline constraint** — A fully staffed live agent platform (e.g., Intercom, Zendesk Chat, LiveChat.com) requires agent scheduling, training, and tooling that were out of scope for the May 4 deadline.
2. **Product complexity** — BAPI products require technical expertise. An AI with access to the full 608-product catalog provides higher-quality first-response than a general-purpose chat queue.
3. **B2B context** — BAPI's customers are primarily engineers and facility managers who expect accurate technical answers, not instant acknowledgment. Email follow-up is standard for B2B technical support.
4. **Cost-effectiveness** — Operating a staffed live chat requires dedicated headcount. The AI advisor handles routine inquiries automatically.

### What This Is NOT

- ❌ Real-time human agent chat (e.g., Intercom, Zendesk Chat, Tawk.to)
- ❌ Guaranteed response time SLA
- ❌ Agent presence/availability indicator
- ❌ Chat queue with wait time estimates
- ❌ Screen sharing or co-browsing

---

## Stakeholder Communication Checklist

Before stakeholder testing (April 10 – May 3, 2026), confirm the following:

- [ ] **Sales Manager** — Informed that chat is AI-first; human escalation via email
- [ ] **Product Manager** — Confirmed AI advisor satisfies Phase 1 "live chat" requirement
- [ ] **Customer Service** — Receives email notifications for handoff requests; knows where to find the admin analytics dashboard (`/admin/chat`)
- [ ] **Select Customers** — Briefed during testing that "Contact Support" button escalates to email, not a live agent

---

## Phase 2 Consideration

If stakeholder testing reveals that real-time human agent availability is required, Phase 2 should evaluate:

- **Intercom** — Best-in-class B2B live chat, integrates with existing email/CRM
- **Zendesk Chat** — Enterprise SLA management, agent routing
- **Tawk.to** — Free tier for budget-conscious rollout

Any Phase 2 upgrade should preserve the existing AI advisor as a first-pass filter to reduce agent workload.

---

## Decision Authority

This scope was accepted as satisfying the Phase 1 requirement. If this decision needs to be revised, it requires explicit sign-off from the Product Manager before any Phase 2 work begins.
