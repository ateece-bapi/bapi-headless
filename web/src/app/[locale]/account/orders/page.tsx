import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Eye, Download, AlertCircle } from 'lucide-react';
import logger from '@/lib/logger';
import { authenticatedGraphqlClient } from '@/lib/graphql/authenticated-client';
import { GET_CUSTOMER_ORDERS } from '@/lib/graphql/queries/customer-orders';
import { getMockUserData, isMockDataEnabled } from '@/lib/mock-user-data';

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
  const { user } = await getServerAuth();

  if (!user) {
    redirect('/sign-in');
  }

  // Check for mock data first
  const mockEnabled = isMockDataEnabled();
  const profile = mockEnabled ? getMockUserData(user.id) : null;

  // WordPress customer ID is the user's database ID from WordPress
  const wpCustomerId = parseInt(user.id);

  let orders: Order[] = [];
  let error = null;
  let useMockData = false;

  // If mock data available, use it
  if (profile) {
    useMockData = true;
    orders = profile.orderHistory.map((order) => ({
      id: order.orderId,
      databaseId: parseInt(order.orderId.split('-')[2] || '0'),
      orderNumber: order.orderId,
      date: order.date,
      status: order.status,
      total: `$${order.total.toFixed(2)}`,
      lineItems: {
        nodes: order.items.map((item) => ({
          quantity: item.quantity,
          product: {
            node: {
              name: item.name,
              image: undefined,
            },
          },
        })),
      },
    }));
  } else if (wpCustomerId) {
    try {
      const data = await authenticatedGraphqlClient.request(GET_CUSTOMER_ORDERS, {
        customerId: wpCustomerId,
        first: 50,
      });
      orders = data.customer?.orders?.nodes || [];
    } catch (err) {
      logger.error('Error fetching orders', err);
      error = 'Failed to load order history';
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Mock Data Banner */}
      {useMockData && (
        <div className="w-full border-b border-yellow-200 bg-yellow-50">
          <div className="mx-auto max-w-container px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span>
                <strong>Development Mode:</strong> Showing mock order data
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="bg-linear-to-r w-full from-primary-600 to-primary-700 text-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/account"
            className="mb-6 inline-flex items-center gap-2 font-semibold text-white/90 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold lg:text-4xl">Order History</h1>
          <p className="mt-2 text-white/90">View and track all your orders</p>
        </div>
      </section>

      {/* Orders Content */}
      <section className="w-full py-12">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-800">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
                  <Package className="h-10 w-10 text-primary-600" strokeWidth={2} />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-neutral-900">No Orders Yet</h2>
              <p className="mx-auto mb-8 max-w-md text-neutral-600">
                {wpCustomerId
                  ? "You haven't placed any orders yet. Start shopping to see your order history here."
                  : 'Your account is being set up. Order history will appear here once available.'}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-700 hover:shadow-lg"
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
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-xl font-bold text-neutral-900">
                            Order #{order.orderNumber}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-neutral-600">
                          Placed on{' '}
                          {new Date(order.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{order.total}</p>
                        <p className="text-sm text-neutral-600">
                          {order.lineItems.nodes.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                          items
                        </p>
                      </div>
                    </div>

                    {/* Product Preview */}
                    <div className="mb-4 flex gap-3 overflow-x-auto pb-2">
                      {order.lineItems.nodes.slice(0, 4).map((item, idx) => (
                        <div
                          key={idx}
                          className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100"
                        >
                          {item.product.node.image?.sourceUrl ? (
                            <img
                              src={item.product.node.image.sourceUrl}
                              alt={item.product.node.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-6 w-6 text-neutral-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.lineItems.nodes.length > 4 && (
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-semibold text-neutral-600">
                          +{order.lineItems.nodes.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/account/orders/${order.databaseId}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.5} />
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        <Download className="h-4 w-4" strokeWidth={2.5} />
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
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || 'border-neutral-200 bg-neutral-100 text-neutral-800'
      }`}
    >
      {label}
    </span>
  );
}
