interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProcessStepsProps {
  steps: Step[];
  /**
   * Number of columns on large screens
   * @default 3
   */
  columns?: 2 | 3 | 4;
  /**
   * Show connecting line between steps
   * @default false
   */
  showConnector?: boolean;
}

/**
 * Numbered process steps component for "How It Works" sections
 * Displays a sequential flow with numbered badges
 *
 * @example
 * ```tsx
 * <ProcessSteps
 *   steps={[
 *     {
 *       number: 1,
 *       title: "Wireless Sensors",
 *       description: "Choose from temperature, humidity, or combination sensors..."
 *     },
 *     // ... more steps
 *   ]}
 *   columns={3}
 *   showConnector={true}
 * />
 * ```
 */
export function ProcessSteps({
  steps,
  columns = 3,
  showConnector = false,
}: ProcessStepsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-8 ${gridCols}`}>
      {steps.map((step, index) => (
        <div key={step.number} className="relative">
          {/* Connector Line (hidden on mobile) */}
          {showConnector && index < steps.length - 1 && (
            <div
              className="absolute left-8 top-8 hidden h-0.5 w-full bg-primary-200 md:block"
              aria-hidden="true"
            />
          )}

          {/* Step Content */}
          <div className="relative">
            {/* Number Badge */}
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-lg"
              aria-label={`Step ${step.number}`}
            >
              {step.number}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-xl font-bold text-neutral-900">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-base leading-relaxed text-neutral-600">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
