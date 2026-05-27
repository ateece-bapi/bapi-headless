import Image from 'next/image';
import { Link } from '@/lib/navigation';
import { CheckCircleIcon } from '@/lib/icons';

interface ProductHighlightProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  features?: string[];
  learnMoreHref?: string;
  /**
   * Image position
   * @default 'right'
   */
  imagePosition?: 'left' | 'right';
}

/**
 * Single product spotlight component with image and feature list
 * Used for highlighting key products on landing pages
 *
 * @example
 * ```tsx
 * <ProductHighlight
 *   title="Wireless Receiver"
 *   description="The Wireless Receiver collects data from one or more wireless sensors..."
 *   imageSrc="/images/wireless/receiver.png"
 *   imageAlt="BAPI Wireless Receiver"
 *   features={[
 *     "Sample Rate/Interval",
 *     "Transmit Rate/Interval",
 *     "Delta Temperature",
 *     "Supports up to 127 different output modules"
 *   ]}
 *   learnMoreHref="/products/wireless-receiver"
 * />
 * ```
 */
export function ProductHighlight({
  title,
  description,
  imageSrc,
  imageAlt,
  features = [],
  learnMoreHref,
  imagePosition = 'right',
}: ProductHighlightProps) {
  const imageOrder = imagePosition === 'left' ? 'lg:order-first' : 'lg:order-last';
  const contentOrder = imagePosition === 'left' ? 'lg:order-last' : 'lg:order-first';

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      {/* Image */}
      <div className={`relative ${imageOrder}`}>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-50 p-8">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>
      </div>

      {/* Content */}
      <div className={contentOrder}>
        <h2 className="mb-4 text-3xl font-bold text-neutral-900 lg:text-4xl">
          {title}
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-neutral-700">
          {description}
        </p>

        {/* Features List */}
        {features.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 font-bold text-neutral-900">
              Field Selectable Settings:
            </h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircleIcon
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600"
                    aria-hidden="true"
                  />
                  <span className="text-neutral-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        {learnMoreHref && (
          <Link
            href={learnMoreHref}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-bold text-white transition-all hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          >
            Learn More
          </Link>
        )}
      </div>
    </div>
  );
}
