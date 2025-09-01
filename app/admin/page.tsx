import { getAdminCounts } from '@/actions/admin';
import { getCurrentUser } from '@/actions/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Tags, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

const AdminDashboardPage = async () => {
  const user = await getCurrentUser();
  const counts = await getAdminCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wit-black">
            안녕하세요, {user?.nickname || '관리자'}님! 👋
          </h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 상품</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.productCount}</div>
            <p className="text-xs text-muted-foreground">전체 등록된 상품 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">카테고리</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.categoryCount}</div>
            <p className="text-xs text-muted-foreground">등록된 카테고리 수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.userCount}</div>
            <p className="text-xs text-muted-foreground">총 가입 사용자 수</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <a
                href="/admin/categories"
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Tags className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">카테고리 관리</h3>
                    <p className="text-sm text-muted-foreground">
                      상품 카테고리를 생성, 수정, 삭제합니다
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/products"
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium">상품 관리</h3>
                    <p className="text-sm text-muted-foreground">
                      새로운 상품을 등록하고 기존 상품을 관리합니다
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
