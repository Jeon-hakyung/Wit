'use client';

import { useLayoutDispatch } from '@/components/layout-context';
import { useEffect, type ReactNode } from 'react';

interface NicknamePageWrapperProps {
  isFromSignup: boolean;
  children: ReactNode;
}

const NicknamePageWrapper = ({
  isFromSignup,
  children,
}: NicknamePageWrapperProps) => {
  const setIsNavVisible = useLayoutDispatch();

  useEffect(() => {
    if (isFromSignup) {
      setIsNavVisible(false);
    }

    return () => {
      setIsNavVisible(true);
    };
  }, [isFromSignup, setIsNavVisible]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

export default NicknamePageWrapper;
