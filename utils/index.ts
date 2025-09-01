import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const getS3ImageUrl = (key: string): string => {
  const cloudfrontUrl = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

  if (!cloudfrontUrl) {
    console.error('CLOUDFRONT_URL이 설정되지 않았습니다.');
    return '';
  }

  return `${cloudfrontUrl}/${key}`;
};
