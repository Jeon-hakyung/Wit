'use client';

import backArrowIcon from '@/assets/icons/back-arrow-profile.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProfileHeader = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBackClick();
    }
  };

  return (
    <header className="relative flex h-[60px] w-full items-center justify-center bg-white px-4">
      <button
        type="button"
        onClick={handleBackClick}
        onKeyDown={handleKeyDown}
        className="absolute left-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center"
        aria-label="뒤로가기"
      >
        <Image
          src={backArrowIcon}
          alt=""
          width={8}
          height={16}
          className="object-contain"
          aria-hidden="true"
        />
      </button>
      <h1 className="text-xl font-semibold leading-[1.4] text-wit-black">
        프로필 설정
      </h1>
    </header>
  );
};

export default ProfileHeader;
