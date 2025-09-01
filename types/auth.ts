import { type User } from '@prisma/client';

export interface KakaoTokenResponse {
  token_type: 'bearer';
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
  id_token?: string;
}

export interface KakaoProfile {
  nickname: string | null;
  profile_image_url: string | null;
  thumbnail_image_url: string | null;
  is_default_image: boolean | null;
}

export interface KakaoAccount {
  profile: KakaoProfile | null;
  email: string | null;
  age_range: string | null;
  birthday: string | null;
  gender: 'male' | 'female' | null;
}

export interface KakaoUserInfo {
  id: number;
  connected_at?: string;
  kakao_account: KakaoAccount | null;
}

export interface SessionPayload {
  userId: string;
  nickname?: string | null;
  [key: string]: unknown;
}

export interface UserSession {
  user:
    | (Omit<User, 'createdAt' | 'updatedAt'> & {
        createdAt: string;
        updatedAt: string;
      })
    | null;
}

export interface AuthError {
  type:
    | 'INVALID_CODE'
    | 'TOKEN_EXCHANGE_FAILED'
    | 'USER_INFO_FETCH_FAILED'
    | 'SESSION_CREATION_FAILED'
    | 'INVALID_STATE'
    | 'UNKNOWN_ERROR';
  message: string;
}

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'createdAt' | 'updatedAt'>;
  error?: AuthError;
}

export interface OAuthState {
  returnUrl?: string;
}
