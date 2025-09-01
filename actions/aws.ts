'use server';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET!,
  },
});

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
  originalFilename: string;
}

const getContentType = (fileExtension: string): string => {
  const ext = fileExtension.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
};

export async function generateProfileImageUploadUrl(
  userId: string,
  fileExtension: string = 'png',
): Promise<UploadUrlResponse | null> {
  try {
    if (
      !process.env.S3_BUCKET_NAME ||
      !process.env.S3_ACCESS_KEY ||
      !process.env.S3_SECRET
    ) {
      console.error('AWS 환경 변수가 설정되지 않았습니다.');
      return null;
    }

    const uuid = uuidv4();
    const key = `users/${userId}/profile/${uuid}.${fileExtension}`;
    const originalFilename = `profile-${userId}-${uuid}.${fileExtension}`;
    const bucketName = process.env.S3_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: getContentType(fileExtension),
      CacheControl: 'max-age=31536000',
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return {
      uploadUrl,
      key,
      originalFilename,
    };
  } catch (error) {
    console.error('프로필 이미지 Presigned URL 생성 실패:', error);
    return null;
  }
}

export async function generateS3UploadUrl(
  productId: string,
  fileExtension: string = 'png',
): Promise<UploadUrlResponse | null> {
  try {
    if (
      !process.env.S3_BUCKET_NAME ||
      !process.env.S3_ACCESS_KEY ||
      !process.env.S3_SECRET
    ) {
      console.error('AWS 환경 변수가 설정되지 않았습니다.');
      return null;
    }

    const now = new Date();
    const uuid = uuidv4();

    const key = `products/${productId}/${uuid}.${fileExtension}`;
    const originalFilename = `${productId}-${uuid}.${fileExtension}`;

    const bucketName = process.env.S3_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: getContentType(fileExtension),
      CacheControl: 'max-age=31536000',
      Metadata: {
        'original-filename': originalFilename,
        'uploaded-at': now.toISOString(),
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 900,
    });

    return {
      uploadUrl,
      key,
      originalFilename,
    };
  } catch (error) {
    console.error('Presigned URL 생성 실패:', error);
    return null;
  }
}

export async function generateMultipleS3UploadUrls(
  productId: string,
  fileExtensions: string[],
): Promise<UploadUrlResponse[]> {
  try {
    const promises = fileExtensions.map(ext =>
      generateS3UploadUrl(productId, ext),
    );

    const results = await Promise.all(promises);

    return results.filter(
      (result): result is UploadUrlResponse => result !== null,
    );
  } catch (error) {
    console.error('다중 Presigned URL 생성 실패:', error);
    return [];
  }
}

export async function deleteS3Object(key: string): Promise<boolean> {
  try {
    if (
      !process.env.S3_BUCKET_NAME ||
      !process.env.S3_ACCESS_KEY ||
      !process.env.S3_SECRET
    ) {
      console.error('AWS 환경 변수가 설정되지 않았습니다.');
      return false;
    }

    const bucketName = process.env.S3_BUCKET_NAME;

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`S3 파일 삭제 성공: ${key}`);
    return true;
  } catch (error) {
    console.error(`S3 파일 삭제 실패 (${key}):`, error);
    return false;
  }
}

export async function deleteMultipleS3Objects(
  keys: string[],
): Promise<boolean[]> {
  try {
    const promises = keys.map(key => deleteS3Object(key));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('다중 S3 파일 삭제 실패:', error);
    return keys.map(() => false);
  }
}
