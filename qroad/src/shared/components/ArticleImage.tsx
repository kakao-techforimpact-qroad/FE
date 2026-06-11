import { useEffect, useMemo, useState } from 'react';
import { getArticlePlaceholderImageUrl, toRenderableImageUrl } from '@/shared/utils/image';

interface ArticleImageProps {
  imageUrl?: string | null;
  imagePath?: string | null;
  alt: string;
  className: string;
  loading?: 'lazy' | 'eager';
}

export function ArticleImage({
  imageUrl,
  imagePath,
  alt,
  className,
  loading = 'lazy',
}: ArticleImageProps) {
  const primarySrc = useMemo(() => {
    const rawUrl = imageUrl?.trim();
    if (rawUrl) return rawUrl;
    return toRenderableImageUrl(imagePath);
  }, [imagePath, imageUrl]);
  const placeholderSrc = useMemo(() => getArticlePlaceholderImageUrl(), []);
  const [src, setSrc] = useState<string | null>(primarySrc || placeholderSrc);

  useEffect(() => {
    setSrc(primarySrc || placeholderSrc);
  }, [primarySrc, placeholderSrc]);

  const handleError = () => {
    if (src !== placeholderSrc && placeholderSrc) {
      setSrc(placeholderSrc);
      return;
    }
    setSrc(null);
  };

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
