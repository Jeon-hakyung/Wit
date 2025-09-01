import { handleKakaoCallback } from '@/actions/auth';
import { ROUTES } from '@/constants/auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('카카오 인증 오류:', errorDescription);
    // 프로덕션 환경에서는 전체 URL을 사용
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL ||
          'https://main.d3lfw4aqqukmdq.amplifyapp.com'
        : '';
    return NextResponse.redirect(
      new URL(
        `${baseUrl}${ROUTES.LOGIN}?error=kakao_error&message=${errorDescription}`,
      ),
    );
  }

  if (!code) {
    console.error('인증 코드가 없습니다.');
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL ||
          'https://main.d3lfw4aqqukmdq.amplifyapp.com'
        : '';
    return NextResponse.redirect(
      new URL(`${baseUrl}${ROUTES.LOGIN}?error=no_code`),
    );
  }

  try {
    const formData = new FormData();
    formData.append('code', code);
    if (state) {
      formData.append('state', state);
    }

    await handleKakaoCallback(formData);

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL ||
          'https://main.d3lfw4aqqukmdq.amplifyapp.com'
        : '';
    return NextResponse.redirect(new URL(`${baseUrl}${ROUTES.HOME}`));
  } catch (e) {
    if (
      e instanceof Error &&
      'digest' in e &&
      typeof e.digest === 'string' &&
      e.digest.startsWith('NEXT_REDIRECT')
    ) {
      throw e;
    }

    console.error('콜백 처리 중 예상치 못한 오류:', e);
    const errorMessage = e instanceof Error ? e.message : 'unknown_error';
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL ||
          'https://main.d3lfw4aqqukmdq.amplifyapp.com'
        : '';
    return NextResponse.redirect(
      new URL(
        `${baseUrl}${ROUTES.LOGIN}?error=callback_failed&message=${errorMessage}`,
      ),
    );
  }
}
