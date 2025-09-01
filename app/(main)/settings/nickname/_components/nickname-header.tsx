'use client';

import backArrowIcon from '@/assets/icons/back-arrow-profile.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface NicknameHeaderProps {
  showBackButton?: boolean;
}

const NicknameHeader = ({ showBackButton = true }: NicknameHeaderProps) => {
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
    <header className="flex h-[60px] w-full items-center bg-white px-4">
      {showBackButton && (
        <button
          type="button"
          onClick={handleBackClick}
          onKeyDown={handleKeyDown}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="뒤로가기"
        >
          <Image
            src={backArrowIcon}
            alt="뒤로가기"
            width={8}
            height={16}
            className="object-contain"
            aria-hidden="true"
          />
        </button>
      )}
    </header>
  );
};

export default NicknameHeader;
