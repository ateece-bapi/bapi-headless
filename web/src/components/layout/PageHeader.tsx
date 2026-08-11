import type { ReactNode } from 'react';
import Breadcrumbs, {
  type BreadcrumbItem,
  type BreadcrumbSchema,
} from '@/components/products/ProductPage/Breadcrumbs';
import PageContainer from './PageContainer';

type PageHeaderProps = {
  breadcrumbs: BreadcrumbItem[];
  breadcrumbSchema?: BreadcrumbSchema;
  title: string;
  titleClassName?: string;
  description?: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  spacing?: 'compact' | 'default' | 'large';
};

const SPACING_CLASSES = {
  compact: 'py-8 sm:py-10',
  default: 'py-12 sm:py-16',
  large: 'py-16 sm:py-20 lg:py-24',
} as const;

export default function PageHeader({
  breadcrumbs,
  breadcrumbSchema,
  title,
  titleClassName = 'text-white',
  description,
  eyebrow,
  actions,
  media,
  children,
  spacing = 'default',
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-accent-500 bg-bapi-primary-gradient text-white">
      <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-10" />

      <PageContainer size="site" className={`relative ${SPACING_CLASSES[spacing]}`}>
        <Breadcrumbs items={breadcrumbs} schema={breadcrumbSchema} variant="gradient" />

        <div
          className={`mt-6 ${media ? 'grid items-center gap-8 lg:grid-cols-2 lg:gap-12' : ''}`}
        >
          <div className="max-w-4xl">
            {eyebrow && <div className="mb-6">{eyebrow}</div>}
            <h1 className={`text-4xl font-bold leading-tight sm:text-5xl ${titleClassName}`}>
              {title}
            </h1>
            {description && (
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-primary-50 sm:text-xl">
                {description}
              </p>
            )}
            {actions && <div className="mt-8">{actions}</div>}
            {children}
          </div>

          {media && <div>{media}</div>}
        </div>
      </PageContainer>
    </section>
  );
}