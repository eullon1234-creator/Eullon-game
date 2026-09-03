import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Image as ImageIcon, Heart, Sparkles, Search, Loader2, Check, ExternalLink, Clock } from 'lucide-react';
import { Game, GameStatus } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { STATUS_CONFIG, DEFAULT_PLATFORMS } from '../../data/defaultCategories';
import { GameCoverImage } from '../common/GameCoverImage';
import { getRatingClassification } from '../common/GameRatingBadge';
import { gameCoverService, GameCoverSearchResult } from '../../services/gameCoverService';
import { timeToBeatService } from '../../services/timeToBeatService';

export const GameFormModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingGame,
    setEditingGame,
    addGame,
    updateGame,
    checkDuplicate,
    setSelectedGame,
    settings,
  } = useGame();

  const isDeathNote = settings.theme === 'death-note';

  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [platform, setPlatform] = useState('PC 💲 (Comprado)');
  const [status, setStatus] = useState<GameStatus>('backlog');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [favorite, setFavorite] = useState(false);
  const [notes, setNotes] = useState('');
  const [timeMain, setTimeMain] = useState<number | undefined>(undefined);
  const [hoursPlayed, setHoursPlayed] = useState<number>(0);

  const [duplicateMatch, setDuplicateMatch] = useState<Game | null>(null);

  // Auto cover search states
  const [isSearchingCover, setIsSearchingCover] = useState(false);
  const [coverResults, setCoverResults] = useState<GameCoverSearchResult[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (editingGame) {
      setTitle(editingGame.title);
      setCoverUrl(editingGame.coverUrl || '');
      setPlatform(editingGame.platform || 'PC 💲 (Comprado)');
      setStatus(editingGame.status);
      setRating(editingGame.rating);
      setFavorite(editingGame.favorite);
      setNotes(editingGame.notes || '');
      setTimeMain(editingGame.timeToBeat?.main);
      setHoursPlayed(editingGame.hoursPlayed || 0);
    } else {
      setTitle('');
      setCoverUrl('');
      setPlatform('PC 💲 (Comprado)');
      setStatus('backlog');
      setRating(undefined);
      setFavorite(false);
      setNotes('');
      setTimeMain(undefined);
      setHoursPlayed(0);
    }
    setDuplicateMatch(null);
    setCoverResults([]);
    setSearchFeedback(null);
    setIsSearchingCover(false);
  }, [editingGame, isAddModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAddModalOpen) return null;

  const handleClose = () => {
    setIsAddModalOpen(false);
    setEditingGame(null);
    setDuplicateMatch(null);
    setCoverResults([]);
    setSearchFeedback(null);
    setIsSearchingCover(false);
  };

  const handleSearchCovers = async () => {
    const query = title.trim();
    if (!query || query.length < 2) {
      setSearchFeedback('Digite pelo menos 2 caracteres do nome do jogo para buscar.');
      return;
    }

    setIsSearchingCover(true);
    setSearchFeedback(null);
    try {
      const results = await gameCoverService.searchCovers(query, settings.rawgApiKey);
      setCoverResults(results);
      if (results.length === 0) {
        setSearchFeedback('Nenhuma capa encontrada. Dica: tente pesquisar pelo nome internacional/inglês.');
      } else {
        setSearchFeedback(`${results.length} capa(s) oficial(is) encontrada(s)! Clique para aplicar:`);
      }
    } catch {
      setSearchFeedback('Falha na conexão com a base de jogos.');
    } finally {
      setIsSearchingCover(false);
    }
  };

  const handleSelectCover = (item: GameCoverSearchResult) => {
    setCoverUrl(item.coverUrl);
    // Sugere o rating oficial se o usuário ainda não preencheu
    if (rating === undefined && item.rating) {
      setRating(item.rating);
    }
    // Sugere o tempo de jogo se disponível
    if (timeMain === undefined) {
      if (item.timeToBeat?.main) {
        setTimeMain(item.timeToBeat.main);
      } else {
        const estimated = timeToBeatService.getTimeToBeat(item.title);
        if (estimated.main) setTimeMain(estimated.main);
      }
    }
    setSearchFeedback(`✓ Capa de "${item.title}" selecionada!`);
  };

  const handleSave = (bypassDuplicateCheck = false) => {
    if (!title.trim()) {
      alert('Por favor, informe o nome do jogo.');
      return;
    }

    if (!editingGame && !bypassDuplicateCheck) {
      const dup = checkDuplicate(title, platform);
      if (dup) {
        setDuplicateMatch(dup);
        return;
      }
    }

    const timeToBeat = timeMain ? {
      main: timeMain,
      extra: Math.round(timeMain * 1.6),
      completionist: Math.round(timeMain * 2.4),
    } : undefined;

    const payload = {
      title: title.trim(),
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
      platform,
      status,
      rating,
      favorite,
      timeToBeat,
      hoursPlayed: hoursPlayed > 0 ? hoursPlayed : undefined,
      notes: notes.trim() || undefined,
    };

    if (editingGame) {
      updateGame(editingGame.id, payload);
    } else {
      addGame(payload);
    }

    handleClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-gamer-900 border border-slate-700/80 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gamer-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shadow-glow-cyan">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingGame ? 'Editar Jogo' : 'Cadastrar Jogo'}
              </h2>
              <p className="text-xs text-slate-400">
                Adicione capas e organize sua biblioteca
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Duplicate Warning */}
        {duplicateMatch && (
          <div className="p-4 m-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-shake">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-200 block">Atenção: Jogo duplicado!</span>
                <span className="text-amber-300/80">Já existe "{duplicateMatch.title}" cadastrado em {duplicateMatch.platform}.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedGame(duplicateMatch);
                  handleClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30"
              >
                Ver Jogo
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-gamer-950 text-xs font-bold hover:brightness-110"
              >
                Adicionar
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* 1. Nome do Jogo com Busca Automática de Capas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Nome do Jogo</span>
                <span className="text-rose-400">*</span>
              </label>

              {title.trim().length >= 2 && (
                <button
                  type="button"
                  onClick={handleSearchCovers}
                  disabled={isSearchingCover}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isDeathNote
                      ? 'bg-death-crimson/20 border-death-crimson/40 text-death-crimson hover:bg-death-crimson/30'
                      : 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/25'
                  }`}
                >
                  {isSearchingCover ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Buscando capas...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Buscar Capa Oficial</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ex: The Witcher 3, Elden Ring, God of War..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchCovers();
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-white placeholder-slate-500 focus:outline-none text-sm font-semibold pr-24 ${
                  isDeathNote
                    ? 'bg-death-900 border-red-950/80 focus:border-death-crimson'
                    : 'bg-gamer-800 border-slate-700 focus:border-neon-cyan'
                }`}
              />

              <button
                type="button"
                onClick={handleSearchCovers}
                disabled={isSearchingCover || title.trim().length < 2}
                className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  isDeathNote
                    ? 'bg-death-crimson text-white hover:brightness-110 shadow-glow-crimson'
                    : 'bg-neon-cyan text-gamer-950 hover:brightness-110 shadow-glow-cyan'
                }`}
                title="Buscar capas oficiais para este jogo"
              >
                {isSearchingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </div>

            {searchFeedback && (
              <p className={`text-[11px] mt-1.5 pl-0.5 flex items-center gap-1.5 ${
                searchFeedback.startsWith('✓') 
                  ? 'text-emerald-400 font-semibold' 
                  : 'text-slate-400'
              }`}>
                {searchFeedback}
              </p>
            )}
          </div>

          {/* 2. Galeria de Capas Encontradas */}
          {coverResults.length > 0 && (
            <div className={`p-3.5 rounded-2xl border space-y-2.5 animate-fadeIn ${
              isDeathNote
                ? 'bg-death-900/90 border-death-crimson/30 shadow-[0_0_20px_rgba(229,9,20,0.1)]'
                : 'bg-gamer-850/80 border-slate-700/80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className={`w-3.5 h-3.5 ${isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'}`} />
                  Capas Oficiais Disponíveis (Clique para escolher)
                </span>
                <span className="text-[10px] text-slate-400">
                  {coverResults.length} opções
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {coverResults.map((item) => {
                  const isSelected = coverUrl === item.coverUrl;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectCover(item)}
                      className={`group relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all text-left flex flex-col justify-end p-1.5 ${
                        isSelected
                          ? isDeathNote
                            ? 'border-death-crimson ring-2 ring-death-crimson/60 shadow-glow-crimson scale-105 z-10'
                            : 'border-neon-cyan ring-2 ring-neon-cyan/60 shadow-glow-cyan scale-105 z-10'
                          : 'border-slate-700/80 hover:border-slate-400 opacity-80 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {isSelected && (
                        <div className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                          isDeathNote ? 'bg-death-crimson text-white' : 'bg-neon-cyan text-gamer-950'
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      <div className="relative z-10">
                        <span className="text-[9px] font-bold text-white line-clamp-1 block leading-tight">
                          {item.title}
                        </span>
                        {item.year && (
                          <span className="text-[8px] text-slate-300 font-mono">
                            {item.year}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Pré-visualização da Capa Atual e URL Manual */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gamer-850/60 border border-slate-800">
            <div className="w-20 sm:w-24 flex-shrink-0 shadow-lg rounded-xl overflow-hidden bg-gamer-950 border border-slate-700">
              <GameCoverImage src={coverUrl} alt={title || 'Prévia'} />
            </div>

            <div className="flex-1 w-full space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ImageIcon className={`w-3.5 h-3.5 ${isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'}`} />
                  URL da Imagem Selecionada
                </label>
                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => setCoverUrl('')}
                    className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Remover Capa
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder="https://... (ou use o botão Buscar Capa acima)"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-white placeholder-slate-500 focus:outline-none text-xs ${
                  isDeathNote
                    ? 'bg-death-900 border-red-950/80 focus:border-death-crimson'
                    : 'bg-gamer-800 border-slate-700 focus:border-neon-cyan'
                }`}
              />
              <p className="text-[10px] text-slate-400">
                Você pode escolher uma capa oficial acima ou colar manualmente o link direto de qualquer imagem da internet.
              </p>
            </div>
          </div>

          {/* Status (4 buttons) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Status <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['playing', 'completed', 'backlog', 'abandoned'] as GameStatus[]).map((st) => {
                const conf = STATUS_CONFIG[st];
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? `${conf.badgeBg} border-current shadow-sm scale-102`
                        : 'bg-gamer-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{conf.emoji}</span>
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Plataforma
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gamer-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-neon-cyan font-medium"
            >
              {DEFAULT_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Para PC, escolha <strong>PC 💲 (Comprado)</strong> ou <strong>PC 💀 (Craqueado)</strong>.
            </p>
          </div>

          {/* Rating (0-10) and Favorite */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Sua Avaliação (0 a 10)
              </label>
              <div className="flex items-center gap-2">
                {rating !== undefined ? (
                  <>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      ⭐ {rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({getRatingClassification(rating).label})
                    </span>
                    <button
                      type="button"
                      onClick={() => setRating(undefined)}
                      className="text-[10px] text-slate-500 hover:text-rose-400 ml-1"
                    >
                      Remover
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-500 italic">Sem nota</span>
                )}
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={rating !== undefined ? rating : 0}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Favorito Checkbox */}
          <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer p-1">
            <input
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 accent-rose-500"
            />
            <span className="flex items-center gap-1.5">
              <Heart className={`w-4 h-4 ${favorite ? 'text-rose-500 fill-current' : 'text-slate-400'}`} />
              Marcar como Favorito ❤️
            </span>
          </label>

          {/* Seção HowLongToBeat & Horas Jogadas */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className={`w-3.5 h-3.5 ${isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'}`} />
                Tempo de Jogo (HowLongToBeat)
              </label>
              <span className="text-[10px] text-slate-500">Opcional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Estimativa para zerar a história */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Tempo Médio da Campanha (horas)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    placeholder="Ex: 20"
                    value={timeMain !== undefined ? timeMain : ''}
                    onChange={(e) => setTimeMain(e.target.value ? parseInt(e.target.value) : undefined)}
                    className={`w-full px-3 py-2 rounded-xl border text-white placeholder-slate-500 focus:outline-none text-xs font-mono ${
                      isDeathNote
                        ? 'bg-death-900 border-red-950/80 focus:border-death-crimson'
                        : 'bg-gamer-800 border-slate-700 focus:border-neon-cyan'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono">h</span>
                </div>
              </div>

              {/* Horas já jogadas pelo usuário */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Horas que Você já Jogou
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    placeholder="Ex: 5"
                    value={hoursPlayed || ''}
                    onChange={(e) => setHoursPlayed(e.target.value ? parseInt(e.target.value) : 0)}
                    className={`w-full px-3 py-2 rounded-xl border text-white placeholder-slate-500 focus:outline-none text-xs font-mono ${
                      isDeathNote
                        ? 'bg-death-900 border-red-950/80 focus:border-death-crimson'
                        : 'bg-gamer-800 border-slate-700 focus:border-neon-cyan'
                    }`}
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-500 font-mono">h</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Essas horas são exibidas no card do jogo e criam uma barra de progresso visual em tempo real!
            </p>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Observação (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Quero jogar depois de terminar God of War..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-neon-cyan"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-gamer-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 font-black text-xs shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {editingGame ? 'Salvar Alterações' : 'Cadastrar Jogo'}
          </button>
        </div>

      </div>
    </div>
  );
};
