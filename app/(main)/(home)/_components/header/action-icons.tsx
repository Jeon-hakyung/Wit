import bellIcon from '@/assets/icons/bell-icon.svg';
import searchIcon from '@/assets/icons/search-icon.svg';
import Image from 'next/image';

const ActionIcons = () => {
  return (
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
        className="flex h-6 w-6 items-center justify-center"
        aria-label="알림"
      >
        <Image
          src={bellIcon}
          alt=""
          width={24}
          height={24}
          className="object-contain"
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default ActionIcons;
