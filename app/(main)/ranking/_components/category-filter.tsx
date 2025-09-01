'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const params = new URLSearchParams(searchParams);
      if (categoryId === 'all') {
        params.delete('category');
      } else {
        params.set('category', categoryId);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="border-b border-[#F4F4F4] px-5 pb-0">
      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
        {categories.map(category => (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategorySelect(category.id)}
            className={`h-8 whitespace-nowrap px-3 py-1 text-base font-normal leading-none ${
              selectedCategory === category.id
                ? 'border-b-2 border-wit-black font-semibold text-wit-black'
                : 'text-[#9D9D9D]'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
