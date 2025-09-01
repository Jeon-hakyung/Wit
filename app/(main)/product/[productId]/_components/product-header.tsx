'use client';

import backArrowIcon from '@/assets/icons/back-arrow.svg';
import homeIcon from '@/assets/icons/home-icon.svg';
import searchDetailIcon from '@/assets/icons/search-icon.svg';
import shareUploadIcon from '@/assets/icons/share-upload.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProductHeader = () => {
  const router = useRouter();

  const handleBackClick = (): void => {
    router.back();
  };

  const handleHomeClick = (): void => {
    router.push('/');
  };

  const handleSearchClick = (): void => {};

  const handleShareClick = (): void => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(err => {
          console.error('공유 실패:', err);
        });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <header className="absolute left-0 top-0 z-10 w-full bg-transparent">
      <div className="flex h-[60px] items-center justify-between px-4">
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          onClick={handleBackClick}
          aria-label="뒤로가기"
        >
          <Image
            src={backArrowIcon}
            alt=""
            width={8}
            height={16}
            className="object-contain"
            style={{
              filter: 'brightness(0) saturate(100%) invert(1)',
              width: 'auto',
              height: 'auto',
            }}
            aria-hidden="true"
          />
        </button>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onClick={handleHomeClick}
            aria-label="홈으로"
          >
            <Image
              src={homeIcon}
              alt=""
              width={22}
              height={18}
              className="object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(1)',
                width: 'auto',
                height: 'auto',
              }}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onClick={handleSearchClick}
            aria-label="검색"
          >
            <Image
              src={searchDetailIcon}
              alt=""
              width={18}
              height={18}
              className="object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(1)',
                width: 'auto',
                height: 'auto',
              }}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onClick={handleShareClick}
            aria-label="공유"
          >
            <Image
              src={shareUploadIcon}
              alt=""
              width={16}
              height={16}
              className="object-contain"
              style={{
                filter: 'brightness(0) saturate(100%) invert(1)',
                width: 'auto',
                height: 'auto',
              }}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProductHeader;
