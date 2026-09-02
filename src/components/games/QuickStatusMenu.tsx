import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { GameStatus } from '../../types/game';
import { STATUS_CONFIG } from '../../data/defaultCategories';
import { GameStatusBadge } from '../common/GameStatusBadge';

interface QuickStatusMenuProps {
  currentStatus: GameStatus;
  onSelect: (status: GameStatus) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const QuickStatusMenu: React.FC<QuickStatusMenuProps> = ({
  currentStatus,
  onSelect,
  className = '',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statuses: GameStatus[] = ['playing', 'completed', 'backlog', 'abandoned'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 group focus:outline-none"
        title="Alterar status rápido"
      >
        <GameStatusBadge status={currentStatus} size={size} />
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-1.5 w-44 rounded-2xl bg-gamer-900 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 p-1.5 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Mudar Status
          </div>
          {statuses.map((st) => {
            const conf = STATUS_CONFIG[st];
            const isSelected = st === currentStatus;
            return (
              <button
                key={st}
                type="button"
                onClick={() => {
                  onSelect(st);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-colors text-left ${
                  isSelected
                    ? 'bg-gamer-800 text-white font-bold'
                    : 'text-slate-300 hover:bg-gamer-850 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{conf.emoji}</span>
                  <span>{conf.label}</span>
                </div>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
