'use client';

import { withdrawUser } from '@/actions/user';
import { useState } from 'react';
import WithdrawButtons from './withdraw-buttons';
import WithdrawOptions from './withdraw-options';

export type WithdrawReason =
  | 'inconvenient'
  | 'inaccurate_info'
  | 'rarely_use'
  | 'rejoin'
  | 'other';

const WithdrawForm = () => {
  const [selectedReason, setSelectedReason] = useState<WithdrawReason | null>(
    null,
  );
  const [otherReasonText, setOtherReasonText] = useState('');

  const isWithdrawEnabled =
    selectedReason !== null &&
    (selectedReason !== 'other' || otherReasonText.trim().length > 0);

  const handleReasonChange = (reason: WithdrawReason) => {
    setSelectedReason(reason);
    if (reason !== 'other') {
      setOtherReasonText('');
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherReasonText(text);
  };

  return (
    <form
      action={withdrawUser}
      className="flex h-[calc(100vh-100px)] flex-col justify-between"
    >
      <div className="flex-1">
        <h2 className="text-lg font-semibold leading-[1.4444] text-wit-black">
          탈퇴하는 이유를 알려주세요
        </h2>

        <input type="hidden" name="type" value={selectedReason ?? ''} />
        {selectedReason === 'other' && (
          <input type="hidden" name="comment" value={otherReasonText} />
        )}

        <div className="mt-[26px]">
          <WithdrawOptions
            selectedReason={selectedReason}
            otherReasonText={otherReasonText}
            onReasonChange={handleReasonChange}
            onOtherTextChange={handleOtherTextChange}
          />
        </div>
      </div>
      <div className="bg-white">
        <WithdrawButtons isWithdrawEnabled={isWithdrawEnabled} />
      </div>
    </form>
  );
};

export default WithdrawForm;
