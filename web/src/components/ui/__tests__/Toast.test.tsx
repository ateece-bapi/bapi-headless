/**
 * Toast Component Tests
 *
 * Covers:
 * - aria-live values by type (polite for success/info, assertive for error/warning)
 * - Deduplication (identical type+title+message is not added twice)
 * - Max 4 toasts — oldest dropped when cap is exceeded
 * - Action presence forces duration=0 (no auto-dismiss) by default
 * - Auto-dismiss fires after duration when no action
 * - Close button triggers animated removal
 */

import type React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast, EXIT_ANIMATION_MS, type ToastType } from '../Toast';

// Helper: renders a button that calls showToast when clicked
function ToastTrigger({
  type = 'success',
  title = 'Title',
  message = 'Message',
  duration,
  action,
}: {
  type?: ToastType;
  title?: string;
  message?: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}) {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast(type, title, message, duration, action)}>
      Show Toast
    </button>
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

/** Query all visible toasts regardless of role (alert for error/warning, status for success/info). */
function getToasts() {
  return [...screen.queryAllByRole('alert'), ...screen.queryAllByRole('status')];
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ─── aria-live ────────────────────────────────────────────────────────────

  it.each([
    ['success', 'polite'],
    ['info', 'polite'],
    ['error', 'assertive'],
    ['warning', 'assertive'],
  ] as [ToastType, string][])(
    '%s toast has aria-live="%s"',
    async (type, expected) => {
      renderWithProvider(<ToastTrigger type={type} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }));
      });

      // role matches live region: 'alert' for assertive (error/warning), 'status' for polite (success/info)
      const expectedRole = expected === 'assertive' ? 'alert' : 'status';
      const el = screen.getByRole(expectedRole);
      expect(el).toHaveAttribute('aria-live', expected);
    },
  );

  // ─── Deduplication ───────────────────────────────────────────────────────

  it('does not add a duplicate toast with the same type, title, and message', async () => {
    renderWithProvider(<ToastTrigger />);
    const btn = screen.getByRole('button', { name: 'Show Toast' });

    await act(async () => {
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);
    });

    expect(getToasts()).toHaveLength(1);
  });

  it('adds a second toast when type differs', async () => {
    function TwoToasts() {
      const { showToast } = useToast();
      return (
        <>
          <button onClick={() => showToast('success', 'Title', 'Message')}>Success</button>
          <button onClick={() => showToast('error', 'Title', 'Message')}>Error</button>
        </>
      );
    }
    render(<ToastProvider><TwoToasts /></ToastProvider>);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Success' }));
      fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    });

    expect(getToasts()).toHaveLength(2);
  });

  // ─── Toast cap ───────────────────────────────────────────────────────────

  it('caps at 4 toasts and drops the oldest when a 5th is added', async () => {
    function ManyToasts() {
      const { showToast } = useToast();
      return (
        <button
          onClick={() => {
            for (let i = 1; i <= 5; i++) {
              showToast('info', `Toast ${i}`, `Message ${i}`);
            }
          }}
        >
          Show 5
        </button>
      );
    }
    render(<ToastProvider><ManyToasts /></ToastProvider>);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show 5' }));
    });

    expect(getToasts()).toHaveLength(4);
    // Oldest (Toast 1) should be gone; newest (Toast 5) should be present
    expect(screen.queryByText('Message 1')).toBeNull();
    expect(screen.getByText('Message 5')).toBeTruthy();
  });

  // ─── Action disables auto-dismiss ────────────────────────────────────────

  it('does not auto-dismiss when an action is provided and no explicit duration', async () => {
    renderWithProvider(
      <ToastTrigger action={{ label: 'Retry', onClick: vi.fn() }} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }));
    });

    expect(getToasts()).toHaveLength(1);

    // Advance well past default 5000ms
    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    // Toast should still be visible (not auto-dismissed)
    expect(getToasts()).toHaveLength(1);
  });

  it('does not auto-dismiss when action is provided even if duration is explicitly set', async () => {
    // action takes precedence over any caller-provided duration
    renderWithProvider(
      <ToastTrigger duration={1000} action={{ label: 'Retry', onClick: vi.fn() }} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }));
    });

    expect(getToasts()).toHaveLength(1);

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(getToasts()).toHaveLength(1);
  });

  // ─── Auto-dismiss ─────────────────────────────────────────────────────────

  it('auto-dismisses after the specified duration when no action', async () => {
    renderWithProvider(<ToastTrigger duration={3000} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }));
    });

    expect(getToasts()).toHaveLength(1);

    // Advance past duration + exit animation
    await act(async () => {
      vi.advanceTimersByTime(3000 + EXIT_ANIMATION_MS);
    });

    expect(getToasts()).toHaveLength(0);
  });

  // ─── Close button ─────────────────────────────────────────────────────────

  it('removes toast when close button is clicked (after exit animation)', async () => {
    renderWithProvider(<ToastTrigger duration={0} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }));
    });

    expect(getToasts()).toHaveLength(1);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
      vi.advanceTimersByTime(EXIT_ANIMATION_MS); // exit animation
    });

    expect(getToasts()).toHaveLength(0);
  });

  // ─── Action button ────────────────────────────────────────────────────────

  it('calls action.onClick and closes the toast when action button is clicked', async () => {
    const mockAction = vi.fn();
    renderWithProvider(
      <ToastTrigger duration={0} action={{ label: 'Retry', onClick: mockAction }} />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Show Toast' }));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      vi.advanceTimersByTime(EXIT_ANIMATION_MS);
    });

    expect(mockAction).toHaveBeenCalledOnce();
    expect(getToasts()).toHaveLength(0);
  });
});
