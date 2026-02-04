/**
 * Centralized logging utility with Sentry integration
 * 
 * Replaces direct console.log() calls with environment-aware logging.
 * Automatically sends errors to Sentry in production.
 * 
 * @example
 * ```ts
 * import logger from '@/lib/logger';
 * 
 * logger.debug('Product fetched', { productId: '123' });
 * logger.error('Failed to load product', error, { slug: 'abc' });
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Determine if a log level should be output
   * 
   * Production: Only warn and error
   * Development: All levels
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction) {
      return level === 'error' || level === 'warn';
    }
    return true;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    
    if (this.isDevelopment) {
      return `[${levelUpper}] ${message}`;
    }
    
    return `${timestamp} [${levelUpper}] ${message}`;
  }

  /**
   * Send error to Sentry if available
   */
  private sendToSentry(error: unknown, context?: LogContext) {
    if (this.isProduction && typeof window !== 'undefined') {
      // @ts-expect-error - Sentry is loaded via script tag
      if (window.Sentry) {
        // @ts-expect-error - Sentry global
        window.Sentry.captureException(error, {
          extra: context,
        });
      }
    }
  }

  /**
   * Debug logging - development only
   * 
   * Use for verbose debugging information that's not needed in production.
   * 
   * @example
   * ```ts
   * logger.debug('Cart state updated', { itemCount: 3 });
   * ```
   */
  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), context || '');
    }
  }

  /**
   * Info logging - development only
   * 
   * Use for general informational messages.
   * 
   * @example
   * ```ts
   * logger.info('User signed in', { userId: '123' });
   * ```
   */
  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), context || '');
    }
  }

  /**
   * Warning logging - development and production
   * 
   * Use for recoverable issues that need attention.
   * 
   * @example
   * ```ts
   * logger.warn('Product missing image', { productId: '123' });
   * ```
   */
  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), context || '');
    }
  }

  /**
   * Error logging - development and production
   * 
   * Automatically sends to Sentry in production.
   * Use for exceptions and critical failures.
   * 
   * @example
   * ```ts
   * try {
   *   await fetchProduct(slug);
   * } catch (error) {
   *   logger.error('Failed to fetch product', error, { slug });
   * }
   * ```
   */
  error(message: string, error?: unknown, context?: LogContext) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error || '', context || '');
      
      // Send to Sentry in production
      if (error) {
        this.sendToSentry(error, {
          message,
          ...context,
        });
      }
    }
  }

  /**
   * Performance timing utility
   * 
   * @example
   * ```ts
   * const timer = logger.time('GraphQL Query');
   * const data = await fetchProducts();
   * timer.end(); // Logs elapsed time
   * ```
   */
  time(label: string) {
    const start = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - start;
        this.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
      },
    };
  }

  /**
   * Group related log messages
   * 
   * @example
   * ```ts
   * logger.group('Cart Operations', () => {
   *   logger.debug('Adding item');
   *   logger.debug('Updating total');
   * });
   * ```
   */
  group(label: string, fn: () => void) {
    if (this.isDevelopment) {
      console.group(label);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  }
}

// Export singleton instance
export default new Logger();
