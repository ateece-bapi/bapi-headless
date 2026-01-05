import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react';

export default async function FavoritesPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // TODO: In production, fetch saved products from database using user.id
  // For now, showing empty state with instructions

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
            Saved Products
          </h1>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="w-full py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
            <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-accent-500" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">
              No Saved Products Yet
            </h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-8">
              Start saving your favorite products to quickly access them later. 
              Click the heart icon on any product page to add it to your favorites.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-neutral-900 font-bold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
            >
              Browse Products
            </Link>
          </div>

          {/* Example Saved Products (for design reference when implemented) */}
          <div className="mt-12 opacity-30">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Your Favorites (Example Layout)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 flex gap-4"
                >
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 mb-1">
                      Example Product Name
                    </h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      Product category
                    </p>
                    <p className="text-lg font-bold text-primary-600">$99.00</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="w-10 h-10 rounded-lg bg-neutral-100 hover:bg-red-50 flex items-center justify-center text-neutral-600 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button className="w-10 h-10 rounded-lg bg-primary-50 hover:bg-primary-100 flex items-center justify-center text-primary-600 transition-colors">
                      <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Note */}
          <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h4 className="font-bold text-primary-900 mb-2">Implementation Note</h4>
            <p className="text-sm text-primary-800">
              <strong>Next Steps:</strong> Implement favorites functionality with:
            </p>
            <ul className="text-sm text-primary-800 mt-2 space-y-1 ml-4">
              <li>• Database table to store user favorites (user_id, product_id, created_at)</li>
              <li>• API endpoints: GET /api/favorites, POST /api/favorites, DELETE /api/favorites/:id</li>
              <li>• Heart button on product pages with optimistic UI updates</li>
              <li>• This page fetches and displays saved products with product details from GraphQL</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
