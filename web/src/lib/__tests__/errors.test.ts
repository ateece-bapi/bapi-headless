import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AppError,
  ERROR_MESSAGES,
  getUserErrorMessage,
  logError,
} from '../errors';

describe('Error Handling Utilities', () => {
  describe('AppError', () => {
    it('creates error with user message', () => {
      const error = new AppError(
        'Technical error message',
        'User-friendly message',
        'ERROR_CODE',
        400
      );

      expect(error.message).toBe('Technical error message');
      expect(error.userMessage).toBe('User-friendly message');
      expect(error.code).toBe('ERROR_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('AppError');
    });

    it('defaults to 500 status code', () => {
      const error = new AppError(
        'Technical message',
        'User message'
      );

      expect(error.statusCode).toBe(500);
    });

    it('allows optional code', () => {
      const error = new AppError(
        'Technical message',
        'User message',
        undefined,
        404
      );

      expect(error.code).toBeUndefined();
      expect(error.statusCode).toBe(404);
    });

    it('extends Error correctly', () => {
      const error = new AppError('Tech', 'User');
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('contains all required error message types', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.TIMEOUT).toBeDefined();
      expect(ERROR_MESSAGES.PRODUCT_NOT_FOUND).toBeDefined();
      expect(ERROR_MESSAGES.ADD_TO_CART_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.VALIDATION_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.UNAUTHORIZED).toBeDefined();
      expect(ERROR_MESSAGES.SERVER_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.UNKNOWN_ERROR).toBeDefined();
    });

    it('has consistent structure for all messages', () => {
      Object.values(ERROR_MESSAGES).forEach((errorMsg) => {
        expect(errorMsg).toHaveProperty('title');
        expect(errorMsg).toHaveProperty('message');
        expect(typeof errorMsg.title).toBe('string');
        expect(typeof errorMsg.message).toBe('string');
        expect(errorMsg.title.length).toBeGreaterThan(0);
        expect(errorMsg.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getUserErrorMessage', () => {
    describe('AppError handling', () => {
      it('extracts message from AppError', () => {
        const error = new AppError(
          'Technical error',
          'User-friendly message',
          'CODE',
          404
        );

        const result = getUserErrorMessage(error);

        expect(result).toEqual({
          title: 'AppError',
          message: 'User-friendly message',
        });
      });

      it('uses error name as title', () => {
        const error = new AppError('Tech', 'User message');
        const result = getUserErrorMessage(error);

        expect(result.title).toBe('AppError');
      });
    });

    describe('Network error detection', () => {
      it('detects fetch failed errors', () => {
        const error = new Error('fetch failed');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
      });

      it('detects NetworkError', () => {
        const error = new Error('NetworkError: Connection refused');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    describe('Timeout error detection', () => {
      it('detects timeout errors', () => {
        const error = new Error('Request timeout');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.TIMEOUT);
      });

      it('detects lowercase timeout', () => {
        const error = new Error('Connection timeout exceeded');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.TIMEOUT);
      });
    });

    describe('HTTP status code detection', () => {
      it('detects 404 errors', () => {
        const error = new Error('HTTP 404 not found');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      });

      it('detects "not found" errors', () => {
        const error = new Error('Resource not found');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      });

      it('detects 401 unauthorized errors', () => {
        const error = new Error('HTTP 401 unauthorized');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.UNAUTHORIZED);
      });

      it('detects 403 forbidden errors', () => {
        const error = new Error('HTTP 403 forbidden');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.FORBIDDEN);
      });

      it('detects 429 rate limit errors', () => {
        const error = new Error('HTTP 429 too many requests');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.RATE_LIMIT);
      });
    });

    describe('Unknown error handling', () => {
      it('returns UNKNOWN_ERROR for generic Error', () => {
        const error = new Error('Some random error');
        const result = getUserErrorMessage(error);

        expect(result).toEqual(ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('handles non-Error objects', () => {
        const result = getUserErrorMessage('string error');

        expect(result).toEqual(ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('handles null', () => {
        const result = getUserErrorMessage(null);

        expect(result).toEqual(ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('handles undefined', () => {
        const result = getUserErrorMessage(undefined);

        expect(result).toEqual(ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('handles objects without message', () => {
        const result = getUserErrorMessage({ code: 'ERROR' });

        expect(result).toEqual(ERROR_MESSAGES.UNKNOWN_ERROR);
      });
    });
  });

  describe('logError', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('logs Error objects with message and stack', () => {
      const error = new Error('Test error');
      logError('test.context', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[test.context]',
        expect.objectContaining({
          context: 'test.context',
          message: 'Test error',
          stack: expect.any(String),
        })
      );
    });

    it('logs AppError with all details', () => {
      const error = new AppError(
        'Technical message',
        'User message',
        'ERROR_CODE',
        404
      );
      logError('app.error', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[app.error]',
        expect.objectContaining({
          context: 'app.error',
          message: 'Technical message',
          stack: expect.any(String),
        })
      );
    });

    it('logs non-Error values as strings', () => {
      logError('test.context', 'string error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[test.context]',
        expect.objectContaining({
          context: 'test.context',
          message: 'string error',
          stack: undefined,
        })
      );
    });

    it('includes metadata when provided', () => {
      const error = new Error('Test error');
      const metadata = {
        userId: '123',
        productId: 'abc',
        timestamp: Date.now(),
      };

      logError('test.context', error, metadata);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[test.context]',
        expect.objectContaining({
          context: 'test.context',
          message: 'Test error',
          userId: '123',
          productId: 'abc',
          timestamp: expect.any(Number),
        })
      );
    });

    it('handles null metadata', () => {
      const error = new Error('Test error');
      logError('test.context', error, undefined);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[test.context]',
        expect.objectContaining({
          context: 'test.context',
          message: 'Test error',
        })
      );
    });

    it('formats context in console output', () => {
      const error = new Error('Test');
      logError('payment.confirm_failed', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[payment.confirm_failed]',
        expect.any(Object)
      );
    });

    it('handles errors without stack trace', () => {
      const error = { message: 'Custom error object' };
      logError('test.context', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[test.context]',
        expect.objectContaining({
          context: 'test.context',
          message: '[object Object]', // Non-Error objects get stringified
          stack: undefined,
        })
      );
    });
  });
});
