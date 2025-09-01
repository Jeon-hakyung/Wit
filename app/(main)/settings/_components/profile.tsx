import type { getCurrentUser } from '@/actions/user';
import Image from 'next/image';

type User = Awaited<ReturnType<typeof getCurrentUser>>;

interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => {
  const nickname = user?.nickname || '감자도리';

  return (
    <section className="flex items-center gap-[11px] px-4 py-6">
      <div className="relative h-[62px] w-[62px] overflow-hidden rounded-full shadow-md">
        <Image
          src={user?.profileUrl || '/default_profile.png'}
          alt={`${nickname}의 프로필 이미지`}
          fill
          sizes="62px"
          className="object-cover"
        />
      </div>
      <div className="flex w-[124px] flex-col">
        <h2 className="text-lg font-semibold leading-[1.4444] text-wit-black">
          {nickname}
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-[5px]">
            <span className="text-base leading-[1] text-wit-black">팔로잉</span>
            <span className="text-sm font-bold leading-[1.5714] text-wit-black">
              8
            </span>
          </div>
          <div className="flex items-center gap-[5px]">
            <span className="text-base leading-[1] text-wit-black">팔로워</span>
            <span className="text-sm font-bold leading-[1.5714] text-wit-black">
              8
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
