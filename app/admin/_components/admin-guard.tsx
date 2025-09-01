import { getCurrentUser } from '@/actions/user';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuardInner = async ({ children }: AdminGuardProps) => {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    notFound();
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

const AdminGuard = ({ children }: AdminGuardProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              권한을 확인하는 중...
            </p>
          </div>
        </div>
      }
    >
      <AdminGuardInner>{children}</AdminGuardInner>
    </Suspense>
  );
};

export default AdminGuard;
