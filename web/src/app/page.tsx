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