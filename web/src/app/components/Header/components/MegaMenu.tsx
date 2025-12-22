'use client';

import React from 'react';
import clsx from 'clsx';
import { MEGA_MENU_ITEMS } from '../config';
import { useMegaMenu } from '../hooks/useMegaMenu';
import { MegaMenuItemComponent } from './MegaMenuItem';

interface MegaMenuProps {
  className?: string;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ className }) => {
  const menu = useMegaMenu();

  return (
    <nav
      aria-label="Primary navigation"
      className={clsx('flex items-center gap-1', className)}
    >
      {MEGA_MENU_ITEMS.map((item, index) => (
        <MegaMenuItemComponent
          key={item.label}
          item={item}
          index={index}
          isOpen={menu.isOpen(index)}
          onOpenWithIntent={() => menu.openWithIntent(index)}
          onCloseWithGrace={menu.closeWithGrace}
          onCancelTimers={menu.cancelTimers}
          onToggle={() => menu.toggle(index)}
          onCloseImmediate={menu.closeImmediate}
        />
      ))}
    </nav>
  );
};

export default MegaMenu;
