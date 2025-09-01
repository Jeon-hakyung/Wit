import type { Product } from './product';

export interface WishlistItem extends Product {
  addedAt: string;
  isSelected?: boolean;
}

export interface WishlistItemProps {
  item: WishlistItem;
  showCheckbox?: boolean;
  onSelectionChange?: (itemId: string | number, isSelected: boolean) => void;
  onClick?: (item: WishlistItem) => void;
}

export interface WishlistHeaderProps {
  isEditMode: boolean;
  onEditModeToggle: () => void;
  onSearchClick?: () => void;
  isEmpty: boolean;
}

export interface WishlistSummaryProps {
  totalPrice: number;
  itemCount: number;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}
