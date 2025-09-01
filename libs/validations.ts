import { z } from 'zod';

export const authCodeSchema = z.object({
  code: z.string().min(1, '인증 코드가 필요합니다'),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

export const kakaoTokenResponseSchema = z.object({
  access_token: z.string().min(1, '액세스 토큰이 필요합니다'),
  token_type: z.literal('bearer'),
  refresh_token: z.string().optional(),
  expires_in: z.number().positive('만료 시간은 양수여야 합니다'),
  scope: z.string().optional(),
  refresh_token_expires_in: z.number().positive().optional(),
});

export const kakaoProfileSchema = z.object({
  nickname: z.string().optional(),
  thumbnail_image_url: z.string().url().optional(),
  profile_image_url: z.string().url().optional(),
  is_default_image: z.boolean().optional(),
  is_default_nickname: z.boolean().optional(),
});

export const kakaoAccountSchema = z.object({
  profile_needs_agreement: z.boolean().optional(),
  profile_nickname_needs_agreement: z.boolean().optional(),
  profile_image_needs_agreement: z.boolean().optional(),
  profile: kakaoProfileSchema.optional(),
  email_needs_agreement: z.boolean().optional(),
  is_email_valid: z.boolean().optional(),
  is_email_verified: z.boolean().optional(),
  email: z.string().email().optional(),
  age_range_needs_agreement: z.boolean().optional(),
  age_range: z.string().optional(),
  birthyear_needs_agreement: z.boolean().optional(),
  birthyear: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  birthday_needs_agreement: z.boolean().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
  gender_needs_agreement: z.boolean().optional(),
  gender: z.enum(['female', 'male']).optional(),
});

export const kakaoUserInfoSchema = z.object({
  id: z.number().positive('사용자 ID는 양수여야 합니다'),
  connected_at: z.string().optional(),
  kakao_account: kakaoAccountSchema.optional(),
  synched_at: z.string().optional(),
  for_partner: z
    .object({
      uuid: z.string().uuid(),
    })
    .optional(),
});

export const sessionPayloadSchema = z.object({
  userId: z.string().min(1, '사용자 ID가 필요합니다'),
  nickname: z.string().nullable().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, '데이터베이스 URL이 필요합니다'),
  KAKAO_CLIENT_ID: z.string().min(1, '카카오 클라이언트 ID가 필요합니다'),
  KAKAO_CLIENT_SECRET: z
    .string()
    .min(1, '카카오 클라이언트 시크릿이 필요합니다'),
  KAKAO_REDIRECT_URI: z.string().url('올바른 리다이렉트 URI를 입력하세요'),
  SESSION_SECRET: z
    .string()
    .min(32, '세션 시크릿은 최소 32자 이상이어야 합니다'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXTAUTH_URL: z.string().url().optional(),
});

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 2글자 이상이어야 해요')
    .max(10, '닉네임은 10글자 이하여야 해요')
    .refine(nickname => {
      const forbiddenWords = [
        '관리자',
        'admin',
        'administrator',
        'root',
        'system',
        '운영자',
        '금지어',
        '테스트',
        'test',
      ];
      return !forbiddenWords.some(word =>
        nickname.toLowerCase().includes(word.toLowerCase()),
      );
    }, '사용할 수 없는 닉네임이에요'),
});

export const oauthStateSchema = z.object({
  state: z.string().min(1, 'State 파라미터가 필요합니다'),
  returnUrl: z.string().url().optional(),
});

export const validateFormData = <T>(
  schema: z.ZodSchema<T>,
  formData: FormData,
): { success: true; data: T } | { success: false; error: z.ZodError } => {
  const data = Object.fromEntries(formData.entries());
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
};

export const formatZodError = (error: z.ZodError): string[] => {
  return error.issues.map((err: z.ZodIssue) => {
    const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
    return `${path}${err.message}`;
  });
};

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, '카테고리 이름을 입력해주세요')
    .max(50, '카테고리 이름은 50자 이하여야 합니다')
    .regex(
      /^[a-zA-Z0-9가-힣\s]+$/,
      '한글, 영문, 숫자, 공백만 사용할 수 있습니다',
    ),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, '상품 이름을 입력해주세요')
    .max(100, '상품 이름은 100자 이하여야 합니다'),
  price: z
    .number()
    .min(0, '가격은 0 이상이어야 합니다')
    .max(10000000, '가격은 1천만원 이하여야 합니다'),
  currency: z
    .string()
    .min(1, '통화를 선택해주세요')
    .max(10, '통화 코드는 10자 이하여야 합니다'),
  categoryId: z.string().optional().nullable(),
  details: z
    .array(
      z.object({
        key: z
          .string()
          .min(1, '키를 입력해주세요')
          .max(50, '키는 50자 이하여야 합니다'),
        value: z.union([
          z.string().max(500, '값은 500자 이하여야 합니다'),
          z.number(),
        ]),
      }),
    )
    .optional()
    .default([]),
  imageKeys: z
    .array(z.string())
    .min(3, '최소 3장의 이미지가 필요합니다')
    .max(6, '최대 6장의 이미지만 업로드할 수 있습니다'),
});

export const withdrawalSchema = z.object({
  type: z.string().min(1, '탈퇴 사유를 선택해주세요.'),
  comment: z.string().max(500, '의견은 500자를 초과할 수 없습니다.').optional(),
});
