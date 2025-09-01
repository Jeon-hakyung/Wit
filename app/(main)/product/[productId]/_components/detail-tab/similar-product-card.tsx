'use client';

import type { Product } from '@/types/product';
import { cn } from '@/utils';
import Image from 'next/image';

interface SimilarProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const SimilarProductCard = ({ product, onClick }: SimilarProductCardProps) => {
  const handleCardClick = (): void => {
    onClick?.(product);
  };

  const formatPrice = (price: number): string => {
    return `약 ${price.toLocaleString('ko-KR')}원`;
  };

  return (
    <div
      className={cn(
        'relative w-[130px] cursor-pointer transition-transform duration-200 hover:scale-105',
        onClick && 'cursor-pointer',
      )}
      onClick={handleCardClick}
      role="button"
    >
      <div className="relative mb-[6px] h-[130px] w-[130px] overflow-hidden rounded-sm bg-[#F4F4F4]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="130px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-1 text-[10px] font-medium leading-[1.6] text-[#6B6B6B]">
          {product.category}
        </span>
        <h4 className="mb-1 line-clamp-1 text-ellipsis text-sm font-medium leading-[1.57] text-[#282828]">
          {product.name}
        </h4>
        <p className="text-sm font-bold leading-[1.57] text-[#282828]">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
};

export default SimilarProductCard;
