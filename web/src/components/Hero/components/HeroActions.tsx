import React from 'react';
import BapiButton from '@/components/ui/BapiButton';
import { HeroAction } from '../types';

interface HeroActionsProps {
  actions: readonly HeroAction[];
  className?: string;
}

const HeroActions: React.FC<HeroActionsProps> = ({ actions, className }) => (
  <div className={`animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center gap-6 delay-500 duration-700 sm:flex-row ${className ?? ''}`}>
    {actions.map((action, index) => (
      <BapiButton
        key={action.href}
        as="a"
        href={action.href}
        color={action.variant}
        // FIXED: Simplified responsive button sizing with consistent mobile-first scaling
        className={`w-full px-6 py-3 text-sm sm:w-auto sm:px-8 sm:py-4 sm:text-base md:text-base lg:px-8 lg:py-4 lg:text-base xl:px-8 xl:py-4 xl:text-lg 2xl:px-10 2xl:py-5 2xl:text-xl ${
          action.variant === 'blue'
            ? 'shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/35'
            : 'shadow-lg shadow-accent-600/25 hover:shadow-xl hover:shadow-accent-600/35'
        } ${index === 0 ? 'sm:mr-2' : ''}`}
      >
        {action.label}
      </BapiButton>
    ))}
  </div>
);

export default HeroActions;