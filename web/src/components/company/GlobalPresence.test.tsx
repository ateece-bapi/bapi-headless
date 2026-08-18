import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GlobalPresence } from './GlobalPresence';

vi.mock('react-simple-maps', () => ({
  ComposableMap: ({ children }: PropsWithChildren) => <svg>{children}</svg>,
  Geographies: ({ children }: { children: (value: { geographies: [] }) => ReactNode }) => (
    <>{children({ geographies: [] })}</>
  ),
  Geography: () => null,
  Marker: ({ children }: PropsWithChildren) => <g>{children}</g>,
  ZoomableGroup: ({ children }: PropsWithChildren) => <g>{children}</g>,
}));

vi.mock('@/lib/navigation', () => ({
  Link: ({ children, href, ...props }: ComponentProps<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('GlobalPresence location directory', () => {
  it('shows one collapsed location group at a time', () => {
    render(<GlobalPresence />);

    const headquarters = screen.getByRole('button', { name: /BAPI Headquarters \(1\)/i });
    const sales = screen.getByRole('button', {
      name: /Business Development & Regional Sales \(9\)/i,
    });

    expect(headquarters).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Global Headquarters')).not.toBeVisible();
    expect(document.getElementById('location-group-headquarters')).toHaveAttribute('hidden');

    fireEvent.click(headquarters);
    expect(headquarters).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Global Headquarters')).toBeVisible();

    fireEvent.click(sales);
    expect(headquarters).toHaveAttribute('aria-expanded', 'false');
    expect(sales).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Global Headquarters')).not.toBeVisible();
    expect(screen.getByText('North India Sales')).toBeVisible();
  });
});
