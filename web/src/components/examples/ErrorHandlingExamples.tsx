'use client';

import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';

/**
 * Example: Cart button with error handling and user-friendly messages
 */
export function AddToCartButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const { showToast } = useToast();

  const handleAddToCart = async () => {
    try {
      // Simulate API call
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Success!
      showToast('success', 'Added to Cart', `${productName} has been added to your cart.`, 4000);
    } catch (error) {
      // Get user-friendly error message
      const { title, message } = getUserErrorMessage(error);

      // Log error for monitoring
      logError('cart.add_failed', error, { productId, productName });

      // Show user-friendly error
      showToast('error', title, message, 6000);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="rounded-lg bg-primary-500 px-6 py-3 text-white transition hover:bg-primary-600"
    >
      Add to Cart
    </button>
  );
}

/**
 * Example: Form with validation and error display
 */
export function ContactForm() {
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Client-side validation
    if (!email || !email.includes('@')) {
      showToast('warning', 'Invalid Email', 'Please enter a valid email address.', 5000);
      return;
    }

    if (!message || message.trim().length < 10) {
      showToast(
        'warning',
        'Message Too Short',
        'Please enter a message with at least 10 characters.',
        5000
      );
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      showToast('success', 'Message Sent', "We'll get back to you within 24 hours.", 5000);

      // Reset form
      e.currentTarget.reset();
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('contact.submit_failed', error, { email });
      showToast('error', title, message, 6000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary-500 px-6 py-3 text-white transition hover:bg-primary-600"
      >
        Send Message
      </button>
    </form>
  );
}
