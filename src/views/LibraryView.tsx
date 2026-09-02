import React, { useState } from 'react';
import { 
  Search, Filter, LayoutGrid, List, Plus, X, Heart, Sparkles 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/games/GameCard';
import { EmptyState } from '../components/common/EmptyState';
import { DEFAULT_PLATFORMS, STATUS_CONFIG } from '../data/defaultCategories';
import { GameStatus } from '../types/game';

export const LibraryView: React.FC = () => {
  const {
    filteredGames,
    filters,
    setFilters,
    resetFilters,
    setIsAddModalOpen,
    settings,
    updateSettings,
    games,
  } = useGame();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const statuses: { id: string; label: string; emoji: string }[] = [
    { id: 'all', label: 'Todos', emoji: '🎮' },
    { id: 'playing', label: 'Jogando', emoji: '🎮' },
    { id: 'completed', label: 'Zerados', emoji: '✅' },
    { id: 'backlog', label: 'Quero Jogar', emoji: '📚' },
    { id: 'abandoned', label: 'Desisti', emoji: '❌' },
  ];

  const activeFiltersCount = [
    filters.status !== 'all',
    filters.platform !== 'all',
    filters.favoriteOnly,
    filters.search.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Minha Biblioteca
            <span className="text-xs font-mono text-neon-cyan font-bold bg-neon-cyan/15 px-2.5 py-0.5 rounded-full border border-neon-cyan/30">
              {filteredGames.length} {filteredGames.length === 1 ? 'jogo' : 'jogos'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize, filtre e encontre qualquer jogo instantaneamente.
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
              title="Visualização em Grade (Pôsteres)"
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

      {/* Quick Search & Status Pills */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {statuses.map((st) => {
            const isSelected = filters.status === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setFilters((prev) => ({ ...prev, status: st.id }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-sm scale-102'
                    : 'bg-gamer-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-850'
                }`}
              >
                <span>{st.emoji}</span>
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input & Filters Drawer button */}
        <div className="flex items-center gap-2 flex-1 lg:max-w-md">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou plataforma..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-gamer-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-neon-cyan"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isFiltersOpen || activeFiltersCount > 0
                ? 'bg-gamer-800 border-neon-cyan/60 text-neon-cyan'
                : 'bg-gamer-900 border-slate-800 text-slate-300 hover:bg-gamer-850'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-neon-cyan text-gamer-950 text-[10px] font-black flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filters Drawer */}
      {isFiltersOpen && (
        <div className="p-4 rounded-2xl bg-gamer-900/90 border border-slate-800/90 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-neon-cyan" />
              Filtros Avançados
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-rose-400 hover:underline"
            >
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plataforma */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Plataforma
              </label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters((prev) => ({ ...prev, platform: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-neon-cyan"
              >
                <option value="all">Todas as Plataformas</option>
                {DEFAULT_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Ordenar Por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-neon-cyan"
              >
                <option value="recent">Mais Recentes</option>
                <option value="name_asc">Nome (A - Z)</option>
                <option value="name_desc">Nome (Z - A)</option>
                <option value="rating_desc">Maior Nota</option>
                <option value="rating_asc">Menor Nota</option>
                <option value="platform">Plataforma</option>
              </select>
            </div>
          </div>

          {/* Favoritos Checkbox */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.favoriteOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, favoriteOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-rose-500 accent-rose-500"
              />
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                Somente Favoritos
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Games List / Grid */}
      {filteredGames.length > 0 ? (
        <div
          className={
            settings.viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4'
              : 'space-y-3'
          }
        >
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} viewMode={settings.viewMode} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum jogo encontrado"
          description={
            games.length === 0
              ? 'Sua biblioteca ainda está vazia. Adicione o seu primeiro jogo!'
              : 'Nenhum jogo corresponde aos filtros selecionados.'
          }
          actionLabel={games.length === 0 ? 'Adicionar Primeiro Jogo' : 'Limpar Filtros'}
          onAction={games.length === 0 ? () => setIsAddModalOpen(true) : resetFilters}
        />
      )}

    </div>
  );
};
