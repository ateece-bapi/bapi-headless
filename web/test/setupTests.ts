import '@testing-library/jest-dom';
import { server } from './msw/server';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

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
import React from 'react';
import { vi } from 'vitest';

// Use Vitest module mock for `next/image` so tests render a plain <img/>.
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
