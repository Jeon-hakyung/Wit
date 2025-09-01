import { logoutUser } from '@/actions/auth';
import { getCurrentUser } from '@/actions/user';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminHeader = async () => {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-wit-black">관리자 대시보드</h1>
          <p className="text-sm text-wit-gray">WIT 상품 관리 시스템</p>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  {user?.nickname?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium">
                  {user?.nickname || '관리자'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">
                  {user?.nickname || '관리자'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || ''}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/" className="cursor-pointer">
                  메인 사이트로 이동
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={logoutUser}>
                  <button type="submit" className="w-full text-left">
                    로그아웃
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
