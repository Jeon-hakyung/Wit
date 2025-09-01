import { getCurrentUser } from '@/actions/user';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import { ErrorBoundary } from '@/components/error-boundary';
import Image from 'next/image';
import Link from 'next/link';
import MypageHeader from './_components/my-page-header';
import Profile from './_components/profile';
import ServiceSettings from './_components/service-setting';

export const dynamic = 'force-dynamic';

const MypagePage = async () => {
  const user = await getCurrentUser();

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-white font-pretendard">
        <main className="flex-1 overflow-y-auto pb-[70px]" role="main">
          <MypageHeader />
          <Profile user={user} />
          <div className="flex flex-col">
            <section className="flex w-full flex-col">
              <div className="flex items-center gap-2.5 bg-[#FFF1EB] px-4 py-2">
                <h3 className="text-sm leading-[1.5714] text-[#6B6B6B]">
                  내 계정
                </h3>
              </div>
              <div className="flex flex-col">
                <Link
                  href="/settings/profile"
                  className="flex items-center justify-between border-b border-[#F4F4F4] px-4 py-4"
                >
                  <span className="text-sm leading-[1.5714] text-wit-black">
                    프로필 설정
                  </span>
                  <Image
                    src={ArrowRightIcon}
                    alt=""
                    width={4}
                    height={8}
                    className="object-contain"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </section>
            <section className="flex w-full flex-col">
              <div className="flex items-center gap-2.5 bg-[#FFF1EB] px-4 py-2">
                <h3 className="text-sm leading-[1.5714] text-[#6B6B6B]">
                  앱 설정
                </h3>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-4">
                  <span className="text-sm leading-[1.5714] text-wit-black">
                    앱 버전 정보
                  </span>
                  <span className="text-sm leading-[1.5714] text-wit-black">
                    1.0.0
                  </span>
                </div>
              </div>
            </section>
            <ServiceSettings />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default MypagePage;
