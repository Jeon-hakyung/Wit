import { getRankedProducts } from '@/actions/product';
import ProductCard from './product-card';
import RankingHeader from './ranking-header';

const RankingList = async () => {
  const { data: products, error } = await getRankedProducts();

  if (error || !products) {
    return (
      <div className="py-4">
        <RankingHeader />
        <div className="flex h-40 items-center justify-center text-wit-gray-300">
          <p>{error || '랭킹 정보를 불러올 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-4">
        <RankingHeader />
        <div className="flex h-40 items-center justify-center text-wit-gray-300">
          <p>랭킹 정보가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-4">
      <RankingHeader />
      <div className="mt-4 space-y-2.5">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            rank={product.rank}
            imageUrl={product.image}
            category={product.category}
            title={product.title}
            price={product.price}
            isBookmarked={product.isBookmarked}
          />
        ))}
      </div>
    </section>
  );
};

export default RankingList;
