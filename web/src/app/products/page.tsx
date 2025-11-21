import { getProducts } from '@/lib/graphql';
import { getProductPrice } from '@/lib/graphql';
import Link from 'next/link';
import { AddToCartButton, CartButton, CartDrawer } from '@/components/cart';
import type { CartItem } from '@/store';

type ProductData = Omit<CartItem, 'quantity'>;

export const metadata = {
  title: 'Products | BAPI',
  description: 'Browse our complete selection of building automation sensors and control modules',
};

export default async function ProductsPage() {
  // Fetch all products (or paginate if needed)
  let products: ProductData[] = [];
  let hasProducts = false;

  if (process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    try {
      const data = await getProducts(50); // Get up to 50 products
      products = (data.products?.nodes || []).map((product) => ({
        id: product.id,
        databaseId: product.databaseId ?? 0,
        name: product.name || 'Unnamed Product',
        slug: product.slug || '',
        price: getProductPrice(product) || '$0.00',
        image: product.image ? {
          sourceUrl: product.image.sourceUrl || '',
          altText: product.image.altText || product.name || '',
        } : null,
      }));
      hasProducts = products.length > 0;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition">
              BAPI
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/products" className="text-primary-500 font-semibold">
                Products
              </Link>
              <Link href="/cart-test" className="text-neutral-700 hover:text-primary-500 transition font-medium">
                Cart Test
              </Link>
              <CartButton />
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <section className="bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Products</h1>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Professional sensors and control modules for building automation systems. 
              All products integrate seamlessly with BACnet, Modbus, and wireless protocols.
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {!hasProducts ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-2">No Products Available</h2>
                <p className="text-neutral-600">
                  Products will appear here once they&apos;re added to your WooCommerce store.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-neutral-600">
                  Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-neutral-200 rounded p-6 shadow-sm hover:shadow-lg hover:border-primary-300 transition bg-white"
                    >
                      {product.image ? (
                        <img
                          src={product.image.sourceUrl}
                          alt={product.image.altText || product.name}
                          className="w-full h-48 object-cover rounded mb-4"
                        />
                      ) : (
                        <div className="w-full h-48 bg-neutral-100 rounded mb-4 flex items-center justify-center">
                          <svg className="w-16 h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      <h3 className="text-lg font-semibold mb-2 text-neutral-800 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                      
                      <p className="text-2xl font-bold text-primary-500 mb-4">
                        {product.price}
                      </p>
                      
                      <div className="space-y-2">
                        <AddToCartButton product={product} className="w-full" />
                        <Link
                          href={`/products/${product.slug}`}
                          className="block w-full text-center py-2 px-4 border border-primary-500 text-primary-500 rounded hover:bg-primary-50 transition font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-primary-500 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Our technical team can help you select the right sensors and controls for your project.
            </p>
            <a
              href="https://www.bapihvac.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-semibold px-8 py-3 rounded transition"
            >
              Contact Support
            </a>
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
