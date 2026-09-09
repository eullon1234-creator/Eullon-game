// src/views/ZeldaView.tsx
import React, { useState, useMemo } from 'react';
import { 
  Search, Shield, Sparkles, Clock, Calendar, 
  CheckCircle2, Plus, X, Compass, Heart, Star,
  Trash2, Edit3, ChevronDown, Play, Bookmark,
  PauseCircle, Trophy, Flame, Layers
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { ZELDA_GAMES_DATABASE, ZELDA_TIMELINE_BRANCHES } from '../data/zeldaGames';
import { ZeldaGameEntry, GameStatus, Game } from '../types/game';

// Ícone SVG de Alta Precisão da Triforce de Hyrule
export const TriforceIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 100 86.6" className={`fill-current ${className}`}>
    {/* Triângulo Superior (Poder - Din) */}
    <polygon points="50,0 25,43.3 75,43.3" />
    {/* Triângulo Inferior Esquerdo (Coragem - Farore) */}
    <polygon points="25,43.3 0,86.6 50,86.6" />
    {/* Triângulo Inferior Direito (Sabedoria - Nayru) */}
    <polygon points="75,43.3 50,86.6 100,86.6" />
  </svg>
);

const normalizeTitle = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[:\-\–\—\']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const ZeldaView: React.FC = () => {
  const { 
    games, 
    addGame, 
    updateGame, 
    deleteGame, 
    quickChangeStatus, 
    quickToggleFavorite, 
    settings, 
    updateSettings 
  } = useGame();
  const { showToast } = useToast();
  const isZeldaTheme = settings.theme === 'zelda';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<ZeldaGameEntry | null>(null);

  // Estados do Diário no Modal
  const [modalUserNotes, setModalUserNotes] = useState('');
  const [modalHoursPlayed, setModalHoursPlayed] = useState<number>(0);
  const [modalRating, setModalRating] = useState<number>(0);

  // Mapeamento bidirecional seguro entre o acervo oficial de Zelda e a biblioteca do usuário
  const userGameMap = useMemo(() => {
    const map = new Map<string, Game>();
    ZELDA_GAMES_DATABASE.forEach((zGame) => {
      const zNorm = normalizeTitle(zGame.title.replace(/\(1986\)/, ''));
      const found = games.find((g) => {
        const gNorm = normalizeTitle(g.title);
        if (gNorm === zNorm) return true;
        if (g.notes && g.notes.includes(zGame.id)) return true;
        if (zGame.id === 'zelda-1-nes') {
          return gNorm === 'the legend of zelda' || gNorm === 'the legend of zelda 1986';
        }
        return gNorm.includes(zNorm) || zNorm.includes(gNorm);
      });
      if (found) {
        map.set(zGame.id, found);
      }
    });
    return map;
  }, [games]);

  // Estatísticas Pessoais da Saga Zelda do Usuário
  const stats = useMemo(() => {
    let completedCount = 0;
    let playingCount = 0;
    let backlogCount = 0;
    let abandonedCount = 0;
    let favoritesCount = 0;
    let totalHours = 0;
    let ratedCount = 0;
    let ratingSum = 0;

    ZELDA_GAMES_DATABASE.forEach((zGame) => {
      const userG = userGameMap.get(zGame.id);
      if (userG) {
        if (userG.status === 'completed') completedCount++;
        if (userG.status === 'playing') playingCount++;
        if (userG.status === 'backlog') backlogCount++;
        if (userG.status === 'abandoned') abandonedCount++;
        if (userG.favorite) favoritesCount++;
        if (userG.hoursPlayed) totalHours += userG.hoursPlayed;
        if (userG.rating) {
          ratingSum += userG.rating;
          ratedCount++;
        }
      }
    });

    const inLibraryCount = userGameMap.size;
    const totalZelda = ZELDA_GAMES_DATABASE.length;
    const completionPercent = Math.round((completedCount / totalZelda) * 100);
    const avgRating = ratedCount > 0 ? (ratingSum / ratedCount).toFixed(1) : '-';

    return {
      totalZelda,
      inLibraryCount,
      completedCount,
      playingCount,
      backlogCount,
      abandonedCount,
      notStartedCount: totalZelda - inLibraryCount,
      favoritesCount,
      totalHours,
      completionPercent,
      avgRating,
    };
  }, [userGameMap]);

  // Filtro de jogos
  const filteredGames = useMemo(() => {
    return ZELDA_GAMES_DATABASE.filter((game) => {
      const userG = userGameMap.get(game.id);

      // Filtro de Status
      if (selectedStatusFilter === 'playing' && userG?.status !== 'playing') return false;
      if (selectedStatusFilter === 'completed' && userG?.status !== 'completed') return false;
      if (selectedStatusFilter === 'backlog' && userG?.status !== 'backlog') return false;
      if (selectedStatusFilter === 'abandoned' && userG?.status !== 'abandoned') return false;
      if (selectedStatusFilter === 'favorites' && !userG?.favorite) return false;
      if (selectedStatusFilter === 'not_started' && userG !== undefined) return false;
      if (selectedStatusFilter === 'in_library' && !userG) return false;

      // Filtro de Busca
      const matchSearch = 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.subtitle && game.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        game.originalPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.iconicItems.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filtro de Linha do Tempo
      const matchBranch = selectedBranch === 'all' || game.timelineBranch === selectedBranch;

      // Filtro de Plataforma
      const matchPlatform = 
        selectedPlatform === 'all' ||
        game.platforms.some((p) => p.toLowerCase().includes(selectedPlatform.toLowerCase())) ||
        game.originalPlatform.toLowerCase().includes(selectedPlatform.toLowerCase());

      return matchSearch && matchBranch && matchPlatform;
    });
  }, [searchQuery, selectedBranch, selectedPlatform, selectedStatusFilter, userGameMap]);

  // Ação de Alterar / Adicionar Status do Jogo com 1 clique
  const handleSetGameStatus = (game: ZeldaGameEntry, status: GameStatus) => {
    const existing = userGameMap.get(game.id);
    if (existing) {
      quickChangeStatus(existing.id, status);
      const statusNames: Record<GameStatus, string> = {
        playing: 'Jogando 🗡️',
        completed: 'Zerado 🏆',
        backlog: 'Quero Jogar 📋',
        abandoned: 'Abandonado ⏸️',
      };
      showToast(`"${game.title}" alterado para ${statusNames[status]}!`, 'success');
    } else {
      addGame({
        title: game.title,
        platform: game.originalPlatform.split('/')[0].trim(),
        status,
        rating: Math.round(game.rating / 10),
        favorite: false,
        coverUrl: game.coverUrl,
        notes: `[ID:${game.id}] ${game.subtitle || ''}. ${game.timelineEraName}.`,
        timeToBeat: {
          main: game.timeToBeat.mainStory,
          extra: game.timeToBeat.extra,
          completionist: game.timeToBeat.completionist,
        },
        hoursPlayed: status === 'completed' ? game.timeToBeat.mainStory : 0,
      });
      showToast(`🛡️ "${game.title}" adicionado à sua biblioteca como ${status === 'playing' ? 'Jogando' : status === 'completed' ? 'Zerado' : 'Quero Jogar'}!`, 'success');
    }
  };

  // Alternar Favorito
  const handleToggleFavorite = (game: ZeldaGameEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = userGameMap.get(game.id);
    if (existing) {
      quickToggleFavorite(existing.id);
      showToast(
        existing.favorite
          ? `Removido dos favoritos: "${game.title}"`
          : `❤️ Adicionado aos favoritos: "${game.title}"`,
        'success'
      );
    } else {
      // Adiciona como backlog e favorito imediatamente
      addGame({
        title: game.title,
        platform: game.originalPlatform.split('/')[0].trim(),
        status: 'backlog',
        rating: Math.round(game.rating / 10),
        favorite: true,
        coverUrl: game.coverUrl,
        notes: `[ID:${game.id}] ${game.subtitle || ''}.`,
        timeToBeat: {
          main: game.timeToBeat.mainStory,
          extra: game.timeToBeat.extra,
          completionist: game.timeToBeat.completionist,
        },
        hoursPlayed: 0,
      });
      showToast(`❤️ "${game.title}" adicionado aos seus favoritos!`, 'success');
    }
  };

  // Abrir Modal de Diário / Detalhes
  const handleOpenDetails = (game: ZeldaGameEntry) => {
    setSelectedGame(game);
    const existing = userGameMap.get(game.id);
    if (existing) {
      setModalUserNotes(existing.notes || '');
      setModalHoursPlayed(existing.hoursPlayed || 0);
      setModalRating(existing.rating || Math.round(game.rating / 10));
    } else {
      setModalUserNotes('');
      setModalHoursPlayed(0);
      setModalRating(Math.round(game.rating / 10));
    }
  };

  // Salvar alterações do Modal
  const handleSaveModalUpdates = () => {
    if (!selectedGame) return;
    const existing = userGameMap.get(selectedGame.id);
    if (existing) {
      updateGame(existing.id, {
        notes: modalUserNotes,
        hoursPlayed: modalHoursPlayed,
        rating: modalRating,
      });
      showToast(`🛡️ Dados de "${selectedGame.title}" salvos com sucesso!`, 'success');
    } else {
      addGame({
        title: selectedGame.title,
        platform: selectedGame.originalPlatform.split('/')[0].trim(),
        status: 'backlog',
        rating: modalRating,
        favorite: false,
        coverUrl: selectedGame.coverUrl,
        notes: modalUserNotes || `[ID:${selectedGame.id}] ${selectedGame.subtitle || ''}.`,
        timeToBeat: {
          main: selectedGame.timeToBeat.mainStory,
          extra: selectedGame.timeToBeat.extra,
          completionist: selectedGame.timeToBeat.completionist,
        },
        hoursPlayed: modalHoursPlayed,
      });
      showToast(`🛡️ "${selectedGame.title}" adicionado e salvo na sua biblioteca!`, 'success');
    }
    setSelectedGame(null);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      
      {/* HERO BANNER: SANTUÁRIO & BIBLIOTECA PESSOAL DE HYRULE */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/90 via-teal-950/80 to-slate-950 border border-emerald-500/30 shadow-2xl">
        {/* Triforce d'água monumental ao fundo */}
        <div className="absolute -right-12 -bottom-16 opacity-10 pointer-events-none text-amber-300">
          <TriforceIcon className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
              <TriforceIcon className="w-3.5 h-3.5" />
              <span>Sua Biblioteca Pessoal de Hyrule</span>
              <span className="text-amber-500">•</span>
              <span>1986 — 2024</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                Santuário The Legend of Zelda
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Gerencie sua jornada por toda a lenda de Hyrule. Marque os jogos que você está jogando, 
              registre os já zerados, salve favoritos e anote seu progresso diretamente aqui.
            </p>
          </div>

          {/* Botão de Ativar Tema do Zelda se não estiver ativo */}
          {!isZeldaTheme && (
            <button
              type="button"
              onClick={() => {
                updateSettings({ theme: 'zelda' });
                showToast('🗡️ Tema The Legend of Zelda ativado em todo o app!', 'success');
              }}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-glow-triforce transition-all shrink-0 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ativar Tema Zelda no App</span>
            </button>
          )}
        </div>

        {/* Barra de Progresso da Lenda de Hyrule */}
        <div className="mt-6 pt-5 border-t border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-300 flex items-center gap-1.5 font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Progresso na Saga de Hyrule:</span>
              <span className="text-white font-black">{stats.completedCount} de {stats.totalZelda} jogos zerados</span>
            </span>
            <span className="text-amber-300 font-mono text-sm font-black">
              {stats.completionPercent}% Concluído
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-emerald-950/80 border border-emerald-500/30 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-1000 shadow-glow-triforce"
              style={{ width: `${Math.max(stats.completionPercent, 2)}%` }}
            />
          </div>
        </div>

        {/* Estatísticas Pessoais */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px]">Na Sua Biblioteca</span>
            <span className="text-xl font-black text-white">{stats.inLibraryCount} <span className="text-xs font-normal text-slate-400">/ {stats.totalZelda}</span></span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px]">Jogando Agora</span>
            <span className="text-xl font-black text-teal-300">{stats.playingCount} jogos</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px]">Jogos Zerados</span>
            <span className="text-xl font-black text-amber-400">{stats.completedCount} títulos</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex flex-col justify-between">
            <span className="text-slate-400 text-[11px]">Quero Jogar</span>
            <span className="text-xl font-black text-blue-300">{stats.backlogCount} na fila</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-slate-400 text-[11px]">Horas em Hyrule</span>
            <span className="text-xl font-black text-emerald-400">~{stats.totalHours}h jogadas</span>
          </div>
        </div>
      </div>

      {/* BARRA DE CONTROLE: STATUS DA BIBLIOTECA, BUSCA & FILTROS */}
      <div className="space-y-4">
        {/* Abas Rápidas de Status da Biblioteca Pessoal */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedStatusFilter === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-glow-triforce font-black'
                : 'bg-gamer-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>🌟 Todos</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">
              {stats.totalZelda}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusFilter('playing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedStatusFilter === 'playing'
                ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-glow-zelda font-black'
                : 'bg-gamer-900/80 text-teal-300/80 border-slate-800 hover:text-white hover:border-teal-500/30'
            }`}
          >
            <span>🗡️ Jogando</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">
              {stats.playingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusFilter('completed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedStatusFilter === 'completed'
                ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-glow-triforce font-black'
                : 'bg-gamer-900/80 text-amber-300/80 border-slate-800 hover:text-white hover:border-amber-500/30'
            }`}
          >
            <span>🏆 Zerados</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">
              {stats.completedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusFilter('backlog')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedStatusFilter === 'backlog'
                ? 'bg-blue-500 text-white border-blue-400 font-black'
                : 'bg-gamer-900/80 text-blue-300/80 border-slate-800 hover:text-white hover:border-blue-500/30'
            }`}
          >
            <span>📋 Quero Jogar</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">
              {stats.backlogCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusFilter('favorites')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedStatusFilter === 'favorites'
                ? 'bg-rose-500 text-white border-rose-400 font-black shadow-md'
                : 'bg-gamer-900/80 text-rose-300/80 border-slate-800 hover:text-white hover:border-rose-500/30'
            }`}
          >
            <span>❤️ Favoritos</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">
              {stats.favoritesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatusFilter('not_started')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
              selectedStatusFilter === 'not_started'
                ? 'bg-slate-700 text-white border-slate-600 font-black'
                : 'bg-gamer-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>⭕ Ainda Não Iniciados</span>
            <span className="px-1.5 py-0.2 rounded-md bg-black/20 text-[10px]">
              {stats.notStartedCount}
            </span>
          </button>
        </div>

        {/* Busca e Plataforma */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="Buscar por título de Zelda, console ou item lendário..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gamer-900/90 border border-emerald-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-gamer-900/90 border border-emerald-500/30 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">Todas as Plataformas</option>
            <option value="NES">NES (8-Bits)</option>
            <option value="SNES">Super Nintendo (SNES)</option>
            <option value="Game Boy">Game Boy / GBC / GBA</option>
            <option value="Nintendo 64">Nintendo 64</option>
            <option value="GameCube">GameCube</option>
            <option value="Nintendo DS">Nintendo DS / 3DS</option>
            <option value="Wii">Nintendo Wii / Wii U</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
          </select>
        </div>

        {/* Abas da Linha do Tempo Canônica de Hyrule */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {ZELDA_TIMELINE_BRANCHES.map((branch) => {
            const isSelected = selectedBranch === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => setSelectedBranch(branch.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-400/60 shadow-glow-triforce scale-[1.02]'
                    : 'bg-gamer-900/70 text-slate-400 border-slate-800 hover:text-white hover:border-emerald-500/30'
                }`}
              >
                <TriforceIcon className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{branch.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID DE JOGOS: EXPERIÊNCIA COMPLETA DE BIBLIOTECA */}
      {filteredGames.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-gamer-900/40 border border-emerald-500/20 space-y-3">
          <TriforceIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-300 font-medium text-sm">
            Nenhum jogo sagrado encontrado com os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedBranch('all');
              setSelectedStatusFilter('all');
              setSelectedPlatform('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => {
            const userG = userGameMap.get(game.id);
            const isInLibrary = !!userG;
            const currentStatus = userG?.status;
            const isFav = !!userG?.favorite;

            return (
              <div
                key={game.id}
                className={`group relative flex flex-col rounded-3xl bg-gamer-900/90 border transition-all duration-300 overflow-hidden shadow-card hover:-translate-y-1 ${
                  isInLibrary
                    ? currentStatus === 'completed'
                      ? 'border-amber-400/50 hover:border-amber-400 shadow-glow-triforce/40'
                      : currentStatus === 'playing'
                      ? 'border-teal-400/50 hover:border-teal-400 shadow-glow-zelda/40'
                      : 'border-emerald-500/40 hover:border-emerald-400'
                    : 'border-slate-800/80 hover:border-emerald-500/40'
                }`}
              >
                {/* Imagem de Capa Oficial */}
                <div 
                  className="relative aspect-game-cover w-full overflow-hidden cursor-pointer bg-slate-950"
                  onClick={() => handleOpenDetails(game)}
                >
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gamer-950 via-transparent to-black/40" />

                  {/* Badges de Topo */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-amber-400/30 text-amber-300 font-bold font-mono text-[10px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{game.releaseYear}</span>
                    </span>

                    {/* Botão de Favorito (Interativo) */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(game, e)}
                      className={`p-1.5 rounded-full pointer-events-auto backdrop-blur-md transition-all active:scale-90 ${
                        isFav
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-black/60 text-slate-300 hover:text-rose-400 hover:bg-black/80'
                      }`}
                      title={isFav ? 'Remover dos favoritos' : 'Favoritar este jogo'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Status Atual na Biblioteca Emblema Inferior */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    {isInLibrary ? (
                      <span className={`px-2.5 py-1 rounded-xl font-black text-[10px] flex items-center gap-1.5 shadow-md ${
                        currentStatus === 'completed'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950'
                          : currentStatus === 'playing'
                          ? 'bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950'
                          : currentStatus === 'backlog'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-white'
                      }`}>
                        {currentStatus === 'completed' && <Trophy className="w-3 h-3" />}
                        {currentStatus === 'playing' && <Play className="w-3 h-3 fill-current" />}
                        {currentStatus === 'backlog' && <Bookmark className="w-3 h-3" />}
                        {currentStatus === 'abandoned' && <PauseCircle className="w-3 h-3" />}
                        <span>
                          {currentStatus === 'completed' ? 'Zerado' :
                           currentStatus === 'playing' ? 'Jogando' :
                           currentStatus === 'backlog' ? 'Quero Jogar' : 'Pausado'}
                        </span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-slate-400 text-[10px] font-medium">
                        Não Iniciado
                      </span>
                    )}

                    {/* Nota Oficial ou Avaliação do Usuário */}
                    <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-amber-400/30 text-amber-300 font-bold text-[10px] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{userG?.rating ? `${userG.rating}/10` : `${game.rating}★`}</span>
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card com Controles Diretos de Biblioteca */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block truncate">
                      {game.timelineEraName}
                    </span>

                    <h3 
                      onClick={() => handleOpenDetails(game)}
                      className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer"
                      title={game.title}
                    >
                      {game.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {game.subtitle || game.lore}
                    </p>
                  </div>

                  {/* Informações de Duração & Console */}
                  <div className="pt-2 border-t border-emerald-500/15 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[130px]" title={game.originalPlatform}>
                        🎮 {game.originalPlatform}
                      </span>
                      <span className="font-mono text-amber-300 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {userG?.hoursPlayed 
                            ? `${userG.hoursPlayed}h / ~${game.timeToBeat.mainStory}h`
                            : `~${game.timeToBeat.mainStory}h`}
                        </span>
                      </span>
                    </div>

                    {/* CONTROLES DE AÇÃO DA BIBLIOTECA (1-CLIQUE) */}
                    <div className="pt-1">
                      {isInLibrary ? (
                        <div className="flex items-center gap-1.5">
                          {/* Seletor Rápido de Status */}
                          <div className="relative flex-1">
                            <select
                              value={currentStatus}
                              onChange={(e) => handleSetGameStatus(game, e.target.value as GameStatus)}
                              className="w-full py-1.5 px-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-white text-[11px] font-bold border border-emerald-500/30 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none text-center"
                            >
                              <option value="playing">🗡️ Jogando</option>
                              <option value="completed">🏆 Zerado</option>
                              <option value="backlog">📋 Quero Jogar</option>
                              <option value="abandoned">⏸️ Pausado</option>
                            </select>
                          </div>

                          {/* Botão de Abrir Ficha / Diário */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(game)}
                            className="p-1.5 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                            title="Abrir diário e notas de progresso"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        /* Botões de Ação Imediata para Iniciar na Biblioteca */
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => handleSetGameStatus(game, 'playing')}
                            className="py-1 px-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 font-bold text-[10px] border border-teal-500/30 transition-all text-center flex items-center justify-center gap-1"
                            title="Marcar como Jogando agora"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Jogar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetGameStatus(game, 'completed')}
                            className="py-1 px-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-[10px] border border-amber-500/30 transition-all text-center flex items-center justify-center gap-1"
                            title="Marcar como Zerado"
                          >
                            <Trophy className="w-2.5 h-2.5" />
                            <span>Zerei</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSetGameStatus(game, 'backlog')}
                            className="py-1 px-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white font-bold text-[10px] border border-blue-500/30 transition-all text-center flex items-center justify-center gap-1"
                            title="Adicionar à fila para jogar"
                          >
                            <Bookmark className="w-2.5 h-2.5" />
                            <span>Fila</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL / DIÁRIO PESSOAL E FICHA COMPLETA DO JOGO SAGRADO */}
      {selectedGame && (() => {
        const userG = userGameMap.get(selectedGame.id);
        const isInLibrary = !!userG;

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setSelectedGame(null)}
          >
            <div 
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gamer-950 border border-amber-400/40 shadow-2xl p-6 sm:p-7 space-y-6 animate-scaleUp text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botão Fechar */}
              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cabeçalho da Ficha */}
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={selectedGame.coverUrl}
                  alt={selectedGame.title}
                  className="w-32 sm:w-40 aspect-game-cover object-cover rounded-2xl border border-emerald-500/40 shadow-xl shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold">
                    <TriforceIcon className="w-3 h-3" />
                    <span>{selectedGame.timelineEraName}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {selectedGame.title}
                  </h2>
                  {selectedGame.subtitle && (
                    <p className="text-xs text-amber-300/90 font-medium">
                      {selectedGame.subtitle}
                    </p>
                  )}
                  {selectedGame.japaneseTitle && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      {selectedGame.japaneseTitle}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="px-2 py-0.5 rounded-lg bg-gamer-900 border border-slate-700 text-slate-300 font-mono">
                      Ano: {selectedGame.releaseYear}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-gamer-900 border border-slate-700 text-slate-300">
                      Origem: {selectedGame.originalPlatform}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Nota Crítica: {selectedGame.rating}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* CONTROLES DE STATUS NA BIBLIOTECA DO USUÁRIO */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Seu Registro em Hyrule</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isInLibrary ? '🟢 Registrado na Biblioteca' : '⚪ Ainda não registrado'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetGameStatus(selectedGame, 'playing')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      userG?.status === 'playing'
                        ? 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-glow-zelda'
                        : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-teal-500/50'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Jogando</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetGameStatus(selectedGame, 'completed')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      userG?.status === 'completed'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-glow-triforce'
                        : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-amber-500/50'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Zerado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetGameStatus(selectedGame, 'backlog')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      userG?.status === 'backlog'
                        ? 'bg-blue-500 text-white border-blue-400 font-black'
                        : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-blue-500/50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Quero Jogar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetGameStatus(selectedGame, 'abandoned')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      userG?.status === 'abandoned'
                        ? 'bg-slate-600 text-white border-slate-500 font-black'
                        : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    <span>Pausado</span>
                  </button>
                </div>

                {/* Campos Pessoais: Horas Jogadas & Sua Nota */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-bold">
                      Horas que você já jogou:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={modalHoursPlayed}
                        onChange={(e) => setModalHoursPlayed(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 rounded-xl bg-gamer-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => setModalHoursPlayed(prev => prev + 1)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold shrink-0"
                      >
                        +1h
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 block font-bold">
                      Sua Nota Pessoal (0 a 10):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={modalRating}
                        onChange={(e) => setModalRating(Math.min(10, Math.max(0, Number(e.target.value))))}
                        className="w-full px-3 py-1.5 rounded-xl bg-gamer-900 border border-slate-700 text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-amber-400 font-bold text-sm">★</span>
                    </div>
                  </div>
                </div>

                {/* Notas e Diário Pessoal */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] text-slate-400 block font-bold">
                    Suas Notas & Memórias em Hyrule:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Escreva suas impressões, memórias, onde parou ou conquistas neste jogo..."
                    value={modalUserNotes}
                    onChange={(e) => setModalUserNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gamer-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Botão de Salvar Alterações */}
                <div className="flex items-center justify-between pt-1">
                  {isInLibrary && (
                    <button
                      type="button"
                      onClick={() => {
                        deleteGame(userG.id);
                        setSelectedGame(null);
                        showToast(`"${selectedGame.title}" removido da sua biblioteca.`, 'info');
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover da Minha Biblioteca</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveModalUpdates}
                    className="ml-auto py-2 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-glow-triforce transition-all"
                  >
                    <span>Salvar Dados no Meu Jogo</span>
                  </button>
                </div>
              </div>

              {/* Sinopse e Lore de Hyrule */}
              <div className="space-y-2 p-4 rounded-2xl bg-gamer-900/80 border border-emerald-500/20">
                <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>História Sagrada & Lore</span>
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedGame.lore}
                </p>
              </div>

              {/* Itens Lendários & Mecânicas */}
              <div className="space-y-2">
                <span className="font-mono text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Itens e Mecânicas Icônicas</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGame.iconicItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium"
                    >
                      🗡️ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tempo Estimado para Zerar (HowLongToBeat) */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-gamer-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Campanha</span>
                  <span className="text-sm sm:text-base font-black text-amber-300">
                    {selectedGame.timeToBeat.mainStory} horas
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-gamer-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">História + Extras</span>
                  <span className="text-sm sm:text-base font-black text-teal-300">
                    {selectedGame.timeToBeat.extra} horas
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-gamer-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">100% Completo</span>
                  <span className="text-sm sm:text-base font-black text-emerald-400">
                    {selectedGame.timeToBeat.completionist} horas
                  </span>
                </div>
              </div>

              {/* Plataformas e Remakes */}
              <div className="space-y-1.5 text-xs text-slate-400">
                <span className="font-bold text-slate-300">Todas as Plataformas / Remakes Disponíveis:</span>
                <p className="font-mono text-[11px] text-emerald-300/90">
                  {selectedGame.platforms.join(' • ')}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
