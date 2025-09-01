import KakaoLoginButton from './_components/login-button';
import LoginImage from './_components/login-image';
import Title from './_components/title';

interface LoginPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const errorMessages: { [key: string]: string } = {
  invalid_params: '잘못된 접근입니다. 다시 시도해주세요.',
  invalid_state: '인증 과정에 문제가 발생했습니다. 다시 로그인해주세요.',
  token_exchange_failed:
    '카카오 인증에 실패했습니다. 잠시 후 다시 시도해주세요.',
  user_info_fetch_failed: '카카오 사용자 정보를 가져오는 데 실패했습니다.',
  session_creation_failed:
    '로그인에 실패했습니다. 문제가 지속되면 문의해주세요.',
  init_failed: '로그인 초기화에 실패했습니다. 잠시 후 다시 시도해주세요.',
  default: '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
};

const LoginPage = ({ searchParams }: LoginPageProps) => {
  const errorCode = searchParams?.error as string | undefined;
  const displayMessage = errorCode
    ? errorMessages[errorCode] || errorMessages.default
    : null;

  return (
    <main
      role="main"
      aria-label="로그인 페이지"
      className="mx-auto flex min-h-screen max-w-[600px] flex-col justify-between px-4"
    >
      <div className="flex flex-1 flex-col items-center justify-center space-y-8">
        <Title />
        <LoginImage />
      </div>
      <div className="flex flex-col items-center space-y-4 pb-8">
        {displayMessage && (
          <div className="w-full px-4 text-center">
            <p className="text-sm font-medium text-red-500" role="alert">
              {displayMessage}
            </p>
          </div>
        )}
        <p
          className="text-center font-pretendard text-sm font-normal leading-[1.5714285714285714] text-wit-gray"
          role="complementary"
          aria-label="로그인 안내 메시지"
        >
          ⚡간편 로그인으로 3초만에 가입하기
        </p>
        <KakaoLoginButton />
      </div>
    </main>
  );
};

export default LoginPage;
