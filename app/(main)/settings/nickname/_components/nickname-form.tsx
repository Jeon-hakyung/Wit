'use client';

import { updateUserNickname } from '@/actions/user';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CompleteButton from './complete-button';
import ErrorMessage from './error-message';
import NicknameInput from './nickname-input';
import Title from './title';

interface NicknameFormProps {
  currentNickname: string;
  serverError: string;
}

const NicknameForm = ({ currentNickname, serverError }: NicknameFormProps) => {
  const [inputValue, setInputValue] = useState(currentNickname);
  const [clientError, setClientError] = useState('');
  const [serverErrorState, setServerErrorState] = useState(serverError);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const errorCode = searchParams.get('error') || undefined;
    const message = (() => {
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
    })();
    setServerErrorState(message);
  }, [searchParams]);

  const validateNickname = (value: string): string => {
    if (!value.trim()) {
      return '닉네임을 입력해주세요';
    }

    if (value.length < 2) {
      return '닉네임은 2자 이상이어야 합니다';
    }

    if (value.length > 10) {
      return '닉네임은 10자 이하여야 합니다';
    }

    if (value === currentNickname) {
      return '현재 닉네임과 동일한 닉네임입니다';
    }

    return '';
  };

  const handleInputChange = (value: string): void => {
    setInputValue(value);
    const error = validateNickname(value);
    setClientError(error);
    if (serverErrorState) {
      setServerErrorState('');
    }

    const hasErrorParam = !!searchParams.get('error');
    if (hasErrorParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('error');
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  };

  const finalError = serverErrorState || clientError;

  const isButtonDisabled =
    !inputValue.trim() || !!finalError || inputValue === currentNickname;

  return (
    <form action={updateUserNickname} className="flex flex-col">
      <div className="mb-[70px]">
        <Title />
      </div>
      <div className="space-y-2">
        <NicknameInput
          defaultValue={currentNickname}
          error={finalError}
          onChange={handleInputChange}
        />
        <ErrorMessage error={finalError} />
      </div>
      <div className="mt-[55px]">
        <CompleteButton disabled={isButtonDisabled} />
      </div>
    </form>
  );
};

export default NicknameForm;
