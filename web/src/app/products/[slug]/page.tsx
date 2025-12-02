import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProductPrice, getProductStockStatus } from '@/lib/graphql';
import { getProductQuerySchema, productSchema } from '@/lib/validation/product';
import { z } from 'zod';
import ProductDetailClient from '@/components/products/ProductDetailClient';
import { CartDrawer } from '@/components/cart';

function stripHtml(html?: string | null) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').slice(0, 160);
}

export async function generateMetadata({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return {};
  const slug = String(resolvedParams.slug);
  const data = await getProductBySlug(slug);
  // Runtime-validate the GraphQL response shape
  getProductQuerySchema.parse(data as unknown);
  const product = data.product;

  if (!product) return {};

  return {
    title: `${product.name} | BAPI`,
    description: stripHtml(product.shortDescription || product.description),
    openGraph: {
      title: product.name,
      description: stripHtml(product.shortDescription || product.description),
      images: product.image ? [product.image.sourceUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    notFound();
  }
  const resolvedParams = await params;
  if (!resolvedParams?.slug) {
    notFound();
  }
  const slug = String(resolvedParams.slug);
  const data = await getProductBySlug(slug);
  // Runtime-validate the GraphQL response shape
  getProductQuerySchema.parse(data as unknown);
  const product = data.product;

  if (!product) {
    notFound();
  }

  // Build a lightweight, serializable shape for the client component
  const productForClient = {
    id: product.id,
    databaseId: product.databaseId ?? 0,
    name: product.name ?? 'Product',
    slug: product.slug ?? '',
    price: getProductPrice(product) || '$0.00',
    stockStatus: getProductStockStatus(product) || null,
    image: product.image
      ? { sourceUrl: product.image.sourceUrl || '', altText: product.image.altText || product.name || '' }
      : null,
    gallery: (product.galleryImages?.nodes || []).map((g) => ({ sourceUrl: g?.sourceUrl || '', altText: g?.altText || '' })),
    variations:
      // normalize variable product variations into simple shape
      // Use the validated product schema to access variation nodes safely
      (product
        ? (() => {
            const validated = productSchema.parse(product) as z.infer<typeof productSchema>;
            return validated.variations?.nodes?.map((v) => ({
              id: v.id,
              databaseId: v.databaseId ?? 0,
              name: v.name || `${product.name} variant`,
              // `price` may or may not exist on different variation types; access safely
              price: (v as { price?: string | null }).price ?? null,
            })) || [];
          })()
        : []) || [],
    shortDescription: product.shortDescription || null,
    description: product.description || null,
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition">
              BAPI
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/products" className="text-primary-500 font-semibold">
                Products
              </Link>
            </nav>
          </div>
        </header>

        <main className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left: images */}
              <div className="lg:col-span-1">
                {productForClient.image ? (
                  <div className="relative w-full h-[420px] rounded mb-4">
                    <Image
                      src={productForClient.image.sourceUrl}
                      alt={productForClient.image.altText || productForClient.name}
                      fill
                      className="object-cover rounded"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[420px] bg-neutral-100 rounded mb-4 flex items-center justify-center">
                    <div className="text-neutral-400">No image</div>
                  </div>
                )}

                {productForClient.gallery && productForClient.gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {productForClient.gallery.map((g, i) => (
                      <div key={i} className="w-full h-20 relative rounded overflow-hidden">
                        <Image src={g.sourceUrl} alt={g.altText || `${productForClient.name} ${i + 1}`} width={160} height={80} className="object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: product info and actions */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{productForClient.name}</h1>
                <p className="text-lg text-primary-500 font-semibold mb-4">{productForClient.price}</p>

                {productForClient.shortDescription && (
                  <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: productForClient.shortDescription }} />
                )}

                <ProductDetailClient product={productForClient} />

                <section className="mt-8 prose max-w-none">
                  <h2>Description</h2>
                  <div dangerouslySetInnerHTML={{ __html: productForClient.description || '<p>No description</p>' }} />
                </section>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-neutral-200 py-8 bg-white">
          <div className="container mx-auto px-4 text-center text-neutral-600">
            <p>&copy; 2025 BAPI. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <CartDrawer />
    </>
  );
}
