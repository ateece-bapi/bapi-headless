import { getServerAuth } from '@/lib/auth/server';
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
  CreditCard,
} from 'lucide-react';
import { Link } from '@/lib/navigation';
import { getMockUserData, isMockDataEnabled } from '@/lib/mock-user-data';
import AccountDashboardClient from '@/components/account/AccountDashboardClient';
import { getTranslations } from 'next-intl/server';

type AccountPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  const { user } = await getServerAuth();
  const t = await getTranslations('account.dashboard');

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  // Get user's display name from WordPress
  const displayName = user.displayName || user.username || user.email?.split('@')[0] || 'there';

  // Get mock data if enabled
  const mockEnabled = isMockDataEnabled();
  const profile = mockEnabled ? getMockUserData(user.id) : null;

  const dashboardSections = [
    {
      title: t('sections.profile.title'),
      description: t('sections.profile.description'),
      icon: User,
      href: `/${locale}/account/profile`,
      color: 'primary',
    },
    {
      title: t('sections.orderHistory.title'),
      description: t('sections.orderHistory.description'),
      icon: Package,
      href: `/${locale}/account/orders`,
      color: 'primary',
    },
    {
      title: t('sections.savedProducts.title'),
      description: t('sections.savedProducts.description'),
      icon: Heart,
      href: `/${locale}/account/favorites`,
      color: 'accent',
    },
    {
      title: t('sections.quoteRequests.title'),
      description: t('sections.quoteRequests.description'),
      icon: FileText,
      href: `/${locale}/account/quotes`,
      color: 'primary',
    },
    {
      title: t('sections.shoppingCart.title'),
      description: t('sections.shoppingCart.description'),
      icon: ShoppingBag,
      href: `/${locale}/cart`,
      color: 'primary',
    },
    {
      title: t('sections.accountSettings.title'),
      description: t('sections.accountSettings.description'),
      icon: Settings,
      href: `/${locale}/account/settings`,
      color: 'neutral',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mock Data Banner */}
      {mockEnabled && profile && (
        <div className="w-full border-b border-yellow-200 bg-yellow-50">
          <div className="mx-auto max-w-container px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span>
                <strong>{t('mockDataBanner')}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-container px-4 py-12 sm:px-6 lg:px-8 lg:py-16 xl:px-12">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold text-neutral-900 lg:text-5xl">
              {t('welcomeBack', { displayName })}
            </h1>
            <p className="text-lg text-neutral-700 lg:text-xl">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats - Only show if mock data available */}
      {profile && (
        <section className="w-full border-b border-neutral-200 bg-white py-8">
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Company Info */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-500">{t('company')}</p>
                  <p className="font-semibold text-neutral-900">{profile.companyName}</p>
                  <p className="text-sm text-neutral-700">{t('accountNumber')} {profile.accountNumber}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                  <Package className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-500">{t('recentOrders')}</p>
                  <p className="font-semibold text-neutral-900">
                    {t('ordersCount', { count: profile.orderHistory.length })}
                  </p>
                  <Link
                    href={`/${locale}/account/orders`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('viewAll')}
                  </Link>
                </div>
              </div>

              {/* Saved Quotes */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent-50">
                  <FileText className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-neutral-500">{t('savedQuotes')}</p>
                  <p className="font-semibold text-neutral-900">
                    {t('quotesCount', { count: profile.savedQuotes.length })}
                  </p>
                  <Link
                    href={`/${locale}/account/quotes`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('viewAll')}
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
          <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t('recentActivity')}</h2>
            <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
              {profile.orderHistory.slice(0, 3).map((order) => (
                <div key={order.orderId} className="p-6 transition-colors hover:bg-neutral-50">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{order.orderId}</h3>
                      <p className="text-sm text-neutral-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">${order.total.toFixed(2)}</p>
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {t(`orderStatus.${order.status}`)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-neutral-700">
                        {item.quantity}x {item.name} ({item.sku})
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-neutral-500">
                        {order.items.length - 2 === 1
                          ? t('moreItems', { count: order.items.length - 2 })
                          : t('moreItemsPlural', { count: order.items.length - 2 })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/${locale}/account/orders`}
                className="inline-flex items-center gap-2 font-medium text-primary-600 hover:text-primary-700"
              >
                {t('viewAllOrders')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Dashboard Grid */}
      <section className="w-full py-12 lg:py-16">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8 xl:px-12">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t('accountManagement')}</h2>
          
          {/* Two-Factor Authentication Banner */}
          <AccountDashboardClient locale={locale} />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {dashboardSections.map((section) => {
              const IconComponent = section.icon;
              const bgColor =
                section.color === 'accent'
                  ? 'bg-accent-50'
                  : section.color === 'neutral'
                    ? 'bg-neutral-100'
                    : 'bg-primary-50';
              const iconColor =
                section.color === 'accent'
                  ? 'text-accent-600'
                  : section.color === 'neutral'
                    ? 'text-neutral-700'
                    : 'text-primary-600';
              const hoverBorder =
                section.color === 'accent' ? 'hover:border-accent-500' : 'hover:border-primary-500';

              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className={`group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg lg:p-8 ${hoverBorder} flex flex-col`}
                >
                  <div
                    className={`h-14 w-14 ${bgColor} mb-4 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                  >
                    <IconComponent className={`h-7 w-7 ${iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-900">{section.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-700">{section.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
