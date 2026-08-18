/**
 * Client-side image compression utility.
 * Resizes and converts images to WebP format via HTML5 Canvas (<150 KB target).
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1080,
    maxHeight = 1080,
    quality = 0.75,
    format = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      return reject(new Error('Invalid file object provided.'));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Preserve aspect ratio within bounding box
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(event.target.result);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL(format, quality);

        resolve(compressedDataUrl);
      };

      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Alias for ProviderDashboard
export const compressListingImage = compressImage;

// Batch compressor
export async function compressMultipleImages(files, options = {}) {
  return Promise.all(Array.from(files).map((file) => compressImage(file, options)));
}

export default compressImage;