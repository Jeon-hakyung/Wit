'use client';

import { logoutUser } from '@/actions/auth';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const ServiceSettings = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    if (isPending) return;

    startTransition(() => {
      logoutUser();
    });
  };

  const menuItems = [
    {
      label: '문의하기',
      onClick: () => {
        alert('문의하기 기능은 준비 중입니다.');
      },
      hasArrow: true,
    },
    {
      label: '서비스 약관',
      onClick: () => {
        alert('서비스 약관 페이지로 이동합니다.');
      },
      hasArrow: true,
    },
    {
      label: '개인정보 처리 방침',
      onClick: () => {
        alert('개인정보 처리 방침 페이지로 이동합니다.');
      },
      hasArrow: true,
    },
    {
      label: '오픈소스 라이선스',
      onClick: () => {
        alert('오픈소스 라이선스 페이지로 이동합니다.');
      },
      hasArrow: true,
    },
    {
      label: '로그아웃',
      onClick: handleLogout,
      hasArrow: true,
    },
    {
      label: '회원 탈퇴',
      onClick: () => {
        router.push('/settings/withdraw');
      },
      hasArrow: true,
    },
  ];

  return (
    <section className="flex w-full flex-col">
      <div className="flex items-center gap-2.5 bg-[#FFF1EB] px-4 py-2">
        <h3 className="text-sm leading-[1.5714] text-[#6B6B6B]">서비스 설정</h3>
      </div>
      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            disabled={isPending}
            className={`flex items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50 disabled:opacity-50 ${
              index < menuItems.length - 1 ? 'border-b border-[#F4F4F4]' : ''
            }`}
          >
            <span className="text-sm leading-[1.5714] text-wit-black">
              {item.label}
            </span>
            {item.hasArrow && (
              <Image
                src={arrowRightIcon}
                alt=""
                width={4}
                height={8}
                className="object-contain"
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ServiceSettings;
