'use client';

import { BatteryIcon, WifiIcon, WrenchIcon, CloudIcon } from '@/lib/icons';

interface WirelessBenefitsProps {
  // Translations passed from server component
  translations: {
    benefit1Title: string;
    benefit1Text: string;
    benefit2Title: string;
    benefit2Text: string;
    benefit3Title: string;
    benefit3Text: string;
    benefit4Title: string;
    benefit4Text: string;
  };
}

/**
 * Compact single-row benefits bar for wireless category
 * Space-efficient: ~120px height
 * Icons are placeholders - can be replaced with uploaded images
 */
export default function WirelessBenefits({ translations }: WirelessBenefitsProps) {
  const benefits = [
    {
      icon: WrenchIcon,
      title: translations.benefit1Title,
      text: translations.benefit1Text,
      // TODO: Can replace with uploaded icon: iconSrc: '/images/wireless/icons/no-wiring.svg'
    },
    {
      icon: BatteryIcon,
      title: translations.benefit2Title,
      text: translations.benefit2Text,
      // TODO: Can replace with uploaded icon: iconSrc: '/images/wireless/icons/battery.svg'
    },
    {
      icon: CloudIcon,
      title: translations.benefit3Title,
      text: translations.benefit3Text,
      // TODO: Can replace with uploaded icon: iconSrc: '/images/wireless/icons/cloud.svg'
    },
    {
      icon: WifiIcon,
      title: translations.benefit4Title,
      text: translations.benefit4Text,
      // TODO: Can replace with uploaded icon: iconSrc: '/images/wireless/icons/wireless.svg'
    },
  ];

  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-8">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
              >
                {/* Icon Circle */}
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-md transition-shadow duration-300 hover:shadow-lg">
                  <Icon className="h-7 w-7 text-white" />
                  {/* TODO: When using uploaded icons:
                  <Image
                    src={benefit.iconSrc}
                    alt={benefit.title}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  */}
                </div>

                {/* Text */}
                <h3 className="mb-1 text-sm font-bold text-neutral-900">{benefit.title}</h3>
                <p className="text-xs leading-relaxed text-neutral-600">{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
