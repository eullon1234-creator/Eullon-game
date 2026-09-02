import React, { useState } from 'react';
import { GameStatus } from '../types/game';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/games/GameCard';
import { EmptyState } from '../components/common/EmptyState';
import { STATUS_CONFIG } from '../data/defaultCategories';
import { Plus, LayoutGrid, List, Search, X } from 'lucide-react';

interface StatusFilteredViewProps {
  statusFilter?: GameStatus;
  isFavorites?: boolean;
}

export const StatusFilteredView: React.FC<StatusFilteredViewProps> = ({
  statusFilter,
  isFavorites = false,
}) => {
  const { games, setIsAddModalOpen, settings, updateSettings } = useGame();
  const [search, setSearch] = useState('');

  const targetGames = games.filter((g) => {
    if (isFavorites) return g.favorite;
    if (statusFilter) return g.status === statusFilter;
    return true;
  });

  const displayedGames = targetGames.filter((g) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      g.title.toLowerCase().includes(s) ||
      g.platform.toLowerCase().includes(s)
    );
  });

  const getHeaderInfo = () => {
    if (isFavorites) {
      return {
        title: 'Meus Favoritos',
        emoji: '❤️',
        subtitle: 'Os jogos que mais marcaram sua trajetória gamer.',
      };
    }
    if (statusFilter) {
      const conf = STATUS_CONFIG[statusFilter];
      return {
        title: conf.label,
        emoji: conf.emoji,
        subtitle: `Todos os seus jogos com status "${conf.label}".`,
      };
    }
    return { title: 'Jogos', emoji: '🎮', subtitle: '' };
  };

  const info = getHeaderInfo();

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{info.emoji}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {info.title}
            </h1>
            <span className="text-xs font-mono font-bold bg-gamer-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              {displayedGames.length}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {info.subtitle}
          </p>
        </div>

        {/* View mode toggle & Add */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-gamer-900 border border-slate-800">
            <button
              onClick={() => updateSettings({ viewMode: 'grid' })}
              className={`p-1.5 rounded-lg transition-colors ${
                settings.viewMode === 'grid'
                  ? 'bg-gamer-800 text-neon-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateSettings({ viewMode: 'list' })}
              className={`p-1.5 rounded-lg transition-colors ${
                settings.viewMode === 'list'
                  ? 'bg-gamer-800 text-neon-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Adicionar Jogo
          </button>
        </div>
      </div>

      {/* Quick Search */}
      {targetGames.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Buscar em ${info.title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-gamer-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-neon-cyan"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Games display */}
      {displayedGames.length > 0 ? (
        <div
          className={
            settings.viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
              : 'space-y-3'
          }
        >
          {displayedGames.map((game) => (
            <GameCard key={game.id} game={game} viewMode={settings.viewMode} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`Nenhum jogo em "${info.title}"`}
          description={
            search
              ? `Nenhum jogo encontrado para "${search}".`
              : `Você não possui nenhum jogo marcado como ${info.title.toLowerCase()} no momento.`
          }
          actionLabel="Adicionar Jogo"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}
    </div>
  );
};
