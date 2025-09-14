'use client';

import { toggleWishlistItem } from '@/actions/wishlist';
import bookmarkIcon from '@/assets/icons/bookmark-icon.svg';
import { cn } from '@/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';

interface ProductCardProps {
  id: string;
  rank: number;
   imageUrl: string;
  category: string;
  title: string;
  price: number;
  isBookmarked: boolean;
  onClick?: (id: string) => void;
}

const ProductCard = ({
  id,
  rank,
  imageUrl,
  category,
  title,
  price,
  isBookmarked: initialIsBookmarked,
  onClick,
}: ProductCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isPending, startTransition] = useTransition();
  const [imageError, setImageError] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isPending) return;

    const previousIsBookmarked = isBookmarked;
    setIsBookmarked(prev => !prev);

    startTransition(async () => {
      const result = await toggleWishlistItem(id);

      if (result.error) {
        setIsBookmarked(previousIsBookmarked);
      } else if (
        result.isBookmarked !== undefined &&
        result.isBookmarked !== isBookmarked
      ) {
        setIsBookmarked(result.isBookmarked);
      }
    });
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <Link
      href={`/product/${id}`}
      className={cn(
        'flex cursor-pointer items-center gap-3 px-4 transition-colors hover:bg-gray-50',
        onClick && 'cursor-pointer',
      )}
      role="button"
      onClick={handleCardClick}
    >
      <div className="relative flex-shrink-0">
        <div className="h-[70px] w-[70px] overflow-hidden bg-gray-100">
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={title}
              width={70}
              height={70}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
              unoptimized={!!imageError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              이미지 없음
            </div>
          )}
        </div>
        <div className="absolute left-0 top-0 flex h-[18px] w-[18px] items-center justify-center bg-wit-orange">
          <span className="text-xs font-medium text-white">{rank}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <span
          className={cn(
            'inline-block rounded py-0.5 text-2xs font-medium text-wit-gray',
          )}
        >
          {category}
        </span>
        <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-wit-black">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-wit-black">{`약 ${price.toLocaleString(
            'ko-KR',
          )}원`}</span>
        </div>
      </div>
      <button
        type="button"
        className={cn(
          'flex h-6 w-6 flex-shrink-0 items-center justify-center transition-opacity hover:opacity-70',
        )}
        onClick={handleBookmarkClick}
        aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
        disabled={isPending}
      >
        <Image
          src={bookmarkIcon}
          alt=""
          width={14}
          height={18}
          className={cn('object-contain transition-all duration-200')}
          style={{
            filter: isBookmarked
              ? 'brightness(0) saturate(100%) invert(48%) sepia(89%) saturate(2077%) hue-rotate(345deg) brightness(101%) contrast(101%)'
              : 'brightness(0) invert(0.8) saturate(100%)',
          }}
          aria-hidden="true"
        />
      </button>
    </Link>
  );
};

export default ProductCard;
