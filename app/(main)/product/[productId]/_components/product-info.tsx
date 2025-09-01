'use client';

import type { getProductDetail } from '@/actions/product';
import { toggleWishlistItem } from '@/actions/wishlist';
import bookmarkIcon from '@/assets/icons/bookmark-detail.svg';
import { cn } from '@/utils';
import Image from 'next/image';
import { useState, useTransition } from 'react';

type ProductDetailData = Awaited<ReturnType<typeof getProductDetail>>['data'];

interface ProductInfoProps {
  product: NonNullable<ProductDetailData>;
  onBookmarkToggle?: (
    productId: string | number,
    isBookmarked: boolean,
  ) => void;
}

const ProductInfo = ({ product, onBookmarkToggle }: ProductInfoProps) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    product.isBookmarked ?? false,
  );
  const [bookmarkCount, setBookmarkCount] = useState<number>(
    product.bookmarkCount ?? 0,
  );
  const [isPending, startTransition] = useTransition();

  const handleBookmarkClick = (): void => {
    if (isPending) return;

    const previousIsBookmarked = isBookmarked;
    const previousCount = bookmarkCount;

    const nextIsBookmarked = !previousIsBookmarked;
    setIsBookmarked(nextIsBookmarked);
    setBookmarkCount(prev => Math.max(0, prev + (nextIsBookmarked ? 1 : -1)));
    onBookmarkToggle?.(product.id, nextIsBookmarked);

    startTransition(async () => {
      const result = await toggleWishlistItem(String(product.id));
      if (result?.error) {
        setIsBookmarked(previousIsBookmarked);
        setBookmarkCount(previousCount);
        return;
      }
      if (typeof result?.isBookmarked === 'boolean') {
        setIsBookmarked(result.isBookmarked);
      }
    });
  };

  return (
    <section className="relative px-4 py-6">
      <div className="flex items-start justify-between">
        <h1 className="flex-1 pr-4 text-xl font-semibold leading-tight text-wit-black">
          {product.name}
        </h1>
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleBookmarkClick}
            className={cn(
              'flex h-6 w-6 items-center justify-center transition-transform duration-200',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-opacity-50',
              isBookmarked ? 'scale-110' : 'scale-100',
            )}
            aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
            disabled={isPending}
          >
            <Image
              src={bookmarkIcon}
              alt=""
              width={14}
              height={18}
              className={cn(
                'object-contain transition-all duration-200',
                !isBookmarked && 'brightness-0 invert-[0.8] saturate-100',
              )}
              style={{
                filter: isBookmarked
                  ? 'brightness(0) saturate(100%) invert(48%) sepia(89%) saturate(2077%) hue-rotate(345deg) brightness(101%) contrast(101%)'
                  : '',
              }}
              aria-hidden="true"
            />
          </button>
          <span className="text-xs font-medium text-wit-black">
            {bookmarkCount}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="rounded-sm bg-[#FFF1EB] px-[6px] py-[1px] text-xs font-medium text-[#6B6B6B]">
            원화
          </span>
          <span className="text-sm font-medium text-wit-orange">
            ₩{product.priceKRW.toLocaleString('ko-KR')}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="rounded-sm bg-[#FFF1EB] px-[6px] py-[1px] text-xs font-medium text-[#6B6B6B]">
            엔화
          </span>
          <span className="text-sm font-medium text-wit-black">
            ¥{product.price.toLocaleString('ja-JP')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ProductInfo;
