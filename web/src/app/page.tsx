import Image from "next/image";
import { cookies } from "next/headers";

type PageData = {
  title?: string;
  content?: string;
};

export default async function Home() {
  // Resolve cookies and detect preview mode
  const cookieStore = await cookies();
  const isPreview = !!cookieStore.get("__prerender_bypass")?.value;

  let pageData: PageData | null = null;

  if (isPreview) {
    try {
      // Build an absolute URL for server-side fetches.
      // In dev, NEXT_PUBLIC_APP_URL can be left undefined and we fall back to localhost.
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000";
      const previewProxyUrl = new URL("/api/preview-proxy", origin).toString();

      // Replace this query to match your WP GraphQL schema if different.
      const query = `
        query PagePreview($uri: String!) {
          pageBy(uri: $uri) {
            id
            title
            content
          }
        }
      `;
      const variables = { uri: "/" };

      const res = await fetch(previewProxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        // Ensure preview requests bypass any Next caching
        cache: "no-store",
      });

      // If the proxy returned a non-JSON or error, handle gracefully
      const json = await res.json().catch(() => null);
      const page = json?.data?.pageBy;
      if (page) {
        pageData = {
          title: page.title ?? "",
          content: page.content ?? "",
        };
      } else {
        // When WP returns nothing for preview, keep pageData null and fall back to starter UI
        pageData = null;
      }
    } catch (err) {
      // Non-fatal: log to server terminal and fall back to default UI
      // eslint-disable-next-line no-console
      console.error("preview fetch error", err);
      pageData = null;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {isPreview && pageData ? (
            <div className="max-w-3xl text-left">
              <h2 className="text-2xl font-semibold text-rose-500">Preview mode</h2>
              <h1 className="mt-4 text-3xl font-bold">{pageData.title}</h1>

              {/* WordPress content is HTML — sanitize in production. */}
              <article
                className="mt-6 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: pageData.content ?? "" }}
              />
            </div>
          ) : (
            <>
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                To get started, edit the page.tsx file.
              </h1>
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Looking for a starting point or more instructions? Head over to{" "}
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Templates
                </a>{" "}
                or the{" "}
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learning
                </a>{" "}
                center.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>

          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-black/[.12] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}