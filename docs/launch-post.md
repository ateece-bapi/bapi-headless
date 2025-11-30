---
title: "Launching BAPI‑Headless — Headless WordPress + Next.js for Sensor Solutions"
date: 2025-11-29
---

TL;DR
----
We rebuilt BAPI’s public website and product catalog as a headless WordPress backend with a Next.js frontend to deliver faster, more secure, and more extensible Sensor solutions. This series documents the work as a team — migration, GraphQL and type-safety, cart and checkout design, CI and deployment, and monitoring — with practical steps and code examples so other teams can replicate it.

Why we did this
----------------
BAPI (https://www.bapihvac.com/) specializes in HVAC Sensor solutions. Our content, product data, and customer-facing tools were already in WordPress and WooCommerce, but we wanted:

- Better performance and SEO with server-rendered React pages.
- A predictable developer experience and type-safety across backend → frontend.
- A scalable, modular approach so product and marketing teams can iterate independently.

Moving to a headless architecture let us keep WordPress as the single source of truth for content while modernizing the presentation layer with React and TypeScript.

What we built (team summary)
----------------------------
- Backend: WordPress + WooCommerce hosted on Kinsta; WPGraphQL + WPGraphQL for WooCommerce expose product and content data.
- Frontend: Next.js (App Router) using React + TypeScript, styled with Tailwind CSS and design tokens for BAPI brand consistency.
- GraphQL: graphql-request and GraphQL Code Generator to produce type-safe query code and generated TypeScript types used across the app.
- Cart & State: Zustand persisted store with small, composable UI components (AddToCart, CartDrawer) and server API routes for order creation.
- Deployment & CI: Vercel for frontend previews and production; GitHub Actions for type-checks, lint, and test runs. Monitoring and analytics are planned as part of the rollout.

Key milestones completed by the team
-----------------------------------
- Created a Kinsta staging environment and migrated the database from DDEV using WP‑CLI with careful serialized replacements.
- Enabled GraphQL introspection on staging and generated TypeScript types via GraphQL Code Generator (~36k lines of generated types).
- Implemented a type-safe GraphQL client and safe query wrappers for product listing and product detail endpoints.
- Built a persistent client-side cart (Zustand) and integrated Add‑to‑Cart flows into product listing and homepage components.
- Developed a BAPI-branded homepage and a `/products` listing page that show real WooCommerce data via GraphQL.
- Introduced a reusable BAPI color token system and updated components for consistent UI and accessibility improvements.

Project artifacts & demo
------------------------
- Repo: https://github.com/ateece-bapi/bapi-headless
- Live preview: https://bapi-headless.vercel.app
- Project board: https://github.com/users/ateece-bapi/projects/3

Technical highlights (brief)
---------------------------
- Type-safety: GraphQL Codegen produces types consumed throughout server and client code, reducing runtime mismatches.
- Migration: WP‑CLI plus serialized search/replace yielded reliable URL replacements; large media moved via SFTP.
- Cart model: `CartItem` is the canonical shape we use across components and persisted storage to avoid runtime errors.

Planned posts in this series
---------------------------
0. Project Launch — goals, architecture, and milestones (this post)
1. Migration & Staging — DDEV → Kinsta, serialized replacements, media migration
2. GraphQL & Types — codegen pipeline, query organization, and tips for WPGraphQL
3. Cart & Client State — Zustand patterns, persistence, and UX considerations for Sensor product catalogs
4. Product Pages — server-rendered product detail pages, variations, and SEO
5. Checkout & Security — API design, WooCommerce order integration, and payment gateway considerations
6. CI, Deploy & Observability — GitHub Actions, Vercel, and monitoring plan
7. Lessons Learned & Roadmap — what worked, what we iterated on, and next steps

Image and asset suggestions
---------------------------
- Hero banner (1200×627): BAPI brand colors, headline “BAPI‑Headless — Headless WordPress + Next.js for Sensor solutions”
- Architecture SVG: WordPress (Kinsta) → WPGraphQL → Next.js (Vercel) with Codegen, Zustand, and API routes
- Migration screenshot: WP‑CLI URL replacements or DDEV import terminal snippet
- GIF: Add‑to‑cart + CartDrawer interaction on demo site

Suggested hashtags and tags
--------------------------
#HeadlessWordPress #NextJS #GraphQL #SensorSolutions #WooCommerce #WebDev #TypeScript

Call to action
--------------
We’ll publish the next article focused on migration and staging this week. If you’re working with Sensor solutions or managing legacy WordPress/WooCommerce sites, follow the series and open an issue in the repo with questions or collaboration ideas. We welcome feedback and contributions.

— The BAPI engineering team

--

LinkedIn-ready short post (copy for a LinkedIn status or the top of a LinkedIn article)
---------------------------------------------------------------------------------
We’re launching a short series documenting how we rebuilt BAPI’s site as a headless WordPress + Next.js application focused on delivering better Sensor solutions.

TL;DR: migration, GraphQL types, cart UX, and deployment. Read the full post and follow the series: https://github.com/ateece-bapi/bapi-headless

#HeadlessWordPress #NextJS #SensorSolutions #GraphQL
