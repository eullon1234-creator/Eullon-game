import React from 'react';
import { Heart, Edit3, Trash2, BookOpen } from 'lucide-react';
import { Game } from '../../types/game';
import { GameCoverImage } from '../common/GameCoverImage';
import { GameRatingBadge } from '../common/GameRatingBadge';
import { QuickStatusMenu } from './QuickStatusMenu';
import { useGame } from '../../context/GameContext';

interface GameCardProps {
  game: Game;
  viewMode?: 'grid' | 'list';
  onDeleteClick?: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  viewMode = 'grid',
  onDeleteClick,
}) => {
  const {
    setSelectedGame,
    setEditingGame,
    setIsAddModalOpen,
    quickToggleFavorite,
    quickChangeStatus,
  } = useGame();

  const handleOpenDetail = () => {
    setSelectedGame(game);
  };

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGame(game);
    setIsAddModalOpen(true);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    quickToggleFavorite(game.id);
  };

  const getPlatformBadgeStyle = (platform: string) => {
    if (platform.includes('$') || platform.includes('Comprado')) {
      return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
    if (platform.includes('💀') || platform.includes('Craqueado')) {
      return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
    }
    return 'bg-gamer-900/80 text-slate-200 border-slate-700/50';
  };

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div
        onClick={handleOpenDetail}
        className="group relative flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-gamer-900/80 hover:bg-gamer-850 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-card"
      >
        <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
          <div className="w-14 h-18 sm:w-16 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden shadow">
            <GameCoverImage src={game.coverUrl} alt={game.title} aspectRatioClass="h-full" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors truncate">
              {game.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPlatformBadgeStyle(game.platform)}`}>
                {game.platform}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/60">
          {game.rating !== undefined && (
            <GameRatingBadge rating={game.rating} size="sm" />
          )}

          <QuickStatusMenu
            currentStatus={game.status}
            onSelect={(st) => quickChangeStatus(game.id, st)}
            size="sm"
          />

          <button
            type="button"
            onClick={handleToggleFav}
            className={`p-2 rounded-xl transition-all ${
              game.favorite ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
            }`}
            title={game.favorite ? 'Desfavoritar' : 'Favoritar'}
          >
            <Heart className={`w-4 h-4 ${game.favorite ? 'fill-current scale-110' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  // GRID / POSTER VIEW (Poster aspect-ratio 3:4)
  return (
    <div
      onClick={handleOpenDetail}
      className="group relative rounded-2xl bg-gamer-900/80 hover:bg-gamer-850 border border-slate-800/80 hover:border-slate-700/90 transition-all duration-300 cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-1.5 flex flex-col overflow-hidden"
    >
      {/* Cover with top badges and hover action overlay */}
      <div className="relative w-full aspect-game-cover overflow-hidden bg-gamer-950">
        <GameCoverImage
          src={game.coverUrl}
          alt={game.title}
          aspectRatioClass="w-full h-full"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <QuickStatusMenu
              currentStatus={game.status}
              onSelect={(st) => quickChangeStatus(game.id, st)}
              size="sm"
            />
          </div>

          <button
            type="button"
            onClick={handleToggleFav}
            className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
              game.favorite
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-gamer-950/70 text-slate-300 hover:text-rose-400 hover:bg-gamer-900'
            }`}
            title={game.favorite ? 'Desfavoritar' : 'Favoritar'}
          >
            <Heart className={`w-4 h-4 ${game.favorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Cover Gradient: Rating & Platform */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gamer-950 via-gamer-950/70 to-transparent p-3 pt-8 flex items-end justify-between z-10 pointer-events-none">
          <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md border ${getPlatformBadgeStyle(game.platform)}`}>
            {game.platform}
          </span>

          {game.rating !== undefined && (
            <GameRatingBadge rating={game.rating} size="sm" />
          )}
        </div>

        {/* Hover Overlay Desktop */}
        <div className="absolute inset-0 bg-gamer-950/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center gap-2 p-4 z-20 pointer-events-none group-hover:pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetail();
            }}
            className="w-full py-2 px-3 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold text-xs hover:bg-neon-cyan hover:text-gamer-950 transition-all flex items-center justify-center gap-1.5 shadow-glow-cyan"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Ver Detalhes
          </button>

          <div className="flex items-center gap-2 w-full mt-1">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="flex-1 py-1.5 px-2 rounded-lg bg-gamer-800 hover:bg-gamer-750 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1 border border-slate-700"
              title="Editar jogo"
            >
              <Edit3 className="w-3 h-3" />
              Editar
            </button>
            {onDeleteClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(game);
                }}
                className="p-1.5 rounded-lg bg-gamer-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs border border-slate-700"
                title="Excluir jogo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-gamer-900/40">
        <div>
          <h3 className="font-bold text-sm text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
            {game.title}
          </h3>
        </div>
      </div>
    </div>
  );
};
