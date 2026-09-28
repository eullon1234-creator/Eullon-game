// src/views/DaysGoneView.tsx
import React, { useState, useMemo } from 'react';
import { 
  Flame, Shield, Clock, Calendar, Heart, Star, 
  Play, Bookmark, Trophy, PauseCircle, Trash2,
  ExternalLink, Compass, Crosshair, Sparkles,
  ChevronRight, AlertTriangle, Eye, Video,
  BookOpen, Layers, Award, CheckCircle2, X
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { 
  DAYS_GONE_INFO, 
  DAYS_GONE_CHARACTERS, 
  DAYS_GONE_ENEMIES, 
  DAYS_GONE_TIPS, 
  DAYS_GONE_GALLERY, 
  DAYS_GONE_VIDEOS,
  DaysGoneMedia
} from '../data/daysGoneData';
import { GameStatus } from '../types/game';

// Ícone SVG de Moto / Biker
export const MotorcycleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="5" cy="16" r="3" />
    <circle cx="19" cy="16" r="3" />
    <path d="M12 17h4l2-5h-4l-3-4h-4l-1 4h5" />
    <path d="M9 17l1-5" />
    <path d="M14 8h2" />
  </svg>
);

export const DaysGoneView: React.FC = () => {
  const { games, addGame, updateGame, deleteGame, quickChangeStatus, quickToggleFavorite } = useGame();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState<'overview' | 'characters' | 'enemies' | 'tips' | 'gallery' | 'videos'>('overview');
  const [selectedPhoto, setSelectedPhoto] = useState<DaysGoneMedia | null>(null);

  // Localiza o jogo Days Gone na biblioteca do usuário
  const userDaysGone = useMemo(() => {
    return games.find((g) => {
      const titleLower = g.title.toLowerCase().trim();
      return titleLower === 'days gone' || (g.notes && g.notes.includes(DAYS_GONE_INFO.id));
    });
  }, [games]);

  const isInLibrary = !!userDaysGone;
  const currentStatus = userDaysGone?.status;
  const isFav = !!userDaysGone?.favorite;

  // Estados locais para edição rápida de progresso
  const [hoursInput, setHoursInput] = useState<number>(userDaysGone?.hoursPlayed || 0);
  const [ratingInput, setRatingInput] = useState<number>(userDaysGone?.rating || 9);
  const [notesInput, setNotesInput] = useState<string>(userDaysGone?.notes || '');
  const [isEditingJournal, setIsEditingJournal] = useState(false);

  // Sincroniza estados locais se o jogo for carregado/atualizado
  React.useEffect(() => {
    if (userDaysGone) {
      setHoursInput(userDaysGone.hoursPlayed || 0);
      setRatingInput(userDaysGone.rating || 9);
      setNotesInput(userDaysGone.notes || '');
    }
  }, [userDaysGone]);

  // Ação de Definir Status do Days Gone
  const handleSetStatus = (status: GameStatus) => {
    if (userDaysGone) {
      quickChangeStatus(userDaysGone.id, status);
      const statusNames: Record<GameStatus, string> = {
        playing: 'Jogando 🏍️',
        completed: 'Zerado 🏆',
        backlog: 'Quero Jogar 📋',
        abandoned: 'Pausado ⏸️',
      };
      showToast(`Days Gone alterado para ${statusNames[status]}!`, 'success');
    } else {
      addGame({
        title: 'Days Gone',
        platform: 'PC / PlayStation',
        status,
        rating: 9,
        favorite: false,
        coverUrl: DAYS_GONE_INFO.coverUrl,
        notes: `[ID:${DAYS_GONE_INFO.id}] Evento Especial do Mês: Farewell Wilderness, Oregon.`,
        timeToBeat: {
          main: DAYS_GONE_INFO.timeToBeat.mainStory,
          extra: DAYS_GONE_INFO.timeToBeat.extra,
          completionist: DAYS_GONE_INFO.timeToBeat.completionist,
        },
        hoursPlayed: status === 'completed' ? DAYS_GONE_INFO.timeToBeat.mainStory : 0,
      });
      showToast('🏍️ Days Gone adicionado com sucesso à sua biblioteca!', 'success');
    }
  };

  // Alternar Favorito
  const handleToggleFavorite = () => {
    if (userDaysGone) {
      quickToggleFavorite(userDaysGone.id);
      showToast(userDaysGone.favorite ? 'Removido dos favoritos' : '❤️ Days Gone favoritado!', 'success');
    } else {
      addGame({
        title: 'Days Gone',
        platform: 'PC / PlayStation',
        status: 'backlog',
        rating: 9,
        favorite: true,
        coverUrl: DAYS_GONE_INFO.coverUrl,
        notes: `[ID:${DAYS_GONE_INFO.id}] Favorito do Evento Especial.`,
        timeToBeat: {
          main: DAYS_GONE_INFO.timeToBeat.mainStory,
          extra: DAYS_GONE_INFO.timeToBeat.extra,
          completionist: DAYS_GONE_INFO.timeToBeat.completionist,
        },
        hoursPlayed: 0,
      });
      showToast('❤️ Days Gone adicionado aos seus favoritos!', 'success');
    }
  };

  // Salvar Notas, Horas e Avaliação
  const handleSaveProgress = () => {
    if (userDaysGone) {
      updateGame(userDaysGone.id, {
        hoursPlayed: hoursInput,
        rating: ratingInput,
        notes: notesInput,
      });
      showToast('🛡️ Diário de sobrevivência em Days Gone salvo!', 'success');
      setIsEditingJournal(false);
    } else {
      addGame({
        title: 'Days Gone',
        platform: 'PC / PlayStation',
        status: 'playing',
        rating: ratingInput,
        favorite: false,
        coverUrl: DAYS_GONE_INFO.coverUrl,
        notes: notesInput || `[ID:${DAYS_GONE_INFO.id}] Notas de sobrevivência.`,
        timeToBeat: {
          main: DAYS_GONE_INFO.timeToBeat.mainStory,
          extra: DAYS_GONE_INFO.timeToBeat.extra,
          completionist: DAYS_GONE_INFO.timeToBeat.completionist,
        },
        hoursPlayed: hoursInput,
      });
      showToast('🏍️ Days Gone registrado com suas horas e notas!', 'success');
      setIsEditingJournal(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn text-slate-100">
      
      {/* HERO BANNER: EVENTO ESPECIAL DO MÊS - DAYS GONE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/70 via-stone-950 to-neutral-950 border border-amber-500/40 shadow-2xl p-6 sm:p-8 lg:p-10">
        {/* Background Artwork com máscara */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none scale-105"
          style={{ backgroundImage: `url(${DAYS_GONE_INFO.bannerUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Informações Principais */}
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-orange-500/20 border border-amber-400/50 text-amber-300 text-xs font-black font-mono uppercase tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span>Evento do Mês • Jogo em Destaque</span>
              <span className="text-amber-500">•</span>
              <span>Farewell, Oregon</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans">
                <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">
                  Days Gone
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-amber-100/90 font-medium">
              {DAYS_GONE_INFO.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {DAYS_GONE_INFO.synopsis}
            </p>

            {/* Badges de Destaque */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-black/60 border border-amber-400/30 text-amber-300 font-bold font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{DAYS_GONE_INFO.releaseYear}</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-black/60 border border-amber-400/30 text-amber-300 font-bold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{DAYS_GONE_INFO.metacriticScore} Metacritic</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                {DAYS_GONE_INFO.userScoreSteam}
              </span>
              <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 font-bold">
                {DAYS_GONE_INFO.developer}
              </span>
            </div>
          </div>

          {/* Card de Capa Oficial & Ações Rápidas de Biblioteca */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 shadow-2xl shrink-0">
            <div className="relative w-44 aspect-game-cover rounded-xl overflow-hidden shadow-lg border border-amber-500/40 group">
              <img
                src={DAYS_GONE_INFO.coverUrl}
                alt="Days Gone"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all ${
                  isFav 
                    ? 'bg-rose-500 text-white shadow-md' 
                    : 'bg-black/60 text-slate-300 hover:text-rose-400 hover:bg-black/80'
                }`}
                title={isFav ? 'Remover dos favoritos' : 'Favoritar Days Gone'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="space-y-2 w-full text-center">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Status na Sua Biblioteca
              </span>

              {/* Botões Rápidos de Status */}
              <div className="grid grid-cols-2 gap-1.5 w-full">
                <button
                  type="button"
                  onClick={() => handleSetStatus('playing')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStatus === 'playing'
                      ? 'bg-teal-500 text-slate-950 border-teal-400 font-black shadow-glow'
                      : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-teal-500/40'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Jogando</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetStatus('completed')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStatus === 'completed'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-glow'
                      : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-amber-400/40'
                  }`}
                >
                  <Trophy className="w-3 h-3" />
                  <span>Zerei</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetStatus('backlog')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStatus === 'backlog'
                      ? 'bg-blue-500 text-white border-blue-400 font-black'
                      : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-blue-500/40'
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  <span>Quero Jogar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSetStatus('abandoned')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                    currentStatus === 'abandoned'
                      ? 'bg-slate-600 text-white border-slate-500 font-black'
                      : 'bg-gamer-900 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <PauseCircle className="w-3 h-3" />
                  <span>Pausado</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas de Tempo para Zerar (HowLongToBeat) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-amber-500/20 text-center">
          <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20">
            <span className="text-[11px] text-slate-400 block font-sans">História Principal</span>
            <span className="text-lg font-black text-amber-300 font-mono">
              ~{DAYS_GONE_INFO.timeToBeat.mainStory} Horas
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20">
            <span className="text-[11px] text-slate-400 block font-sans">Campanha + Extras</span>
            <span className="text-lg font-black text-orange-300 font-mono">
              ~{DAYS_GONE_INFO.timeToBeat.extra} Horas
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/20">
            <span className="text-[11px] text-slate-400 block font-sans">100% / Platinar Tudo</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ~{DAYS_GONE_INFO.timeToBeat.completionist} Horas
            </span>
          </div>
        </div>
      </div>

      {/* PAINEL PESSOAL: SEU DIÁRIO & PROGRESSO DE DEACON ST. JOHN */}
      <div className="rounded-3xl bg-gamer-900/80 border border-amber-500/30 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MotorcycleIcon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              Seu Registro Pessoal de Days Gone
            </h2>
            {isInLibrary && (
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                Conectado à Biblioteca
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditingJournal ? (
              <button
                type="button"
                onClick={() => setIsEditingJournal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
              >
                Editar Progresso & Diário
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveProgress}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black shadow-md transition-all"
              >
                Salvar Alterações
              </button>
            )}
          </div>
        </div>

        {/* Campos de Horas, Avaliação e Diário */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold block">Horas Jogadas na Estrada:</span>
            {isEditingJournal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 rounded-xl bg-gamer-900 border border-amber-500/30 text-white font-mono text-base focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setHoursInput(prev => prev + 1)}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold"
                >
                  +1h
                </button>
              </div>
            ) : (
              <div className="text-2xl font-black text-amber-300 font-mono">
                {userDaysGone?.hoursPlayed || 0}h <span className="text-xs text-slate-500 font-sans font-normal">/ ~{DAYS_GONE_INFO.timeToBeat.mainStory}h estimadas</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold block">Sua Nota Pessoal:</span>
            {isEditingJournal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={ratingInput}
                  onChange={(e) => setRatingInput(Math.min(10, Math.max(0, Number(e.target.value))))}
                  className="w-full px-3 py-1.5 rounded-xl bg-gamer-900 border border-amber-500/30 text-amber-300 font-mono text-base focus:outline-none focus:border-amber-400"
                />
                <span className="text-amber-400 font-bold text-lg">★</span>
              </div>
            ) : (
              <div className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
                <span>{userDaysGone?.rating || 9}/10</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-bold block">Status Atual:</span>
            <div className="text-base font-black text-white flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                currentStatus === 'completed'
                  ? 'bg-amber-400 text-slate-950'
                  : currentStatus === 'playing'
                  ? 'bg-teal-400 text-slate-950'
                  : currentStatus === 'backlog'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {currentStatus === 'completed' ? '🏆 Zerado' :
                 currentStatus === 'playing' ? '🏍️ Jogando' :
                 currentStatus === 'backlog' ? '📋 Quero Jogar' :
                 currentStatus === 'abandoned' ? '⏸️ Pausado' : '⚪ Não Iniciado'}
              </span>
              {isFav && <span className="text-rose-500 text-xs font-bold flex items-center gap-1">❤️ Favorito</span>}
            </div>
          </div>
        </div>

        {/* Diário de Memórias e Estratégias */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-bold text-slate-300 block">
            Suas Notas & Memórias na Estrada:
          </label>
          {isEditingJournal ? (
            <textarea
              rows={3}
              placeholder="Ex: Destruí a primeira horda em Cascades! Preciso achar mais sucata para consertar a moto..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full p-3 rounded-2xl bg-black/60 border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400 resize-none font-sans"
            />
          ) : (
            <div className="p-3.5 rounded-2xl bg-black/40 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans min-h-[4rem]">
              {userDaysGone?.notes || 'Nenhuma anotação registrada ainda. Clique em "Editar Progresso & Diário" para salvar suas memórias ou onde parou no jogo!'}
            </div>
          )}
        </div>
      </div>

      {/* NAVEGAÇÃO DE SUB-ABAS DO EVENTO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
            activeSection === 'overview'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/60 shadow-md font-black'
              : 'bg-gamer-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Visão Geral & Acampamentos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('characters')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
            activeSection === 'characters'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/60 shadow-md font-black'
              : 'bg-gamer-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 text-orange-400" />
          <span>Personagens & Mongrels MC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('enemies')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
            activeSection === 'enemies'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/60 shadow-md font-black'
              : 'bg-gamer-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Freakers & Ameaças</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('tips')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
            activeSection === 'tips'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/60 shadow-md font-black'
              : 'bg-gamer-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <span>Dicas Pro & Guia de Hordas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('gallery')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
            activeSection === 'gallery'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/60 shadow-md font-black'
              : 'bg-gamer-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4 text-teal-400" />
          <span>Galeria em HD (Fotos)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('videos')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
            activeSection === 'videos'
              ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/60 shadow-md font-black'
              : 'bg-gamer-900/60 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4 text-cyan-400" />
          <span>Gameplays & Trilha Sonora</span>
        </button>
      </div>

      {/* 1. VISÃO GERAL & ACAMPAMENTOS */}
      {activeSection === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 space-y-3">
              <span className="font-mono text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>O Cenário de Farewell Wilderness</span>
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                Situado na deslumbrante e mortal região vulcânica do alto deserto do Oregon, Days Gone coloca o jogador em um mundo aberto dinâmico. O clima muda em tempo real com chuvas torrenciais, tempestades de neve pesadas e neblina densa, alterando a tração da moto na lama e aumentando a ferocidade dos Freakers.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  🌲 Florestas de Coníferas
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  🏔️ Montanhas Rochosas Nevadas
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  🌋 Cavernas de Tubos de Lava
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 space-y-3">
              <span className="font-mono text-orange-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Os Acampamentos de Sobreviventes</span>
              </span>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="font-bold text-amber-300 block">Acampamento de Copeland (Cascades):</span>
                  <span>Sobrevivencialistas e caçadores que transmitem a rádio "Radio Free Oregon". Excelente para as primeiras melhorias de moto.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="font-bold text-amber-300 block">Hot Springs de Tucker (Belknap):</span>
                  <span>Acampamento linha-dura de trabalhos forçados comandado por Alkai Turner. O melhor fornecedor de armas pesadas no início.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                  <span className="font-bold text-amber-300 block">Lost Lake de Iron Mike (Lost Lake):</span>
                  <span>A comunidade mais próspera e humana, com fazendas e eletricidade. O lar adotivo temporário de Deacon e Boozer.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSONAGENS */}
      {activeSection === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
          {DAYS_GONE_CHARACTERS.map((char, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-gamer-900/80 border border-slate-800 hover:border-amber-400/50 transition-all space-y-3 flex flex-col justify-between shadow-card"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                    {char.badge}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  {char.name}
                </h3>
                <span className="text-xs text-orange-300/90 font-medium block">
                  {char.role}
                </span>
                {char.quote && (
                  <p className="text-[11px] italic text-amber-200/80 bg-black/40 p-2 rounded-xl border border-amber-500/20">
                    {char.quote}
                  </p>
                )}
                <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  {char.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. FREAKERS & INIMIGOS */}
      {activeSection === 'enemies' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeIn">
          {DAYS_GONE_ENEMIES.map((enemy, idx) => {
            const dangerColor = 
              enemy.dangerLevel === 'Extremo' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
              enemy.dangerLevel === 'Alto' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
              enemy.dangerLevel === 'Médio' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
              'bg-slate-700/40 text-slate-300 border-slate-600';

            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-gamer-900/80 border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 flex flex-col justify-between shadow-card"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      {enemy.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${dangerColor}`}>
                      Perigo: {enemy.dangerLevel}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">
                    {enemy.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {enemy.description}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/20 space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block text-[11px] flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                    <span>Como Derrotar:</span>
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {enemy.tactic}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. DICAS PRO & GUIA DE HORDAS */}
      {activeSection === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {DAYS_GONE_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-gamer-900/80 border border-amber-500/20 hover:border-amber-400/40 transition-all space-y-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  {tip.category}
                </span>
              </div>

              <h3 className="text-lg font-black text-white">
                {tip.title}
              </h3>

              <p className="text-xs text-amber-200/90 font-medium">
                {tip.summary}
              </p>

              <ul className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                {tip.details.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 5. GALERIA DE FOTOS EM HD */}
      {activeSection === 'gallery' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DAYS_GONE_GALLERY.map((media, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(media)}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-black cursor-pointer border border-slate-800 hover:border-amber-400/50 transition-all shadow-md"
              >
                <img
                  src={media.imageUrl}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-0.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-200 text-[9px] font-mono font-bold">
                    {media.tag}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">
                    {media.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Zoom de Imagem */}
          {selectedPhoto && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setSelectedPhoto(null)}
            >
              <div 
                className="relative max-w-4xl w-full bg-gamer-950 rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl p-4 space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/70 text-slate-300 hover:text-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[70vh] object-contain rounded-2xl"
                />

                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    {selectedPhoto.tag}
                  </span>
                  <h3 className="text-base font-black text-white">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedPhoto.caption}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. VÍDEOS & GAMEPLAYS */}
      {activeSection === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
          {DAYS_GONE_VIDEOS.map((vid, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-gamer-900/80 border border-slate-800 hover:border-amber-400/40 transition-all space-y-3 flex flex-col justify-between shadow-card"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-mono font-bold uppercase">
                    {vid.type}
                  </span>
                  {vid.duration && (
                    <span className="text-[11px] font-mono text-slate-400">
                      ⏱️ {vid.duration}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-black text-white">
                  {vid.title}
                </h3>
                <span className="text-xs text-amber-400/90 font-bold block">
                  Canal: {vid.channel}
                </span>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {vid.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Assistir no YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
