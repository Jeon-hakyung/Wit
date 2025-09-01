'use client';

import type { DeleteConfirmModalProps } from '@/types/wishlist';
import { useEffect, useRef } from 'react';

const DeleteConfirmModal = ({
  isOpen,
  itemCount,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  const handleButtonKeyDown = (
    e: React.KeyboardEvent,
    action: () => void,
  ): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-9"
      style={{ backgroundColor: 'rgba(40, 40, 40, 0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={handleOverlayClick}
        aria-label="모달 닫기"
        tabIndex={-1}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-[288px] rounded-lg bg-white p-5"
        role="document"
      >
        <div className="space-y-5">
          <div>
            <h2
              id="delete-modal-title"
              className="text-center text-sm font-medium leading-[1.57] text-wit-black"
            >
              기념품 <span className="text-wit-orange">{itemCount}개</span>를
              위트에서 삭제하시겠습니까?
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-[4px] bg-[#F2F3F6] px-3 py-2 text-center text-sm font-medium text-wit-black transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              onClick={onCancel}
              onKeyDown={e => handleButtonKeyDown(e, onCancel)}
              aria-label="삭제 취소"
            >
              취소하기
            </button>
            <button
              type="button"
              className="flex-1 rounded-[4px] bg-wit-orange px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-opacity-50"
              onClick={onConfirm}
              onKeyDown={e => handleButtonKeyDown(e, onConfirm)}
              aria-label={`기념품 ${itemCount}개 삭제 확인`}
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
