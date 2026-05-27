interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  /**
   * Number of columns on large screens
   * @default 4
   */
  columns?: 2 | 3 | 4;
  /**
   * Background color
   * @default 'transparent'
   */
  background?: 'transparent' | 'white' | 'gray';
}

/**
 * Reusable feature grid component for landing pages
 * Displays icon-based features in a responsive grid layout
 *
 * @example
 * ```tsx
 * <FeatureGrid
 *   features={[
 *     {
 *       icon: <WifiOffIcon className="h-12 w-12" />,
 *       title: "No Wiring Required",
 *       description: "Eliminate expensive wire runs..."
 *     }
 *   ]}
 *   columns={4}
 * />
 * ```
 */
export function FeatureGrid({
  features,
  columns = 4,
  background = 'transparent',
}: FeatureGridProps) {
  const bgClass = {
    transparent: '',
    white: 'bg-white',
    gray: 'bg-neutral-50',
  }[background];

  const gridCols = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-8 md:grid-cols-2 ${gridCols} ${bgClass}`}>
      {features.map((feature, index) => (
        <div
          key={index}
          className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-md transition-shadow hover:shadow-lg"
        >
          {/* Icon with rounded background */}
          <div className="mb-6 flex justify-center">
            <div
              className="inline-flex rounded-2xl bg-primary-100 p-6 text-primary-600"
              aria-hidden="true"
            >
              {feature.icon}
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-center text-xl font-bold text-neutral-900">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-center text-base leading-relaxed text-neutral-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
