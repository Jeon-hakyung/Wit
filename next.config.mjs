import { z } from 'zod';

const envSchema = z.object({
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
});

if (process.env.NODE_ENV !== 'test') {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ 환경변수 검증 실패:');
    if (error instanceof z.ZodError && error.errors) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error(error);
    }
    console.error(
      '\n💡 .env.local 파일을 생성하고 필요한 환경변수를 설정하세요.',
    );
    console.error('   예시는 .env.example 파일을 참고하세요.\n');

    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
      },
      {
        protocol: 'https',
        hostname: 'd2fhkci3svedcb.cloudfront.net',
      },
    ],
  },
  compiler: {
    reactRemoveProperties: {
      properties: ['cz-shortcut-listen'],
    },
  },
};

export default nextConfig;
