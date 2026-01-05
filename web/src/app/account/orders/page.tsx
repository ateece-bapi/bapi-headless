import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Eye, Download } from 'lucide-react';
import { authenticatedGraphqlClient } from '@/lib/graphql/authenticated-client';
import { GET_CUSTOMER_ORDERS } from '@/lib/graphql/queries/customer-orders';

interface Order {
  id: string;
  databaseId: number;
  orderNumber: string;
  date: string;
  status: string;
  total: string;
  lineItems: {
    nodes: Array<{
      quantity: number;
      product: {
        node: {
          name: string;
          image?: {
            sourceUrl: string;
          };
        };
      };
    }>;
  };
}

export default async function OrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get WordPress customer ID from Clerk metadata
  const wpCustomerId = user.publicMetadata?.wordpressCustomerId as number | undefined;

  let orders: Order[] = [];
  let error = null;

  if (wpCustomerId) {
    try {
      const data = await authenticatedGraphqlClient.request(GET_CUSTOMER_ORDERS, {
        customerId: wpCustomerId,
        first: 50,
      });
      orders = data.customer?.orders?.nodes || [];
    } catch (err) {
      console.error('Error fetching orders:', err);
      error = 'Failed to load order history';
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="w-full bg-linear-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold">Order History</h1>
          <p className="text-white/90 mt-2">
            View and track all your orders
          </p>
        </div>
      </section>

      {/* Orders Content */}
      <section className="w-full py-12">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-800">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <Package className="w-10 h-10 text-primary-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                No Orders Yet
              </h2>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                {wpCustomerId 
                  ? "You haven't placed any orders yet. Start shopping to see your order history here."
                  : "Your account is being set up. Order history will appear here once available."}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </h2>
              </div>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-neutral-900">
                            Order #{order.orderNumber}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-neutral-600">
                          Placed on {new Date(order.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {order.total}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {order.lineItems.nodes.reduce((sum, item) => sum + item.quantity, 0)} items
                        </p>
                      </div>
                    </div>

                    {/* Product Preview */}
                    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                      {order.lineItems.nodes.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden"
                        >
                          {item.product.node.image?.sourceUrl ? (
                            <img
                              src={item.product.node.image.sourceUrl}
                              alt={item.product.node.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.lineItems.nodes.length > 4 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-600 text-sm font-semibold">
                          +{order.lineItems.nodes.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/account/orders/${order.databaseId}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" strokeWidth={2.5} />
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 font-semibold text-sm rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" strokeWidth={2.5} />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// Helper function for status badges
function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    'on-hold': 'bg-orange-100 text-orange-800 border-orange-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-purple-100 text-purple-800 border-purple-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
  };

  const label = status.replace('-', ' ');

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border capitalize ${
        styles[status] || 'bg-neutral-100 text-neutral-800 border-neutral-200'
      }`}
    >
      {label}
    </span>
  );
}
