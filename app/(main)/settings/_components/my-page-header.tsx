import bellIcon from '@/assets/icons/bell-icon.svg';
import Image from 'next/image';

const MypageHeader = () => {
  return (
    <header className="flex h-[60px] w-full items-center justify-between bg-white px-4">
      <div className="flex items-center gap-1.5">
        <h1 className="text-xl font-semibold leading-[1.4] text-wit-black">
          마이페이지
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center"
          aria-label="알림"
        >
          <Image
            src={bellIcon}
            alt=""
            width={20}
            height={17}
            className="object-contain"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
};

export default MypageHeader;
