import { redirect } from 'next/navigation';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import { getServerAuth } from '@/lib/auth/server';

export default async function FavoritesTestPage() {
  const { user } = await getServerAuth();

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
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">Test Favorites Feature</h1>
          <p className="mb-4 text-neutral-600">
            Click the heart icons below to add/remove products from your favorites
          </p>
          <Link
            href="/account/favorites"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            View My Favorites
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-3 top-3">
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
                <h3 className="mb-2 font-bold text-neutral-900">{product.name}</h3>
                <p className="mb-4 text-lg font-bold text-primary-600">{product.price}</p>
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
