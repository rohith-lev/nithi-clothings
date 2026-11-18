/**
 * Client-side Image Compression Helper for Nithi Collection Admin
 * Resizes large camera photos to maximum 1600px and compresses to lightweight JPEG/WebP.
 * Prevents Vercel 4.5MB payload limit errors and ensures fast, reliable uploads.
 */

export async function compressImageClient(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<File> {
  if (
    typeof window === "undefined" ||
    !file.type.startsWith("image/") ||
    file.type.includes("svg") ||
    file.type.includes("gif")
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // If image is already smaller than maxDimension and less than 1MB, skip re-encoding
      if (width <= maxDimension && height <= maxDimension && file.size < 1024 * 1024) {
        resolve(file);
        return;
      }

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // Smooth downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
          } else {
            const cleanExt = mimeType === "image/png" ? ".png" : ".jpg";
            const originalBase = file.name.replace(/\.[^/.]+$/, "");
            const newName = `${originalBase}${cleanExt}`;
            const compressedFile = new File([blob], newName, {
              type: mimeType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

