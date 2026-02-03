import type { ReactNode } from 'react';

type PageContainerSize = 'container' | 'content' | 'narrow';

type PageContainerProps = {
  children: ReactNode;
  size?: PageContainerSize;
  className?: string;
};

const SIZE_CLASSES: Record<PageContainerSize, string> = {
  container: 'max-w-container',
  content: 'max-w-content',
  narrow: 'max-w-narrow',
};

/**
 * Consistent page container with semantic max-width tokens.
 *
 * @param children - Content to render inside the container.
 * @param size - Width preset for the container.
 * @param className - Optional additional classes.
 */
export default function PageContainer({
  children,
  size = 'content',
  className = '',
}: PageContainerProps) {
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={`${sizeClass} mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 ${className}`.trim()}>
      {children}
    </div>
  );
}
