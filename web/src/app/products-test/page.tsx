import { getProducts } from '@/lib/graphql';
import { getProductPrice, getProductStockStatus } from '@/lib/graphql';
import { getCollectionPageJsonLd } from '@/lib/seo';
export const metadata = {
  title: 'Products Test | BAPI',
  description: 'Test page for viewing building automation products and their stock status.',
  openGraph: {
    title: 'Products Test | BAPI',
    description: 'Test page for viewing building automation products and their stock status.',
    type: 'website',
    url: 'https://yourdomain.com/products-test',
    images: [
      {
        url: 'https://yourdomain.com/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'BAPI - Building Automation Products'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products Test | BAPI',
    description: 'Test page for viewing building automation products and their stock status.',
    images: ['https://yourdomain.com/og-default.jpg']
  },
  alternates: {
    canonical: '/products-test'
  }
};
import Image from 'next/image';

export default async function ProductsTestPage() {
  // --- JSON-LD Structured Data ---
  const jsonLd = getCollectionPageJsonLd({
    title: 'Products Test | BAPI',
    description: 'Test page for viewing building automation products and their stock status.',
    url: 'https://yourdomain.com/products-test'
  });
  // Skip data fetching if environment variable not set (build time)
  if (!process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Products Test</h1>
        <p className="text-red-600">
          NEXT_PUBLIC_WORDPRESS_GRAPHQL environment variable is not configured.
        </p>
      </div>
    );
  }

  const data = await getProducts(5);
  const products = data.products?.nodes || [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const price = getProductPrice(product);
          const stockStatus = getProductStockStatus(product);
          
          return (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              {product.image && (
                <Image
                  src={product.image.sourceUrl || ''}
                  alt={product.image.altText || product.name || ''}
                  width={640}
                  height={192}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  {price || 'N/A'}
                </span>
                
                {stockStatus && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    stockStatus === 'IN_STOCK' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stockStatus}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                Type: {product.__typename}
              </p>
            </div>
          );
        })}
      </div>
      
      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No products found</p>
      )}
    </div>
    </>
  );


}
