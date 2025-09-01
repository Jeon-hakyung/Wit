'use server';

import prisma from '@/libs/prisma';
import { getSession } from '@/libs/session';
import { getS3ImageUrl } from '@/utils';
import { convertToKRW } from '@/utils/currency';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return {
      data: [{ id: 'all', name: '전체' }, ...categories],
    };
  } catch (error) {
    console.error('카테고리 조회 에러:', error);
    return {
      error: '카테고리를 불러오는 데 실패했습니다.',
    };
  }
}

export async function getRankedProducts(categoryId?: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;

    const where =
      categoryId && categoryId !== 'all' ? { categoryId } : undefined;

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        {
          wishlists: {
            _count: 'desc',
          },
        },
        {
          count: 'desc',
        },
      ],
      include: {
        category: true,
        ProductImage: true,
        wishlists: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : { take: 0 },
      },
      take: 10,
    });

    return {
      data: products.map((p, index) => ({
        id: p.id,
        rank: index + 1,
        category: p.category?.name || '미분류',
        title: p.name,
        price: convertToKRW(p.price, p.currency),
        image: p.ProductImage[0]?.imageKey
          ? getS3ImageUrl(p.ProductImage[0].imageKey)
          : '/assets/images/product-sample-1.png',
        isBookmarked: (p.wishlists?.length ?? 0) > 0,
      })),
    };
  } catch (error) {
    console.error('랭킹 상품 조회 에러:', error);
    return {
      error: '랭킹을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    };
  }
}

export async function getProductDetail(productId: string) {
  try {
    const session = await getSession();
    const userId = session?.userId;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        ProductImage: true,
        ProductDetail: true,
        wishlists: userId
          ? {
              where: { userId },
              select: { userId: true },
            }
          : { take: 0 },
        _count: { select: { wishlists: true } },
      },
    });

    if (!product) {
      return { error: '상품을 찾을 수 없습니다.' };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { count: { increment: 1 } },
    });

    let details: { key: string; value: string }[] = [];
    try {
      if (
        product.ProductDetail?.detail &&
        typeof product.ProductDetail.detail === 'string'
      ) {
        details = JSON.parse(product.ProductDetail.detail);
      }
    } catch (e) {
      console.error('상품 상세 정보 JSON 파싱 에러:', e);
    }

    let similarProducts: {
      id: string;
      name: string;
      category: string;
      price: number;
      imageUrl: string;
    }[] = [];

    if (product.categoryId) {
      const totalProductsInCategory = await prisma.product.count({
        where: {
          categoryId: product.categoryId,
          id: { not: productId },
        },
      });

      const take = 5;
      if (totalProductsInCategory > 0) {
        const skip = Math.max(
          0,
          Math.floor(Math.random() * (totalProductsInCategory - take + 1)),
        );
        const randomProducts = await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: { not: productId },
          },
          take,
          skip,
          include: {
            ProductImage: true,
          },
        });
        similarProducts = randomProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: product.category?.name || '미분류',
          price: convertToKRW(p.price, p.currency),
          imageUrl: p.ProductImage[0]?.imageKey
            ? getS3ImageUrl(p.ProductImage[0].imageKey)
            : '/assets/images/product-sample-1.png',
        }));
      }
    }

    return {
      data: {
        id: product.id,
        name: product.name,
        images: product.ProductImage.map(img => ({
          id: img.id,
          url: getS3ImageUrl(img.imageKey),
        })),
        category: product.category?.name || '미분류',
        isBookmarked: (product.wishlists?.length ?? 0) > 0,
        bookmarkCount: product._count?.wishlists ?? 0,
        details,
        price: product.price,
        priceKRW: convertToKRW(product.price, product.currency),
        currency: product.currency,
        similarProducts,
      },
    };
  } catch (error) {
    console.error('상품 상세 정보 조회 에러:', error);
    return {
      error: '상품 정보를 불러오는 데 실패했습니다.',
    };
  }
}
