'use client';

import { useLayoutState } from '@/components/layout-context';
import { type ReactNode } from 'react';
import Navigation from './(home)/_components/navigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isNavVisible = useLayoutState();

  return (
    <div className="min-h-screen bg-white">
      <main className="relative mx-auto w-full max-w-[600px] bg-white">
        {children}
      </main>
      {isNavVisible && <Navigation />}
    </div>
  );
};

export default MainLayout;
