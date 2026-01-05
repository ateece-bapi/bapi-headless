import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  FileText,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

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

      {/* Dashboard Grid */}
      <section className="w-full py-12 lg:py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {dashboardSections.map((section) => {
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
