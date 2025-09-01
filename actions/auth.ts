'use server';

import { KAKAO_API, OAUTH_CONFIG, ROUTES } from '@/constants/auth';
import { CONTENT_TYPES } from '@/constants/config';
import prisma from '@/libs/prisma';
import {
  createSession,
  deleteSession,
  getAndClearOAuthState,
  getAndClearReturnUrl,
  setOAuthState,
  setReturnUrl,
} from '@/libs/session';
import {
  authCodeSchema,
  kakaoTokenResponseSchema,
  kakaoUserInfoSchema,
  validateFormData,
} from '@/libs/validations';
import { type KakaoTokenResponse, type KakaoUserInfo } from '@/types/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function exchangeCodeForToken(
  code: string,
): Promise<KakaoTokenResponse | null> {
  try {
    const response = await fetch(KAKAO_API.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': CONTENT_TYPES.FORM_URLENCODED,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      }),
    });

    if (!response.ok) {
      console.error(
        '토큰 교환 HTTP 에러:',
        response.status,
        response.statusText,
      );
      return null;
    }

    const data = await response.json();

    const validation = kakaoTokenResponseSchema.safeParse(data);
    if (!validation.success) {
      console.error('토큰 응답 검증 실패:', validation.error);
      return null;
    }

    return validation.data as KakaoTokenResponse;
  } catch (error) {
    console.error('토큰 교환 요청 실패:', error);
    return null;
  }
}

async function fetchKakaoUserInfo(
  accessToken: string,
): Promise<KakaoUserInfo | null> {
  try {
    const response = await fetch(KAKAO_API.USER_INFO_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': CONTENT_TYPES.FORM_URLENCODED,
      },
    });

    if (!response.ok) {
      console.error(
        '사용자 정보 조회 HTTP 에러:',
        response.status,
        response.statusText,
      );
      return null;
    }

    const data = await response.json();

    const validation = kakaoUserInfoSchema.safeParse(data);
    if (!validation.success) {
      console.error('사용자 정보 검증 실패:', validation.error);
      return null;
    }

    return validation.data as KakaoUserInfo;
  } catch (error) {
    console.error('사용자 정보 조회 요청 실패:', error);
    return null;
  }
}

export async function upsertUser(kakaoUserData: KakaoUserInfo) {
  try {
    const kakaoId = kakaoUserData.id.toString();
    const profile = kakaoUserData.kakao_account?.profile;
    const rawEmail = kakaoUserData.kakao_account?.email || null;
    const email = rawEmail ? rawEmail.toLowerCase() : null;

    const existingByKakao = await prisma.user.findUnique({
      where: { kakaoId },
    });

    let emailToUse: string | null = null;
    if (email) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (!existingByEmail) {
        emailToUse = email;
      } else if (existingByKakao && existingByEmail.id === existingByKakao.id) {
        emailToUse = email;
      } else {
        emailToUse = null;
      }
    }

    const user = await prisma.user.upsert({
      where: {
        kakaoId,
      },
      create: {
        kakaoId,
        email: emailToUse,
        name: profile?.nickname || null,
        profileUrl: profile?.profile_image_url || null,
      },
      update: {
        email: emailToUse ?? undefined,
        name: profile?.nickname || undefined,
        updatedAt: new Date(),
      },
    });

    return user;
  } catch (error) {
    console.error('사용자 upsert 실패:', error);
    return null;
  }
}

export async function initiateKakaoLogin(returnUrl?: string): Promise<void> {
  try {
    const state = crypto.randomUUID();

    await setOAuthState(state);

    const params = new URLSearchParams({
      client_id: process.env.KAKAO_CLIENT_ID!,
      redirect_uri: process.env.KAKAO_REDIRECT_URI!,
      response_type: OAUTH_CONFIG.RESPONSE_TYPE,
      scope: OAUTH_CONFIG.SCOPE,
      state,
    });

    const isSafeInternalPath = (url: string): boolean => {
      if (!url) return false;
      if (!url.startsWith('/')) return false;
      if (url.startsWith('//')) return false;
      return true;
    };

    if (returnUrl && isSafeInternalPath(returnUrl)) {
      await setReturnUrl(returnUrl);
    }

    redirect(`${KAKAO_API.AUTHORIZE_URL}?${params.toString()}`);
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
    console.error('카카오 로그인 시작 실패:', error);
    redirect(`${ROUTES.LOGIN}?error=init_failed`);
  }
}

export async function handleKakaoCallback(formData: FormData): Promise<void> {
  const validation = validateFormData(authCodeSchema, formData);
  if (!validation.success) {
    console.error('콜백 파라미터 검증 실패:', validation.error);
    redirect(`${ROUTES.LOGIN}?error=invalid_params`);
  }

  const { code, state } = validation.data;

  const savedState = await getAndClearOAuthState();
  if (!savedState || state !== savedState) {
    console.error('State 파라미터 불일치:', {
      received: state,
      saved: savedState,
    });
    redirect(`${ROUTES.LOGIN}?error=invalid_state`);
  }

  const tokenData = await exchangeCodeForToken(code);
  if (!tokenData) {
    redirect(`${ROUTES.LOGIN}?error=token_exchange_failed`);
  }

  const userData = await fetchKakaoUserInfo(tokenData.access_token);
  if (!userData) {
    redirect(`${ROUTES.LOGIN}?error=user_info_fetch_failed`);
  }

  const user = await upsertUser(userData);
  if (!user) {
    redirect(`${ROUTES.LOGIN}?error=session_creation_failed`);
  }

  await createSession(user.id, user.nickname);

  if (!user.nickname) {
    redirect(ROUTES.SETTINGS_NICKNAME);
  }

  const returnUrl = await getAndClearReturnUrl();
  redirect(returnUrl || ROUTES.HOME);
}

export async function logoutUser(): Promise<void> {
  try {
    await deleteSession();

    revalidatePath('/', 'layout');

    redirect(ROUTES.LOGIN);
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
    console.error('로그아웃 실패:', error);
    redirect(ROUTES.LOGIN);
  }
}

export async function unlinkUser(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('사용자를 찾을 수 없음:', userId);
      return false;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    await deleteSession();

    return true;
  } catch (error) {
    console.error('계정 연결 해제 실패:', error);
    return false;
  }
}
