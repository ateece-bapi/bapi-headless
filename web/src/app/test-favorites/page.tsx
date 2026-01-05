import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

export default async function FavoritesTestPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Sample products for testing
  const testProducts = [
    {
      id: 'test-product-1',
      name: 'Temperature Sensor BA/T-2000',
      slug: 'temperature-sensor-bat2000',
      image: 'https://placehold.co/400x400/0066CC/white?text=Sensor+1',
      price: '$89.99',
    },
    {
      id: 'test-product-2',
      name: 'Humidity Sensor BA/RH-200',
      slug: 'humidity-sensor-barh200',
      image: 'https://placehold.co/400x400/009688/white?text=Sensor+2',
      price: '$129.99',
    },
    {
      id: 'test-product-3',
      name: 'Pressure Transducer BA/P-4000',
      slug: 'pressure-transducer-bap4000',
      image: 'https://placehold.co/400x400/FF6B35/white?text=Sensor+3',
      price: '$249.99',
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Test Favorites Feature
          </h1>
          <p className="text-neutral-600 mb-4">
            Click the heart icons below to add/remove products from your favorites
          </p>
          <Link
            href="/account/favorites"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
          >
            View My Favorites
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden"
            >
              <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <FavoriteButton
                    productId={product.id}
                    productName={product.name}
                    productSlug={product.slug}
                    productImage={product.image}
                    productPrice={product.price}
                    size="lg"
                    variant="icon"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-neutral-900 mb-2">{product.name}</h3>
                <p className="text-lg font-bold text-primary-600 mb-4">{product.price}</p>
                <FavoriteButton
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                  productImage={product.image}
                  productPrice={product.price}
                  variant="button"
                  size="md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
