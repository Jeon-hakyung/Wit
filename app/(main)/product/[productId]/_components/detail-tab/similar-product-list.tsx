'use client';

import type { Product } from '@/types/product';
import { useRouter } from 'next/navigation';
import SimilarProductCard from './similar-product-card';

interface SimilarProductListProps {
  products: Product[];
}

const SimilarProductList = ({ products }: SimilarProductListProps) => {
  const router = useRouter();

  const handleProductClick = (product: Product): void => {
    router.push(`/product/${product.id}`);
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-gray-500">비슷한 기념품이 없습니다</p>
      </div>
    );
  }

  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold text-[#111111]">
        비슷한 기념품
      </h3>
      <div className="overflow-x-auto pb-[10px] scrollbar-hide">
        <div className="flex items-start gap-[6px]">
          {products.map(product => (
            <div key={product.id} className="flex-shrink-0">
              <SimilarProductCard
                product={product}
                onClick={handleProductClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProductList;
