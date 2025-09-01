import { cn } from '@/utils';

interface CompleteButtonProps {
  disabled?: boolean;
}

const CompleteButton = ({ disabled = false }: CompleteButtonProps) => {
  return (
    <div className="w-full">
      <button
        type="submit"
        disabled={disabled}
        className={cn(
          'flex h-[50px] w-full items-center justify-center rounded-md',
          'font-pretendard text-base font-semibold leading-none text-white transition-colors duration-200',
          {
            'cursor-not-allowed bg-wit-gray-200': disabled,
            'cursor-pointer bg-wit-orange hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-wit-orange focus:ring-offset-2':
              !disabled,
          },
        )}
        aria-label={disabled ? '닉네임을 입력해주세요' : '닉네임 설정 완료'}
        aria-disabled={disabled}
      >
        완료
      </button>
    </div>
  );
};

export default CompleteButton;
