'use client';

import { useSwipe } from '@/hooks/useSwipe';
import { cn, getS3ImageUrl } from '@/utils';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CircularIndicator from './slide-indicator';

interface ProductImageSliderProps {
  images: { id: string; url: string }[];
  productName: string;
  className?: string;
  autoPlayInterval?: number;
}

const ProductImageSlider = ({
  images,
  productName,
  className,
  autoPlayInterval = 5000,
}: ProductImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionStyle, setTransitionStyle] = useState(
    'transform 0.5s ease-in-out',
  );
  const [isAutoPlay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slideImages = useMemo(() => {
    if (images.length === 0) return [];
    if (images.length === 1) return images;
    return [images[images.length - 1], ...images, images[0]];
  }, [images]);

  const slideCount = images.length;

  const { ref: swipeRef, isDragging } = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => {
      setCurrentIndex(prev => prev + 1);
      setTransitionStyle('transform 0.5s ease-in-out');
    },
    onSwipeRight: () => {
      setCurrentIndex(prev => prev - 1);
      setTransitionStyle('transform 0.5s ease-in-out');
    },
    minSwipeDistance: 50,
  });

  const resetAutoPlay = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    if (isAutoPlay && slideCount > 1 && !isDragging) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setTransitionStyle('transform 0.5s ease-in-out');
      }, autoPlayInterval);
    }
  }, [isAutoPlay, slideCount, autoPlayInterval, isDragging]);

  const handleGoTo = useCallback((index: number) => {
    setCurrentIndex(index + 1);
    setTransitionStyle('transform 0.5s ease-in-out');
  }, []);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [isAutoPlay, resetAutoPlay]);

  useEffect(() => {
    if (!isDragging) {
      const timer = setTimeout(() => {
        resetAutoPlay();
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

    return undefined;
  }, [isDragging, resetAutoPlay]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const handleTransitionEnd = () => {
      if (currentIndex === slideCount + 1) {
        setTransitionStyle('none');
        setCurrentIndex(1);
        setTimeout(() => {
          resetAutoPlay();
        }, 50);
      }
      if (currentIndex === 0) {
        setTransitionStyle('none');
        setCurrentIndex(slideCount);
        setTimeout(() => {
          resetAutoPlay();
        }, 50);
      }
    };

    if (currentIndex === slideCount + 1 || currentIndex === 0) {
      timer = setTimeout(handleTransitionEnd, 500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentIndex, slideCount, resetAutoPlay]);

  if (slideCount === 0) {
    return (
      <div className={cn('relative h-[400px] w-full bg-gray-200', className)}>
        <p className="flex h-full items-center justify-center text-gray-500">
          이미지가 없습니다
        </p>
      </div>
    );
  }

  return (
    <section
      className={cn('relative w-full', className)}
      aria-label="상품 이미지 슬라이더"
    >
      <div
        ref={swipeRef}
        className="relative h-[360px] w-full select-none overflow-hidden bg-gray-100"
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transitionStyle,
          }}
        >
          {slideImages.map((image, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`${image.id}-${index}`}
              className="relative h-full min-w-full flex-shrink-0"
            >
              <Image
                src={getS3ImageUrl(image.url)}
                alt={`${productName} 이미지 ${index > 0 && index <= slideCount ? index : ''}`}
                fill
                draggable={false}
                priority={index === 1}
                className="object-fill"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div
                className="absolute inset-0 top-0 h-[100px]"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(217, 217, 217, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
                }}
              />
            </div>
          ))}
        </div>

        {slideCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <CircularIndicator
              totalSlides={slideCount}
              currentSlide={(currentIndex - 1 + slideCount) % slideCount}
              onSlideChange={handleGoTo}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductImageSlider;
