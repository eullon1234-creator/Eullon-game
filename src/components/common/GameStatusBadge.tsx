import React from 'react';
import { GameStatus } from '../../types/game';
import { STATUS_CONFIG } from '../../data/defaultCategories';

interface GameStatusBadgeProps {
  status: GameStatus;
  size?: 'sm' | 'md' | 'lg';
  showEmoji?: boolean;
  className?: string;
}

export const GameStatusBadge: React.FC<GameStatusBadgeProps> = ({
  status,
  size = 'md',
  showEmoji = true,
  className = '',
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.backlog;

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm backdrop-blur-md transition-all duration-200 ${config.badgeBg} ${sizeStyles[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
      {showEmoji && <span>{config.emoji}</span>}
      <span>{config.label}</span>
    </span>
  );
};
