'use client';

import { deleteWishlistItems } from '@/actions/wishlist';
import { useLayoutDispatch } from '@/components/layout-context';
import type { WishlistItem } from '@/types/wishlist';
import { cn } from '@/utils';
import { useCallback, useEffect, useState, useTransition } from 'react';
import DeleteConfirmModal from './delete-confirm-modal';
import EmptyList from './empty-list';
import ScrapHeader from './scrap-header';
import ScrapListItem from './scrap-list-item';
import ScrapSummary from './scrap-summary';

interface ScrapContainerProps {
  initialItems: WishlistItem[];
  totalPrice: number;
}

const ScrapContainer = ({ initialItems, totalPrice }: ScrapContainerProps) => {
  const [items, setItems] = useState(initialItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const setIsNavVisible = useLayoutDispatch();

  useEffect(() => {
    setIsNavVisible(!isEditMode);
    return () => setIsNavVisible(true);
  }, [isEditMode, setIsNavVisible]);

  const handleSearchClick = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('위시리스트 검색 기능');
    }
  }, []);

  const handleEditModeToggle = useCallback(() => {
    setIsEditMode(prev => !prev);
    setSelectedIds(new Set());
    setShowDeleteModal(false);
  }, []);

  const handleSelectionChange = useCallback(
    (itemId: string | number, isSelected: boolean) => {
      setSelectedIds(prev => {
        const newSelectedIds = new Set(prev);
        if (isSelected) {
          newSelectedIds.add(itemId);
        } else {
          newSelectedIds.delete(itemId);
        }
        return newSelectedIds;
      });
    },
    [],
  );

  const handleItemClick = (item: WishlistItem) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('상품 상세 보기:', item.name);
    }
  };

  const handleShowDeleteModal = useCallback(() => {
    if (selectedIds.size > 0) {
      setShowDeleteModal(true);
    }
  }, [selectedIds.size]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    startTransition(async () => {
      const idsToRemove = Array.from(selectedIds, String);
      const result = await deleteWishlistItems(idsToRemove);

      if (result.success) {
        setItems(prev =>
          prev.filter(item => !idsToRemove.includes(item.id as string)),
        );
      }

      setSelectedIds(new Set());
      setIsEditMode(false);
      setShowDeleteModal(false);
    });
  }, [selectedIds]);

  const isEmpty = items.length === 0;

  return (
    <div
      className={cn(
        'flex flex-col',
        isEditMode ? 'h-screen' : 'h-[calc(100vh-60px)]',
      )}
    >
      <ScrapHeader
        isEditMode={isEditMode}
        onEditModeToggle={handleEditModeToggle}
        onSearchClick={handleSearchClick}
        isEmpty={isEmpty}
      />
      <div className="relative flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyList />
        ) : (
          <>
            {!isEditMode && (
              <ScrapSummary totalPrice={totalPrice} itemCount={items.length} />
            )}
            {isEditMode && (
              <div className="px-4 py-4">
                <p className="text-sm font-normal text-wit-orange">
                  선택한 기념품 {selectedIds.size}개
                </p>
              </div>
            )}
            {items.map(item => (
              <ScrapListItem
                key={item.id}
                item={item}
                showCheckbox={isEditMode}
                onSelectionChange={handleSelectionChange}
                onClick={handleItemClick}
              />
            ))}
          </>
        )}
      </div>
      {isEditMode && !isEmpty && (
        <div className="shadow-top border-t border-gray-100 bg-white p-4">
          <button
            type="button"
            className={`w-full rounded-md py-4 text-center text-base font-semibold transition-colors ${
              selectedIds.size > 0 && !isPending
                ? 'bg-wit-orange text-white hover:bg-orange-600'
                : 'cursor-not-allowed bg-gray-200 text-gray-400'
            }`}
            onClick={handleShowDeleteModal}
            disabled={selectedIds.size === 0 || isPending}
            aria-label={`선택한 ${selectedIds.size}개 아이템 삭제`}
          >
            {isPending ? '삭제 중...' : '삭제'}
          </button>
        </div>
      )}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        itemCount={selectedIds.size}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ScrapContainer;
