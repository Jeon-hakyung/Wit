'use client';

import Link from 'next/link';

interface WithdrawButtonsProps {
  isWithdrawEnabled: boolean;
}

const WithdrawButtons = ({ isWithdrawEnabled }: WithdrawButtonsProps) => {
  return (
    <div className="flex gap-2.5 px-4 py-2.5">
      <button
        type="submit"
        disabled={!isWithdrawEnabled}
        className={`flex h-[50px] flex-1 items-center justify-center rounded-md text-base font-semibold leading-none transition-colors ${
          isWithdrawEnabled
            ? 'bg-wit-orange text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-offset-2'
            : 'cursor-not-allowed bg-[#DFDFDF] text-white'
        }`}
      >
        탈퇴하기
      </button>
      <Link
        href="/settings"
        className="flex h-[50px] flex-1 items-center justify-center rounded-md bg-wit-orange text-base font-semibold leading-none text-white transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-offset-2"
      >
        계속 이용하기
      </Link>
    </div>
  );
};

export default WithdrawButtons;
