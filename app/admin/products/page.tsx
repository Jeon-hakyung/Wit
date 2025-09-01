'use client';

import { deleteProduct, getProducts } from '@/actions/admin';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ProductWithRelations } from '@/types/admin';
import { Package, Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductTable from './_components/product-table';

export const dynamic = 'force-dynamic';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('상품 목록을 불러오는데 실패했습니다.');
      console.error('상품 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = (product: ProductWithRelations) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleDeleteProduct = (product: ProductWithRelations) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);

    try {
      const result = await deleteProduct(selectedProduct.id);

      if (result.success) {
        toast.success(result.message);
        loadProducts();
        setShowDeleteDialog(false);
        setSelectedProduct(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('상품 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wit-black">상품 관리</h1>
          <p className="mt-2 text-wit-gray">
            상품을 등록, 수정, 삭제하고 이미지와 상세정보를 관리할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadProducts}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          <Button
            onClick={handleAddProduct}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>상품 추가</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>등록된 상품 ({products.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
              <span>상품 목록을 불러오는 중...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                아직 등록된 상품이 없습니다
              </h3>
              <p className="mb-6 text-gray-500">
                첫 번째 상품을 추가하여 쇼핑몰을 시작하세요.
              </p>
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />첫 상품 추가하기
              </Button>
            </div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>상품 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>&quot;{selectedProduct?.name}&quot;</strong> 상품을 정말
              삭제하시겠습니까?
              <br />
              <br />이 작업은 되돌릴 수 없으며, 연관된 이미지와 데이터도 함께
              삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
