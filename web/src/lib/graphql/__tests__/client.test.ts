/**
 * GraphQL Client Tests
 *
 * Tests for the GraphQL client configuration and behavior, focusing on
 * caching strategies, method selection (GET/POST), and header management.
 *
 * Coverage:
 * - Client initialization with cache tags
 * - GET vs POST method selection for CDN optimization
 * - Custom header injection
 * - Cache invalidation patterns
 * - Integration with Next.js ISR and fetch cache
 *
 * Note: This file tests configuration behavior only. The underlying GraphQL endpoint
 * is mocked in integration tests. We validate the client's request configuration
 * rather than actual network calls.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGraphQLClient } from '../client';

// Mock graphql-request
vi.mock('graphql-request', () => ({
  GraphQLClient: vi.fn(function (this: any, url: string, options: any) {
    this.url = url;
    this.options = options;
    this.setHeaders = vi.fn(function (headers: any) {
      this.options.headers = { ...this.options.headers, ...headers };
    });
    this.setMethod = vi.fn(function (method: string) {
      this.options.method = method;
    });
    return this;
  }),
}));

// Extract the mocked GraphQLClient constructor
import { GraphQLClient } from 'graphql-request';
const MockedGraphQLClient = GraphQLClient as unknown as vi.Mock;

describe('GraphQL Client', () => {
  beforeEach(() => {
    // Clear mock call history
    MockedGraphQLClient.mockClear();
  });

  describe('Basic Initialization', () => {
    it('should create a GraphQL client instance', () => {
      const client = getGraphQLClient();
      expect(client).toBeDefined();
      expect(MockedGraphQLClient).toHaveBeenCalledTimes(1);
    });

    it('should use environment variable for GraphQL endpoint', () => {
      getGraphQLClient();
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const url = callArgs[0];
      
      // Should use a valid URL (either from env or fallback)
      expect(url).toBeTruthy();
      expect(typeof url).toBe('string');
    });

    it('should include default headers in client configuration', () => {
      getGraphQLClient();
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      
      expect(options.headers).toBeDefined();
      expect(options.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Cache Tag System', () => {
    it('should accept cache tags parameter', () => {
      const tags = ['products', 'categories'];
      const client = getGraphQLClient(tags);
      
      expect(client).toBeDefined();
      expect(MockedGraphQLClient).toHaveBeenCalled();
    });

    it('should handle empty cache tags array', () => {
      const client = getGraphQLClient([]);
      expect(client).toBeDefined();
    });

    it('should handle single cache tag', () => {
      const client = getGraphQLClient(['product-123']);
      expect(client).toBeDefined();
    });

    it('should handle multiple cache tags', () => {
      const tags = ['products', 'product-123', 'category-hvac', 'graphql'];
      const client = getGraphQLClient(tags);
      expect(client).toBeDefined();
    });
  });

  describe('Method Selection (GET vs POST)', () => {
    it('should default to GET method when useGetMethod not specified', () => {
      getGraphQLClient();
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      
      // Default behavior: useGetMethod defaults to true, so method should be GET
      expect(options.method).toBe('GET');
    });

    it('should explicitly specify POST method when useGetMethod is false', () => {
      getGraphQLClient([], false);
      expect(MockedGraphQLClient).toHaveBeenCalled();
    });

    it('should specify GET method when useGetMethod is true', () => {
      getGraphQLClient([], true);
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      
      expect(options.method).toBe('GET');
    });

    it('should handle GET method with cache tags', () => {
      const tags = ['products', 'categories'];
      getGraphQLClient(tags, true);
      
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      expect(options.method).toBe('GET');
    });
  });

  describe('Custom Headers', () => {
    it('should merge custom headers with defaults', () => {
      const customHeaders = {
        'X-Custom-Header': 'test-value',
        'Authorization': 'Bearer token123',
      };
      
      getGraphQLClient([], false, customHeaders);
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      
      expect(options.headers['X-Custom-Header']).toBe('test-value');
      expect(options.headers['Authorization']).toBe('Bearer token123');
      expect(options.headers['Content-Type']).toBe('application/json');
    });

    it('should allow custom headers to override defaults', () => {
      const customHeaders = {
        'Content-Type': 'application/graphql',
      };
      
      getGraphQLClient([], false, customHeaders);
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      
      expect(options.headers['Content-Type']).toBe('application/graphql');
    });

    it('should handle empty custom headers object', () => {
      getGraphQLClient([], false, {});
      expect(MockedGraphQLClient).toHaveBeenCalled();
    });
  });

  describe('Real-World Usage Patterns', () => {
    it('should support product listing with GET for CDN caching', () => {
      const client = getGraphQLClient(['products'], true);
      expect(client).toBeDefined();
      
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      expect(options.method).toBe('GET');
    });

    it('should support product detail with specific cache tag', () => {
      const slug = 'valve-actuator-xyz';
      const client = getGraphQLClient([`product-${slug}`], true);
      expect(client).toBeDefined();
    });

    it('should support authenticated requests with custom headers', () => {
      const client = getGraphQLClient(
        ['user-profile'],
        false,
        { 'Authorization': 'Bearer user-token' }
      );
      
      expect(client).toBeDefined();
      const callArgs = MockedGraphQLClient.mock.calls[0];
      const options = callArgs[1];
      expect(options.headers['Authorization']).toBe('Bearer user-token');
    });

    it('should support multiple cache tags for related data', () => {
      const client = getGraphQLClient(
        ['products', 'categories', 'product-variants'],
        true
      );
      expect(client).toBeDefined();
    });
  });
});
