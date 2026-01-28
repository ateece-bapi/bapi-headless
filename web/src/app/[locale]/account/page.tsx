import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  FileText,
  ShoppingBag,
  AlertCircle,
  Building2,
  MapPin,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { getMockUserData, isMockDataEnabled } from '@/lib/mock-user-data';

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Get user's display name from Clerk or WordPress metadata
  const displayName = user.firstName || 
                     user.lastName ||
                     (user.username as string) ||
                     user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
                     'there';

  // Get mock data if enabled
  const mockEnabled = isMockDataEnabled();
  const profile = mockEnabled ? getMockUserData(user.id) : null;

  const dashboardSections = [
    {
      title: 'Profile',
      description: 'Manage your account information and preferences',
      icon: User,
      href: '/account/profile',
      color: 'primary',
    },
    {
      title: 'Order History',
      description: 'View your past orders and track shipments',
      icon: Package,
      href: '/account/orders',
      color: 'primary',
    },
    {
      title: 'Saved Products',
      description: 'Access your favorite products and wishlists',
      icon: Heart,
      href: '/account/favorites',
      color: 'accent',
    },
    {
      title: 'Quote Requests',
      description: 'Manage your custom quote requests',
      icon: FileText,
      href: '/account/quotes',
      color: 'primary',
    },
    {
      title: 'Shopping Cart',
      description: 'View and manage items in your cart',
      icon: ShoppingBag,
      href: '/cart',
      color: 'primary',
    },
    {
      title: 'Account Settings',
      description: 'Update your password and security settings',
      icon: Settings,
      href: '/account/settings',
      color: 'neutral',
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Mock Data Banner */}
      {mockEnabled && profile && (
        <div className="w-full bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4" />
              <span><strong>Development Mode:</strong> Showing mock data for testing</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full bg-white border-b border-neutral-200">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Welcome back, {displayName}!
            </h1>
            <p className="text-lg lg:text-xl text-neutral-600">
              Manage your account, orders, and preferences from your dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats - Only show if mock data available */}
      {profile && (
        <section className="w-full py-8 bg-white border-b border-neutral-200">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Company Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Company</p>
                  <p className="font-semibold text-neutral-900">{profile.companyName}</p>
                  <p className="text-sm text-neutral-600">Account #{profile.accountNumber}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Recent Orders</p>
                  <p className="font-semibold text-neutral-900">{profile.orderHistory.length} orders</p>
                  <Link href="/account/orders" className="text-sm text-primary-600 hover:text-primary-700">
                    View all →
                  </Link>
                </div>
              </div>

              {/* Saved Quotes */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Saved Quotes</p>
                  <p className="font-semibold text-neutral-900">{profile.savedQuotes.length} quotes</p>
                  <Link href="/account/quotes" className="text-sm text-primary-600 hover:text-primary-700">
                    View all →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Activity - Only show if mock data available */}
      {profile && profile.orderHistory.length > 0 && (
        <section className="w-full py-8">
          <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 divide-y divide-neutral-200">
              {profile.orderHistory.slice(0, 3).map((order) => (
                <div key={order.orderId} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{order.orderId}</h3>
                      <p className="text-sm text-neutral-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-neutral-600">
                        {item.quantity}x {item.name} ({item.sku})
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-neutral-500">
                        + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                href="/account/orders" 
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Grid */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Account Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">{dashboardSections.map((section) => {
              const IconComponent = section.icon;
              const bgColor = section.color === 'accent' 
                ? 'bg-accent-50' 
                : section.color === 'neutral'
                ? 'bg-neutral-100'
                : 'bg-primary-50';
              const iconColor = section.color === 'accent'
                ? 'text-accent-600'
                : section.color === 'neutral'
                ? 'text-neutral-600'
                : 'text-primary-600';
              const hoverBorder = section.color === 'accent'
                ? 'hover:border-accent-500'
                : 'hover:border-primary-500';

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 lg:p-8 border border-neutral-200 ${hoverBorder} flex flex-col`}
                >
                  <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-7 h-7 ${iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {section.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
