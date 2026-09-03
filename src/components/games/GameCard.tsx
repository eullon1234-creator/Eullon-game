import React from 'react';
import { Heart, Edit3, Trash2, BookOpen, Clock } from 'lucide-react';
import { Game } from '../../types/game';
import { GameCoverImage } from '../common/GameCoverImage';
import { GameRatingBadge } from '../common/GameRatingBadge';
import { QuickStatusMenu } from './QuickStatusMenu';
import { useGame } from '../../context/GameContext';
import { timeToBeatService } from '../../services/timeToBeatService';

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

  const time = game.timeToBeat || timeToBeatService.getTimeToBeat(game.title);

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
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md border ${getPlatformBadgeStyle(game.platform)}`}>
                {game.platform}
              </span>

              {time.main && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md" title="Tempo estimado para zerar">
                  <Clock className="w-3 h-3 text-neon-cyan" />
                  {game.hoursPlayed ? `${game.hoursPlayed}h / ~${time.main}h` : `~${time.main}h`}
                </span>
              )}
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

  // GRID VIEW (POSTER)
  return (
    <div
      onClick={handleOpenDetail}
      className="group relative flex flex-col rounded-2xl bg-gamer-900 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm hover:shadow-card hover:-translate-y-1"
    >
      {/* Aspect Poster 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gamer-950">
        <GameCoverImage src={game.coverUrl} alt={game.title} />

        {/* Top Floating Badges */}
        <div className="absolute inset-x-0 top-0 p-2.5 flex items-center justify-between z-10 pointer-events-none">
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

        {/* Bottom Cover Gradient: Rating & Platform & Time */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gamer-950 via-gamer-950/85 to-transparent p-2 sm:p-3 pt-6 flex items-end justify-between gap-1 z-10 pointer-events-none">
          <div className="flex flex-col gap-1 items-start min-w-0 flex-1">
            <span className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md backdrop-blur-md border max-w-[100px] sm:max-w-none truncate ${getPlatformBadgeStyle(game.platform)}`}>
              {game.platform}
            </span>
            {time.main && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono font-bold text-slate-200 bg-black/70 backdrop-blur-md border border-slate-700/60 px-1.5 py-0.5 rounded" title="Tempo estimado para zerar">
                <Clock className="w-2.5 h-2.5 text-neon-cyan shrink-0" />
                <span className="truncate">{game.hoursPlayed ? `${game.hoursPlayed}h / ~${time.main}h` : `~${time.main}h`}</span>
              </span>
            )}
          </div>

          {game.rating !== undefined && (
            <div className="shrink-0">
              <GameRatingBadge rating={game.rating} size="sm" />
            </div>
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
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between bg-gamer-900/40">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
            {game.title}
          </h3>
        </div>
      </div>
    </div>
  );
};
