'use server';

import { requireAdmin } from '@/libs/admin';
import prisma from '@/libs/prisma';
import {
  categorySchema,
  productSchema,
  validateFormData,
} from '@/libs/validations';
import {
  type AdminActionResult,
  type AdminCounts,
  type CategoryWithProductCount,
  type ProductWithRelations,
} from '@/types/admin';
import { revalidatePath } from 'next/cache';

export const getCategories = async (): Promise<CategoryWithProductCount[]> => {
  await requireAdmin();

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categories;
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    throw new Error('카테고리 목록을 불러오는데 실패했습니다.');
  }
};

export const createCategory = async (
  formData: FormData,
): Promise<AdminActionResult> => {
  try {
    await requireAdmin();

    const validation = validateFormData(categorySchema, formData);
    if (!validation.success) {
      return {
        success: false,
        message: '입력 데이터가 올바르지 않습니다.',
        error: validation.error.issues[0]?.message || '검증 실패',
      };
    }

    const { name } = validation.data;

    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: '이미 존재하는 카테고리 이름입니다.',
        error: 'DUPLICATE_CATEGORY',
      };
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/category');
    revalidatePath('/ranking');

    return {
      success: true,
      message: '카테고리가 성공적으로 생성되었습니다.',
      data: category,
    };
  } catch (error) {
    console.error('카테고리 생성 실패:', error);
    return {
      success: false,
      message: '카테고리 생성에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

export const updateCategory = async (
  categoryId: string,
  formData: FormData,
): Promise<AdminActionResult> => {
  try {
    await requireAdmin();

    const validation = validateFormData(categorySchema, formData);
    if (!validation.success) {
      return {
        success: false,
        message: '입력 데이터가 올바르지 않습니다.',
        error: validation.error.issues[0]?.message || '검증 실패',
      };
    }

    const { name } = validation.data;

    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return {
        success: false,
        message: '존재하지 않는 카테고리입니다.',
        error: 'CATEGORY_NOT_FOUND',
      };
    }

    const duplicateCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        NOT: {
          id: categoryId,
        },
      },
    });

    if (duplicateCategory) {
      return {
        success: false,
        message: '이미 존재하는 카테고리 이름입니다.',
        error: 'DUPLICATE_CATEGORY',
      };
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name.trim(),
        updatedAt: new Date(),
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/category');
    revalidatePath('/ranking');
    revalidatePath('/');

    return {
      success: true,
      message: '카테고리가 성공적으로 수정되었습니다.',
      data: updatedCategory,
    };
  } catch (error) {
    console.error('카테고리 수정 실패:', error);
    return {
      success: false,
      message: '카테고리 수정에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

export const deleteCategory = async (
  categoryId: string,
): Promise<AdminActionResult> => {
  try {
    await requireAdmin();

    const categoryWithProducts = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!categoryWithProducts) {
      return {
        success: false,
        message: '존재하지 않는 카테고리입니다.',
        error: 'CATEGORY_NOT_FOUND',
      };
    }

    if (categoryWithProducts._count.products > 0) {
      return {
        success: false,
        message: `이 카테고리에 ${categoryWithProducts._count.products}개의 상품이 연결되어 있습니다. 먼저 상품을 다른 카테고리로 이동하거나 삭제해주세요.`,
        error: 'CATEGORY_HAS_PRODUCTS',
      };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/category');
    revalidatePath('/ranking');
    revalidatePath('/');

    return {
      success: true,
      message: '카테고리가 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('카테고리 삭제 실패:', error);
    return {
      success: false,
      message: '카테고리 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

export const getProducts = async (): Promise<ProductWithRelations[]> => {
  await requireAdmin();

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        ProductDetail: true,
        ProductImage: true,
        _count: {
          select: {
            wishlists: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  } catch (error) {
    console.error('상품 조회 실패:', error);
    throw new Error('상품 목록을 불러오는데 실패했습니다.');
  }
};

export const createProduct = async (
  formData: FormData,
): Promise<AdminActionResult> => {
  try {
    await requireAdmin();

    const detailsJson = formData.get('details') as string;
    const imageKeysJson = formData.get('imageKeys') as string;

    let details: Array<{ key: string; value: string | number }> = [];
    let imageKeys: string[] = [];

    try {
      if (detailsJson) {
        details = JSON.parse(detailsJson);
      }
      if (imageKeysJson) {
        imageKeys = JSON.parse(imageKeysJson);
      }
    } catch (parseError) {
      return {
        success: false,
        message: '상세정보 또는 이미지 데이터 형식이 올바르지 않습니다.',
        error: 'INVALID_JSON_DATA',
      };
    }

    const categoryIdValue = formData.get('categoryId') as string;
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      currency: formData.get('currency') as string,
      categoryId:
        categoryIdValue === 'uncategorized' || !categoryIdValue
          ? null
          : categoryIdValue,
      details,
      imageKeys,
    };

    const validation = productSchema.safeParse(productData);
    if (!validation.success) {
      return {
        success: false,
        message: '입력 데이터가 올바르지 않습니다.',
        error: validation.error.issues[0]?.message || '검증 실패',
      };
    }

    const validatedData = validation.data;

    const result = await prisma.$transaction(async tx => {
      const product = await tx.product.create({
        data: {
          name: validatedData.name,
          price: validatedData.price,
          currency: validatedData.currency,
          categoryId: validatedData.categoryId,
        },
      });

      if (validatedData.details && validatedData.details.length > 0) {
        await tx.productDetail.create({
          data: {
            productId: product.id,
            detail: JSON.stringify(validatedData.details),
          },
        });
      }

      if (validatedData.imageKeys && validatedData.imageKeys.length > 0) {
        await tx.productImage.createMany({
          data: validatedData.imageKeys.map(imageKey => ({
            productId: product.id,
            imageKey,
          })),
        });
      }

      return product;
    });

    revalidatePath('/admin/products');
    revalidatePath('/ranking');
    revalidatePath('/');

    return {
      success: true,
      message: '상품이 성공적으로 생성되었습니다.',
      data: result,
    };
  } catch (error) {
    console.error('상품 생성 실패:', error);
    return {
      success: false,
      message: '상품 생성에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

export const updateProduct = async (
  productId: string,
  formData: FormData,
): Promise<AdminActionResult> => {
  try {
    await requireAdmin();

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductDetail: true,
        ProductImage: true,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: '존재하지 않는 상품입니다.',
        error: 'PRODUCT_NOT_FOUND',
      };
    }

    const detailsJson = formData.get('details') as string;
    const imageKeysJson = formData.get('imageKeys') as string;

    let details: Array<{ key: string; value: string | number }> = [];
    let imageKeys: string[] = [];

    try {
      if (detailsJson) {
        details = JSON.parse(detailsJson);
      }
      if (imageKeysJson) {
        imageKeys = JSON.parse(imageKeysJson);
      }
    } catch (parseError) {
      return {
        success: false,
        message: '상세정보 또는 이미지 데이터 형식이 올바르지 않습니다.',
        error: 'INVALID_JSON_DATA',
      };
    }

    const categoryIdValue = formData.get('categoryId') as string;
    const productData = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      currency: formData.get('currency') as string,
      categoryId:
        categoryIdValue === 'uncategorized' || !categoryIdValue
          ? null
          : categoryIdValue,
      details,
      imageKeys,
    };

    const validation = productSchema.safeParse(productData);
    if (!validation.success) {
      return {
        success: false,
        message: '입력 데이터가 올바르지 않습니다.',
        error: validation.error.issues[0]?.message || '검증 실패',
      };
    }

    const validatedData = validation.data;

    const result = await prisma.$transaction(async tx => {
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          name: validatedData.name,
          price: validatedData.price,
          currency: validatedData.currency,
          categoryId: validatedData.categoryId,
          updatedAt: new Date(),
        },
      });

      if (validatedData.details && validatedData.details.length > 0) {
        await tx.productDetail.upsert({
          where: { productId },
          update: {
            detail: JSON.stringify(validatedData.details),
            updatedAt: new Date(),
          },
          create: {
            productId,
            detail: JSON.stringify(validatedData.details),
          },
        });
      } else if (existingProduct.ProductDetail) {
        await tx.productDetail.delete({
          where: { productId },
        });
      }

      await tx.productImage.deleteMany({
        where: { productId },
      });

      if (validatedData.imageKeys && validatedData.imageKeys.length > 0) {
        await tx.productImage.createMany({
          data: validatedData.imageKeys.map(imageKey => ({
            productId,
            imageKey,
          })),
        });
      }

      return updatedProduct;
    });

    revalidatePath('/admin/products');
    revalidatePath('/ranking');
    revalidatePath('/');

    return {
      success: true,
      message: '상품이 성공적으로 수정되었습니다.',
      data: result,
    };
  } catch (error) {
    console.error('상품 수정 실패:', error);
    return {
      success: false,
      message: '상품 수정에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

export const deleteProduct = async (
  productId: string,
): Promise<AdminActionResult> => {
  try {
    await requireAdmin();

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductImage: true,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: '존재하지 않는 상품입니다.',
        error: 'PRODUCT_NOT_FOUND',
      };
    }

    await prisma.$transaction(async tx => {
      await tx.wishlist.deleteMany({
        where: { productId },
      });

      await tx.productImage.deleteMany({
        where: { productId },
      });

      await tx.productDetail.deleteMany({
        where: { productId },
      });

      await tx.product.delete({
        where: { id: productId },
      });
    });

    revalidatePath('/admin/products');
    revalidatePath('/product', 'layout');
    revalidatePath('/ranking');
    revalidatePath('/');

    return {
      success: true,
      message: '상품이 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('상품 삭제 실패:', error);
    return {
      success: false,
      message: '상품 삭제에 실패했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

export const getAdminCounts = async (): Promise<AdminCounts> => {
  await requireAdmin();
  try {
    const [productCount, categoryCount, userCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
    ]);
    return {
      productCount,
      categoryCount,
      userCount,
    };
  } catch (error) {
    console.error('관리자 대시보드 집계 조회 실패:', error);
    throw new Error('관리자 대시보드 집계 조회에 실패했습니다.');
  }
};
