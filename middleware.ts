import { ROUTES, SESSION_CONFIG } from '@/constants/auth';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const getSecretKey = (): Uint8Array => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET 환경변수가 설정되지 않았습니다.');
  }
  return new TextEncoder().encode(secret);
};

async function verifySession(
  token: string,
): Promise<{ userId: string; nickname?: string | null } | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: [SESSION_CONFIG.JWT_ALGORITHM],
    });

    if (typeof payload.userId === 'string') {
      return {
        userId: payload.userId,
        nickname:
          typeof payload.nickname === 'string' ? payload.nickname : null,
      };
    }

    return null;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_CONFIG.COOKIE_NAME)?.value;

  const sessionData = sessionToken ? await verifySession(sessionToken) : null;
  const isAuthenticated = !!sessionData;

  if (pathname.startsWith(ROUTES.LOGIN)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('returnUrl', pathname);

    const response = NextResponse.redirect(loginUrl);
    if (sessionToken) {
      response.cookies.delete(SESSION_CONFIG.COOKIE_NAME);
    }
    return response;
  }

  if (sessionData) {
    if (
      !sessionData.nickname &&
      !pathname.startsWith(ROUTES.SETTINGS_NICKNAME)
    ) {
      return NextResponse.redirect(
        new URL(ROUTES.SETTINGS_NICKNAME, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)',
  ],
};
