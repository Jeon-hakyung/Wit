import WithdrawForm from './_components/withdraw-form';
import WithdrawHeader from './_components/withdraw-header';
import WithdrawPageWrapper from './_components/withdraw-page-wrapper';

const WithdrawPage = () => {
  return (
    <WithdrawPageWrapper>
      <div className="flex min-h-screen flex-col bg-white">
        <WithdrawHeader />
        <main
          role="main"
          aria-label="회원탈퇴 페이지"
          className="flex-1 px-4 pt-8"
        >
          <WithdrawForm />
        </main>
      </div>
    </WithdrawPageWrapper>
  );
};

export default WithdrawPage;
