'use client';

interface SlideIndicatorProps {
  totalSlides: number;
  currentSlide: number;
  onSlideChange?: (slide: number) => void;
}

const SlideIndicator = ({
  totalSlides,
  currentSlide,
  onSlideChange,
}: SlideIndicatorProps) => {
  const handleIndicatorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSlideChange) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const targetSlide = Math.floor(clickRatio * totalSlides);

    if (targetSlide >= 0 && targetSlide < totalSlides) {
      onSlideChange(targetSlide);
    }
  };

  return (
    <div
      role="slider"
      aria-label="슬라이드 네비게이터"
      aria-valuenow={currentSlide + 1}
      aria-valuemin={1}
      aria-valuemax={totalSlides}
      tabIndex={0}
      className="absolute bottom-0 left-0 flex h-[3px] w-full cursor-pointer"
      onClick={handleIndicatorClick}
    >
      <div className="h-full w-full bg-gray-300">
        <div
          className="h-full bg-wit-orange transition-all duration-300 ease-in-out"
          style={{
            width: `${100 / totalSlides}%`,
            transform: `translateX(${currentSlide * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default SlideIndicator;
