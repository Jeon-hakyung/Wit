'use client';

import { getCategories } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type CategoryWithProductCount } from '@/types/admin';
import { Plus, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CategoryDeleteDialog from './_components/category-delete-dialog';
import CategoryForm from './_components/category-form';
import CategoryTable from './_components/category-table';

export const dynamic = 'force-dynamic';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryWithProductCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithProductCount | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('카테고리 목록을 불러오는데 실패했습니다.');
      console.error('카테고리 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: CategoryWithProductCount) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = (category: CategoryWithProductCount) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const handleSuccess = () => {
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wit-black">카테고리 관리</h1>
          <p className="mt-2 text-wit-gray">
            상품 카테고리를 생성, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCategories}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          <Button
            onClick={handleAddCategory}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>카테고리 추가</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>등록된 카테고리 ({categories.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
              <span>카테고리 목록을 불러오는 중...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                아직 등록된 카테고리가 없습니다
              </h3>
              <p className="mb-6 text-gray-500">
                첫 번째 카테고리를 추가하여 상품 분류를 시작하세요.
              </p>
              <Button onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" />첫 카테고리 추가하기
              </Button>
            </div>
          ) : (
            <CategoryTable
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          )}
        </CardContent>
      </Card>

      <CategoryForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleSuccess}
        category={selectedCategory}
      />

      <CategoryDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onSuccess={handleSuccess}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoriesPage;
