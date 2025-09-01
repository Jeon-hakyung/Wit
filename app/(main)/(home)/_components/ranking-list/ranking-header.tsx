import arrowRight from '@/assets/icons/arrow-right.svg';
import galleryIcon from '@/assets/icons/gallery-icon.svg';
import Image from 'next/image';
import Link from 'next/link';

const RankingHeader = () => {
  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-wit-black">👑 위트 랭킹</h2>
        <Link
          href="/ranking"
          className="flex items-center gap-1 hover:opacity-70"
          aria-label="위트 랭킹 더보기"
        >
          <span className="text-xs text-wit-gray">더보기</span>
          <div className="relative h-2 w-1">
            <Image
              src={arrowRight}
              alt=""
              fill
              sizes="0.5rem"
              className="object-contain"
              aria-hidden="true"
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative h-3.5 w-3">
          <Image
            src={galleryIcon}
            alt=""
            fill
            sizes="1rem"
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <span className="text-xs text-wit-gray">10분 전 업데이트</span>
      </div>
    </div>
  );
};

export default RankingHeader;
