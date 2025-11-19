# PREVIEW - Operations & Runbook

This runbook describes operational procedures for the Preview endpoints in the `web` application, including the health endpoint used by uptime monitors, how to rotate the `PREVIEW_SECRET`, and steps to troubleshoot common failures.

Contents
- Purpose & quick check
- Required environment variables
- Health / uptime checks (Pingdom / UptimeRobot) configuration
- Troubleshooting steps (failures, TLS, timeouts)
- Rotating `PREVIEW_SECRET`
- Emergency & rollback steps

## Purpose & quick check

The preview endpoints are used to enable Next.js Preview Mode and to proxy preview requests to the WordPress GraphQL endpoint. Before alerting or escalating, confirm the simplest check:

Manual HTTP check (replace example host/secret):

```bash
export PREVIEW_SECRET="$PREVIEW_SECRET"
curl -i -X POST \
  -H "Content-Type: application/json" \
  -H "x-preview-secret: $PREVIEW_SECRET" \
  -d '{"query":"{ __typename }"}' \
  https://<your-site>/api/preview-proxy/health
```

Expected result: 200 OK and a small JSON body indicating upstream GraphQL is reachable. If this returns 401, 400, 502, or 503 see Troubleshooting below.

## Required environment variables

- `NEXT_PUBLIC_WORDPRESS_GRAPHQL` – The upstream WordPress GraphQL endpoint (e.g., https://wp.example/graphql)
- `PREVIEW_SECRET` – HMAC-like secret required to call preview endpoints. Must be set in production repository secrets and in runtime environment.
- Optional: `PREVIEW_USER` / `PREVIEW_APP_PASSWORD` – Basic Auth credentials for upstream WordPress if required.
- Optional: `PREVIEW_CA_PATH` – Path to a PEM CA to trust for upstream TLS.
- Optional: `PREVIEW_ALLOW_INSECURE` – If `true` in non-production, disables TLS verification for convenience in local dev. Do NOT enable in production.

## Health / uptime checks

Recommended: use a monitor that supports HTTP POST and custom request headers (Pingdom, Upptime, or any synthetic monitoring tool that supports headers).

Suggested monitor settings:

- Type: HTTP(S) POST
- URL: `https://<your-site>/api/preview-proxy/health`
- Headers:
  - `Content-Type: application/json`
  - `x-preview-secret: <your PREVIEW_SECRET>` (use the secret configured as an environment secret in the monitor)
- Body: `{ "query": "{ __typename }" }`
- Check frequency: 1–5 minutes (1 minute is ideal for high-visibility sites)
- Alert criteria: Trigger on 3 consecutive failures (to avoid transient noise). Send to on-call rota with runbook link.

Notes:
- If your uptime monitor does not support custom headers, create a small, authenticated wrapper (internal-only) or use a monitor that allows query-string tokens (not recommended for secrets). Prefer monitors that support secure secrets or integrate with your secret manager.

## Troubleshooting

Common failures and remediation steps.

- 401 Invalid / missing preview secret
  - Cause: `x-preview-secret` header missing or does not match `PREVIEW_SECRET`.
  - Check: confirm monitor or caller is sending the correct header. Locally, run the curl command above.
  - Fix: update the monitor's secret or rotate `PREVIEW_SECRET` (see below).

- 400 Invalid JSON / Missing query
  - Cause: Monitor or caller sent invalid JSON or omitted `query`.
  - Check: Inspect request body and Content-Type header.
  - Fix: Ensure monitor sends valid JSON with `query` field.

- 500 Missing WP endpoint env
  - Cause: `NEXT_PUBLIC_WORDPRESS_GRAPHQL` is not set in the runtime environment.
  - Fix: Set `NEXT_PUBLIC_WORDPRESS_GRAPHQL` in the environment (or in repository secrets / hosting config) and redeploy.

- 502 Upstream fetch failed / non-2xx / TLS verification error / timeout
  - Cause: Upstream WordPress GraphQL returned non-2xx, network/TLS error, or timed out.
  - Check:
    - Inspect `web` logs for structured entries that include `preview-proxy.upstream_non_2xx`, `preview-proxy.upstream_fetch_failed`, or `preview-proxy.upstream_timeout`.
    - Run the manual curl check from this runbook against the WordPress endpoint directly to confirm it responds:

```bash
curl -i -X POST -H 'Content-Type: application/json' \
  -d '{"query":"{ __typename }"}' \
  $NEXT_PUBLIC_WORDPRESS_GRAPHQL
```

  - TLS note: If you see messages like "unable to verify the first certificate" or similar, the server is presenting a cert signed by an untrusted CA (local dev mkcert or self-signed). Options:
    - Add the CA to the host's trust store, or
    - Configure `PREVIEW_CA_PATH` to a PEM file pointing to the CA and restart, or
    - For local development only, set `PREVIEW_ALLOW_INSECURE=true` (DO NOT use in production).

  - Timeouts: The preview proxy uses a configurable timeout (env `PREVIEW_FETCH_TIMEOUT_MS`, default 10000 ms). If upstream is slow, increase the timeout or investigate WP performance.

## Rotating `PREVIEW_SECRET`

Steps to rotate the shared `PREVIEW_SECRET` with zero-downtime where possible:

1. Generate a new secret (use a secure generator):

```bash
openssl rand -base64 32
# or: pwgen, or your secret manager's generator
```

2. Add the new secret to your deployment environment (CI/hosting) as `PREVIEW_SECRET_NEW` or directly overwrite `PREVIEW_SECRET` in your secret store. Prefer safe rollout:
  - Add new secret under a temporary key in the secret manager or repository secrets (e.g., `PREVIEW_SECRET_NEXT`).

3. Deploy an application update that accepts either the old or new secret temporarily (optional):
  - If you prefer zero-downtime rotation, change code to accept either secret for a short window. Otherwise proceed with direct update.

4. Update monitoring to use the new secret.

5. Replace `PREVIEW_SECRET` with the new value in your hosting environment and redeploy.

6. Monitor the health endpoint and logs for errors. When confident the new secret is active everywhere, remove the old secret from stores.

Notes: If you cannot do a dual-accept rollout, schedule a quick maintenance window and update `PREVIEW_SECRET` and monitors together.

## Emergency & rollback

- If previews must be disabled quickly, remove `PREVIEW_SECRET` from the runtime environment. This will make the proxy return 503 (Preview disabled). Note this is a blunt instrument and will prevent previews for all users.
- If TLS verification blocks traffic and you need a short-term workaround in a trusted environment, set `PREVIEW_ALLOW_INSECURE=true` in non-production only.

## Contact & escalation

- Include links to the logs/observability dashboards and on-call contact list here. Keep escalation steps minimal: check monitor -> check app logs -> check WP endpoint -> escalate to platform/WP on-call.

---
Runbook authored on 2025-11-19 — keep this file next to your operations docs and update when the preview proxy behavior changes.
