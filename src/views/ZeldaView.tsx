// src/views/ZeldaView.tsx
import React, { useState, useMemo } from 'react';
import { 
  Search, Shield, Sparkles, Clock, Calendar, 
  Layers, CheckCircle2, Plus, ExternalLink, X, Compass,
  Flame, Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { ZELDA_GAMES_DATABASE, ZELDA_TIMELINE_BRANCHES } from '../data/zeldaGames';
import { ZeldaGameEntry, GameStatus } from '../types/game';

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

export const ZeldaView: React.FC = () => {
  const { games, addGame, settings, updateSettings, setActiveTab } = useGame();
  const { showToast } = useToast();
  const isZeldaTheme = settings.theme === 'zelda';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<ZeldaGameEntry | null>(null);

  // Mapeamento de jogos do Zelda que já estão na biblioteca do usuário
  const userLibraryTitles = useMemo(() => {
    const map = new Map<string, GameStatus>();
    games.forEach((g) => {
      map.set(g.title.toLowerCase().trim(), g.status);
    });
    return map;
  }, [games]);

  // Filtro de jogos
  const filteredGames = useMemo(() => {
    return ZELDA_GAMES_DATABASE.filter((game) => {
      const matchSearch = 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.subtitle && game.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        game.originalPlatform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.iconicItems.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchBranch = selectedBranch === 'all' || game.timelineBranch === selectedBranch;

      const matchPlatform = 
        selectedPlatform === 'all' ||
        game.platforms.some((p) => p.toLowerCase().includes(selectedPlatform.toLowerCase())) ||
        game.originalPlatform.toLowerCase().includes(selectedPlatform.toLowerCase());

      return matchSearch && matchBranch && matchPlatform;
    });
  }, [searchQuery, selectedBranch, selectedPlatform]);

  // Adiciona o jogo à biblioteca do usuário
  const handleAddToLibrary = (game: ZeldaGameEntry, status: GameStatus = 'backlog') => {
    const exists = games.some((g) => g.title.toLowerCase().trim() === game.title.toLowerCase().trim());
    if (exists) {
      showToast(`🛡️ "${game.title}" já está na sua biblioteca!`, 'info');
      return;
    }

    addGame({
      title: game.title,
      platform: game.originalPlatform.split('/')[0].trim(),
      status,
      rating: Math.round(game.rating / 10),
      favorite: game.rating >= 95,
      coverUrl: game.coverUrl,
      notes: `${game.subtitle || ''}. ${game.timelineEraName}.`,
      timeToBeat: {
        main: game.timeToBeat.mainStory,
        extra: game.timeToBeat.extra,
        completionist: game.timeToBeat.completionist,
      },
    });

    const statusLabel = 
      status === 'playing' ? 'Jogando' : 
      status === 'completed' ? 'Zerados' : 
      status === 'backlog' ? 'Quero Jogar' : 'Biblioteca';

    showToast(`🗡️ "${game.title}" adicionado a ${statusLabel}!`, 'success');
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      
      {/* HERO BANNER SAGRADO DE HYRULE */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/90 via-teal-950/80 to-slate-950 border border-emerald-500/30 shadow-2xl">
        {/* Marca d'água monumental da Triforce no fundo */}
        <div className="absolute -right-12 -bottom-16 opacity-10 pointer-events-none text-amber-300">
          <TriforceIcon className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono uppercase tracking-wider">
              <TriforceIcon className="w-3.5 h-3.5" />
              <span>Santuário Oficial de Hyrule</span>
              <span className="text-amber-500">•</span>
              <span>1986 — 2024</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                The Legend of Zelda
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Explore toda a cronologia canônica oficial da maior franquia de aventura dos videogames. 
              Consulte a história, itens sagrados, remakes e adicione qualquer jogo à sua coleção com 1 clique.
            </p>
          </div>

          {/* Botão Rápido de Ativar Tema do Zelda se não estiver ativo */}
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

        {/* Estatísticas do Santuário */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-500/20 text-xs">
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20">
            <span className="text-slate-400 block text-[11px]">Acervo Histórico</span>
            <span className="text-xl font-black text-amber-300">{ZELDA_GAMES_DATABASE.length} Títulos</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20">
            <span className="text-slate-400 block text-[11px]">Gerações Abrangidas</span>
            <span className="text-xl font-black text-emerald-300">38 Anos de Glória</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20">
            <span className="text-slate-400 block text-[11px]">Eras Temporais</span>
            <span className="text-xl font-black text-teal-300">6 Ramificações</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20">
            <span className="text-slate-400 block text-[11px]">Na Sua Biblioteca</span>
            <span className="text-xl font-black text-amber-400">
              {ZELDA_GAMES_DATABASE.filter((g) => userLibraryTitles.has(g.title.toLowerCase().trim())).length} Registrados
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE CONTROLE: BUSCA & FILTROS DA LINHA DO TEMPO */}
      <div className="space-y-4">
        {/* Barra de Busca e Filtro de Plataforma */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="Buscar jogo de Zelda por título, plataforma ou item lendário..."
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

          {/* Seletor Rápido de Plataforma */}
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
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-400/60 shadow-glow-triforce scale-[1.02]'
                    : 'bg-gamer-900/70 text-slate-400 border-slate-800 hover:text-white hover:border-emerald-500/30'
                }`}
              >
                <TriforceIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{branch.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID DE JOGOS DE ZELDA */}
      {filteredGames.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-gamer-900/40 border border-emerald-500/20 space-y-3">
          <TriforceIcon className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 font-medium text-sm">
            Nenhum jogo sagrado encontrado com os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedBranch('all');
              setSelectedPlatform('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredGames.map((game) => {
            const libraryStatus = userLibraryTitles.get(game.title.toLowerCase().trim());
            const isInLibrary = !!libraryStatus;

            return (
              <div
                key={game.id}
                className="group relative flex flex-col rounded-3xl bg-gamer-900/80 border border-emerald-500/25 hover:border-amber-400/50 transition-all duration-300 overflow-hidden shadow-card hover:shadow-glow-triforce hover:-translate-y-1"
              >
                {/* Imagem de Capa do Jogo */}
                <div 
                  className="relative aspect-game-cover w-full overflow-hidden cursor-pointer bg-slate-950"
                  onClick={() => setSelectedGame(game)}
                >
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gamer-950 via-transparent to-black/30" />

                  {/* Badges de Topo */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-300 font-bold font-mono text-[10px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{game.releaseYear}</span>
                    </span>

                    {/* Nota ou Aspecto da Triforce */}
                    <span className="px-2 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 font-bold text-[10px] flex items-center gap-1 shadow-sm">
                      <TriforceIcon className="w-3 h-3 text-amber-400" />
                      <span>{game.rating}★</span>
                    </span>
                  </div>

                  {/* Status na Biblioteca (se já tiver) */}
                  {isInLibrary && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/90 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-md">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>
                          {libraryStatus === 'playing' ? 'Jogando' : 
                           libraryStatus === 'completed' ? 'Zerado' : 
                           libraryStatus === 'backlog' ? 'Quero Jogar' : 'Na Coleção'}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Linha Temporal */}
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block truncate">
                      {game.timelineEraName}
                    </span>

                    <h3 
                      onClick={() => setSelectedGame(game)}
                      className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer"
                      title={game.title}
                    >
                      {game.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {game.subtitle || game.lore}
                    </p>
                  </div>

                  {/* Itens Lendários & Duração */}
                  <div className="pt-2 border-t border-emerald-500/15 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[140px]" title={game.originalPlatform}>
                        🎮 {game.originalPlatform}
                      </span>
                      <span className="font-mono text-amber-300 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>~{game.timeToBeat.mainStory}h</span>
                      </span>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedGame(game)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 transition-colors text-center"
                      >
                        Ver Detalhes
                      </button>

                      {isInLibrary ? (
                        <button
                          type="button"
                          onClick={() => setActiveTab('library')}
                          className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                          title="Abrir na biblioteca"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToLibrary(game, 'backlog')}
                          className="py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                          title="Adicionar aos meus jogos"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL / FICHA COMPLETA DO JOGO SAGRADO */}
      {selectedGame && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedGame(null)}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gamer-950 border border-amber-400/40 shadow-2xl p-6 sm:p-7 space-y-6 animate-scaleUp text-slate-200"
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
                    Nota: {selectedGame.rating}/100
                  </span>
                </div>
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

            {/* Botão de Adicionar à Coleção */}
            <div className="pt-3 border-t border-emerald-500/20 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  handleAddToLibrary(selectedGame, 'playing');
                  setSelectedGame(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-glow-zelda"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar como Jogando</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToLibrary(selectedGame, 'backlog');
                  setSelectedGame(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-gamer-900 hover:bg-gamer-800 border border-amber-400/40 text-amber-300 font-bold text-xs"
              >
                <span>Quero Jogar (Backlog)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddToLibrary(selectedGame, 'completed');
                  setSelectedGame(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-gamer-900 hover:bg-gamer-800 border border-slate-700 text-slate-300 font-bold text-xs"
              >
                <span>Já Zerei</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
