'use client';

import editIcon from '@/assets/icons/edit-icon.svg';
import searchIcon from '@/assets/icons/search-icon.svg';
import type { WishlistHeaderProps } from '@/types/wishlist';
import Image from 'next/image';

const ScrapHeader = ({
  isEditMode,
  onEditModeToggle,
  onSearchClick,
  isEmpty,
}: WishlistHeaderProps) => {
  const handleSearchClick = (): void => {
    onSearchClick?.();

    if (process.env.NODE_ENV === 'development') {
      console.log('위시리스트 검색 버튼 클릭');
    }
  };

  const handleEditModeToggle = (): void => {
    onEditModeToggle();

    if (process.env.NODE_ENV === 'development') {
      console.log('편집 모드 토글:', !isEditMode);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    action: () => void,
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <header className="bg-white">
      <div className="flex h-[60px] items-center justify-between px-4">
        <h1 className="text-xl font-semibold text-wit-black">내 위트템</h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center transition-opacity duration-200 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-opacity-50 focus:ring-offset-2"
            onClick={handleSearchClick}
            onKeyDown={e => handleKeyDown(e, handleSearchClick)}
            aria-label="검색"
          >
            <Image
              src={searchIcon}
              alt=""
              width={20}
              height={20}
              className="object-contain"
              aria-hidden="true"
            />
          </button>
          {!isEmpty && (
            <button
              type="button"
              className={`flex h-6 w-6 items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-opacity-50 focus:ring-offset-2 ${
                isEditMode
                  ? 'scale-110 opacity-100'
                  : 'opacity-70 hover:scale-105 hover:opacity-100'
              }`}
              onClick={handleEditModeToggle}
              onKeyDown={e => handleKeyDown(e, handleEditModeToggle)}
              aria-label={isEditMode ? '편집 모드 종료' : '편집 모드 시작'}
              aria-pressed={isEditMode}
            >
              <Image
                src={editIcon}
                alt=""
                width={24}
                height={24}
                className={`object-contain transition-all duration-200 ${
                  isEditMode
                    ? 'invert(30%) sepia(100%) saturate(2000%) hue-rotate(8deg) brightness(1.2) contrast(1) brightness-0 saturate-100'
                    : ''
                }`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ScrapHeader;
