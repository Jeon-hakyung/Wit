import type { WishlistSummaryProps } from '@/types/wishlist';

const ScrapSummary = ({ totalPrice, itemCount }: WishlistSummaryProps) => {
  if (itemCount === 0) {
    return null;
  }

  const formatPrice = (price: number): string => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="px-4 py-1">
      <p className="mb-1 text-xs font-normal text-wit-gray">
        기념품 {itemCount}개
      </p>
      <p className="text-base font-semibold text-wit-black">
        총 <span className="text-wit-orange">{formatPrice(totalPrice)}원</span>
        어치를 담아뒀어요!
      </p>
    </div>
  );
};

export default ScrapSummary;
