import { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

export const BrandLogo = ({ className = 'h-8 w-auto', alt = 'QRoad Logo' }: BrandLogoProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center gap-2">
        <img src="/qr.svg" alt="QR icon" className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-[18px] sm:text-[20px] font-bold text-[#111827] tracking-[-0.5px]">QRoad</span>
      </div>
    );
  }

  return (
    <img
      src="/qroad-logo.png"
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
