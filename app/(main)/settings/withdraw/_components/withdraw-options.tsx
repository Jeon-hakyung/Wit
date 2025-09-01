'use client';

import type { WithdrawReason } from './withdraw-form';

interface WithdrawOption {
  id: WithdrawReason;
  label: string;
}

const withdrawOptions: WithdrawOption[] = [
  { id: 'inconvenient', label: '앱 사용이 불편해요' },
  { id: 'inaccurate_info', label: '상품 정보가 정확하지 않아요' },
  { id: 'rarely_use', label: '잘 쓰지 않는 앱이에요' },
  { id: 'rejoin', label: '재가입할 거예요' },
  { id: 'other', label: '기타' },
];

interface WithdrawOptionsProps {
  selectedReason: WithdrawReason | null;
  otherReasonText: string;
  onReasonChange: (reason: WithdrawReason) => void;
  onOtherTextChange: (text: string) => void;
}

const WithdrawOptions = ({
  selectedReason,
  otherReasonText,
  onReasonChange,
  onOtherTextChange,
}: WithdrawOptionsProps) => {
  return (
    <div className="space-y-0">
      {withdrawOptions.map((option, index) => (
        <div key={option.id}>
          <div
            className={`border-b border-[#EEEEEE] px-0 py-4 ${
              index === withdrawOptions.length - 1 && selectedReason === 'other'
                ? 'pb-[15px]'
                : ''
            }`}
          >
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onReasonChange(option.id)}
                className="flex h-5 w-5 items-center justify-center"
                aria-label={`${option.label} 선택`}
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    selectedReason === option.id
                      ? option.id === 'other'
                        ? 'border-[5px] border-wit-orange'
                        : 'border-2 border-wit-orange'
                      : 'border-2 border-[#E1E1E1]'
                  }`}
                >
                  {selectedReason === option.id && option.id !== 'other' && (
                    <div className="h-[9px] w-[9px] rounded-full bg-wit-orange" />
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => onReasonChange(option.id)}
                className="flex-1 text-left text-sm font-medium leading-[1.5714] text-[#6B6B6B] opacity-90"
              >
                {option.label}
              </button>
            </div>
          </div>
          {option.id === 'other' && selectedReason === 'other' && (
            <div className="border-b border-[#EEEEEE] pb-4">
              <textarea
                value={otherReasonText}
                onChange={e => onOtherTextChange(e.target.value)}
                placeholder="더 나은 위트가 될 수 있도록 의견을 남겨주세요"
                className="h-[73px] w-full resize-none rounded-[3px] border border-[#DDDDDD] px-[11px] py-[11px] text-xs font-normal leading-[1.3333] text-wit-black placeholder:text-[#9D9D9D] focus:border-wit-orange focus:outline-none"
                maxLength={500}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WithdrawOptions;
