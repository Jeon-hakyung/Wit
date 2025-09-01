'use client';

import backArrowIcon from '@/assets/icons/back-arrow-ranking.svg';
import notificationIcon from '@/assets/icons/notification-ranking.svg';
import searchIcon from '@/assets/icons/search-ranking.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RankingHeader = () => {
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
    <header className="flex h-[60px] w-full items-center justify-between bg-white px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleBackClick}
          onKeyDown={handleKeyDown}
          className="flex h-6 w-6 items-center justify-center p-[2px]"
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
          위트 랭킹
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center"
          aria-label="검색"
        >
          <Image
            src={searchIcon}
            alt=""
            width={20}
            height={20}
            className="object-contain"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center p-[2px]"
          aria-label="알림"
        >
          <Image
            src={notificationIcon}
            alt=""
            width={20}
            height={20}
            className="object-contain"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
};

export default RankingHeader;
