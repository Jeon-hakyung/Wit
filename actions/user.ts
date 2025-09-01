'use server';

import { ROUTES } from '@/constants/auth';
import prisma from '@/libs/prisma';
import { createSession, deleteSession, getSession } from '@/libs/session';
import {
  nicknameSchema,
  validateFormData,
  withdrawalSchema,
} from '@/libs/validations';
import { type UserSession } from '@/types/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { deleteS3Object } from './aws';

export const getCurrentUser = cache(async (): Promise<UserSession['user']> => {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) return null;

    return {
      ...user,
      email: user.email ?? null,
      nickname: user.nickname ?? null,
      profileUrl: user.profileUrl ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('사용자 조회 실패:', error);
    return null;
  }
});

export async function updateUserNickname(formData: FormData): Promise<void> {
  try {
    const validation = validateFormData(nicknameSchema, formData);
    if (!validation.success) {
      console.error('닉네임 검증 실패:', validation.error);
      redirect(`${ROUTES.SETTINGS_NICKNAME}?error=invalid_nickname`);
    }

    const { nickname } = validation.data;

    const session = await getSession();
    if (!session?.userId) {
      console.error('유효하지 않은 세션');
      redirect(`${ROUTES.LOGIN}?error=session_expired`);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        nickname,
        NOT: {
          id: session.userId,
        },
      },
    });

    if (existingUser) {
      console.error('닉네임 중복:', nickname);
      redirect(`${ROUTES.SETTINGS_NICKNAME}?error=duplicate_nickname`);
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        nickname,
        updatedAt: new Date(),
      },
    });

    await createSession(session.userId, nickname);

    revalidatePath('/', 'layout');

    redirect(ROUTES.HOME);
  } catch (error) {
    if (error instanceof Error) {
      if (
        'digest' in error &&
        typeof error.digest === 'string' &&
        error.digest.startsWith('NEXT_REDIRECT')
      ) {
        throw error;
      }
    }
    console.error('닉네임 업데이트 실패:', error);
    redirect(`${ROUTES.SETTINGS_NICKNAME}?error=update_failed`);
  }
}

export async function resetUserProfileImage(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: '인증되지 않은 사용자입니다.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    const currentProfileUrl = user?.profileUrl;
    const cloudfrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

    if (cloudfrontUrl && currentProfileUrl?.startsWith(cloudfrontUrl)) {
      const s3Key = currentProfileUrl.replace(`${cloudfrontUrl}/`, '');
      if (s3Key) {
        await deleteS3Object(s3Key);
      }
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { profileUrl: null },
    });

    revalidatePath('/settings', 'layout');

    return { success: true };
  } catch (error) {
    console.error('프로필 이미지 초기화 실패:', error);
    return { success: false, error: '프로필 이미지 변경에 실패했습니다.' };
  }
}

export async function updateUserProfileUrl(
  profileUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: '인증되지 않은 사용자입니다.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    const currentProfileUrl = user?.profileUrl;
    const cloudfrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

    if (cloudfrontUrl && currentProfileUrl?.startsWith(cloudfrontUrl)) {
      const s3Key = currentProfileUrl.replace(`${cloudfrontUrl}/`, '');
      if (s3Key) {
        await deleteS3Object(s3Key);
      }
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { profileUrl },
    });

    revalidatePath('/settings', 'layout');

    return { success: true };
  } catch (error) {
    console.error('프로필 URL 업데이트 실패:', error);
    return { success: false, error: '프로필 이미지 변경에 실패했습니다.' };
  }
}

export async function withdrawUser(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session?.userId) {
    redirect(ROUTES.LOGIN);
  }

  const validation = validateFormData(withdrawalSchema, formData);

  if (!validation.success) {
    console.error('탈퇴 데이터 검증 실패:', validation.error);
    redirect(
      `${ROUTES.SETTINGS_WITHDRAW}?error=${validation.error.issues[0].message}`,
    );
  }

  const { type, comment } = validation.data;

  try {
    await prisma.$transaction(async tx => {
      await tx.withdrawalHistory.create({
        data: {
          type,
          comment,
        },
      });

      await tx.user.delete({
        where: { id: session.userId },
      });
    });

    await deleteSession();
  } catch (error) {
    console.error('회원 탈퇴 처리 실패:', error);
    redirect(`${ROUTES.SETTINGS_WITHDRAW}?error=withdraw_failed`);
  }

  redirect(ROUTES.LOGIN);
}
