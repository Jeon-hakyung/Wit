'use server';

import prisma from '@/libs/prisma';
import { getSession } from '@/libs/session';
import { getS3ImageUrl } from '@/utils';
import { convertToKRW } from '@/utils/currency';
import { revalidatePath } from 'next/cache';

export const getWishlist = async () => {
  const session = await getSession();

  if (!session?.userId) {
    return { error: '로그인이 필요합니다.' };
  }
  const { userId } = session;

  try {
    const wishlistItemsFromDB = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            ProductImage: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const items = wishlistItemsFromDB.map(({ product, createdAt }) => ({
      id: product.id,
      name: product.name,
      price: convertToKRW(product.price, product.currency),
      currency: product.currency,
      imageUrl: product.ProductImage[0]?.imageKey
        ? getS3ImageUrl(product.ProductImage[0].imageKey)
        : '/assets/images/product-sample-1.png',
      isBookmarked: true,
      category: product.category?.name || '미분류',
      addedAt: createdAt.toISOString(),
    }));

    const totalPriceKRW = wishlistItemsFromDB.reduce((total, { product }) => {
      return total + convertToKRW(product.price, product.currency);
    }, 0);

    return { data: { items, totalPriceKRW } };
  } catch (error) {
    console.error('위시리스트 조회 에러:', error);
    return { error: '위시리스트를 불러오는 데 실패했습니다.' };
  }
};

export const toggleWishlistItem = async (productId: string) => {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: '로그인이 필요합니다.' };
  }
  const { userId } = session;

  try {
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingWishlistItem) {
      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      revalidatePath('/scrap');
      revalidatePath(`/product/${productId}`);
      return {
        success: true,
        message: '위시리스트에서 제거했습니다.',
        isBookmarked: false,
      };
    }

    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    });

    revalidatePath('/');
    revalidatePath('/scrap');
    revalidatePath(`/product/${productId}`);
    return {
      success: true,
      message: '위시리스트에 추가했습니다.',
      isBookmarked: true,
    };
  } catch (error) {
    console.error('위시리스트 토글 에러:', error);
    return { error: '위시리스트 토글에 실패했습니다.' };
  }
};

export const deleteWishlistItems = async (productIds: string[]) => {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: '로그인이 필요합니다.' };
  }
  const { userId } = session;

  if (!productIds || productIds.length === 0) {
    return { success: false, message: '삭제할 상품이 선택되지 않았습니다.' };
  }

  try {
    await prisma.wishlist.deleteMany({
      where: {
        userId,
        productId: {
          in: productIds,
        },
      },
    });

    revalidatePath('/');
    revalidatePath('/scrap');
    revalidatePath(`/product/${productIds}`);
    return { success: true, message: '선택한 상품을 삭제했습니다.' };
  } catch (error) {
    console.error('위시리스트 다중 삭제 에러:', error);
    return { error: '위시리스트 삭제에 실패했습니다.' };
  }
};
