Preview & local TLS

This project includes a small set of server routes used for CMS previewing and a proxy to a WordPress GraphQL endpoint. When developing locally you may need to configure TLS so Next.js can talk to a local (mkcert) or remote dev WordPress instance.

Environment variables

- `PREVIEW_SECRET` (required at runtime for preview routes) — a random shared secret used by the preview endpoints.
- `NEXT_PUBLIC_WORDPRESS_GRAPHQL` (required for the preview-proxy health check) — upstream GraphQL endpoint.
- `PREVIEW_CA_PATH` (optional) — path to a PEM file containing an additional CA (for mkcert or custom CA). If set, the proxy/health route will use it.
- `PREVIEW_ALLOW_INSECURE` (optional, dev-only) — set to `true` to allow insecure TLS (rejectUnauthorized=false). Do NOT use in production.

Quick mkcert / local TLS notes

- Use `mkcert` to generate a local CA and certificates for your WordPress dev host. Example:

```bash
mkcert -install
mkcert example.test localhost 127.0.0.1 ::1
# set PREVIEW_CA_PATH to the mkcert root CA pem (usually at: $(mkcert -CAROOT)/rootCA.pem)
export PREVIEW_CA_PATH="$(mkcert -CAROOT)/rootCA.pem"
```

- Alternatively you can set `NODE_EXTRA_CA_CERTS` to include the mkcert CA when running the Next.js process.

Running sanity & tests

- Sanity script (quick checks):

```bash
node web/scripts/preview_sanity.mjs
```

- Run unit tests for the web package:

```bash
pnpm --prefix web test
```

Security notes

- Never commit secrets. The repository includes a sanity script that checks for the presence of `PREVIEW_SECRET` in code paths and uses timing-safe comparisons — do not log secret values.

If you want, I can add a short troubleshooting section for common TLS errors (certificate verification failures) or automate a small script to resolve common mkcert paths.
