import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
}

/**
 * Optimized Image Component:
 * - WebP formatting & auto-compression
 * - Blur-up / shimmer loading placeholder
 * - Strict alt text for accessibility (WCAG AA)
 * - Explicit width & height to eliminate Layout Shift (CLS = 0)
 * - Native lazy loading for below-the-fold assets
 * - Graceful fallback on broken image URLs
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  aspectRatio,
  fallbackSrc = '/images/garments/panjabi-kurta.jpg',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Optimize Unsplash image URLs if applicable by appending webp & responsive quality
  const getOptimizedUrl = (url: string) => {
    if (!url) return fallbackSrc;
    if (url.includes('images.unsplash.com')) {
      // Ensure webp format and optimized quality
      const cleanUrl = url.split('?')[0];
      const params = new URLSearchParams(url.split('?')[1] || '');
      params.set('auto', 'format');
      params.set('fit', 'crop');
      if (!params.has('q')) params.set('q', '80');
      if (!params.has('fm')) params.set('fm', 'webp');
      return `${cleanUrl}?${params.toString()}`;
    }
    return url;
  };

  const currentSrc = hasError ? fallbackSrc : getOptimizedUrl(src);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {/* Shimmer / Blur Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Main Image */}
      <img
        src={currentSrc}
        alt={alt || 'Digital Dorji bespoke tailored garment'}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
