import React, { useState } from 'react';
import { 
  Gamepad2, CheckCircle2, BookMarked, XCircle, 
  Play, Plus, Dices, ChevronRight, Activity, RefreshCw, Sparkles, Compass, Shield
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/games/GameCard';
import { EmptyState } from '../components/common/EmptyState';
import { ArcReactor } from '../components/common/ArcReactor';
import { groqService, TacticalBriefingResult } from '../services/groqService';

export const DashboardView: React.FC = () => {
  const {
    games,
    setActiveTab,
    setIsAddModalOpen,
    setIsPickerModalOpen,
    setIsAIAssistantOpen,
    settings,
  } = useGame();

  const [tacticalBriefing, setTacticalBriefing] = useState<TacticalBriefingResult | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);

  const handleGenerateBriefing = async () => {
    if (loadingBriefing) return;
    setLoadingBriefing(true);
    try {
      const res = await groqService.getTacticalBriefing(games, settings.groqApiKey);
      setTacticalBriefing(res);
    } catch (err) {
      console.warn('Erro ao gerar briefing tático:', err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const playingGames = games.filter((g) => g.status === 'playing');
  const completedGames = games.filter((g) => g.status === 'completed');
  const backlogGames = games.filter((g) => g.status === 'backlog');
  const abandonedGames = games.filter((g) => g.status === 'abandoned');

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🎮</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Minha Biblioteca
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Todos os meus jogos em um só lugar.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsPickerModalOpen(true)}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm"
          >
            <Dices className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">O que jogar?</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 font-black text-xs sm:text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="truncate">Adicionar Jogo</span>
          </button>
        </div>
      </div>

      {/* Stark Industries • J.A.R.V.I.S. Tactical Briefing Banner */}
      <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-gamer-900/95 via-gamer-950/95 to-gamer-900/95 border border-cyan-500/30 shadow-[0_4px_30px_rgba(0,242,254,0.1)] backdrop-blur-xl">
        {/* Background circuit glow */}
        <div className="absolute top-0 right-0 w-80 h-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <ArcReactor size="lg" pulse={loadingBriefing} />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                  <span className="font-mono text-cyan-400">J.A.R.V.I.S.</span>
                  <span className="text-slate-300 font-sans font-bold">• Briefing Tático do Dia</span>
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xl">
                {tacticalBriefing 
                  ? tacticalBriefing.headline 
                  : "Sistemas em espera para o Senhor Eullon. Solicite uma varredura tática da sua biblioteca para definir a melhor rota de zeramento."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {!tacticalBriefing ? (
              <button
                type="button"
                disabled={loadingBriefing}
                onClick={handleGenerateBriefing}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-gamer-950 font-black text-xs sm:text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loadingBriefing ? 'animate-spin' : ''}`} />
                <span>{loadingBriefing ? 'Calculando Telemetria...' : 'Solicitar Briefing Tático'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={loadingBriefing}
                  onClick={handleGenerateBriefing}
                  className="p-2.5 rounded-2xl bg-gamer-850 hover:bg-gamer-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
                  title="Atualizar análise"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingBriefing ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-glow-cyan"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Falar com J.A.R.V.I.S.</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Relatório Exibido */}
        {tacticalBriefing && (
          <div className="mt-5 pt-4 border-t border-cyan-950/80 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-fadeIn">
            {/* Diagnóstico */}
            <div className="md:col-span-2 p-3.5 rounded-2xl bg-gamer-950/80 border border-cyan-900/40 space-y-2">
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">
                RELATÓRIO OPERACIONAL PARA O SENHOR EULLON:
              </span>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {tacticalBriefing.statusReport}
              </p>
              <div className="pt-1 flex items-center gap-2 text-cyan-300 italic font-mono text-[11px]">
                <span>💡 Conselho Tático:</span>
                <span className="text-slate-200 not-italic font-sans">"{tacticalBriefing.tacticalAdvice}"</span>
              </div>
            </div>

            {/* Missão do Dia Recomendada */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-gamer-950 to-blue-950/40 border border-cyan-500/30 flex flex-col justify-between space-y-2">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider block font-bold">
                  MISSÃO RECOMENDADA DE HOJE:
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  {tacticalBriefing.recommendedGame}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Estimativa backlog restante: ~{tacticalBriefing.estimatedHoursLeft}h
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAIAssistantOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Consultar Estratégia</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4 Big Status Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Jogando */}
        <div
          onClick={() => setActiveTab('playing')}
          className="p-5 rounded-3xl bg-gamer-900/80 hover:bg-gamer-850 border border-slate-800/80 hover:border-neon-cyan/50 transition-all cursor-pointer shadow-card group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Jogando
            </span>
            <div className="w-10 h-10 rounded-2xl bg-neon-cyan/15 flex items-center justify-center text-neon-cyan shadow-sm">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-white font-mono block">
            {playingGames.length}
          </span>
          <span className="text-[11px] text-neon-cyan font-semibold mt-1 block">
            Em andamento agora
          </span>
        </div>

        {/* Zerados */}
        <div
          onClick={() => setActiveTab('completed')}
          className="p-5 rounded-3xl bg-gamer-900/80 hover:bg-gamer-850 border border-slate-800/80 hover:border-emerald-500/50 transition-all cursor-pointer shadow-card group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Zerados
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono block">
            {completedGames.length}
          </span>
          <span className="text-[11px] text-emerald-300 font-semibold mt-1 block">
            Terminados com sucesso
          </span>
        </div>

        {/* Quero Jogar */}
        <div
          onClick={() => setActiveTab('backlog')}
          className="p-5 rounded-3xl bg-gamer-900/80 hover:bg-gamer-850 border border-slate-800/80 hover:border-purple-500/50 transition-all cursor-pointer shadow-card group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quero Jogar
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-300 shadow-sm">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-purple-300 font-mono block">
            {backlogGames.length}
          </span>
          <span className="text-[11px] text-purple-300 font-semibold mt-1 block">
            Aguardando na fila
          </span>
        </div>

        {/* Desisti */}
        <div
          onClick={() => setActiveTab('abandoned')}
          className="p-5 rounded-3xl bg-gamer-900/80 hover:bg-gamer-850 border border-slate-800/80 hover:border-rose-500/50 transition-all cursor-pointer shadow-card group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Desisti
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-400 shadow-sm">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-rose-400 font-mono block">
            {abandonedGames.length}
          </span>
          <span className="text-[11px] text-rose-300 font-semibold mt-1 block">
            Jogos abandonados
          </span>
        </div>
      </div>

      {/* Section 1: JOGANDO AGORA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Jogando Agora
            </h2>
            <span className="text-xs font-mono text-neon-cyan font-bold">
              ({playingGames.length})
            </span>
          </div>

          {playingGames.length > 0 && (
            <button
              onClick={() => setActiveTab('playing')}
              className="text-xs font-bold text-neon-cyan hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {playingGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {playingGames.map((game) => (
              <GameCard key={game.id} game={game} viewMode={settings.viewMode} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 rounded-2xl bg-gamer-900/40 border border-slate-800">
            Você não está jogando nenhum jogo no momento.
          </p>
        )}
      </div>

      {/* Section 2: MEU BACKLOG (QUERO JOGAR) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Meu Backlog (Quero Jogar)
            </h2>
            <span className="text-xs font-mono text-purple-300 font-bold">
              ({backlogGames.length})
            </span>
          </div>

          {backlogGames.length > 0 && (
            <button
              onClick={() => setActiveTab('backlog')}
              className="text-xs font-bold text-purple-300 hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {backlogGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {backlogGames.slice(0, 5).map((game) => (
              <GameCard key={game.id} game={game} viewMode={settings.viewMode} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 rounded-2xl bg-gamer-900/40 border border-slate-800">
            Nenhum jogo na lista de Quero Jogar.
          </p>
        )}
      </div>

      {/* Section 3: JÁ ZERADOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Jogos Zerados
            </h2>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              ({completedGames.length})
            </span>
          </div>

          {completedGames.length > 0 && (
            <button
              onClick={() => setActiveTab('completed')}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {completedGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {completedGames.slice(0, 5).map((game) => (
              <GameCard key={game.id} game={game} viewMode={settings.viewMode} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 rounded-2xl bg-gamer-900/40 border border-slate-800">
            Nenhum jogo zerado ainda.
          </p>
        )}
      </div>

      {/* Section 4: JOGOS QUE ABANDONEI */}
      {abandonedGames.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Jogos que Abandonei
              </h2>
              <span className="text-xs font-mono text-rose-400 font-bold">
                ({abandonedGames.length})
              </span>
            </div>

            <button
              onClick={() => setActiveTab('abandoned')}
              className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {abandonedGames.slice(0, 5).map((game) => (
              <GameCard key={game.id} game={game} viewMode={settings.viewMode} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
