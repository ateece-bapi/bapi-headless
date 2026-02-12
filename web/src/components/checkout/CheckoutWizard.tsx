'use client';

/**
 * Checkout Wizard Component
 *
 * Multi-step wizard with progress indicator and step components:
 * - Step 1: Shipping Information
 * - Step 2: Payment Method
 * - Step 3: Review & Place Order
 */

import { Check } from 'lucide-react';
import ShippingStep from './steps/ShippingStep';
import PaymentStep from './steps/PaymentStep';
import ReviewStep from './steps/ReviewStep';
import type { CheckoutData } from './CheckoutPageClient';

interface CheckoutWizardProps {
  currentStep: number;
  checkoutData: CheckoutData;
  onNext: () => void;
  onBack: () => void;
  onUpdateData: (data: Partial<CheckoutData>) => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

const steps = [
  { number: 1, title: 'Shipping', description: 'Delivery address' },
  { number: 2, title: 'Payment', description: 'Payment method' },
  { number: 3, title: 'Review', description: 'Place order' },
];

export default function CheckoutWizard({
  currentStep,
  checkoutData,
  onNext,
  onBack,
  onUpdateData,
  onPlaceOrder,
  isProcessing,
}: CheckoutWizardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Progress Steps */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-1 items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all sm:h-12 sm:w-12 sm:text-base ${
                    currentStep > step.number
                      ? 'bg-success-500 text-white'
                      : currentStep === step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-200 text-neutral-500'
                  } `}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-xs font-semibold sm:text-sm ${
                      currentStep >= step.number ? 'text-neutral-900' : 'text-neutral-500'
                    } `}
                  >
                    {step.title}
                  </div>
                  <div className="hidden text-xs text-neutral-500 sm:block">{step.description}</div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-all sm:mx-4 ${
                    currentStep > step.number ? 'bg-success-500' : 'bg-neutral-200'
                  } `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8">
        {currentStep === 1 && (
          <ShippingStep data={checkoutData} onNext={onNext} onUpdateData={onUpdateData} />
        )}

        {currentStep === 2 && (
          <PaymentStep
            data={checkoutData}
            onNext={onNext}
            onBack={onBack}
            onUpdateData={onUpdateData}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            data={checkoutData}
            onBack={onBack}
            onPlaceOrder={onPlaceOrder}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
}
