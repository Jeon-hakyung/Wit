'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/utils';
import {
  AlertCircle,
  GripVertical,
  Image as ImageIcon,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface ExistingImage {
  key: string;
  url: string;
}

interface ImageUploadProps {
  productId?: string;
  maxImages?: number;
  minImages?: number;
  onImagesChange?: (imageKeys: string[]) => void;
  className?: string;
  initialImages?: ExistingImage[];
}

const ImageUpload = ({
  productId,
  maxImages = 6,
  minImages = 3,
  onImagesChange,
  className,
  initialImages = [],
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    images,
    isUploading,
    uploadProgress,
    addImages,
    removeImage,
    reorderImages,
    uploadImages,
    clearImages,
    errors,
  } = useImageUpload({
    maxImages,
    minImages,
    productId,
    onImagesChange,
    initialImages,
  });

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        addImages(files);
      }
      const input = event.target;
      setTimeout(() => {
        input.value = '';
      }, 0);
    },
    [addImages],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const files = Array.from(event.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        addImages(imageFiles);
      }
    },
    [addImages],
  );

  const handleImageDragStart = (event: React.DragEvent, index: number) => {
    event.dataTransfer.setData('text/plain', index.toString());
  };

  const handleImageDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    const dragIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);

    if (dragIndex !== dropIndex) {
      reorderImages(dragIndex, dropIndex);
    }
  };

  return (
    <section className={cn('space-y-4', className)}>
      <Card
        className={cn(
          'border-2 border-dashed transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400',
        )}
      >
        <CardContent
          className="flex flex-col items-center justify-center p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <Upload className="h-8 w-8 text-gray-600" />
          </div>

          <h3 className="mb-2 text-lg font-semibold">이미지를 업로드하세요</h3>

          <p className="mb-4 text-sm text-muted-foreground">
            {minImages}장 이상 {maxImages}장 이하의 이미지를 선택하거나
            드래그하세요
            <br />
            JPG, PNG, WebP 파일 (최대 10MB)
          </p>

          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <Button
            type="button"
            variant="outline"
            disabled={isUploading || images.length >= maxImages}
            className="cursor-pointer"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            이미지 선택
          </Button>

          <p className="mt-2 text-xs text-muted-foreground">
            현재 {images.length}/{maxImages}장
          </p>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
              <div className="space-y-1">
                {errors.map(error => (
                  <p key={error} className="text-sm text-destructive">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">업로드 중...</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {images.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium">선택된 이미지 ({images.length}장)</h4>
              <div className="space-x-2">
                {productId && (
                  <>
                    <Button
                      onClick={() => {
                        const hasNewImages = images.some(
                          img => !img.isExisting && !img.uploaded,
                        );
                        if (hasNewImages) {
                          uploadImages();
                        }
                      }}
                      disabled={
                        isUploading ||
                        images.length < minImages ||
                        !images.some(img => !img.isExisting && !img.uploaded)
                      }
                      size="sm"
                    >
                      {isUploading
                        ? '업로드 중...'
                        : images.some(img => !img.isExisting && !img.uploaded)
                          ? '새 이미지 업로드'
                          : '모든 이미지 업로드됨'}
                    </Button>
                    {images.some(img => !img.uploaded) &&
                      images.some(img => img.uploaded) && (
                        <Button
                          onClick={() => {
                            const failedImages = images.filter(
                              img => !img.uploaded,
                            );
                            if (failedImages.length > 0) {
                              uploadImages();
                            }
                          }}
                          disabled={isUploading}
                          variant="secondary"
                          size="sm"
                        >
                          실패한 이미지 재업로드
                        </Button>
                      )}
                  </>
                )}
                <Button
                  onClick={clearImages}
                  disabled={isUploading}
                  variant="outline"
                  size="sm"
                >
                  전체 삭제
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
                  draggable
                  onDragStart={e => handleImageDragStart(e, index)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => handleImageDrop(e, index)}
                >
                  <Image
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />

                  <div
                    className={cn(
                      'absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                      image.isExisting ? 'bg-blue-500' : 'bg-primary',
                    )}
                  >
                    {index + 1}
                  </div>

                  {image.isExisting && (
                    <div className="absolute left-2 top-8 rounded bg-blue-500 px-1 py-0.5 text-xs text-white">
                      기존
                    </div>
                  )}
                  {image.uploaded && (
                    <div className="absolute right-8 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                      ✓
                    </div>
                  )}
                  {image.uploaded === false && image.key && (
                    <div className="absolute right-8 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      ✗
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    disabled={isUploading}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity hover:bg-destructive/90 disabled:opacity-50 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-60">
                    <GripVertical className="h-4 w-4 text-white" />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              💡 이미지를 드래그하여 순서를 변경할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default ImageUpload;
