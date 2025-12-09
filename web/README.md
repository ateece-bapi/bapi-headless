# Product Field: partNumber (Developer Note)

## Purpose
The `partNumber` field is reserved for future use. It is intended to store a manufacturer or customer-facing part number, which may differ from the internal SKU. Currently, most products only have a SKU, and `partNumber` is often null.

## Frontend Handling
- The UI will display the SKU if `partNumber` is null, so users always see a value.
- Do not make `partNumber` required in the schema or UI until business needs require it.

## When to Use
- If a product has a distinct part number (different from SKU), populate `partNumber`.
- Otherwise, fallback to displaying SKU in all user-facing contexts.

## Maintenance
- Keep this field in the schema for future flexibility.
- Update this documentation if business requirements change.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

For local preview & TLS instructions see `PREVIEW.md`.

## Monitoring

We expose a health endpoint for the preview proxy at `/api/preview-proxy/health` suitable for uptime checks. Recommended configuration:

- Pingdom / Upptime / UptimeRobot: use an HTTP POST to `https://<your-site>/api/preview-proxy/health` with JSON body `{ "query": "{ __typename }" }` and the header `x-preview-secret: <secret>`.
- Check frequency: 1–5 minutes. Alert on 3 consecutive failures.

Example manual check:

```bash
export PREVIEW_SECRET="${PREVIEW_SECRET}"
curl -i -X POST \
	-H "Content-Type: application/json" \
	-H "x-preview-secret: $PREVIEW_SECRET" \
	-d '{"query":"{ __typename }"}' \
	https://<your-site>/api/preview-proxy/health
```

See `docs/PREVIEW-OPERATIONS.md` for full runbook, rotation steps, and troubleshooting guidance.

CI status badge: [![web CI](https://github.com/ateece-bapi/bapi-headless/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ateece-bapi/bapi-headless/actions/workflows/ci.yml)
