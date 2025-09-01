import { getRankedProducts } from '@/actions/product';
import RankingItem from './ranking-item';

interface RankingListProps {
  searchParams?: {
    category?: string;
  };
}

const RankingList = async ({ searchParams }: RankingListProps) => {
  const categoryId = searchParams?.category;
  const { data: rankingData, error } = await getRankedProducts(categoryId);

  if (error || !rankingData) {
    return (
      <div className="flex h-40 items-center justify-center text-wit-gray-300">
        <p>{error || '랭킹 정보를 불러올 수 없습니다.'}</p>
      </div>
    );
  }

  if (rankingData.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-wit-gray-300">
        <p>랭킹 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="space-y-2.5">
        {rankingData.map(item => (
          <RankingItem
            key={item.id}
            item={{
              id: item.id,
              rank: item.rank,
              category: item.category,
              title: item.title,
              price: item.price,
              image: item.image,
              isBookmarked: item.isBookmarked,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RankingList;
