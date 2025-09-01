/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */

export const getFileExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  return supportedExtensions.includes(ext) ? ext : 'jpg';
};

const getContentTypeFromExtension = (extension: string): string => {
  switch (extension.toLowerCase()) {
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

export const uploadFileToS3 = async (
  uploadUrl: string,
  file: File,
): Promise<boolean> => {
  try {
    const fileExtension = getFileExtension(file.name);
    const contentType = getContentTypeFromExtension(fileExtension);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (!response.ok) {
      console.error(`업로드 실패 (${response.status}):`, response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    return false;
  }
};

export const uploadMultipleFilesToS3 = async (
  uploads: Array<{ uploadUrl: string; file: File }>,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; results: boolean[] }> => {
  const results: boolean[] = [];
  let completedUploads = 0;

  try {
    for (const { uploadUrl, file } of uploads) {
      const success = await uploadFileToS3(uploadUrl, file);
      results.push(success);

      completedUploads++;
      if (onProgress) {
        onProgress((completedUploads / uploads.length) * 100);
      }
    }

    const allSuccess = results.every(result => result);
    return { success: allSuccess, results };
  } catch (error) {
    console.error('다중 파일 업로드 실패:', error);
    return { success: false, results };
  }
};

export const resizeImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('이미지 압축 실패'));
          }
        },
        file.type,
        quality,
      );
    };

    img.onerror = () => reject(new Error('이미지 로드 실패'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (
  file: File,
): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'JPG, PNG, WebP 파일만 업로드할 수 있습니다.',
    };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '파일 크기는 10MB 이하여야 합니다.',
    };
  }

  return { valid: true };
};
