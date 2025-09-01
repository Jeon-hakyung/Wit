import { getCurrentUser } from '@/actions/user';
import NicknameForm from './_components/nickname-form';
import NicknameHeader from './_components/nickname-header';
import NicknamePageWrapper from './_components/nickname-page-wrapper';

export const dynamic = 'force-dynamic';

interface NicknamePageProps {
  searchParams: { error?: string; from?: string };
}

const NicknamePage = async ({ searchParams }: NicknamePageProps) => {
  const currentUser = await getCurrentUser();
  const currentNickname = currentUser?.nickname || '';

  const isFromSignup = searchParams.from === 'signup';

  const getErrorMessage = (errorCode?: string): string => {
    switch (errorCode) {
      case 'invalid_nickname':
        return '올바르지 않은 닉네임입니다.';
      case 'duplicate_nickname':
        return '중복된 닉네임이에요';
      case 'update_failed':
        return '닉네임 업데이트에 실패했습니다.';
      case 'session_expired':
        return '세션이 만료되었습니다.';
      default:
        return '';
    }
  };

  const serverError = getErrorMessage(searchParams.error);

  return (
    <NicknamePageWrapper isFromSignup={isFromSignup}>
      <div className="flex min-h-screen flex-col bg-white">
        <NicknameHeader showBackButton={!isFromSignup} />
        <main role="main" aria-label="닉네임 설정 페이지" className="px-4 pt-8">
          <NicknameForm
            currentNickname={currentNickname}
            serverError={serverError}
          />
        </main>
      </div>
    </NicknamePageWrapper>
  );
};

export default NicknamePage;
