'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  XIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
} from '@/lib/icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration: number;
  action?: ToastAction;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    type: ToastType,
    title: string,
    message: string,
    duration?: number,
    action?: ToastAction,
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/** Maximum number of toasts visible simultaneously. Oldest is dropped when exceeded. */
const MAX_TOASTS = 4;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message: string,
      duration?: number,
      action?: ToastAction,
    ) => {
      // Toasts with action buttons must never auto-dismiss — action presence
      // takes precedence over any caller-supplied duration. This ensures the
      // action button is always reachable (keyboard, pointer, screen reader).
      const effectiveDuration = action ? 0 : (duration ?? 5000);

      setToasts((prev) => {
        // Deduplicate: ignore if identical type+title+message already visible
        if (prev.some((t) => t.type === type && t.title === title && t.message === message)) {
          return prev;
        }

        const newToast: Toast = {
          id: Math.random().toString(36).substring(2, 9),
          type,
          title,
          message,
          duration: effectiveDuration,
          action,
        };

        // Cap at MAX_TOASTS — drop the oldest when exceeded
        const withNew = [...prev, newToast];
        return withNew.length > MAX_TOASTS ? withNew.slice(withNew.length - MAX_TOASTS) : withNew;
      });
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-toast flex items-end px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  // Animate in: start invisible/translated, flip to visible on first paint
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guard against re-entrancy: close button + auto-dismiss timer can both fire
  // during the 300ms exit window; only the first call should schedule removal.
  const isClosingRef = useRef(false);

  // Enter animation — triggers on next frame so the transition actually runs
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Animate out, then call onClose after the transition completes (300ms).
  // Re-entrancy guard prevents duplicate removal timers.
  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsVisible(false);
    closeTimerRef.current = setTimeout(() => onClose(toast.id), 300);
  }, [onClose, toast.id]);

  // Auto-dismiss timer (skipped when duration === 0)
  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const timer = setTimeout(handleClose, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, handleClose]);

  // Clean up pending close timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const icons = {
    success: CheckCircleIcon,
    error: AlertCircleIcon,
    warning: AlertTriangleIcon,
    info: InfoIcon,
  };

  const styles = {
    success: 'bg-success-50 text-success-900 border-success-200',
    error: 'bg-error-50 text-error-900 border-error-200',
    warning: 'bg-warning-50 text-warning-900 border-warning-200',
    info: 'bg-info-50 text-info-900 border-info-200',
  };

  const iconStyles = {
    success: 'text-success-700',
    error: 'text-error-700',
    warning: 'text-warning-800',
    info: 'text-info-700',
  };

  // Errors and warnings interrupt screen readers immediately (assertive + alert).
  // Success and info use polite live regions (status) so they don't break reading flow.
  // role="alert" has an implicit assertive live region; role="status" is implicitly polite.
  // Setting both role and aria-live explicitly makes the contract clear to AT.
  const isUrgent = toast.type === 'error' || toast.type === 'warning';
  const role = isUrgent ? 'alert' : 'status';
  const ariaLive = isUrgent ? 'assertive' : 'polite';

  const Icon = icons[toast.type];

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-in-out ${styles[toast.type]} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconStyles[toast.type]}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium">{toast.title}</p>
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
            {toast.action && (
              <div className="mt-3">
                <button
                  type="button"
                  className="rounded-md text-sm font-semibold underline underline-offset-2 opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => {
                    toast.action!.onClick();
                    handleClose();
                  }}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={handleClose}
              aria-label="Close notification"
            >
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
