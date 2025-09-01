'use client';

import { createProduct, getCategories, updateProduct } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type CategoryWithProductCount,
  type ProductWithRelations,
} from '@/types/admin';
import { getS3ImageUrl } from '@/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ImageUpload from './image-upload';
import ProductDetailForm from './product-detail-form';

interface ProductFormProps {
  product?: ProductWithRelations | null;
  isEdit?: boolean;
}

interface ProductDetail {
  id: string;
  key: string;
  value: string | number;
}

const ProductForm = ({ product, isEdit = false }: ProductFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    currency: product?.currency || 'KRW',
    categoryId: product?.categoryId || 'uncategorized',
  });

  const [details, setDetails] = useState<ProductDetail[]>(() => {
    if (product?.ProductDetail?.detail) {
      try {
        const parsed = JSON.parse(product.ProductDetail.detail) as Array<{
          key?: string;
          value?: string | number;
        }>;
        return parsed.map(d => ({
          id: `${Date.now()}-${Math.random()}`,
          key: d.key ?? '',
          value: d.value ?? '',
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const [imageKeys, setImageKeys] = useState<string[]>(
    product?.ProductImage?.map(img => img.imageKey) || [],
  );

  const initialImages = useMemo(() => {
    if (!product?.ProductImage) return [];

    return product.ProductImage.map(img => ({
      key: img.imageKey,
      url: getS3ImageUrl(img.imageKey),
    }));
  }, [product?.ProductImage]);

  const stableProductId = useMemo(
    () => product?.id || `temp-${Date.now()}`,
    [product?.id],
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
        toast.error('카테고리 목록을 불러오는데 실패했습니다.');
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (keys: string[]) => {
    setImageKeys(keys);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('상품명을 입력해주세요.');
      return;
    }

    const priceValue =
      typeof formData.price === 'string'
        ? parseFloat(formData.price)
        : formData.price;
    if (!formData.price || priceValue <= 0 || Number.isNaN(priceValue)) {
      toast.error('가격을 올바르게 입력해주세요.');
      return;
    }

    if (imageKeys.length < 3) {
      toast.error('최소 3장의 이미지가 필요합니다.');
      return;
    }

    if (imageKeys.length > 6) {
      toast.error('최대 6장의 이미지만 업로드할 수 있습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('price', priceValue.toString());
      submitData.append('currency', formData.currency);

      submitData.append('categoryId', formData.categoryId);

      submitData.append(
        'details',
        JSON.stringify(details.map(({ key, value }) => ({ key, value }))),
      );
      submitData.append('imageKeys', JSON.stringify(imageKeys));

      const result =
        isEdit && product
          ? await updateProduct(product.id, submitData)
          : await createProduct(submitData);

      if (result.success) {
        toast.success(result.message);
        router.push('/admin/products');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('상품 저장 실패:', error);
      toast.error('상품 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wit-black">
            {isEdit ? '상품 수정' : '상품 등록'}
          </h1>
          <p className="mt-2 text-wit-gray">
            {isEdit
              ? '상품 정보를 수정하세요.'
              : '새로운 상품을 등록하세요. 모든 정보를 정확히 입력해주세요.'}
          </p>
        </div>

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">상품명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="상품명을 입력하세요"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={value =>
                    handleInputChange('categoryId', value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uncategorized">미분류</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category._count.products}개)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">가격 *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={e => handleInputChange('price', e.target.value)}
                  placeholder="가격을 입력하세요"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">통화</Label>
                <Select
                  value={formData.currency}
                  onValueChange={value => handleInputChange('currency', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JPY">JPY (엔)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <ImageUpload
          productId={stableProductId}
          maxImages={6}
          minImages={3}
          onImagesChange={handleImagesChange}
          initialImages={initialImages}
        />

        <ProductDetailForm details={details} onChange={setDetails} />

        <div className="flex justify-end space-x-2 md:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
