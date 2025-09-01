'use client';

import { createCategory, updateCategory } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type CategoryWithProductCount } from '@/types/admin';
import { useState } from 'react';
import { toast } from 'sonner';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: CategoryWithProductCount | null;
}

const CategoryForm = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}: CategoryFormProps) => {
  const [name, setName] = useState(category?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!category;

  const resetForm = () => {
    setName(category?.name || '');
    setError('');
    setIsLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('카테고리 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());

      const result = isEdit
        ? await updateCategory(category.id, formData)
        : await createCategory(formData);

      if (result.success) {
        toast.success(result.message);
        resetForm();
        onSuccess();
        onClose();
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      const errorMessage = '처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? '카테고리 수정' : '카테고리 추가'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? '카테고리 정보를 수정하세요.'
              : '새로운 카테고리를 추가하세요.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                이름
              </Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="카테고리 이름을 입력하세요"
                className="col-span-3"
                disabled={isLoading}
                maxLength={50}
              />
            </div>

            {error && (
              <div className="col-span-4 text-sm text-destructive">{error}</div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? '처리 중...' : isEdit ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
