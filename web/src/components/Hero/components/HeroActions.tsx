import React from 'react';
import BapiButton from '@/components/ui/BapiButton';
import { HeroAction } from '../types';

interface HeroActionsProps {
  actions: readonly HeroAction[];
}

const HeroActions: React.FC<HeroActionsProps> = ({ actions }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center gap-6 delay-500 duration-700 sm:flex-row">
    {actions.map((action, index) => (
      <BapiButton
        key={action.href}
        as="a"
        href={action.href}
        color={action.variant}
        className={`w-full min-w-[240px] px-8 py-4 text-base sm:w-auto lg:min-w-[260px] lg:px-10 lg:py-5 lg:text-lg ${
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
