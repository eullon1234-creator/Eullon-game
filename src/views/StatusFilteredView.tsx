import React, { useState } from 'react';
import { GameStatus } from '../types/game';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/games/GameCard';
import { EmptyState } from '../components/common/EmptyState';
import { STATUS_CONFIG } from '../data/defaultCategories';
import { Plus, LayoutGrid, List, Search, X, Clock } from 'lucide-react';
import { timeToBeatService } from '../services/timeToBeatService';

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
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long' | 'epic'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'time_asc' | 'time_desc' | 'rating_desc' | 'name_asc'>('recent');

  const targetGames = games.filter((g) => {
    if (isFavorites) return g.favorite;
    if (statusFilter) return g.status === statusFilter;
    return true;
  });

  const displayedGames = targetGames
    .filter((g) => {
      if (search.trim()) {
        const s = search.toLowerCase();
        const match = g.title.toLowerCase().includes(s) || g.platform.toLowerCase().includes(s);
        if (!match) return false;
      }

      if (durationFilter !== 'all') {
        const hours = g.timeToBeat?.main || timeToBeatService.getTimeToBeat(g.title).main || 15;
        if (durationFilter === 'short' && hours > 10) return false;
        if (durationFilter === 'medium' && (hours <= 10 || hours > 25)) return false;
        if (durationFilter === 'long' && (hours <= 25 || hours > 50)) return false;
        if (durationFilter === 'epic' && hours <= 50) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const getHours = (game: typeof a) => game.timeToBeat?.main || timeToBeatService.getTimeToBeat(game.title).main || 15;

      switch (sortBy) {
        case 'time_asc':
          return getHours(a) - getHours(b);
        case 'time_desc':
          return getHours(b) - getHours(a);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
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

      {/* Barra Rápida de Duração & Ordenação de Tempo */}
      {targetGames.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-gamer-900/80 border border-slate-800/90 shadow-sm">
          {/* Pills de Duração */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider mr-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-neon-cyan" />
              Tempo:
            </span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'short', label: '⚡ Rápido (< 10h)' },
              { id: 'medium', label: '🎯 Médio (10-25h)' },
              { id: 'long', label: '🛡️ Longo (25-50h)' },
              { id: 'epic', label: '👑 Demorado (+50h)' },
            ].map((dur) => {
              const isSelected = durationFilter === dur.id;
              return (
                <button
                  key={dur.id}
                  type="button"
                  onClick={() => setDurationFilter(dur.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-glow-cyan scale-102'
                      : 'bg-gamer-850/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-800'
                  }`}
                >
                  {dur.label}
                </button>
              );
            })}
          </div>

          {/* Botões Rápidos de Ordenação Mais Rápido / Mais Demorado */}
          <div className="flex items-center gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
            <button
              type="button"
              onClick={() => setSortBy((prev) => prev === 'time_asc' ? 'recent' : 'time_asc')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                sortBy === 'time_asc'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-cyan'
                  : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-800'
              }`}
              title="Ordenar pelos jogos mais rápidos primeiro (menor tempo de campanha)"
            >
              <span>⚡ Mais Rápido</span>
            </button>

            <button
              type="button"
              onClick={() => setSortBy((prev) => prev === 'time_desc' ? 'recent' : 'time_desc')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                sortBy === 'time_desc'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm'
                  : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-800'
              }`}
              title="Ordenar pelos jogos mais longos/demorados primeiro (maior tempo de campanha)"
            >
              <span>⏳ Mais Demorado</span>
            </button>
          </div>
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
