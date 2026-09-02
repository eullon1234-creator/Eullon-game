import React, { ReactNode } from 'react';
import { LucideIcon, Gamepad2 } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon | string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  extraAction?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Gamepad2,
  title,
  description,
  actionLabel,
  onAction,
  extraAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-800 bg-gamer-900/40 backdrop-blur-sm max-w-lg mx-auto my-8 animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gamer-850 to-gamer-750 border border-slate-700/60 flex items-center justify-center mb-4 shadow-lg text-slate-400">
        {typeof Icon === 'string' ? (
          <span className="text-3xl">{Icon}</span>
        ) : (
          <Icon className="w-8 h-8 text-neon-cyan/80" />
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-2 tracking-wide">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center gap-3">
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 font-bold text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            {actionLabel}
          </button>
        )}
        {extraAction}
      </div>
    </div>
  );
};
