export const KAKAO_API = {
  AUTHORIZE_URL: 'https://kauth.kakao.com/oauth/authorize',
  TOKEN_URL: 'https://kauth.kakao.com/oauth/token',
  USER_INFO_URL: 'https://kapi.kakao.com/v2/user/me',
  REFRESH_TOKEN_URL: 'https://kauth.kakao.com/oauth/token',
  LOGOUT_URL: 'https://kapi.kakao.com/v1/user/logout',
  UNLINK_URL: 'https://kapi.kakao.com/v1/user/unlink',
} as const;

export const OAUTH_CONFIG = {
  RESPONSE_TYPE: 'code',
  SCOPE: 'profile_nickname,profile_image,account_email',
  PROMPT: 'login',
} as const;

export const SESSION_CONFIG = {
  COOKIE_NAME: 'session',
  STATE_COOKIE_NAME: 'oauth_state',
  EXPIRES_IN: 7 * 24 * 60 * 60 * 1000,
  STATE_EXPIRES_IN: 10 * 60 * 1000,
  JWT_ALGORITHM: 'HS256' as const,
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
      process.env.NODE_ENV === 'production'
        ? ('none' as const)
        : ('lax' as const),
    path: '/',
  },
} as const;

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  SETTINGS_NICKNAME: '/settings/nickname',
  SETTINGS_WITHDRAW: '/settings/withdraw',
} as const;
