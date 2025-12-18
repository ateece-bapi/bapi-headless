import React from 'react';
import BapiButton from '../../BapiButton';
import { HeroAction } from '../types';

interface HeroActionsProps {
  actions: readonly HeroAction[];
}

export const HeroActions: React.FC<HeroActionsProps> = ({ actions }) => (
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
    {actions.map((action) => (
      <BapiButton
        key={action.href}
        as="a"
        href={action.href}
        color={action.variant}
        className="w-full sm:w-auto min-w-[200px] transform hover:scale-105 transition-transform duration-200"
      >
        {action.label}
      </BapiButton>
    ))}
  </div>
);