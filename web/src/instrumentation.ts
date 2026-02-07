import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }

  // Client-side Sentry initialization
  if (process.env.NEXT_RUNTIME === "browser") {
    await import("../sentry.client.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
