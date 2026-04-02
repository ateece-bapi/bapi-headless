// Mock react-dom createPortal FIRST (must be before imports for hoisting)
import { vi } from 'vitest';
vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom');
  return {
    ...actual,
    createPortal: (node: any) => node,
  };
});

import '@testing-library/jest-dom';
import { server } from './msw/server';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';
import React from 'react';

// Set global flag for test environment (used by components to skip Portal rendering)
(globalThis as any).__IS_TEST_ENV__ = true;

// Set JWT_SECRET for 2FA tests (required for JWT token signing/verification)
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';

// Set GraphQL endpoint for client tests
process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL = 'https://test.example.com/graphql';

// Mock IntersectionObserver (not available in jsdom)
class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	options?: IntersectionObserverInit;
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	
	constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
		this.callback = callback;
		this.options = options;
		this.observe = vi.fn();
		this.unobserve = vi.fn();
		this.disconnect = vi.fn();
	}
	
	// Helper method for tests to trigger intersection
	triggerIntersection(isIntersecting: boolean, target: Element) {
		this.callback(
			[
				{
					isIntersecting,
					target,
					boundingClientRect: target.getBoundingClientRect(),
					intersectionRatio: isIntersecting ? 1 : 0,
					intersectionRect: isIntersecting ? target.getBoundingClientRect() : ({} as DOMRectReadOnly),
					rootBounds: null,
					time: Date.now(),
				},
			] as IntersectionObserverEntry[],
			this as unknown as IntersectionObserver
		);
	}
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Extend Vitest's expect with jest-axe accessibility matchers
// Note: jest-axe is the industry standard and works perfectly with Vitest
expect.extend(toHaveNoViolations);

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
// Reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());

// Mock next/image to render a plain <img/> in jsdom tests.
vi.mock('next/image', () => ({
	default: (props: unknown) => {
		const p = props as { src?: string | { src: string }; alt?: string; className?: string; style?: Record<string, unknown> };
		const { src, alt, className, style } = p;
		let resolvedSrc = '';
		if (typeof src === 'string') resolvedSrc = src;
		else if (src && typeof src === 'object') resolvedSrc = (src as { src: string }).src;
		return React.createElement('img', { src: resolvedSrc, alt, className, style });
	},
}));

// Mock @/lib/navigation (next-intl) for i18n Link support in all tests
vi.mock('@/lib/navigation', () => ({
	Link: (props: unknown) => {
		const p = props as {
			href?: string;
			children?: React.ReactNode;
			className?: string;
			locale?: string;
			prefetch?: boolean;
			replace?: boolean;
			scroll?: boolean;
			shallow?: boolean;
			[key: string]: unknown;
		};
		// Strip out Next.js/next-intl Link-only props to avoid React DOM warnings
		const {
			href,
			children,
			className,
			locale: _locale,
			prefetch: _prefetch,
			replace: _replace,
			scroll: _scroll,
			shallow: _shallow,
			...anchorProps
		} = p;
		return React.createElement('a', { href, className, ...anchorProps }, children);
	},
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		prefetch: vi.fn(),
	}),
	usePathname: () => '/en',
	redirect: vi.fn(),
}));
