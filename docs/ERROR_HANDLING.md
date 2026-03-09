# Error Handling & User Feedback System

## Overview

This application implements a comprehensive error handling system with user-friendly messages and toast notifications for better UX.

## Components

### 1. Toast Notification System

**Location:** `/src/components/ui/Toast.tsx`

A React context-based toast system for displaying temporary notifications.

**Usage:**

```tsx
import { useToast } from '@/components/ui/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleAction = async () => {
    try {
      // ... do something
      showToast('success', 'Success!', 'Your action completed successfully.');
    } catch (error) {
      showToast('error', 'Error', 'Something went wrong.');
    }
  };
}
```

**Toast Types:**
- `success` - Green, for successful operations
- `error` - Red, for errors and failures
- `warning` - Yellow, for warnings and validation issues
- `info` - Blue, for informational messages

**Props:**
- `type` - Toast type (required)
- `message` - Main message (required)
- `description` - Optional detailed description
- `duration` - Auto-dismiss time in ms (default: 5000)

### 2. Error Utilities

**Location:** `/src/lib/errors.ts`

Centralized error messages and utilities for consistent user feedback.

**Features:**
- `AppError` class - Custom error with user-friendly messages
- `ERROR_MESSAGES` - Predefined error messages
- `getUserErrorMessage()` - Extract user-friendly messages from errors
- `logError()` - Structured error logging

**Usage:**

```tsx
import { AppError, ERROR_MESSAGES, getUserErrorMessage, logError } from '@/lib/errors';

// Throw user-friendly errors
throw new AppError(
  'Technical error message for logs',
  'User-friendly message',
  'ERROR_CODE',
  404
);

// Get user message from any error
try {
  // ...
} catch (error) {
  const { title, message } = getUserErrorMessage(error);
  showToast('error', title, message);
  logError('context.action', error, { metadata });
}
```

### 3. Setup

The `ToastProvider` is already configured in `/src/app/layout.tsx` and wraps the entire application.

## Error Messages

### Predefined Messages

All error messages are defined in `ERROR_MESSAGES` constant:

```typescript
ERROR_MESSAGES.NETWORK_ERROR        // Connection issues
ERROR_MESSAGES.TIMEOUT              // Request timeouts
ERROR_MESSAGES.PRODUCT_NOT_FOUND    // 404 errors
ERROR_MESSAGES.ADD_TO_CART_ERROR    // Cart failures
ERROR_MESSAGES.VALIDATION_ERROR     // Form validation
ERROR_MESSAGES.UNAUTHORIZED         // Auth required
ERROR_MESSAGES.RATE_LIMIT           // Too many requests
ERROR_MESSAGES.SERVER_ERROR         // 500 errors
ERROR_MESSAGES.UNKNOWN_ERROR        // Catch-all
```

### API Error Responses

All API routes now return structured JSON error responses:

```json
{
  "error": "Error Title",
  "message": "User-friendly detailed message",
  "retryAfter": 60  // Optional: for rate limiting
}
```

**Example API Routes:**
- `/api/preview` - Preview authentication with rate limiting
- `/api/revalidate` - Cache revalidation with validation

## Examples

### Adding to Cart with Error Handling

```tsx
'use client';

import { useToast } from '@/components/ui/Toast';
import { getUserErrorMessage, logError } from '@/lib/errors';

export function AddToCartButton({ productId, productName }) {
  const { showToast } = useToast();

  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      showToast('success', 'Added to Cart', `${productName} added successfully.`);
    } catch (error) {
      const { title, message } = getUserErrorMessage(error);
      logError('cart.add_failed', error, { productId });
      showToast('error', title, message);
    }
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

### Form Validation

```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!email.includes('@')) {
    showToast('warning', 'Invalid Email', 'Please enter a valid email address.');
    return;
  }

  try {
    await submitForm(email);
    showToast('success', 'Form Submitted', 'We\'ll get back to you soon.');
  } catch (error) {
    const { title, message } = getUserErrorMessage(error);
    showToast('error', title, message);
  }
};
```

### GraphQL Error Handling

GraphQL queries automatically throw `AppError` with user-friendly messages:

```tsx
import { getProductBySlug } from '@/lib/graphql';
import { getUserErrorMessage } from '@/lib/errors';

try {
  const product = await getProductBySlug('invalid-slug');
} catch (error) {
  // Error is already an AppError with user message
  const { title, message } = getUserErrorMessage(error);
  // Show to user: "Product Not Found" / "Unable to load this product..."
}
```

## Best Practices

### 1. Always Show User-Friendly Messages

❌ **Bad:**
```tsx
catch (error) {
  alert(error.message); // Technical error message
}
```

✅ **Good:**
```tsx
catch (error) {
  const { title, message } = getUserErrorMessage(error);
  showToast('error', title, message);
}
```

### 2. Log Errors for Monitoring

Always log errors with context:

```tsx
catch (error) {
  logError('feature.action', error, { 
    userId, 
    productId,
    timestamp: Date.now() 
  });
  showToast('error', 'Operation Failed', 'Please try again.');
}
```

### 3. Provide Actionable Feedback

Include next steps in error messages:

```tsx
showToast(
  'error',
  'Unable to Load Products',
  'Please check your connection and refresh the page.',
  6000
);
```

### 4. Use Appropriate Toast Types

- `success` - Confirmation of completed actions
- `error` - Failed operations that need attention
- `warning` - Validation issues or cautionary messages
- `info` - Helpful information or status updates

### 5. Set Appropriate Durations

```tsx
showToast('success', 'Saved!', '', 3000);     // Quick success - 3s
showToast('error', 'Error', 'Details...', 6000);  // Errors need reading time - 6s
showToast('info', 'Note', 'Info...', 5000);   // Standard - 5s
```

## Testing

### Manual Testing

1. Test toast notifications in different scenarios
2. Verify error messages are user-friendly
3. Check rate limiting responses
4. Test form validation feedback

### Unit Testing

```tsx
import { getUserErrorMessage, ERROR_MESSAGES } from '@/lib/errors';

describe('Error handling', () => {
  it('returns friendly message for network errors', () => {
    const error = new Error('fetch failed');
    const result = getUserErrorMessage(error);
    expect(result).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
  });
});
```

## Error Boundaries

Error boundaries are configured at multiple levels:

1. **Root:** `/src/app/error.tsx` - Catches all app-level errors
2. **Route:** `/src/app/products/error.tsx` - Route-specific handling
3. **Global:** `/src/app/global-error.tsx` - Root layout errors

These provide fallback UI when errors occur during rendering.

## Monitoring

In production, errors are logged for monitoring:

```tsx
// lib/errors.ts - logError function
if (process.env.NODE_ENV === 'production') {
  // Send to monitoring service (Sentry, LogRocket, etc.)
  // window.Sentry?.captureException(error, { extra: metadata });
}
```

Configure your monitoring service to capture these logs.

## API Rate Limiting

All public APIs include rate limiting with clear error messages:

- **Preview API:** 10 requests/minute
- **Revalidate API:** 5 requests/minute

Rate limit responses include retry information:

```json
{
  "error": "Too Many Requests",
  "message": "You have made too many requests...",
  "retryAfter": 45
}
```

## Accessibility

Toast notifications are accessible:

- `role="alert"` for screen readers
- `aria-live="assertive"` for important announcements
- Sufficient color contrast (WCAG AA compliant)
- Keyboard dismissible
- Close buttons with `aria-label`

## CSS Animations

Toast animations are defined in `/src/app/globals.css`:

```css
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

Animations are smooth (300ms) and use GPU-accelerated transforms.
