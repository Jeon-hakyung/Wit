import { getProductDetail } from '@/actions/product';
import { ErrorBoundary } from '@/components/error-boundary';
import { Suspense } from 'react';
import ProductDetailTabs from './_components/detail-tab';
import ProductImageSlider from './_components/image-slide';
import ProductHeader from './_components/product-header';
import ProductInfo from './_components/product-info';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: { productId: string };
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const { productId } = params;
  const { data: productDetail, error } = await getProductDetail(productId);

  if (error || !productDetail) {
    return (
      <ErrorBoundary>
        <div className="flex min-h-screen flex-col bg-white font-pretendard">
          <ProductHeader />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h1 className="mb-2 text-xl font-bold text-gray-800">
                {error || '상품을 찾을 수 없습니다'}
              </h1>
              <p className="text-gray-600">
                요청하신 상품 정보가 존재하지 않습니다.
              </p>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-white font-pretendard">
        <ProductHeader />
        <main className="flex-1 overflow-y-auto pb-[55px]" role="main">
          <Suspense
            fallback={<div className="h-[400px] animate-pulse bg-gray-100" />}
          >
            <ProductImageSlider
              images={productDetail.images}
              productName={productDetail.name}
            />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-[200px] animate-pulse bg-gray-100 px-4" />
            }
          >
            <ProductInfo product={productDetail} />
          </Suspense>
          <Suspense
            fallback={
              <div className="h-[300px] animate-pulse bg-gray-100 px-4" />
            }
          >
            <ProductDetailTabs product={productDetail} />
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default ProductDetailPage;
