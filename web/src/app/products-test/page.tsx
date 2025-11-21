import { getProducts } from '@/lib/graphql';
import { getProductPrice, getProductStockStatus } from '@/lib/graphql';

export default async function ProductsTestPage() {
  const data = await getProducts(5);
  const products = data.products?.nodes || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const price = getProductPrice(product);
          const stockStatus = getProductStockStatus(product);
          
          return (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              {product.image && (
                <img
                  src={product.image.sourceUrl || ''}
                  alt={product.image.altText || product.name || ''}
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
  );
}
