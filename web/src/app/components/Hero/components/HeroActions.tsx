import React from 'react';
import BapiButton from '../../BapiButton';
import { HeroAction } from '../types';

interface HeroActionsProps {
  actions: readonly HeroAction[];
}

const HeroActions: React.FC<HeroActionsProps> = ({ actions }) => (
  <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
    {actions.map((action, index) => (
      <BapiButton
        key={action.href}
        as="a"
        href={action.href}
        color={action.variant}
        className={`w-full sm:w-auto min-w-[240px] lg:min-w-[260px] px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg ${
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