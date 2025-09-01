'use client';

import { deleteS3Object, generateMultipleS3UploadUrls } from '@/actions/aws';
import {
  getFileExtension,
  resizeImage,
  uploadMultipleFilesToS3,
  validateImageFile,
} from '@/libs/aws';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  key?: string;
  uploaded: boolean;
  isExisting?: boolean;
}

interface ExistingImage {
  key: string;
  url: string;
}

interface UseImageUploadProps {
  maxImages?: number;
  minImages?: number;
  productId?: string;
  onImagesChange?: (imageKeys: string[]) => void;
  initialImages?: ExistingImage[];
}

interface UseImageUploadReturn {
  images: UploadedImage[];
  isUploading: boolean;
  uploadProgress: number;
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  reorderImages: (startIndex: number, endIndex: number) => void;
  uploadImages: () => Promise<string[]>;
  clearImages: () => void;
  errors: string[];
}

export const useImageUpload = ({
  maxImages = 6,
  minImages = 3,
  productId,
  onImagesChange,
  initialImages = [],
}: UseImageUploadProps = {}): UseImageUploadReturn => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const previousKeysRef = useRef<string>('');

  useEffect(() => {
    if (initialImages.length > 0) {
      const existingImages: UploadedImage[] = initialImages.map(
        (img, index) => ({
          id: `existing-${img.key}-${index}`,
          preview: img.url,
          key: img.key,
          uploaded: true,
          isExisting: true,
        }),
      );
      setImages(existingImages);
    }
  }, [initialImages]);

  useEffect(() => {
    const imageKeys = images.filter(img => img.key).map(img => img.key!);
    const keysString = imageKeys.join(',');

    if (keysString !== previousKeysRef.current && onImagesChange) {
      previousKeysRef.current = keysString;
      onImagesChange(imageKeys);
    }
  }, [images, onImagesChange]);

  const addImages = useCallback(
    async (files: File[]) => {
      const newErrors: string[] = [];

      if (images.length + files.length > maxImages) {
        newErrors.push(`최대 ${maxImages}장까지 업로드할 수 있습니다.`);
        setErrors(newErrors);
        return;
      }

      const validFiles: File[] = [];

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          newErrors.push(`${file.name}: ${validation.error}`);
          continue;
        }
        validFiles.push(file);
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        if (validFiles.length === 0) return;
      }

      try {
        const processedImages: UploadedImage[] = [];

        for (const file of validFiles) {
          const resizedFile = await resizeImage(file);
          const preview = URL.createObjectURL(resizedFile);

          processedImages.push({
            id: `${Date.now()}-${Math.random()}`,
            file: resizedFile,
            preview,
            uploaded: false,
            isExisting: false,
          });
        }

        setImages(prev => [...prev, ...processedImages]);
        setErrors([]);
      } catch (error) {
        console.error('이미지 처리 실패:', error);
      }
    },
    [images.length, maxImages],
  );

  const removeImage = useCallback(async (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);

      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        if (!imageToRemove.isExisting) {
          URL.revokeObjectURL(imageToRemove.preview);
        } else if (imageToRemove.key) {
          deleteS3Object(imageToRemove.key)
            .then(success => {
              if (success) {
                console.log(`S3에서 이미지 삭제 완료: ${imageToRemove.key}`);
              } else {
                console.error(`S3에서 이미지 삭제 실패: ${imageToRemove.key}`);
              }
            })
            .catch(error => {
              console.error('S3 삭제 중 오류:', error);
            });
        }
      }

      return filtered;
    });
  }, []);

  const reorderImages = useCallback((startIndex: number, endIndex: number) => {
    setImages(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    });
  }, []);

  const uploadImages = useCallback(async (): Promise<string[]> => {
    if (!productId) {
      throw new Error('Product ID가 필요합니다.');
    }

    if (images.length < minImages) {
      throw new Error(`최소 ${minImages}장의 이미지가 필요합니다.`);
    }

    if (images.length > maxImages) {
      throw new Error(`최대 ${maxImages}장까지 업로드할 수 있습니다.`);
    }

    const newImages = images.filter(img => !img.isExisting && !img.uploaded);

    if (newImages.length === 0) {
      const allKeys = images.filter(img => img.key).map(img => img.key!);
      return allKeys;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrors([]);

    try {
      const fileExtensions = newImages.map(img =>
        img.file ? getFileExtension(img.file.name) : 'jpg',
      );

      const uploadUrls = await generateMultipleS3UploadUrls(
        productId,
        fileExtensions,
      );

      if (uploadUrls.length !== newImages.length) {
        throw new Error('업로드 URL 생성에 실패했습니다.');
      }

      const uploads = newImages.map((img, index) => ({
        uploadUrl: uploadUrls[index].uploadUrl,
        file: img.file!,
      }));

      const { results } = await uploadMultipleFilesToS3(
        uploads,
        setUploadProgress,
      );

      setImages(prev => {
        const updated = [...prev];
        let newImageIndex = 0;

        for (let i = 0; i < updated.length; i++) {
          if (!updated[i].isExisting && !updated[i].uploaded) {
            if (newImageIndex < uploadUrls.length) {
              updated[i] = {
                ...updated[i],
                key: uploadUrls[newImageIndex].key,
                uploaded: results[newImageIndex],
              };
              newImageIndex++;
            }
          }
        }

        return updated;
      });

      const newUploadedKeys = uploadUrls
        .filter((_, index) => results[index])
        .map(url => url.key);

      const existingKeys = images
        .filter(img => img.isExisting && img.key)
        .map(img => img.key!);
      const allKeys = [...existingKeys, ...newUploadedKeys];

      const successCount = newUploadedKeys.length;
      const totalNewCount = newImages.length;
      const failedCount = totalNewCount - successCount;

      if (successCount === totalNewCount) {
        console.log(`${successCount}장의 새 이미지가 모두 업로드되었습니다.`);
      } else if (successCount > 0) {
        console.warn(
          `${successCount}장 업로드 성공, ${failedCount}장 실패. 실패한 이미지를 다시 시도하세요.`,
        );
        setErrors([`${failedCount}장의 이미지 업로드에 실패했습니다.`]);
      } else {
        throw new Error('모든 새 이미지 업로드에 실패했습니다.');
      }

      return allKeys;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '업로드 중 오류가 발생했습니다.';
      setErrors([errorMessage]);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [images, productId, minImages, maxImages, onImagesChange]);

  const clearImages = useCallback(() => {
    images.forEach(img => {
      URL.revokeObjectURL(img.preview);
    });

    setImages([]);
    setErrors([]);
    setUploadProgress(0);
  }, [images]);

  return {
    images,
    isUploading,
    uploadProgress,
    addImages,
    removeImage,
    reorderImages,
    uploadImages,
    clearImages,
    errors,
  };
};
