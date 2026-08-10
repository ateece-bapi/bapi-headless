import type { ReactNode } from 'react';

type PageContainerSize = 'site' | 'container' | 'content' | 'narrow' | 'prose';

type PageContainerProps = {
  children: ReactNode;
  size?: PageContainerSize;
  className?: string;
};

const SIZE_CLASSES: Record<PageContainerSize, string> = {
  site: 'max-w-7xl',
  container: 'max-w-7xl',
  content: 'max-w-[1200px]',
  narrow: 'max-w-[800px]',
  prose: 'max-w-prose',
};

const GUTTER_CLASSES: Record<PageContainerSize, string> = {
  site: 'px-4 sm:px-6 lg:px-8',
  container: 'px-4 sm:px-6 lg:px-8',
  content: 'px-4 sm:px-6 lg:px-8',
  narrow: 'px-4 sm:px-6 lg:px-8',
  prose: 'px-4 sm:px-6 lg:px-8',
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
  const gutterClass = GUTTER_CLASSES[size];

  return (
    <div className={`${sizeClass} ${gutterClass} mx-auto ${className}`.trim()}>
      {children}
    </div>
  );
}
