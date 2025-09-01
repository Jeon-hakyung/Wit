'use client';

import { initiateKakaoLogin } from '@/actions/auth';
import kakaoLogo from '@/assets/images/kakao-logo.svg';
import { cn } from '@/utils';
import Image from 'next/image';
import { useTransition } from 'react';

const KaKaoLoginButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleKakaoLogin = (): void => {
    startTransition(async () => {
      try {
        await initiateKakaoLogin();
      } catch (error) {
        console.error('카카오 로그인 시작 실패:', error);
      }
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ): void => {
    if (isPending) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleKakaoLogin();
    }
  };

  return (
    <section className="flex w-[328px] flex-col items-center gap-[9px]">
      <button
        type="button"
        onClick={handleKakaoLogin}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className={cn(
          'flex w-full items-center justify-center gap-[6px] rounded-[10px] bg-kakao-yellow px-24 py-[18px]',
          'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-kakao-yellow focus:ring-offset-2',
          {
            'cursor-not-allowed opacity-75': isPending,
            'hover:bg-opacity-90 active:scale-[0.98]': !isPending,
          },
        )}
        aria-label={
          isPending ? '카카오 로그인 처리 중...' : '카카오로 로그인하기'
        }
      >
        <div className="flex h-4 w-[17px] items-center justify-center rounded">
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-wit-black border-t-transparent" />
          ) : (
            <Image
              src={kakaoLogo}
              alt="KakaoLogo"
              width={17}
              height={16}
              className="object-contain"
            />
          )}
        </div>
        <span className="whitespace-nowrap font-pretendard text-base font-semibold leading-[1em] text-wit-black">
          {isPending ? '로그인 중...' : '카카오로 시작하기'}
        </span>
      </button>
    </section>
  );
};

export default KaKaoLoginButton;
