import dropdownIcon from '@/assets/icons/dropdown-arrow-ranking.svg';
import galleryIcon from '@/assets/icons/gallery-icon.svg';
import Image from 'next/image';

const RankingUpdateInfo = () => {
  return (
    <div className="flex items-center justify-between py-[16px]">
      <div className="flex items-center gap-[16px]">
        <Image
          src={galleryIcon}
          alt=""
          width={16}
          height={16}
          className="object-contain"
          aria-hidden="true"
        />
        <span className="text-xs font-normal leading-[1.3333] text-[#9D9D9D]">
          10분 전 업데이트
        </span>
      </div>

      <div className="flex items-center gap-[6px]">
        <span className="text-xs font-normal leading-[1.3333] text-[#9D9D9D]">
          방금전
        </span>
        <Image
          src={dropdownIcon}
          alt=""
          width={6}
          height={3}
          className="object-contain"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default RankingUpdateInfo;
