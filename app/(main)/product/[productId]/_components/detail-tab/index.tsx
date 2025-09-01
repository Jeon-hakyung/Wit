'use client';

import type { getProductDetail } from '@/actions/product';
import { cn } from '@/utils';
import { useState } from 'react';
import ProductDetailInfoTable from './product-detail';
import SimilarProductList from './similar-product-list';

type ProductDetailData = Awaited<ReturnType<typeof getProductDetail>>['data'];

interface ProductDetailTabsProps {
  product: NonNullable<ProductDetailData>;
}

type TabType = 'info' | 'similar';

const ProductDetailTabs = ({ product }: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const tabs = [
    { id: 'info', label: '기념품 정보' },
    { id: 'similar', label: '비슷한 기념품' },
  ] as const;

  const handleTabClick = (tabId: TabType): void => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: TabType): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(tabId);
    }
  };

  return (
    <section className="w-full border-t-[6px] border-[#F4F4F4]">
      <div className="border-b border-[#F4F4F4] px-10">
        <div className="flex">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  'flex-1 px-4 py-3 text-center transition-colors duration-200',
                  'border-b-2 border-transparent',
                  'focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-opacity-50',
                  isActive
                    ? 'border-[#282828] text-[#282828]'
                    : 'text-gray-500 hover:text-[#282828]',
                )}
                onClick={() => handleTabClick(tab.id)}
                onKeyDown={e => handleKeyDown(e, tab.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-6">
        {activeTab === 'info' && (
          <div
            id="tabpanel-info"
            role="tabpanel"
            aria-labelledby="tab-info"
            className="space-y-4"
          >
            <h3 className="mb-4 text-lg font-semibold text-[#111111]">
              기념품 정보
            </h3>
            <ProductDetailInfoTable details={product.details} />
          </div>
        )}

        {activeTab === 'similar' && (
          <div
            id="tabpanel-similar"
            role="tabpanel"
            aria-labelledby="tab-similar"
            className="space-y-4"
          >
            <SimilarProductList products={product.similarProducts || []} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailTabs;
