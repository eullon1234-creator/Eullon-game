import React, { useState, useEffect } from 'react';
import { X, Heart, Edit3, Trash2, Calendar, Star, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameCoverImage } from '../common/GameCoverImage';
import { GameRatingBadge } from '../common/GameRatingBadge';
import { QuickStatusMenu } from '../games/QuickStatusMenu';

export const GameDetailModal: React.FC = () => {
  const {
    selectedGame,
    setSelectedGame,
    setEditingGame,
    setIsAddModalOpen,
    quickToggleFavorite,
    quickChangeStatus,
    deleteGame,
  } = useGame();

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!selectedGame) return null;

  const handleClose = () => {
    setSelectedGame(null);
    setConfirmDelete(false);
  };

  const handleEdit = () => {
    setEditingGame(selectedGame);
    setIsAddModalOpen(true);
    setSelectedGame(null);
  };

  const handleDelete = () => {
    deleteGame(selectedGame.id);
    handleClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-gamer-900 border border-slate-700/80 shadow-2xl overflow-hidden my-6 flex flex-col">
        
        {/* Banner with blur backdrop */}
        <div className="relative h-44 w-full overflow-hidden bg-gamer-950">
          <img
            src={selectedGame.coverUrl}
            alt=""
            className="w-full h-full object-cover blur-2xl opacity-25 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gamer-900 via-gamer-900/60 to-transparent" />

          {/* Top action buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={() => quickToggleFavorite(selectedGame.id)}
              className={`p-2.5 rounded-2xl backdrop-blur-md border transition-all ${
                selectedGame.favorite
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-gamer-900/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={selectedGame.favorite ? 'Desfavoritar' : 'Favoritar'}
            >
              <Heart className={`w-5 h-5 ${selectedGame.favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleEdit}
              className="p-2.5 rounded-2xl bg-gamer-900/80 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md hover:bg-gamer-800 transition-colors"
              title="Editar jogo"
            >
              <Edit3 className="w-5 h-5" />
            </button>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-2xl bg-gamer-900/80 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title and quick info */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-5 z-10">
            <div className="w-24 sm:w-28 flex-shrink-0 -mb-10 shadow-2xl rounded-2xl overflow-hidden border-2 border-slate-700 bg-gamer-950">
              <GameCoverImage src={selectedGame.coverUrl} alt={selectedGame.title} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <QuickStatusMenu
                  currentStatus={selectedGame.status}
                  onSelect={(st) => quickChangeStatus(selectedGame.id, st)}
                />
                {selectedGame.rating !== undefined && (
                  <GameRatingBadge rating={selectedGame.rating} size="sm" />
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate drop-shadow-md">
                {selectedGame.title}
              </h1>

              <p className="text-xs text-slate-400 mt-0.5">
                {selectedGame.platform}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-12 space-y-5">
          {/* Notes Section */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Observações
            </span>
            {selectedGame.notes ? (
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedGame.notes}
              </p>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Nenhuma observação informada. Clique em Editar para adicionar!
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-gamer-950/80 flex items-center justify-between">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Excluir Jogo
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-300 font-semibold">Excluir este jogo?</span>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 rounded-lg bg-gamer-800 text-slate-300 text-xs hover:text-white"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleEdit}
              className="px-4 py-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-neon-cyan text-gamer-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
