/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for SEO
 * Use this component to inject schema.org markup into pages
 * 
 * @example
 * ```tsx
 * <StructuredData schema={productSchema} />
 * ```
 */

import type { Schema } from '@/lib/schema/types';
import { schemaToJsonLd } from '@/lib/schema/generators';

interface StructuredDataProps {
  schema: Schema | Schema[];
}

export function StructuredData({ schema }: StructuredDataProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((s, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaToJsonLd(s) }}
        />
      ))}
    </>
  );
}
