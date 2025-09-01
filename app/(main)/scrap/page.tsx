import { getWishlist } from '@/actions/wishlist';
import { ErrorBoundary } from '@/components/error-boundary';
import { Suspense } from 'react';
import ScrapContainer from './_components/scrap-container';

export const dynamic = 'force-dynamic';

const ScrapPage = async () => {
  const { data, error } = await getWishlist();

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <p className="text-lg text-gray-600">
          {error || '데이터를 불러올 수 없습니다.'}
        </p>
      </div>
    );
  }

  const { items, totalPriceKRW } = data;

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-white font-pretendard">
        <main className="flex-1 overflow-y-auto" role="main">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-wit-orange" />
                <p className="ml-3 text-sm text-gray-500">
                  위시리스트 로딩 중...
                </p>
              </div>
            }
          >
            <ScrapContainer initialItems={items} totalPrice={totalPriceKRW} />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default ScrapPage;
