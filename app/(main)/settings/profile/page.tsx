import { getCurrentUser } from '@/actions/user';
import { ErrorBoundary } from '@/components/error-boundary';
import NickNameChange from './_components/nickname-change';
import ProfileHeader from './_components/profile-header';
import ProfileImage from './_components/profile-image';
import SnsAccount from './_components/sns-account';

export const dynamic = 'force-dynamic';

const ProfileSettingsPage = async () => {
  const user = await getCurrentUser();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white font-pretendard">
        <ProfileHeader />
        <ProfileImage user={user} />
        <div className="flex flex-col">
          <NickNameChange />
          <SnsAccount />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProfileSettingsPage;
