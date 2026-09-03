import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Search, Plus, Check, BookMarked, PlayCircle, 
  CheckCircle2, Filter, Layers, ArrowRight, Star, Clock
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CATALOG_CATEGORIES, CURATED_GAMES, CuratedGame } from '../data/curatedGames';
import { GameCoverImage } from '../components/common/GameCoverImage';
import { GameStatus } from '../types/game';
import { useToast } from '../context/ToastContext';
import { timeToBeatService } from '../services/timeToBeatService';

export const CatalogView: React.FC = () => {
  const { games, addGame, settings, setActiveTab } = useGame();
  const { showToast } = useToast();
  const isDeathNote = settings.theme === 'death-note';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long' | 'epic'>('all');
  const [catalogSort, setCatalogSort] = useState<'default' | 'time_asc' | 'time_desc' | 'rating_desc' | 'name_asc' | 'year_desc'>('default');

  // Mapeia títulos existentes na biblioteca para checar se o jogo já foi adicionado
  const existingGamesMap = useMemo(() => {
    const map = new Map<string, GameStatus>();
    games.forEach((g) => {
      map.set(g.title.trim().toLowerCase(), g.status);
    });
    return map;
  }, [games]);

  // Filtra os jogos pela categoria, busca, duração estimada e ordenação
  const filteredGames = useMemo(() => {
    return CURATED_GAMES.filter((game) => {
      const matchCategory = selectedCategory === 'all' || 
        (Array.isArray(game.category) ? game.category.includes(selectedCategory) : game.category === selectedCategory);
      const matchSearch = !searchQuery.trim() || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchCategory || !matchSearch) return false;

      // Filtro de duração (HowLongToBeat)
      if (durationFilter !== 'all') {
        const hours = game.timeToBeat?.main || timeToBeatService.getTimeToBeat(game.title, game.category).main || 15;
        if (durationFilter === 'short' && hours > 10) return false;
        if (durationFilter === 'medium' && (hours <= 10 || hours > 25)) return false;
        if (durationFilter === 'long' && (hours <= 25 || hours > 50)) return false;
        if (durationFilter === 'epic' && hours <= 50) return false;
      }

      return true;
    }).sort((a, b) => {
      const getHours = (g: CuratedGame) => g.timeToBeat?.main || timeToBeatService.getTimeToBeat(g.title, g.category).main || 15;

      switch (catalogSort) {
        case 'time_asc':
          return getHours(a) - getHours(b);
        case 'time_desc':
          return getHours(b) - getHours(a);
        case 'rating_desc':
          return b.rating - a.rating;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'year_desc':
          return b.year - a.year;
        case 'default':
        default:
          return 0;
      }
    });
  }, [selectedCategory, searchQuery, durationFilter, catalogSort]);

  // Adiciona um jogo individual
  const handleAddSingleGame = (item: CuratedGame, status: GameStatus = 'backlog') => {
    const timeToBeat = item.timeToBeat || timeToBeatService.getTimeToBeat(item.title, item.category);
    addGame({
      title: item.title,
      coverUrl: item.coverUrl,
      platform: item.platform,
      status,
      rating: item.rating,
      favorite: false,
      timeToBeat,
      notes: item.description,
    });
    showToast(
      status === 'completed' ? 'Adicionado como Zerado! ✅' : 'Adicionado ao Backlog! 📚',
      item.title,
      'success'
    );
  };

  // Seleção múltipla (checkbox)
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Jogos da visualização atual que ainda não estão na biblioteca
  const unaddedFilteredGames = useMemo(() => {
    return filteredGames.filter((g) => !existingGamesMap.has(g.title.trim().toLowerCase()));
  }, [filteredGames, existingGamesMap]);

  const allFilteredSelected = unaddedFilteredGames.length > 0 && 
    unaddedFilteredGames.every((g) => selectedIds.has(g.id));

  const toggleSelectAllFiltered = () => {
    const next = new Set(selectedIds);
    if (allFilteredSelected) {
      unaddedFilteredGames.forEach((g) => next.delete(g.id));
    } else {
      unaddedFilteredGames.forEach((g) => next.add(g.id));
    }
    setSelectedIds(next);
  };

  // Adiciona todos os selecionados ao backlog ou zerados
  const handleAddBatch = (status: GameStatus = 'backlog') => {
    const toAdd = CURATED_GAMES.filter((g) => selectedIds.has(g.id));
    let addedCount = 0;

    toAdd.forEach((item) => {
      const isAlreadyAdded = existingGamesMap.has(item.title.trim().toLowerCase());
      if (!isAlreadyAdded) {
        const timeToBeat = item.timeToBeat || timeToBeatService.getTimeToBeat(item.title, item.category);
        addGame({
          title: item.title,
          coverUrl: item.coverUrl,
          platform: item.platform,
          status,
          rating: item.rating,
          favorite: false,
          timeToBeat,
          notes: item.description,
        });
        addedCount++;
      }
    });

    setSelectedIds(new Set());
    showToast(
      `${addedCount} jogo(s) adicionado(s) com sucesso!`,
      undefined,
      'success'
    );
  };

  const statusLabel = (st: GameStatus) => {
    switch (st) {
      case 'playing': return 'Jogando';
      case 'completed': return 'Zerado';
      case 'backlog': return 'No Backlog';
      case 'abandoned': return 'Desistiu';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* 1. Header com Título e Estatísticas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-black text-white tracking-tight ${
              isDeathNote ? 'font-deathnote text-3xl sm:text-4xl' : ''
            }`}>
              {isDeathNote ? 'Grimório de Jogos • Escolha os Alvos' : 'Catálogo & Descoberta'}
            </h1>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              isDeathNote 
                ? 'bg-death-crimson/20 text-death-crimson border-death-crimson/40' 
                : 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40'
            }`}>
              {CURATED_GAMES.length} Obras-Primas
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDeathNote ? 'text-death-smoke font-deathnote-sub italic' : 'text-slate-400'}`}>
            {isDeathNote 
              ? 'Consulte os maiores clássicos separados por gênero e registre-os diretamente no seu caderno.' 
              : 'Navegue pelos maiores sucessos organizados por gênero e monte sua biblioteca em 1 clique.'}
          </p>
        </div>

        {/* Ações em lote e Seleção Rápida */}
        <div className="flex flex-wrap items-center gap-2">
          {unaddedFilteredGames.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectAllFiltered}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                allFilteredSelected
                  ? isDeathNote
                    ? 'bg-death-crimson/20 border-death-crimson text-death-crimson shadow-glow-crimson'
                    : 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-cyan'
                  : isDeathNote
                    ? 'bg-death-900 border-red-950/80 text-death-smoke hover:text-white hover:border-death-crimson/50'
                    : 'bg-gamer-850 border-slate-700 text-slate-300 hover:text-white hover:bg-gamer-800'
              }`}
              title={allFilteredSelected ? 'Desmarcar todos os jogos desta categoria' : 'Selecionar todos os jogos disponíveis nesta categoria'}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>
                {allFilteredSelected 
                  ? 'Desmarcar Todos' 
                  : `Selecionar Todos (${unaddedFilteredGames.length})`}
              </span>
            </button>
          )}

          {selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 animate-scaleIn">
              <span className="text-xs text-slate-300 font-semibold px-1">
                {selectedIds.size} selecionado(s)
              </span>
              <button
                type="button"
                onClick={() => handleAddBatch('backlog')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                  isDeathNote 
                    ? 'bg-death-crimson text-white shadow-glow-crimson hover:brightness-110' 
                    : 'bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 shadow-glow-cyan hover:brightness-110'
                }`}
                title="Adicionar selecionados ao Backlog"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Adicionar ao Backlog</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBatch('completed')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-400"
                title="Adicionar selecionados como Zerados"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>Marcar Zerado</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="p-2 rounded-xl bg-gamer-850 border border-slate-700 text-slate-400 hover:text-white text-xs"
                title="Limpar seleção"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Barra de Busca e Categorias */}
      <div className="space-y-3">
        {/* Barra de Busca rápida */}
        <div className="relative max-w-md">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'
          }`} />
          <input
            type="text"
            placeholder="Buscar por nome ou tema dentro do catálogo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs text-white placeholder-slate-500 focus:outline-none ${
              isDeathNote
                ? 'bg-death-900 border-red-950/80 focus:border-death-crimson'
                : 'bg-gamer-900 border-slate-800 focus:border-neon-cyan'
            }`}
          />
        </div>

        {/* Pílulas de Categorias */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATALOG_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? CURATED_GAMES.length 
              : CURATED_GAMES.filter((g) => 
                  Array.isArray(g.category) ? g.category.includes(cat.id) : g.category === cat.id
                ).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? isDeathNote
                      ? 'bg-death-crimson text-white border-death-crimson shadow-glow-crimson'
                      : 'bg-neon-cyan/20 border-neon-cyan text-white shadow-glow-cyan'
                    : isDeathNote
                      ? 'bg-death-900/90 border-red-950/70 text-death-smoke hover:text-white hover:border-death-crimson/40'
                      : 'bg-gamer-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected 
                    ? isDeathNote ? 'bg-black/30 text-white' : 'bg-neon-cyan/30 text-neon-cyan' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de Filtro de Tempo & Ordenação de Duração */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-gamer-900/80 border border-slate-800/90 shadow-sm">
        {/* Pills de Duração */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider mr-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-neon-cyan" />
            Duração:
          </span>
          {[
            { id: 'all', label: 'Todas as Durações' },
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
                    ? isDeathNote
                      ? 'bg-death-crimson border-death-crimson text-white shadow-glow-crimson scale-102'
                      : 'bg-neon-cyan/20 border-neon-cyan text-white shadow-glow-cyan scale-102'
                    : 'bg-gamer-850/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-800'
                }`}
              >
                {dur.label}
              </button>
            );
          })}
        </div>

        {/* Ordenação por Velocidade / Tempo */}
        <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
          <button
            type="button"
            onClick={() => setCatalogSort((prev) => prev === 'time_asc' ? 'default' : 'time_asc')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              catalogSort === 'time_asc'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-cyan'
                : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-800'
            }`}
            title="Ordenar pelos jogos mais rápidos primeiro (menor tempo de campanha)"
          >
            <span>⚡ Mais Rápido</span>
          </button>

          <button
            type="button"
            onClick={() => setCatalogSort((prev) => prev === 'time_desc' ? 'default' : 'time_desc')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
              catalogSort === 'time_desc'
                ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-sm'
                : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-gamer-800'
            }`}
            title="Ordenar pelos jogos mais longos/demorados primeiro (maior tempo de campanha)"
          >
            <span>⏳ Mais Demorado</span>
          </button>

          <select
            value={catalogSort}
            onChange={(e) => setCatalogSort(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-gamer-850 border border-slate-800 text-slate-300 text-xs font-bold focus:outline-none focus:border-neon-cyan"
          >
            <option value="default">Ordem Padrão</option>
            <option value="time_asc">⚡ Mais Rápido Primeiro</option>
            <option value="time_desc">⏳ Mais Demorado Primeiro</option>
            <option value="rating_desc">⭐ Maior Nota</option>
            <option value="name_asc">🔤 Nome (A - Z)</option>
            <option value="year_desc">📅 Mais Recentes</option>
          </select>
        </div>
      </div>

      {/* 3. Grid dos Jogos Curados */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gamer-900/50 border border-slate-800 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">Nenhum jogo encontrado</h3>
          <p className="text-xs text-slate-500">Tente buscar por outro termo ou selecione outra categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredGames.map((item) => {
            const normalizedTitle = item.title.trim().toLowerCase();
            const existingStatus = existingGamesMap.get(normalizedTitle);
            const isAlreadyAdded = existingStatus !== undefined;
            const isChecked = selectedIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 ${
                  isDeathNote 
                    ? 'bg-death-900/95 border-red-950/70 hover:border-death-crimson/60 hover:shadow-glow-crimson' 
                    : 'bg-gamer-900/90 border-slate-800 hover:border-slate-700 hover:shadow-card-hover'
                }`}
              >
                {/* Imagem do Pôster */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gamer-950">
                  <GameCoverImage src={item.coverUrl} alt={item.title} />

                  {/* Checkbox de seleção em lote */}
                  {!isAlreadyAdded && (
                    <button
                      type="button"
                      onClick={() => toggleSelect(item.id)}
                      className={`absolute top-2.5 left-2.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all z-10 ${
                        isChecked 
                          ? isDeathNote ? 'bg-death-crimson border-death-crimson text-white' : 'bg-neon-cyan border-neon-cyan text-gamer-950'
                          : 'bg-black/60 border-white/30 text-transparent hover:border-white'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  )}

                  {/* Nota */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{item.rating}</span>
                  </div>

                  {/* Badge de já adicionado */}
                  {isAlreadyAdded && (
                    <div className="absolute inset-x-0 bottom-0 py-1 px-2 bg-emerald-950/90 border-t border-emerald-500/40 backdrop-blur-sm text-center">
                      <span className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {statusLabel(existingStatus)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Informações do Jogo */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    {/* Header info com Plataforma, Tempo HowLongToBeat e Ano */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-neon-cyan/80">{item.platform}</span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-medium text-slate-300 bg-slate-800/90 border border-slate-700/60 px-1.5 py-0.2 rounded" title="Tempo estimado para zerar a campanha principal">
                          <Clock className="w-2.5 h-2.5 text-neon-cyan" />
                          ~{(item.timeToBeat?.main || timeToBeatService.getTimeToBeat(item.title, item.category).main)}h
                        </span>
                        <span className="font-mono">{item.year}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-neon-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  {/* Botões de Ação */}
                  <div className="pt-2 border-t border-slate-800/80">
                    {isAlreadyAdded ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab('library')}
                        className="w-full py-1.5 px-2 rounded-xl bg-gamer-850 hover:bg-gamer-800 text-slate-400 hover:text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Ver na Biblioteca</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddSingleGame(item, 'backlog')}
                          className={`flex-1 py-1.5 px-2 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center gap-1 ${
                            isDeathNote
                              ? 'bg-death-crimson/20 border border-death-crimson/40 text-death-crimson hover:bg-death-crimson hover:text-white'
                              : 'bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 hover:text-white'
                          }`}
                          title="Adicionar ao Quero Jogar"
                        >
                          <BookMarked className="w-3 h-3" />
                          <span>+ Backlog</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddSingleGame(item, 'completed')}
                          className="p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                          title="Adicionar como Já Zerei"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
