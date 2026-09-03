import React, { useState, useEffect } from 'react';
import { X, Dices, Play, Sparkles, Clock, Bot, Zap, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Game } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { GameCoverImage } from '../common/GameCoverImage';
import { timeToBeatService } from '../../services/timeToBeatService';
import { groqService } from '../../services/groqService';

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
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

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
    setAiReasoning(null);
  };

  const handleSpin = (customPool?: Game[]) => {
    const pool = customPool || eligibleGames;
    setAiReasoning(null);
    if (pool.length === 0) {
      setPickedGame(null);
      return;
    }
    const randomChoice = pool[Math.floor(Math.random() * pool.length)];
    setPickedGame(randomChoice);
    triggerPickerConfetti();
  };

  const handleAIPick = async () => {
    if (eligibleGames.length === 0 || loadingAI) return;
    setLoadingAI(true);
    setAiReasoning(null);
    try {
      const completed = games.filter((g) => g.status === 'completed');
      const moodText = durationFilter === 'short' 
        ? 'Quero um jogo rápido e dinâmico (<10h) para zerar logo'
        : durationFilter === 'long'
          ? 'Quero uma jornada épica e demorada (+25h) para mergulhar fundo'
          : undefined;

      const result = await groqService.getSmartPickRecommendation(
        eligibleGames,
        completed,
        moodText,
        settings.groqApiKey
      );
      setPickedGame(result.game);
      setAiReasoning(result.reasoning);
      triggerPickerConfetti();
    } catch (err: any) {
      handleSpin();
    } finally {
      setLoadingAI(false);
    }
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

              {/* Justificativa da IA (quando gerada) */}
              {aiReasoning && (
                <div className={`mt-3 p-3 rounded-xl border text-left text-xs space-y-1 animate-fadeIn ${
                  isDeathNote 
                    ? 'bg-death-950/80 border-death-crimson/40 text-slate-300' 
                    : 'bg-gamer-950/80 border-neon-cyan/40 text-slate-200'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-neon-cyan text-[11px] uppercase tracking-wider">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Por que a IA escolheu este jogo:</span>
                  </div>
                  <p className="leading-relaxed italic">
                    "{aiReasoning}"
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              {/* Botão de Decisão Inteligente com IA */}
              <button
                type="button"
                disabled={loadingAI}
                onClick={handleAIPick}
                className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-2 shadow-sm ${
                  loadingAI
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    : isDeathNote
                      ? 'bg-purple-950/50 hover:bg-purple-900/70 border-purple-500/50 text-purple-200 hover:text-white'
                      : 'bg-gradient-to-r from-neon-cyan/20 via-purple-600/20 to-blue-600/20 hover:from-neon-cyan/30 hover:to-blue-600/30 border-neon-cyan/40 text-neon-cyan hover:text-white shadow-glow-cyan'
                }`}
              >
                {loadingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-neon-cyan" />
                    <span>Avaliando seu backlog com IA do Groq...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-neon-cyan" />
                    <span>Pedir para a IA Escolher o Ideal</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Groq ⚡
                    </span>
                  </>
                )}
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2">
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
                  <span>Sorteio Aleatório</span>
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
                  <span>{isDeathNote ? 'Iniciar no Caderno' : 'Começar a Jogar'}</span>
                </button>
              </div>
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
