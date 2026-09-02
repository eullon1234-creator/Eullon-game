import React from 'react';
import { Star } from 'lucide-react';

interface GameRatingBadgeProps {
  rating?: number;
  showClassification?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function getRatingClassification(rating: number): { label: string; color: string; bg: string; border: string } {
  if (rating >= 9.0) {
    return { label: 'Excelente', color: 'text-amber-300', bg: 'bg-amber-500/20', border: 'border-amber-500/40' };
  }
  if (rating >= 8.0) {
    return { label: 'Muito bom', color: 'text-emerald-300', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' };
  }
  if (rating >= 7.0) {
    return { label: 'Bom', color: 'text-cyan-300', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' };
  }
  if (rating >= 6.0) {
    return { label: 'Mediano', color: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' };
  }
  if (rating >= 5.0) {
    return { label: 'Fraco', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/40' };
  }
  return { label: 'Ruim', color: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40' };
}

export const GameRatingBadge: React.FC<GameRatingBadgeProps> = ({
  rating,
  showClassification = false,
  size = 'md',
  className = '',
}) => {
  if (rating === undefined || rating === null) {
    return (
      <span className="text-[11px] text-slate-500 italic">
        Sem nota
      </span>
    );
  }

  const { label, color, bg, border } = getRatingClassification(rating);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-base px-3 py-1.5 gap-2 font-bold',
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center rounded-lg border backdrop-blur-md shadow-sm ${bg} ${border} ${color} ${sizeClasses[size]}`}
      >
        <Star className={`${starSizes[size]} fill-current`} />
        <span>{rating.toFixed(1)}</span>
      </span>
      {showClassification && (
        <span className={`text-xs font-medium ${color}`}>
          {label}
        </span>
      )}
    </div>
  );
};
