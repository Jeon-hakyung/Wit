'use client';

import { cn } from '@/utils';

interface CircularIndicatorProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange?: (slideIndex: number) => void;
}

const CircularIndicator = ({
  totalSlides,
  currentSlide,
  onSlideChange,
}: CircularIndicatorProps) => {
  const handleIndicatorClick = (slideIndex: number): void => {
    onSlideChange?.(slideIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent, slideIndex: number): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleIndicatorClick(slideIndex);
    }
  };

  return (
    <div
      className="flex items-center justify-center gap-[6px]"
      role="tablist"
      aria-label="상품 이미지 슬라이드 인디케이터"
    >
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentSlide;

        return (
          <button
            key={index}
            type="button"
            className={cn(
              'h-[4.61px] w-[4.61px] rounded-full transition-opacity duration-300',
              'focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50',
              isActive ? 'bg-white opacity-100' : 'bg-white opacity-50',
              onSlideChange && 'cursor-pointer hover:opacity-75',
            )}
            onClick={() => handleIndicatorClick(index)}
            onKeyDown={e => handleKeyDown(e, index)}
            role="tab"
            aria-selected={isActive}
            aria-label={`${index + 1}번째 이미지로 이동`}
            tabIndex={isActive ? 0 : -1}
          />
        );
      })}
    </div>
  );
};

export default CircularIndicator;
