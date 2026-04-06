import { useEffect, useMemo, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getArticlePlaceholderImageUrl, toRenderableImageUrl } from '@/shared/utils/image';

interface ArticleImageProps {
  imageUrl?: string | null;
  imagePath?: string | null;
  alt: string;
  className: string;
  fallbackClassName?: string;
  fallbackLabelClassName?: string;
  fallbackLabel?: string;
  loading?: 'lazy' | 'eager';
}

export function ArticleImage({
  imageUrl,
  imagePath,
  alt,
  className,
  fallbackClassName = 'w-full h-full bg-[#F3F4F6] flex flex-col items-center justify-center text-[#9CA3AF]',
  fallbackLabelClassName = 'text-[11px] tracking-[-0.5px]',
  fallbackLabel = '이미지 없음',
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
    return (
      <div className={fallbackClassName}>
        <ImageOff className="w-5 h-5 mb-1" />
        <span className={fallbackLabelClassName}>{fallbackLabel}</span>
      </div>
    );
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
