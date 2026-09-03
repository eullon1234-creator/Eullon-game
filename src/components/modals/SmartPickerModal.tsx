import React, { useState, useEffect } from 'react';
import { X, Dices, Play, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { GameCoverImage } from '../common/GameCoverImage';
import { timeToBeatService } from '../../services/timeToBeatService';

export const SmartPickerModal: React.FC = () => {
  const {
    isPickerModalOpen,
    setIsPickerModalOpen,
    games,
    quickChangeStatus,
    setSelectedGame,
    settings,
  } = useGame();

  const isDeathNote = settings.theme === 'death-note';
  const [pickedGame, setPickedGame] = useState<Game | null>(null);
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  const backlogGames = games.filter((g) => g.status === 'backlog');

  const eligibleGames = backlogGames.filter((g) => {
    if (durationFilter === 'all') return true;
    const hours = g.timeToBeat?.main || timeToBeatService.getTimeToBeat(g.title).main || 15;
    if (durationFilter === 'short') return hours <= 10;
    if (durationFilter === 'medium') return hours > 10 && hours <= 25;
    if (durationFilter === 'long') return hours > 25;
    return true;
  });

  const triggerPickerConfetti = () => {
    if (isDeathNote) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#e50914', '#991b1b', '#111115', '#f5f2eb'],
      });
    } else {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#00f2fe', '#9d4edd', '#10b981', '#f59e0b'],
      });
    }
  };

  const handleClose = () => {
    setIsPickerModalOpen(false);
    setPickedGame(null);
  };

  const handleSpin = (customPool?: Game[]) => {
    const pool = customPool || eligibleGames;
    if (pool.length === 0) {
      setPickedGame(null);
      return;
    }
    const randomChoice = pool[Math.floor(Math.random() * pool.length)];
    setPickedGame(randomChoice);
    triggerPickerConfetti();
  };

  useEffect(() => {
    if (isPickerModalOpen && backlogGames.length > 0) {
      handleSpin();
    }
  }, [isPickerModalOpen, durationFilter]);

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
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col p-6 text-center animate-scaleIn border ${
        isDeathNote 
          ? 'bg-death-900 border-death-crimson/40 shadow-[0_0_50px_rgba(229,9,20,0.25)]' 
          : 'bg-gamer-900 border-slate-700/80'
      }`}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
          isDeathNote
            ? 'bg-death-crimson/20 border border-death-crimson/50 text-death-crimson shadow-glow-crimson'
            : 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-glow-amber'
        }`}>
          {isDeathNote ? (
            <span className="text-2xl leading-none">🍎</span>
          ) : (
            <Dices className="w-6 h-6" />
          )}
        </div>

        <h3 className={`text-lg font-black text-white mb-1 ${isDeathNote ? 'font-deathnote text-2xl tracking-wider' : ''}`}>
          {isDeathNote ? 'Qual será o próximo jogo do caderno?' : 'O que eu vou jogar?'}
        </h3>
        <p className={`text-xs mb-3 ${isDeathNote ? 'text-death-smoke font-deathnote-sub italic' : 'text-slate-400'}`}>
          {isDeathNote 
            ? 'Escolhido aleatoriamente das páginas do seu Backlog' 
            : 'Sorteado aleatoriamente dos seus jogos em Quero Jogar'}
        </p>

        {/* Filtro Rápido de Duração no Sorteador */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
          {[
            { id: 'all', label: 'Qualquer Duração' },
            { id: 'short', label: '⚡ Rápido (< 10h)' },
            { id: 'medium', label: '🎯 Médio (10-25h)' },
            { id: 'long', label: '👑 Demorado (+25h)' },
          ].map((dur) => {
            const isSelected = durationFilter === dur.id;
            return (
              <button
                key={dur.id}
                type="button"
                onClick={() => setDurationFilter(dur.id as any)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                  isSelected
                    ? isDeathNote
                      ? 'bg-death-crimson border-death-crimson text-white shadow-glow-crimson'
                      : 'bg-neon-cyan/20 border-neon-cyan text-white shadow-glow-cyan'
                    : 'bg-gamer-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {dur.label}
              </button>
            );
          })}
        </div>

        {pickedGame ? (
          <div className="space-y-4">
            <div className={`w-36 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 bg-gamer-950 ${
              isDeathNote ? 'border-death-crimson/50 shadow-glow-crimson' : 'border-slate-700'
            }`}>
              <GameCoverImage src={pickedGame.coverUrl} alt={pickedGame.title} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className={`text-xs font-bold ${
                  isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'
                }`}>
                  {pickedGame.platform}
                </span>

                {/* Badge de Tempo Estimado */}
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-slate-300 bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded-md">
                  <Clock className="w-3 h-3 text-neon-cyan" />
                  ~{(pickedGame.timeToBeat?.main || timeToBeatService.getTimeToBeat(pickedGame.title).main)}h
                </span>
              </div>

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
                onClick={() => handleSpin()}
                className={`w-full sm:w-1/2 py-2.5 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                  isDeathNote
                    ? 'bg-death-850 hover:bg-death-800 text-death-parchment border-death-crimson/30 hover:border-death-crimson/60'
                    : 'bg-gamer-800 hover:bg-gamer-750 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                {isDeathNote ? <span className="text-sm">🎲</span> : <Dices className="w-4 h-4" />}
                {isDeathNote ? 'Sortear Outro' : 'Sortear Outro'}
              </button>

              <button
                type="button"
                onClick={() => handleStartPlaying(pickedGame)}
                className={`w-full sm:w-1/2 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  isDeathNote
                    ? 'bg-gradient-to-r from-death-crimson to-red-800 text-white shadow-glow-crimson hover:brightness-110'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-gamer-950 shadow-glow-emerald hover:brightness-110'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                {isDeathNote ? 'Iniciar no Caderno' : 'Começar a Jogar'}
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
