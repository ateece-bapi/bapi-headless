/**
 * User-friendly error messages and error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public userMessage: string,
    public code?: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
  },
  TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
  },
  
  // Product errors
  PRODUCT_NOT_FOUND: {
    title: 'Product Not Found',
    message: 'The product you\'re looking for doesn\'t exist or has been removed.',
  },
  PRODUCT_LOAD_ERROR: {
    title: 'Unable to Load Product',
    message: 'We couldn\'t load this product. Please try refreshing the page.',
  },
  PRODUCTS_LOAD_ERROR: {
    title: 'Unable to Load Products',
    message: 'We couldn\'t load the product catalog. Please try refreshing the page.',
  },
  
  // Cart errors
  ADD_TO_CART_ERROR: {
    title: 'Unable to Add to Cart',
    message: 'We couldn\'t add this item to your cart. Please try again.',
  },
  CART_UPDATE_ERROR: {
    title: 'Cart Update Failed',
    message: 'We couldn\'t update your cart. Please try again.',
  },
  OUT_OF_STOCK: {
    title: 'Out of Stock',
    message: 'This product is currently out of stock. Please check back later.',
  },
  
  // Form errors
  VALIDATION_ERROR: {
    title: 'Invalid Information',
    message: 'Please check your information and try again.',
  },
  REQUIRED_FIELD: {
    title: 'Required Field',
    message: 'Please fill in all required fields.',
  },
  
  // Authentication errors
  UNAUTHORIZED: {
    title: 'Authentication Required',
    message: 'You need to be logged in to perform this action.',
  },
  FORBIDDEN: {
    title: 'Access Denied',
    message: 'You don\'t have permission to perform this action.',
  },
  
  // API errors
  RATE_LIMIT: {
    title: 'Too Many Requests',
    message: 'You\'ve made too many requests. Please wait a moment and try again.',
  },
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Our team has been notified.',
  },
  
  // Generic
  UNKNOWN_ERROR: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
} as const;

/**
 * Get user-friendly error message from error object
 */
export function getUserErrorMessage(error: unknown): { title: string; message: string } {
  if (error instanceof AppError) {
    return { title: error.name, message: error.userMessage };
  }

  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('fetch failed') || error.message.includes('NetworkError')) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (error.message.includes('timeout')) {
      return ERROR_MESSAGES.TIMEOUT;
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      return ERROR_MESSAGES.PRODUCT_NOT_FOUND;
    }
    if (error.message.includes('401')) {
      return ERROR_MESSAGES.UNAUTHORIZED;
    }
    if (error.message.includes('403')) {
      return ERROR_MESSAGES.FORBIDDEN;
    }
    if (error.message.includes('429')) {
      return ERROR_MESSAGES.RATE_LIMIT;
    }
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Log error to monitoring service (structured logging)
 */
export function logError(context: string, error: unknown, metadata?: Record<string, unknown>) {
  const errorData = {
    context,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...metadata,
  };

  // In production, send to monitoring service (e.g., Sentry, LogRocket)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: window.Sentry?.captureException(error, { extra: metadata });
  }

  console.error(`[${context}]`, errorData);
}
