import { useState, useEffect } from 'react';

export const useBackgroundImage = (localPath, fallbackUrl) => {
  const [bgImage, setBgImage] = useState(fallbackUrl);

  useEffect(() => {
    if (!localPath) return;
    const img = new Image();
    img.src = localPath;
    img.onload = () => setBgImage(localPath);
    // If it fails (404), it naturally stays as fallbackUrl
  }, [localPath, fallbackUrl]);

  return bgImage;
};
