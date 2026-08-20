/**
 * Compresses an image File/Blob to a binary WebP/JPEG Blob using Canvas.
 * Always resolves to a valid binary Blob (never a base64 string).
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    format = 'image/webp',
  } = options;

  if (!file || !(file instanceof Blob)) {
    return file;
  }

  return new Promise((resolve) => {
    if (typeof window.createImageBitmap === 'function') {
      createImageBitmap(file)
        .then((bitmap) => {
          let { width, height } = bitmap;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            bitmap.close();
            return resolve(file);
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(bitmap, 0, 0, width, height);
          bitmap.close();

          canvas.toBlob(
            (blob) => {
              if (blob && blob.size > 0) {
                resolve(blob.size > file.size ? file : blob);
              } else {
                canvas.toBlob(
                  (jpegBlob) => resolve(jpegBlob || file),
                  'image/jpeg',
                  quality
                );
              }
            },
            format,
            quality
          );
        })
        .catch(() => {
          useImageElementFallback(file, maxWidth, maxHeight, quality, format, resolve);
        });
    } else {
      useImageElementFallback(file, maxWidth, maxHeight, quality, format, resolve);
    }
  });
}

function useImageElementFallback(file, maxWidth, maxHeight, quality, format, resolve) {
  const img = new Image();
  const url = URL.createObjectURL(file);

  img.onload = () => {
    URL.revokeObjectURL(url);
    let { width, height } = img;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return resolve(file);
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob && blob.size > 0) {
          resolve(blob);
        } else {
          canvas.toBlob(
            (jpegBlob) => resolve(jpegBlob || file),
            'image/jpeg',
            quality
          );
        }
      },
      format,
      quality
    );
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    resolve(file);
  };

  img.src = url;
}

// Named alias export for ProviderDashboard.jsx compatibility
export const compressListingImage = compressImage;

export default compressImage;