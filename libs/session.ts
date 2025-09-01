import { SESSION_CONFIG } from '@/constants/auth';
import { sessionPayloadSchema } from '@/libs/validations';
import { type SessionPayload } from '@/types/auth';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const getSecretKey = (): Uint8Array => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET 환경변수가 설정되지 않았습니다.');
  }
  return new TextEncoder().encode(secret);
};

export const createSession = async (
  userId: string,
  nickname?: string | null,
  returnUrl?: string,
): Promise<void> => {
  try {
    const expiresAt = new Date(Date.now() + SESSION_CONFIG.EXPIRES_IN);
    const secretKey = getSecretKey();

    const payload: SessionPayload = {
      userId,
      nickname,
    };

    const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: SESSION_CONFIG.JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(expiresAt)
      .sign(secretKey);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_CONFIG.COOKIE_NAME, session, {
      ...SESSION_CONFIG.COOKIE_OPTIONS,
      expires: expiresAt,
    });

    if (returnUrl) {
      cookieStore.set('return_url', returnUrl, {
        ...SESSION_CONFIG.COOKIE_OPTIONS,
        maxAge: 60 * 10,
      });
    }
  } catch (error) {
    console.error('세션 생성 실패:', error);
    throw new Error('세션 생성에 실패했습니다.');
  }
};

export const getSession = async (): Promise<SessionPayload | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_CONFIG.COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const secretKey = getSecretKey();

    const { payload } = await jwtVerify(sessionCookie.value, secretKey, {
      algorithms: [SESSION_CONFIG.JWT_ALGORITHM],
    });

    const validatedPayload = sessionPayloadSchema.safeParse(payload);
    if (!validatedPayload.success) {
      console.error('세션 페이로드 검증 실패:', validatedPayload.error);
      return null;
    }

    return validatedPayload.data;
  } catch (error) {
    if (
      error instanceof Error &&
      'digest' in error &&
      typeof (error as any).digest === 'string' &&
      (error as any).digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      return null;
    }
    console.error('세션 조회 실패:', error);
    return null;
  }
};

export const deleteSession = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_CONFIG.COOKIE_NAME);

    cookieStore.delete('return_url');

    cookieStore.delete(SESSION_CONFIG.STATE_COOKIE_NAME);
  } catch (error) {
    console.error('세션 삭제 실패:', error);
    throw new Error('로그아웃 처리에 실패했습니다.');
  }
};

export const setOAuthState = async (state: string): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_CONFIG.STATE_COOKIE_NAME, state, {
      ...SESSION_CONFIG.COOKIE_OPTIONS,
      maxAge: SESSION_CONFIG.STATE_EXPIRES_IN / 1000,
    });
  } catch (error) {
    console.error('OAuth 상태 설정 실패:', error);
    throw new Error('OAuth 상태 설정에 실패했습니다.');
  }
};

export const getAndClearOAuthState = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const stateCookie = cookieStore.get(SESSION_CONFIG.STATE_COOKIE_NAME);

    if (!stateCookie?.value) {
      return null;
    }

    cookieStore.delete(SESSION_CONFIG.STATE_COOKIE_NAME);

    return stateCookie.value;
  } catch (error) {
    console.error('OAuth 상태 조회 실패:', error);
    return null;
  }
};

export const getAndClearReturnUrl = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies();
    const returnUrlCookie = cookieStore.get('return_url');

    if (!returnUrlCookie?.value) {
      return null;
    }

    cookieStore.delete('return_url');

    return returnUrlCookie.value;
  } catch (error) {
    console.error('리다이렉트 URL 조회 실패:', error);
    return null;
  }
};

export const setReturnUrl = async (returnUrl: string): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.set('return_url', returnUrl, {
      ...SESSION_CONFIG.COOKIE_OPTIONS,
      maxAge: 60 * 10,
    });
  } catch (error) {
    console.error('리다이렉트 URL 설정 실패:', error);
    throw new Error('리다이렉트 URL 설정에 실패했습니다.');
  }
};
