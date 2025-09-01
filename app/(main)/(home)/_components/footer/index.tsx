import instagramIcon from '@/assets/icons/instagram-icon.svg';
import kakaoIcon from '@/assets/icons/kakao-icon.svg';
import twitterIcon from '@/assets/icons/twitter-icon.svg';
import youtubeIcon from '@/assets/icons/youtube-icon.svg';
import Image from 'next/image';

const Footer = () => {
  const socialMediaItems = [
    {
      icon: instagramIcon,
      alt: '인스타그램',
      href: '#',
      size: { width: 12, height: 12 },
    },
    {
      icon: twitterIcon,
      alt: '트위터',
      href: '#',
      size: { width: 13, height: 12 },
    },
    {
      icon: youtubeIcon,
      alt: '유튜브',
      href: '#',
      size: { width: 13, height: 14 },
    },
    {
      icon: kakaoIcon,
      alt: '카카오톡',
      href: '#',
      size: { width: 15, height: 14 },
    },
  ];

  const footerLinks = [
    { label: '이용약관', href: '#' },
    { label: '개인정보처리방침', href: '#' },
    { label: '고객센터', href: '#' },
    { label: '위트 소개', href: '#' },
  ];

  return (
    <footer className="bg-gray-50 px-4 py-4">
      <div className="space-y-4">
        <nav
          className="flex flex-wrap gap-2 text-3xs font-bold text-wit-gray-70"
          aria-label="푸터 네비게이션"
        >
          {footerLinks.map((link, index) => (
            <span key={link.label}>
              <a
                href={link.href}
                className="transition-colors hover:text-wit-black-70 hover:underline"
                aria-label={`${link.label} 페이지로 이동`}
              >
                {link.label}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="ml-2 text-gray-400">|</span>
              )}
            </span>
          ))}
        </nav>
        <div className="flex gap-2">
          {socialMediaItems.map(item => (
            <a
              key={item.alt}
              href={item.href}
              className="flex h-[26px] w-[26px] items-center justify-center rounded-[13px] bg-wit-dark-gray transition-colors hover:bg-gray-700"
              aria-label={`${item.alt} 페이지로 이동`}
            >
              <Image
                src={item.icon}
                alt=""
                width={item.size.width}
                height={item.size.height}
                className="brightness-0 invert"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
        <div className="text-3xs font-semibold text-wit-gray-70">
          COPYRIGHTⓒ 2024 WIT. ALL RIGTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
