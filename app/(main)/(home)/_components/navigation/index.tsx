'use client';

import { BOTTOM_NAVIGATION_ITEMS } from '@/constants/navigation';
import { usePathname } from 'next/navigation';
import NavigationItemComponent from './navigation-item';

const Navigation = () => {
  const pathname = usePathname();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).click();
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-1/2 w-full max-w-[600px] -translate-x-1/2 border-t border-gray-100 bg-white"
      role="navigation"
      aria-label="메인 네비게이션"
    >
      <div className="flex h-[54px] items-center justify-around px-2.5">
        {BOTTOM_NAVIGATION_ITEMS.map(item => {
          const isActive = pathname === item.path;

          return (
            <NavigationItemComponent
              key={item.id}
              item={item}
              isActive={isActive}
              onKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
