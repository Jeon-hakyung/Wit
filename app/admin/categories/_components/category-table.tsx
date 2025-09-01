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
import { type CategoryWithProductCount } from '@/types/admin';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';

interface CategoryTableProps {
  categories: CategoryWithProductCount[];
  onEdit: (category: CategoryWithProductCount) => void;
  onDelete: (category: CategoryWithProductCount) => void;
}

const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) => {
  if (categories.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Trash2 className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          등록된 카테고리가 없습니다
        </h3>
        <p className="text-gray-500">
          첫 번째 카테고리를 추가하여 상품 분류를 시작하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>카테고리명</TableHead>
            <TableHead>상품 수</TableHead>
            <TableHead>생성일</TableHead>
            <TableHead>수정일</TableHead>
            <TableHead className="w-[50px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    category._count.products > 0 ? 'default' : 'secondary'
                  }
                >
                  {category._count.products}개
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(category.createdAt), 'yyyy.MM.dd HH:mm', {
                  locale: ko,
                })}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(category.updatedAt), 'yyyy.MM.dd HH:mm', {
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
                    <DropdownMenuItem
                      onClick={() => onEdit(category)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category)}
                      className="cursor-pointer text-destructive"
                      disabled={category._count.products > 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                      {category._count.products > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (상품 있음)
                        </span>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
