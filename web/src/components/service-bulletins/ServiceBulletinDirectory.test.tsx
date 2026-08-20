import type { ComponentProps } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ServiceBulletin } from '@/lib/serviceBulletins';
import { ServiceBulletinDirectory } from './ServiceBulletinDirectory';

vi.mock('@/lib/navigation', () => ({
  Link: ({ children, href, ...props }: ComponentProps<'a'>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function createBulletins(count: number): ServiceBulletin[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `bulletin-${index + 1}`,
    title: `Service Bulletin ${index + 1}`,
    slug: `service-bulletin-${index + 1}`,
    date: `2026-01-${String(index + 1).padStart(2, '0')}T12:00:00`,
    excerpt: `<p>Details for bulletin ${index + 1}</p>`,
    serviceBulletinCategories: {
      nodes: [{ id: 'general', name: 'General', slug: 'general' }],
    },
  }));
}

describe('ServiceBulletinDirectory', () => {
  it('links each bulletin to its detail route', () => {
    render(<ServiceBulletinDirectory bulletins={createBulletins(1)} />);

    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute(
      'href',
      '/service-bulletin/service-bulletin-1'
    );
  });

  it('hides pagination when all bulletins fit on one page', () => {
    render(<ServiceBulletinDirectory bulletins={createBulletins(2)} />);

    expect(
      screen.queryByRole('navigation', { name: /service bulletin pages/i })
    ).not.toBeInTheDocument();
  });

  it('navigates forward and backward through bulletin pages', () => {
    render(<ServiceBulletinDirectory bulletins={createBulletins(12)} />);

    const previous = screen.getByRole('button', { name: /previous/i });
    const next = screen.getByRole('button', { name: /next/i });

    expect(previous).toBeDisabled();
    expect(screen.getByText('Service Bulletin 1')).toBeInTheDocument();
    expect(screen.queryByText('Service Bulletin 11')).not.toBeInTheDocument();

    fireEvent.click(next);

    expect(next).toBeDisabled();
    expect(previous).toBeEnabled();
    expect(screen.queryByText('Service Bulletin 1')).not.toBeInTheDocument();
    expect(screen.getByText('Service Bulletin 11')).toBeInTheDocument();

    fireEvent.click(previous);

    expect(previous).toBeDisabled();
    expect(screen.getByText('Service Bulletin 1')).toBeInTheDocument();
  });
});
