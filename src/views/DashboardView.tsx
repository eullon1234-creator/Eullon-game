import React from 'react';
import { 
  Gamepad2, CheckCircle2, BookMarked, XCircle, 
  Play, Plus, Dices, ChevronRight 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/games/GameCard';
import { EmptyState } from '../components/common/EmptyState';

export const DashboardView: React.FC = () => {
  const {
    games,
    setActiveTab,
    setIsAddModalOpen,
    setIsPickerModalOpen,
    settings,
  } = useGame();

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

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPickerModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            O que eu vou jogar?
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 font-black text-xs sm:text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Adicionar Jogo
          </button>
        </div>
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
