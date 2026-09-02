import React, { useState, useEffect } from 'react';
import { X, Dices, Play, Sparkles } from 'lucide-react';
import { Game } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { GameCoverImage } from '../common/GameCoverImage';

export const SmartPickerModal: React.FC = () => {
  const {
    isPickerModalOpen,
    setIsPickerModalOpen,
    games,
    quickChangeStatus,
    setSelectedGame,
  } = useGame();

  const [pickedGame, setPickedGame] = useState<Game | null>(null);

  const backlogGames = games.filter((g) => g.status === 'backlog');

  const handleClose = () => {
    setIsPickerModalOpen(false);
    setPickedGame(null);
  };

  const handleSpin = () => {
    if (backlogGames.length === 0) return;
    const randomChoice = backlogGames[Math.floor(Math.random() * backlogGames.length)];
    setPickedGame(randomChoice);
  };

  useEffect(() => {
    if (isPickerModalOpen && backlogGames.length > 0 && !pickedGame) {
      handleSpin();
    }
  }, [isPickerModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isPickerModalOpen) return null;

  const handleStartPlaying = (game: Game) => {
    quickChangeStatus(game.id, 'playing');
    setSelectedGame(game);
    handleClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-gamer-900 border border-slate-700/80 shadow-2xl overflow-hidden my-6 flex flex-col p-6 text-center animate-scaleIn">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-glow-amber">
          <Dices className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-white mb-1">
          O que eu vou jogar?
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Sorteado aleatoriamente dos seus jogos em <strong>Quero Jogar</strong>
        </p>

        {pickedGame ? (
          <div className="space-y-4">
            <div className="w-36 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-gamer-950">
              <GameCoverImage src={pickedGame.coverUrl} alt={pickedGame.title} />
            </div>

            <div>
              <span className="text-xs font-bold text-neon-cyan block mb-1">
                {pickedGame.platform}
              </span>
              <h4 className="text-xl font-black text-white">
                {pickedGame.title}
              </h4>
              {pickedGame.notes && (
                <p className="text-xs text-slate-400 italic mt-1 line-clamp-2">
                  "{pickedGame.notes}"
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSpin}
                className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <Dices className="w-4 h-4" />
                Sortear Outro
              </button>

              <button
                type="button"
                onClick={() => handleStartPlaying(pickedGame)}
                className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-gamer-950 font-black text-xs shadow-glow-emerald hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                Começar a Jogar
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-3">
            <p className="text-xs text-slate-400">
              Você não possui nenhum jogo marcado como "Quero Jogar" no momento.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-gamer-800 text-slate-300 text-xs font-bold"
            >
              Fechar
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
