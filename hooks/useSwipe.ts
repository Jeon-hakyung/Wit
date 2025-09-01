'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
}

interface SwipePosition {
  x: number;
  y: number;
}

interface UseSwipeReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  isDragging: boolean;
}

export const useSwipe = <T extends HTMLElement>({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
}: UseSwipeOptions): UseSwipeReturn<T> => {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef<SwipePosition | null>(null);
  const currentPosition = useRef<SwipePosition | null>(null);

  const getPosition = (e: TouchEvent | MouseEvent): SwipePosition => {
    if (e instanceof TouchEvent) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = useCallback((e: TouchEvent | MouseEvent) => {
    setIsDragging(true);
    startPosition.current = getPosition(e);
    currentPosition.current = getPosition(e);
  }, []);

  const handleMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!isDragging || !startPosition.current) return;

      currentPosition.current = getPosition(e);

      const deltaX = Math.abs(
        currentPosition.current.x - startPosition.current.x,
      );
      const deltaY = Math.abs(
        currentPosition.current.y - startPosition.current.y,
      );

      if (deltaX > deltaY) {
        if (e instanceof TouchEvent) {
          e.preventDefault();
        }
      }
    },
    [isDragging],
  );

  const handleEnd = useCallback(() => {
    if (!isDragging || !startPosition.current || !currentPosition.current) {
      setIsDragging(false);
      return;
    }

    const deltaX = currentPosition.current.x - startPosition.current.x;
    const deltaY = Math.abs(
      currentPosition.current.y - startPosition.current.y,
    );
    const absDeltaX = Math.abs(deltaX);

    if (absDeltaX > deltaY && absDeltaX >= minSwipeDistance) {
      if (deltaX > 0) onSwipeRight?.();
      else onSwipeLeft?.();
    }

    setIsDragging(false);
    startPosition.current = null;
    currentPosition.current = null;
  }, [isDragging, minSwipeDistance, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchmove', handleMove, { passive: false });
    element.addEventListener('touchend', handleEnd);
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseup', handleEnd);
    element.addEventListener('mouseleave', handleEnd);

    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseup', handleEnd);
      element.removeEventListener('mouseleave', handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return { ref, isDragging };
};
