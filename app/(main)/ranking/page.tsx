import { getCategories } from '@/actions/product';
import { ErrorBoundary } from '@/components/error-boundary';
import { Suspense } from 'react';
import CategoryFilter from './_components/category-filter';
import RankingHeader from './_components/ranking-header';
import RankingList from './_components/ranking-list';
import RankingUpdateInfo from './_components/ranking-update-info';

export const dynamic = 'force-dynamic';

interface RankingPageProps {
  searchParams: {
    category?: string;
  };
}

const RankingPage = async ({ searchParams }: RankingPageProps) => {
  const { data: categories } = await getCategories();
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <RankingHeader />
        <Suspense>
          <CategoryFilter categories={categories || []} />
        </Suspense>
        <div className="px-4">
          <RankingUpdateInfo />
        </div>
        <RankingList searchParams={searchParams} />
      </div>
    </ErrorBoundary>
  );
};

export default RankingPage;
