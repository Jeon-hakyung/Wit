'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { LayoutDashboard, Package, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigation: NavigationItem[] = [
  {
    name: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
    description: '전체 현황 및 통계',
  },
  {
    name: '카테고리 관리',
    href: '/admin/categories',
    icon: Tags,
    description: '상품 카테고리 관리',
  },
  {
    name: '상품 관리',
    href: '/admin/products',
    icon: Package,
    description: '상품 등록 및 관리',
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-white">
            W
          </div>
          <span className="text-xl font-bold text-wit-black">WIT Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Button
              key={item.name}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start space-x-3 px-3 py-2 text-left',
                isActive
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'text-gray-700 hover:bg-gray-100',
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs opacity-70">{item.description}</span>
                </div>
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <p>WIT 관리자 시스템</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
