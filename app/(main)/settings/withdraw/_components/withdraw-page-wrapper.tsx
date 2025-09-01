'use client';

import { useLayoutDispatch } from '@/components/layout-context';
import { useEffect, type ReactNode } from 'react';

interface WithdrawPageWrapperProps {
  children: ReactNode;
}

const WithdrawPageWrapper = ({ children }: WithdrawPageWrapperProps) => {
  const setIsNavVisible = useLayoutDispatch();

  useEffect(() => {
    setIsNavVisible(false);

    return () => {
      setIsNavVisible(true);
    };
  }, [setIsNavVisible]);

  return <>{children}</>;
};

export default WithdrawPageWrapper;
