import dropdownArrow from '@/assets/icons/dropdown-arrow.svg';
import Image from 'next/image';

const LocationSelector = () => {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5"
      aria-label="지역 선택"
    >
      <span className="text-xl font-semibold text-wit-black">일본</span>
      <div className="relative h-2 w-4">
        <Image
          src={dropdownArrow}
          alt=""
          fill
          sizes="1rem"
          className="object-contain"
          aria-hidden="true"
        />
      </div>
    </button>
  );
};

export default LocationSelector;
