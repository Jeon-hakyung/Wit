import { Toaster } from '@/components/ui/sonner';
import AdminGuard from './_components/admin-guard';
import AdminHeader from './_components/admin-header';
import AdminSidebar from './_components/admin-sidebar';

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex flex-1 flex-col">
          <AdminHeader />

          <main className="flex-1 bg-white p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </AdminGuard>
  );
};

export default AdminLayout;
