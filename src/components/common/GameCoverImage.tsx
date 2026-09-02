import React, { useState } from 'react';
import { Gamepad2, ImageOff } from 'lucide-react';

interface GameCoverImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}

export const GameCoverImage: React.FC<GameCoverImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[3/4]',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // If no URL provided or error loading
  if (!src || error) {
    return (
      <div
        className={`relative w-full ${aspectRatioClass} bg-gradient-to-br from-gamer-850 via-gamer-800 to-gamer-900 flex flex-col items-center justify-center p-4 text-center border border-slate-800/80 rounded-xl overflow-hidden ${className}`}
      >
        <div className="w-12 h-12 rounded-2xl bg-gamer-750/80 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-2 shadow-inner">
          {error ? <ImageOff className="w-6 h-6 text-slate-500" /> : <Gamepad2 className="w-6 h-6 text-neon-cyan/70" />}
        </div>
        <p className="text-xs font-semibold text-slate-300 line-clamp-2 px-1">
          {alt}
        </p>
        <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
          {error ? 'Capa indisponível' : 'Sem Capa'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-xl bg-gamer-900 border border-slate-800/60 ${className}`}>
      {/* Skeleton loader */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gamer-850 via-gamer-800 to-gamer-850 animate-pulse flex items-center justify-center">
          <Gamepad2 className="w-8 h-8 text-slate-700 animate-bounce" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
};
