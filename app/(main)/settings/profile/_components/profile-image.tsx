'use client';

import { generateProfileImageUploadUrl } from '@/actions/aws';
import type { getCurrentUser } from '@/actions/user';
import { resetUserProfileImage, updateUserProfileUrl } from '@/actions/user';
import resetIcon from '@/assets/icons/reset-icon.svg';
import Image from 'next/image';
import { useRef, useTransition } from 'react';

type User = Awaited<ReturnType<typeof getCurrentUser>>;

interface ProfileImageProps {
  user: User;
}

const ProfileImage = ({ user }: ProfileImageProps) => {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageContainerClick = () => {
    if (isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return;
    }

    startTransition(async () => {
      try {
        if (!user?.id) {
          return;
        }

        const fileExtension = file.name.split('.').pop() || 'png';
        const response = await generateProfileImageUploadUrl(
          user.id,
          fileExtension,
        );
        if (!response) {
          throw new Error('업로드 URL 생성에 실패했습니다.');
        }

        const { uploadUrl, key } = response;

        await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        const cloudfrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
        if (!cloudfrontUrl) {
          throw new Error('CloudFront URL이 설정되지 않았습니다.');
        }
        const fullUrl = `${cloudfrontUrl}/${key}`;
        const updateResult = await updateUserProfileUrl(fullUrl);

        if (!updateResult.success) {
          throw new Error(
            updateResult.error || '프로필 업데이트에 실패했습니다.',
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleProfileReset = () => {
    if (isPending) return;
    startTransition(async () => {
      await resetUserProfileImage();
    });
  };

  return (
    <section className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div
        className="relative mt-[56px] h-[100px] w-[100px] cursor-pointer overflow-hidden rounded-full shadow-md transition-opacity hover:opacity-80"
        onClick={handleImageContainerClick}
        onKeyDown={e => {
          if (e.key === 'Enter') handleImageContainerClick();
        }}
        role="button"
        tabIndex={0}
        aria-label="프로필 이미지 변경"
      >
        {isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
        <Image
          src={user?.profileUrl || '/default_profile.png'}
          alt={`${user?.nickname || '사용자'}의 프로필 이미지`}
          fill
          sizes="100px"
          className="object-cover"
        />
      </div>
      <button
        type="button"
        onClick={handleProfileReset}
        disabled={isPending}
        className="mt-5 flex h-[29px] w-[125px] items-center justify-center gap-1.5 rounded border border-wit-orange px-[13px] py-1 transition-colors hover:bg-wit-orange hover:bg-opacity-5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Image
          src={resetIcon}
          alt=""
          width={14}
          height={13}
          className="object-contain"
          aria-hidden="true"
        />
        <span className="whitespace-nowrap text-xs font-normal leading-[1.3333] text-wit-orange">
          {isPending ? '처리 중...' : '기본 프로필로 변경'}
        </span>
      </button>
    </section>
  );
};

export default ProfileImage;
