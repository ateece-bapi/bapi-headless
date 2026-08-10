import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageHeader from './PageHeader';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Temperature Sensors' },
];

describe('PageHeader', () => {
  it('renders the canonical page heading and breadcrumb structure', () => {
    const { container } = render(
      <PageHeader
        breadcrumbs={breadcrumbs}
        title="Temperature Sensors"
        description="Sensors for building automation systems."
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Temperature Sensors' })).toBeVisible();
    expect(screen.getByText('Sensors for building automation systems.')).toBeVisible();
    expect(screen.getByRole('navigation', { name: /breadcrumb navigation/i })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByText('Temperature Sensors', { selector: '[aria-current="page"]' })).toBeVisible();

    const section = container.querySelector('section');
    expect(section).toHaveClass('border-b-4', 'border-accent-500', 'bg-bapi-primary-gradient');
    expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
  });

  it('renders optional content and breadcrumb structured data', () => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bapihvac.com' },
      ],
    };

    const { container } = render(
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbSchema={schema}
        title="Temperature Sensors"
        eyebrow={<span>Product family</span>}
        actions={<button type="button">Get started</button>}
        media={<div data-testid="header-media">Product image</div>}
      >
        <span>Additional details</span>
      </PageHeader>
    );

    expect(screen.getByText('Product family')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Get started' })).toBeVisible();
    expect(screen.getByTestId('header-media')).toBeVisible();
    expect(screen.getByText('Additional details')).toBeVisible();
    expect(container.querySelector('script[type="application/ld+json"]')).toHaveTextContent(
      'BreadcrumbList'
    );
  });
});