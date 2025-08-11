// app/components/ArtikelImage.js
'use client'

import Image from 'next/image';
import { useState } from 'react';

export default function ArtikelImage({ src, alt, className = "" }) {
  const [imageError, setImageError] = useState(false);

  if (imageError || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">
          Gambar tidak tersedia
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImageError(true)}
    />
  );
}