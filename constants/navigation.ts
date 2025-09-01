export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  iconPath: string;
  ariaLabel: string;
  width: number;
  height: number;
}

export const BOTTOM_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'category',
    label: '카테고리',
    path: '/category',
    iconPath: '/assets/icons/nav-category.svg',
    ariaLabel: '카테고리 페이지로 이동',
    width: 18,
    height: 19,
  },
  {
    id: 'community',
    label: '커뮤니티',
    path: '/community',
    iconPath: '/assets/icons/nav-community.svg',
    ariaLabel: '커뮤니티 페이지로 이동',
    width: 18,
    height: 18,
  },
  {
    id: 'home',
    label: '홈',
    path: '/',
    iconPath: '/assets/icons/nav-home.svg',
    ariaLabel: '홈 페이지로 이동',
    width: 16,
    height: 18,
  },
  {
    id: 'scrap',
    label: '위트',
    path: '/scrap',
    iconPath: '/assets/icons/nav-bookmark.svg',
    ariaLabel: '위트 페이지로 이동',
    width: 14,
    height: 18,
  },
  {
    id: 'mypage',
    label: '마이페이지',
    path: '/settings',
    iconPath: '/assets/icons/nav-mypage.svg',
    ariaLabel: '마이페이지로 이동',
    width: 16,
    height: 16,
  },
] as const;
