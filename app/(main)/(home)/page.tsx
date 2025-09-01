import { ErrorBoundary } from '@/components/error-boundary';
import { Suspense } from 'react';
import Footer from './_components/footer';
import Header from './_components/header';
import ImageSlide from './_components/image-slide';
import RankingList from './_components/ranking-list';
import RankingListSkeleton from './_components/ranking-list/ranking-list-skeleton';

export const dynamic = 'force-dynamic';

const HomePage = () => {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-white font-pretendard">
        <Header />
        <main className="flex-1 overflow-y-auto pb-[55px]" role="main">
          <Suspense
            fallback={<div className="h-[316px] animate-pulse bg-gray-100" />}
          >
            <ImageSlide />
          </Suspense>
          <Suspense fallback={<RankingListSkeleton />}>
            <RankingList />
          </Suspense>
          <Footer />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
