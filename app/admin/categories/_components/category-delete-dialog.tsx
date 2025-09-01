'use client';

import { deleteCategory } from '@/actions/admin';
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
import { type CategoryWithProductCount } from '@/types/admin';
import { useState } from 'react';
import { toast } from 'sonner';

interface CategoryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: CategoryWithProductCount | null;
}

const CategoryDeleteDialog = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}: CategoryDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    setIsDeleting(true);

    try {
      const result = await deleteCategory(category.id);

      if (result.success) {
        toast.success(result.message);
        onSuccess();
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasProducts = category?._count.products && category._count.products > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            {hasProducts ? (
              <>
                <strong>&quot;{category?.name}&quot;</strong> 카테고리에는{' '}
                <strong>{category?._count.products}개의 상품</strong>이 연결되어
                있습니다.
                <br />
                <br />
                먼저 상품을 다른 카테고리로 이동하거나 삭제한 후 다시
                시도해주세요.
              </>
            ) : (
              <>
                <strong>&quot;{category?.name}&quot;</strong> 카테고리를 정말
                삭제하시겠습니까?
                <br />
                <br />이 작업은 되돌릴 수 없습니다.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          {!hasProducts && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryDeleteDialog;
