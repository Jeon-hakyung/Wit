import kakaoSnsIcon from '@/assets/icons/kakao-sns-icon.png';
import Image from 'next/image';

const SnsAccount = () => {
  return (
    <section className="border-b border-[#D6D6D6] px-4 py-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium leading-[1.5714] text-wit-black">
          연결된 SNS 계정
        </h3>
        <div className="flex items-center">
          <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-[#FFE866]">
            <Image
              src={kakaoSnsIcon}
              alt="카카오톡"
              width={12}
              height={8}
              className="object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SnsAccount;
