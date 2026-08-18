import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PDFPreviewModal from './PDFPreviewModal';

describe('PDFPreviewModal', () => {
  it('allows Chromium browsers to use their built-in PDF viewer', () => {
    render(
      <PDFPreviewModal
        url="https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/instructions.pdf"
        title="Product Instructions"
        onClose={vi.fn()}
      />
    );

    const preview = screen.getByTitle('PDF Preview: Product Instructions');

    expect(preview).toHaveAttribute(
      'src',
      'https://bapiheadlessstaging.kinsta.cloud/wp-content/uploads/instructions.pdf'
    );
    expect(preview).not.toHaveAttribute('sandbox');
  });

  it.each([
    'javascript:alert(document.domain)',
    'https://example.com/not-a-pdf.html',
    '/relative/document.pdf',
  ])('does not embed an unsafe document URL: %s', (url) => {
    render(<PDFPreviewModal url={url} title="Unsafe Document" onClose={vi.fn()} />);

    expect(screen.queryByTitle('PDF Preview: Unsafe Document')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Download' })).not.toBeInTheDocument();
    expect(screen.getByText('This document cannot be previewed safely.')).toBeInTheDocument();
  });
});