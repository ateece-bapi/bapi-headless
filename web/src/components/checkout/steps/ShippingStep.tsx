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
import type { CheckoutData } from '../CheckoutPageClient';
import { useToast } from '@/components/ui/Toast';

interface ShippingStepProps {
  data: CheckoutData;
  onNext: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
}

export default function ShippingStep({
  data,
  onNext,
  onUpdateData,
}: ShippingStepProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(data.shippingAddress);
  const [sameAsShipping, setSameAsShipping] = useState(
    data.billingAddress.sameAsShipping
  );
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
        showToast('warning', 'Missing Information', `Please fill in all required fields`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('warning', 'Invalid Email', 'Please enter a valid email address');
      return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(formData.phone)) {
      showToast('warning', 'Invalid Phone', 'Please enter a valid phone number');
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
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-6 h-6 text-primary-500" />
          <h2 className="text-2xl font-bold text-neutral-900">
            Shipping Address
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Company (Optional) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Company (Optional)
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Address Line 1 */}
          <div className="sm:col-span-2">
            <label
              htmlFor="address1"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Address *
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              required
              placeholder="Street address"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* State */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              State *
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="CA, NY, TX, etc."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Postcode */}
          <div>
            <label
              htmlFor="postcode"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              ZIP Code *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              placeholder="12345"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              required
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(555) 123-4567"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Billing Address Toggle */}
      <div className="border-t border-neutral-200 pt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="w-5 h-5 text-primary-500 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Billing address same as shipping address
          </span>
        </label>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-6 border-t border-neutral-200">
        <button
          type="submit"
          className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
        >
          Continue to Payment
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
