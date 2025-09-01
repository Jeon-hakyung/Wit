'use client';

import type { NavigationItem } from '@/constants/navigation';
import { cn } from '@/utils';
import Link from 'next/link';
import CategoryIcon from './category-icon';
import CommunityIcon from './community-icon';
import HomeIcon from './home-icon';
import MyPageIcon from './my-page-icon';
import ScrapIcon from './scrap-icon';

interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const ICONS: Record<string, React.ElementType> = {
  category: CategoryIcon,
  community: CommunityIcon,
  home: HomeIcon,
  scrap: ScrapIcon,
  mypage: MyPageIcon,
};

const NavigationItemComponent = ({
  item,
  isActive,
  onKeyDown,
}: NavigationItemProps) => {
  const Icon = ICONS[item.id];
  const iconTextColor = isActive ? 'text-wit-orange' : 'text-wit-black';

  return (
    <Link
      href={item.path}
      replace
      className="flex w-auto flex-1 flex-col items-center justify-center focus:outline-none"
      aria-label={item.ariaLabel}
      onKeyDown={onKeyDown}
    >
      <div
        className={cn(
          'relative mb-1 flex h-5 w-5 items-center justify-center',
          iconTextColor,
        )}
      >
        <Icon className="h-full w-full" />
      </div>
      <span
        className={cn(
          'text-2xs font-medium transition-colors duration-200',
          isActive ? 'text-wit-orange' : 'text-wit-black hover:text-wit-orange',
        )}
      >
        {item.label}
      </span>
    </Link>
  );
};

export default NavigationItemComponent;
