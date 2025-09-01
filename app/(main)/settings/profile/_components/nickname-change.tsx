import arrowRightIcon from '@/assets/icons/arrow-right-black.svg';
import { getSession } from '@/libs/session';
import Image from 'next/image';
import Link from 'next/link';

const NickNameChange = async () => {
  const session = await getSession();
  const nickname = session?.nickname || '감자도리';

  return (
    <section className="mt-8 border-b border-[#D6D6D6] px-4 py-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium leading-[1.5714] text-wit-black">
          닉네임
        </h3>
        <Link
          href="/settings/nickname"
          className="flex items-center gap-[19px] transition-opacity hover:opacity-70"
        >
          <span className="text-sm font-medium leading-[1.5714] text-[#9D9D9D]">
            {nickname}
          </span>
          <Image
            src={arrowRightIcon}
            alt=""
            width={4}
            height={8}
            className="object-contain"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
};

export default NickNameChange;
