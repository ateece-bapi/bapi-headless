'use client';

/**
 * Shipping Step Component
 *
 * Step 1 of checkout: Collect shipping address
 * - Shipping address form with validation
 * - Billing address toggle (same as shipping)
 * - Form validation before proceeding
 */

import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CheckoutData } from '../CheckoutPageClient';
import { useToast } from '@/components/ui/Toast';

interface ShippingStepProps {
  data: CheckoutData;
  onNext: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

export default function ShippingStep({ data, onNext, onUpdateData }: ShippingStepProps) {
  const { showToast } = useToast();
  const t = useTranslations('checkoutPage.shipping');
  const [formData, setFormData] = useState(data.shippingAddress);
  const [sameAsShipping, setSameAsShipping] = useState(data.billingAddress.sameAsShipping);
  const [billingData, setBillingData] = useState(data.billingAddress);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const required = [
      'firstName',
      'lastName',
      'address1',
      'city',
      'state',
      'postcode',
      'country',
      'phone',
      'email',
    ];

    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        showToast('warning', t('validation.missingInfo'), t('validation.missingInfoMessage'));
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('warning', t('validation.invalidEmail'), t('validation.invalidEmailMessage'));
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast('warning', t('validation.invalidPhone'), t('validation.invalidPhoneMessage'));
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Update checkout data
    onUpdateData({
      shippingAddress: formData,
      billingAddress: sameAsShipping
        ? { ...formData, sameAsShipping: true }
        : { ...billingData, sameAsShipping: false },
    });

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address Section */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-neutral-900">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('firstName')} *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('lastName')} *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Company (Optional) */}
          <div className="sm:col-span-2">
            <label htmlFor="company" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('company')}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Address Line 1 */}
          <div className="sm:col-span-2">
            <label htmlFor="address1" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('address')} *
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              required
              placeholder={t('addressPlaceholder')}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Address Line 2 (Optional) */}
          <div className="sm:col-span-2">
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              placeholder={t('address2Placeholder')}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('city')} *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('state')} *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder={t('statePlaceholder')}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Postcode */}
          <div>
            <label htmlFor="postcode" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('zipCode')} *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              placeholder={t('zipCodePlaceholder')}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('country')} *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="US">{t('countries.us')}</option>
              <option value="CA">{t('countries.ca')}</option>
              <option value="MX">{t('countries.mx')}</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('phone')} *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder={t('phonePlaceholder')}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
              {t('email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Billing Address Toggle */}
      <div className="border-t border-neutral-200 pt-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="h-5 w-5 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            {t('billingSameAsShipping')}
          </span>
        </label>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end border-t border-neutral-200 pt-6">
        <button
          type="submit"
          className="btn-bapi-primary flex items-center gap-2 rounded-xl px-8 py-4"
        >
          {t('continueButton')}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
