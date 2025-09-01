import { type Category, type Product } from '@prisma/client';

export interface CategoryFormData {
  name: string;
}

export interface CategoryWithProductCount extends Category {
  _count: {
    products: number;
  };
}

export interface ProductFormData {
  name: string;
  price: number;
  currency: string;
  categoryId: string | null;
  details: Array<{
    key: string;
    value: string | number;
  }>;
  imageKeys: string[];
}

export interface ProductWithRelations extends Product {
  category: Category | null;
  ProductDetail: {
    detail: string;
  } | null;
  ProductImage: Array<{
    imageKey: string;
  }>;
  _count: {
    wishlists: number;
  };
}

export interface AdminActionResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

export interface AdminCounts {
  productCount: number;
  categoryCount: number;
  userCount: number;
}
