import { getProducts } from '@/lib/graphql';
import { getProductPrice } from '@/lib/graphql';
import Link from 'next/link';
import { CartButton, CartDrawer, AddToCartButton } from '@/components/cart';

export default async function Home() {
  // Skip data fetching if environment variable not set (build time)
  let products = [];
  if (process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    const data = await getProducts(6);
    products = (data.products?.nodes || []).map((product) => ({
      id: product.id,
      databaseId: product.databaseId,
      name: product.name || 'Unnamed Product',
      slug: product.slug || '',
      price: getProductPrice(product) || '$0.00',
      image: product.image ? {
        sourceUrl: product.image.sourceUrl || '',
        altText: product.image.altText || product.name || '',
      } : null,
    }));
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-neutral-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition">
              BAPI
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/products" className="text-neutral-700 hover:text-primary-500 transition font-medium">
                Products
              </Link>
              <Link href="/cart-test" className="text-neutral-700 hover:text-primary-500 transition font-medium">
                Cart Test
              </Link>
              <CartButton />
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-neutral-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6 text-neutral-900">
              Building Automation & Control Solutions
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
              Professional sensors and control modules for modern building automation systems
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/products"
                className="bg-accent-500 hover:bg-accent-600 text-neutral-900 px-8 py-3 rounded font-semibold transition shadow-sm hover:shadow-md"
              >
                Browse Products
              </Link>
              <Link
                href="/cart-test"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded font-semibold transition shadow-sm"
              >
                Try Cart Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {products.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900">Featured Products</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-neutral-200 rounded p-6 shadow-sm hover:shadow-lg hover:border-primary-300 transition bg-white"
                  >
                    {product.image && (
                      <img
                        src={product.image.sourceUrl}
                        alt={product.image.altText}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-2 text-neutral-800">{product.name}</h3>
                    <p className="text-2xl font-bold text-primary-500 mb-4">
                      {product.price}
                    </p>
                    <AddToCartButton product={product} className="w-full" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features/USPs */}
        <section className="bg-neutral-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center p-6 bg-white rounded shadow-sm">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Professional Grade</h3>
                <p className="text-neutral-600">
                  Industry-leading sensors and control modules
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded shadow-sm">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Easy Integration</h3>
                <p className="text-neutral-600">
                  BACnet, Modbus, and wireless connectivity
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded shadow-sm">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-bold mb-2 text-neutral-900">Reliable Support</h3>
                <p className="text-neutral-600">
                  Expert technical assistance when you need it
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 py-8 bg-white">
          <div className="container mx-auto px-4 text-center text-neutral-600">
            <p>&copy; 2025 BAPI. All rights reserved.</p>
          </div>
        </footer>
      </div>
      
      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
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