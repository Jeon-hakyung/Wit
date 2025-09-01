export interface Product {
  id: string | number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isBookmarked?: boolean;
  isBestSeller?: boolean;
  discountRate?: number;
}

export interface ProductCardProps {
  product: Product;
  rank?: number;
  onBookmarkToggle?: (productId: string | number) => void;
  onClick?: (product: Product) => void;
  showRankBadge?: boolean;
}

export interface ProductDetailInfo {
  productName: string;
  productType: string;
  countryOfOrigin: string;
  usage: string;
  ingredients: string;
}

export interface ProductDetail extends Product {
  images: { id: string; url: string }[];
  description: string;
  priceJpy: number;
  originalPriceJpy?: number;
  bookmarkCount: number;
  details: ProductDetailInfo;
  similarProductIds: (string | number)[];
}
