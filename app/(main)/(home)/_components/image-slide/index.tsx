'use client';

import productSample1 from '@/assets/images/product-sample-1-380ded.png';
import rankingProduct1 from '@/assets/images/ranking-product-1-604397.png';
import rankingProduct2 from '@/assets/images/ranking-product-2-604397.png';
import rankingProduct3 from '@/assets/images/ranking-product-3-604397.png';
import { useSwipe } from '@/hooks/useSwipe';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SlideIndicator from './slide-indicator';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const ImageSlide = () => {
  const slides: SlideData[] = useMemo(
    () => [
      {
        id: 1,
        subtitle: '일본여행 기념품으로 꼭 사야한다는 화제의 디저트',
        title: '먼작귀 X 도쿄바나나',
        imageUrl: productSample1.src,
      },
      {
        id: 2,
        subtitle: '슬라이드 샘플 2',
        title: '슬라이드 샘플 2',
        imageUrl: rankingProduct1.src,
      },
      {
        id: 3,
        subtitle: '슬라이드 샘플 3',
        title: '슬라이드 샘플 3',
        imageUrl: rankingProduct2.src,
      },
      {
        id: 4,
        subtitle: '슬라이드 샘플 4',
        title: '슬라이드 샘플 4',
        imageUrl: rankingProduct3.src,
      },
    ],
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionStyle, setTransitionStyle] = useState(
    'transform 0.5s ease-in-out',
  );
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slideItems = useMemo(() => {
    if (slides.length === 0) return [];
    if (slides.length === 1) return slides;
    return [slides[slides.length - 1], ...slides, slides[0]];
  }, [slides]);

  const slideCount = slides.length;

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
      }, 5000);
    }
  }, [isAutoPlay, slideCount, isDragging]);

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
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    }
    return undefined;
  }, [isDragging, resetAutoPlay]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentIndex === slideCount + 1) {
      timer = setTimeout(() => {
        setTransitionStyle('none');
        setCurrentIndex(1);
        setTimeout(() => {
          resetAutoPlay();
        }, 50);
      }, 500);
    } else if (currentIndex === 0) {
      timer = setTimeout(() => {
        setTransitionStyle('none');
        setCurrentIndex(slideCount);
        setTimeout(() => {
          resetAutoPlay();
        }, 50);
      }, 500);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [currentIndex, slideCount, resetAutoPlay]);

  const handleContainerClick = () => {
    if (!isDragging) {
      setIsAutoPlay(prev => !prev);
    }
  };

  return (
    <section className="w-full">
      <div
        ref={swipeRef}
        className="relative h-[316px] w-full cursor-pointer select-none overflow-hidden"
        role="button"
        tabIndex={0}
        onClick={handleContainerClick}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transitionStyle,
          }}
        >
          {slideItems.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="relative min-w-full flex-shrink-0"
            >
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                draggable={false}
                className="object-cover"
                priority={index === 1}
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h2 className="text-sm font-medium leading-snug">
                  {slide.subtitle}
                </h2>
                <p className="text-2xl font-black">{slide.title}</p>
              </div>
            </div>
          ))}
        </div>
        <SlideIndicator
          totalSlides={slideCount}
          currentSlide={(currentIndex - 1 + slideCount) % slideCount}
          onSlideChange={handleGoTo}
        />
      </div>
    </section>
  );
};

export default ImageSlide;
