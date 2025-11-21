import { getProducts } from '@/lib/graphql';
import { getProductPrice } from '@/lib/graphql';
import CartTestClient from './CartTestClient';

export default async function CartTestPage() {
  // Skip data fetching if environment variable not set (build time)
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Cart Test Page</h1>
        <p className="text-red-600">
          NEXT_PUBLIC_WORDPRESS_GRAPHQL environment variable is not configured.
        </p>
      </div>
    );
  }

  // Fetch real products from WooCommerce
  const data = await getProducts(6);
  const products = (data.products?.nodes || []).map((product) => ({
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
  
  return <CartTestClient products={products} />;
}

