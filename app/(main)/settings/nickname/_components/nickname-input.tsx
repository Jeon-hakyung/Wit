import closeIcon from '@/assets/icons/close-circle-icon.svg';
import { cn } from '@/utils';
import Image from 'next/image';
import { useState } from 'react';

interface NicknameInputProps {
  defaultValue?: string;
  error: string;
  onChange?: (value: string) => void;
}

const NicknameInput = ({
  defaultValue = '',
  error,
  onChange,
}: NicknameInputProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleClearClick = (): void => {
    setValue('');
    onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClearClick();
    }
  };

  return (
    <div className="w-full" role="group" aria-label="닉네임 입력 영역">
      <div
        className={cn('relative flex items-center gap-2.5 border-b pb-2.5', {
          'border-wit-red': error,
          'border-wit-black': !error && value,
          'border-wit-gray-300': !error && !value,
        })}
      >
        <input
          type="text"
          name="nickname"
          value={value}
          onChange={handleInputChange}
          placeholder="닉네임"
          className={cn(
            'flex-1 border-none bg-transparent font-pretendard text-base font-normal leading-none text-wit-black outline-none',
            'placeholder:text-wit-gray-300',
          )}
          aria-label="닉네임 입력"
          aria-invalid={!!error}
          aria-describedby={error ? 'nickname-error' : undefined}
          required
        />

        {value && (
          <button
            type="button"
            onClick={handleClearClick}
            onKeyDown={handleKeyDown}
            className="flex h-5 w-5 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            aria-label="입력 내용 지우기"
            tabIndex={0}
          >
            <Image
              src={closeIcon}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default NicknameInput;
