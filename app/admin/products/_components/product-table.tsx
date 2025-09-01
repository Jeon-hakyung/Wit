'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type ProductWithRelations } from '@/types/admin';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Edit, Eye, Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface ProductTableProps {
  products: ProductWithRelations[];
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (product: ProductWithRelations) => void;
  onView?: (product: ProductWithRelations) => void;
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onView,
}: ProductTableProps) => {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Trash2 className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          등록된 상품이 없습니다
        </h3>
        <p className="text-gray-500">첫 번째 상품을 추가하여 시작하세요.</p>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string = 'KRW') => {
    return `${price.toLocaleString('ko-KR')}${currency === 'KRW' ? '원' : ` ${currency}`}`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">이미지</TableHead>
            <TableHead>상품명</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>가격</TableHead>
            <TableHead className="w-[80px]">찜</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead className="w-[50px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => {
            const firstImage = product.ProductImage[0];
            const imageUrl = firstImage
              ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL || ''}/${firstImage.imageKey}`
              : null;

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-xs text-gray-400">
                          이미지
                          <br />
                          없음
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.ProductImage.length}장의 이미지
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {product.category ? (
                    <Badge variant="secondary">{product.category.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">미분류</span>
                  )}
                </TableCell>

                <TableCell className="font-medium">
                  {formatPrice(product.price, product.currency)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-sm">{product._count.wishlists}</span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {format(new Date(product.createdAt), 'MM.dd HH:mm', {
                    locale: ko,
                  })}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">메뉴 열기</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onView && (
                        <DropdownMenuItem
                          onClick={() => onView(product)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          상세보기
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onEdit(product)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="cursor-pointer text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
