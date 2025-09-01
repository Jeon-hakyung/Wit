'use client';

import type { WishlistItemProps } from '@/types/wishlist';
import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const ScrapListItem = ({
  item,
  showCheckbox = false,
  onSelectionChange,
  onClick,
}: WishlistItemProps) => {
  const [isSelected, setIsSelected] = useState(item.isSelected ?? false);
  const [imageError, setImageError] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);
    onSelectionChange?.(item.id, newSelectedState);
  };

  const handleCardClick = () => {
    if (!showCheckbox) {
      onClick?.(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const Comp = showCheckbox ? 'div' : Link;

  return (
    <Comp
      href={`/product/${item.id}`}
      className={cn(
        'flex items-center gap-3 px-4 py-1.5 transition-colors',
        !showCheckbox && 'cursor-pointer hover:bg-gray-50',
        showCheckbox && 'bg-white',
      )}
      onClick={handleCardClick}
      role={showCheckbox ? 'listitem' : 'button'}
      tabIndex={showCheckbox ? -1 : 0}
      onKeyDown={e => handleKeyDown(e, handleCardClick)}
      aria-label={!showCheckbox ? `${item.name} 상품 상세 보기` : undefined}
    >
      <div className="relative flex-shrink-0">
        <div className="h-[70px] w-[70px] overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={70}
              height={70}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              이미지 없음
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <span
          className={cn(
            'inline-block rounded py-0.5 text-2xs font-medium text-wit-gray',
          )}
        >
          {item.category}
        </span>
        <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-wit-black">
          {item.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-wit-black">{`약 ${item.price.toLocaleString(
            'ko-KR',
          )}원`}</span>
        </div>
      </div>
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
        {showCheckbox && (
          <button
            type="button"
            className={cn(
              'flex h-[18px] w-[18px] items-center justify-center rounded border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-opacity-50 focus:ring-offset-1',
              isSelected
                ? 'border-wit-orange bg-wit-orange'
                : 'border-[#CECECE] bg-white hover:border-wit-orange',
            )}
            onClick={handleCheckboxClick}
            aria-label={isSelected ? '선택 해제' : '선택'}
            aria-checked={isSelected}
            role="checkbox"
          >
            {isSelected && (
              <svg
                width="8"
                height="6"
                viewBox="0 0 8 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M1 3L3 5L7 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </Comp>
  );
};

export default ScrapListItem;
