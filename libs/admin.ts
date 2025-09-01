import { getCurrentUser } from '@/actions/user';
import { type UserSession } from '@/types/auth';

export const isAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('관리자 권한 확인 실패:', error);
    return false;
  }
};

export const getAdminUser = async (): Promise<UserSession['user'] | null> => {
  try {
    const user = await getCurrentUser();
    if (user?.role === 'ADMIN') {
      return user;
    }
    return null;
  } catch (error) {
    console.error('관리자 사용자 조회 실패:', error);
    return null;
  }
};

export const requireAdmin = async (): Promise<UserSession['user']> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  if (user.role !== 'ADMIN') {
    throw new Error('관리자 권한이 필요합니다.');
  }

  return user;
};
