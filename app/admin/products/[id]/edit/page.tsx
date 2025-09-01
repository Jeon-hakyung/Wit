import { getProducts } from '@/actions/admin';
import { notFound } from 'next/navigation';
import ProductForm from '../../_components/product-form';

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

const EditProductPage = async ({ params }: EditProductPageProps) => {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === params.id);

    if (!product) {
      notFound();
    }

    return <ProductForm product={product} isEdit />;
  } catch (error) {
    console.error('상품 조회 실패:', error);
    notFound();
  }
};

export default EditProductPage;
