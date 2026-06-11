import Image from 'next/image';
import { Link } from '@/lib/navigation';

interface CTABannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  imageSrc?: string;
  imageAlt?: string;
  /**
   * Background color scheme
   * @default 'blue'
   */
  variant?: 'blue' | 'yellow' | 'gray';
}

/**
 * Call-to-action banner with optional background image
 * Used for promotional sections and conversion points
 *
 * @example
 * ```tsx
 * <CTABanner
 *   title="Worried about signal strength?"
 *   description="Get peace of mind before you place an order. BAPI's easy-to-use app lets you verify sensor distances..."
 *   buttonText="Learn More"
 *   buttonHref="/wireless-site-verification"
 *   imageSrc="/images/wireless/site-verification.webp"
 *   imageAlt="Wireless signal verification app"
 *   variant="blue"
 * />
 * ```
 */
export function CTABanner({
  title,
  description,
  buttonText,
  buttonHref,
  imageSrc,
  imageAlt,
  variant = 'blue',
}: CTABannerProps) {
  const variants = {
    blue: {
      bg: 'bg-gradient-to-br from-primary-700 to-primary-500',
      text: 'text-white',
      button: 'bg-accent-500 text-neutral-900 hover:bg-accent-600',
    },
    yellow: {
      bg: 'bg-gradient-to-br from-accent-500 to-accent-600',
      text: 'text-neutral-900',
      button: 'bg-primary-600 text-white hover:bg-primary-700',
    },
    gray: {
      bg: 'bg-neutral-100',
      text: 'text-neutral-900',
      button: 'bg-primary-600 text-white hover:bg-primary-700',
    },
  }[variant];

  return (
    <section className={`relative overflow-hidden ${variants.bg} py-16 lg:py-20`}>
      {/* Background Image (if provided) */}
      {imageSrc && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={imageSrc}
            alt={imageAlt || ''}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className={`mb-4 text-3xl font-bold lg:text-4xl ${variants.text}`}
          >
            {title}
          </h2>
          <p className={`mb-8 text-lg leading-relaxed ${variants.text}`}>
            {description}
          </p>
          <Link
            href={buttonHref}
            className={`inline-flex items-center gap-2 rounded-lg px-8 py-4 font-bold transition-all focus:outline-none focus:ring-4 focus:ring-white/50 ${variants.button}`}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
