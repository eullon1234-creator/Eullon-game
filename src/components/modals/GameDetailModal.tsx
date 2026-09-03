import React, { useState, useEffect } from 'react';
import { X, Heart, Edit3, Trash2, Calendar, Star, Sparkles, Lightbulb, Zap, RefreshCw, Film, Play, ExternalLink } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameCoverImage } from '../common/GameCoverImage';
import { GameRatingBadge } from '../common/GameRatingBadge';
import { QuickStatusMenu } from '../games/QuickStatusMenu';
import { HowLongToBeatSection } from '../common/HowLongToBeatCard';
import { groqService, GameInsightResult } from '../../services/groqService';
import { trailerService, GameTrailer } from '../../services/trailerService';

export const GameDetailModal: React.FC = () => {
  const {
    selectedGame,
    setSelectedGame,
    setEditingGame,
    setIsAddModalOpen,
    quickToggleFavorite,
    quickChangeStatus,
    updateGame,
    deleteGame,
    settings,
  } = useGame();

  const isDeathNote = settings.theme === 'death-note';

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [aiInsights, setAiInsights] = useState<GameInsightResult | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailer, setTrailer] = useState<GameTrailer | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  // Reset insights e trailer ao mudar de jogo
  useEffect(() => {
    setAiInsights(null);
    setLoadingInsights(false);
    setShowTrailer(false);
    setTrailer(null);
    setLoadingTrailer(false);
  }, [selectedGame?.id]);

  const handleOpenTrailer = async () => {
    setShowTrailer(true);
    if (trailer || !selectedGame) return;

    setLoadingTrailer(true);
    try {
      const result = await trailerService.getGameTrailer(selectedGame.title, settings.rawgApiKey);
      setTrailer(result);
    } catch (err) {
      console.error('Erro ao buscar trailer:', err);
    } finally {
      setLoadingTrailer(false);
    }
  };

  const handleFetchInsights = async () => {
    if (!selectedGame || loadingInsights) return;
    setLoadingInsights(true);
    try {
      const data = await groqService.getGameInsights(selectedGame, settings.groqApiKey);
      setAiInsights(data);
    } catch (err) {
      console.error('Erro ao buscar insights da IA:', err);
    } finally {
      setLoadingInsights(false);
    }
  };

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
    setShowTrailer(false);
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

  const handleUpdateHoursPlayed = (newHours: number) => {
    if (!selectedGame) return;
    const updated = {
      ...selectedGame,
      hoursPlayed: newHours,
      updatedAt: new Date().toISOString(),
    };
    updateGame(selectedGame.id, { hoursPlayed: newHours });
    setSelectedGame(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto safe-top safe-bottom">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-gamer-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col animate-scale-in">
        {/* Banner with Game Cover Blurry Background */}
        <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-gamer-950 flex-shrink-0">
          <img
            src={selectedGame.coverUrl}
            alt=""
            className="w-full h-full object-cover blur-md opacity-30 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gamer-900 via-gamer-900/50 to-transparent" />

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
        <div className="p-4 sm:p-6 pt-12 space-y-5 overflow-y-auto flex-1">
          {/* HowLongToBeat Section */}
          <HowLongToBeatSection
            game={selectedGame}
            onUpdateHoursPlayed={handleUpdateHoursPlayed}
            isDeathNote={isDeathNote}
          />

          {/* AI Insights & Dicas Section (Groq) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDeathNote
              ? 'bg-death-950/60 border-red-950/80'
              : 'bg-gamer-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${
                  isDeathNote ? 'bg-death-crimson/20 text-death-crimson' : 'bg-neon-cyan/20 text-neon-cyan'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>Dicas & Análise da IA</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Groq ⚡
                    </span>
                  </h3>
                </div>
              </div>

              {aiInsights && (
                <button
                  type="button"
                  onClick={handleFetchInsights}
                  disabled={loadingInsights}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  title="Gerar novas dicas"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
                  <span className="text-[11px]">Atualizar</span>
                </button>
              )}
            </div>

            {!aiInsights && !loadingInsights ? (
              <button
                type="button"
                onClick={handleFetchInsights}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                  isDeathNote
                    ? 'bg-death-900 border-red-950 hover:border-death-crimson/60 text-death-parchment hover:text-white hover:shadow-glow-crimson'
                    : 'bg-gradient-to-r from-neon-cyan/15 to-purple-600/15 border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan hover:text-white shadow-glow-cyan'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Pedir Dicas & Análise para a IA</span>
              </button>
            ) : loadingInsights ? (
              <div className="py-6 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-neon-cyan">
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">Consultando a IA do Groq...</span>
              </div>
            ) : aiInsights ? (
              <div className="space-y-3 animate-fadeIn">
                {/* Dificuldade e Para quem é */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 font-semibold">
                    🎯 Dificuldade: <span className="text-amber-400 font-bold">{aiInsights.difficulty}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                    👥 <span className="text-slate-400">{aiInsights.forWho}</span>
                  </span>
                </div>

                {/* Veredito */}
                <p className="text-xs text-slate-300 italic border-l-2 border-neon-cyan/60 pl-2.5 py-0.5">
                  "{aiInsights.verdict}"
                </p>

                {/* 3 Dicas Práticas */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    💡 Dicas Essenciais para Começar:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {aiInsights.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-neon-cyan font-bold">›</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          {/* Trailer Oficial do Jogo (YouTube Embed) */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Trailer Oficial & Gameplay
                </span>
              </div>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedGame.title + ' official trailer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <span>Abrir no YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {!showTrailer ? (
              <button
                type="button"
                onClick={handleOpenTrailer}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600/20 to-amber-600/20 hover:from-rose-600/30 hover:to-amber-600/30 border border-rose-500/40 text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.15)] group"
              >
                <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span>Assistir Trailer Oficial em Tela Cheia</span>
              </button>
            ) : loadingTrailer ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-2 bg-slate-950/80 rounded-xl border border-slate-800">
                <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
                <p className="text-xs text-slate-400 font-medium">
                  Localizando trailer oficial em alta definição...
                </p>
              </div>
            ) : trailer?.videoId ? (
              <div className="space-y-2 animate-fadeIn">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-700 shadow-2xl">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${trailer.videoId}?autoplay=1&rel=0`}
                    title={trailer.title || `Trailer de ${selectedGame.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="line-clamp-1 text-[11px] text-slate-300" title={trailer.title}>
                    🎬 {trailer.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTrailer(false)}
                    className="text-[11px] text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-gamer-800 hover:bg-gamer-750 transition-colors shrink-0"
                  >
                    Fechar Vídeo
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-2.5 animate-fadeIn">
                <p className="text-xs text-slate-300">
                  Trailer disponível diretamente no canal oficial do YouTube.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedGame.title + ' official trailer')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Assistir no YouTube</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowTrailer(false)}
                    className="px-3 py-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-300 text-xs font-bold transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>

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
