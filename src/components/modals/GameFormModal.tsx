import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Image as ImageIcon, Heart, Sparkles } from 'lucide-react';
import { Game, GameStatus } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { STATUS_CONFIG, DEFAULT_PLATFORMS } from '../../data/defaultCategories';
import { GameCoverImage } from '../common/GameCoverImage';
import { getRatingClassification } from '../common/GameRatingBadge';

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
  } = useGame();

  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [platform, setPlatform] = useState('PC 💲 (Comprado)');
  const [status, setStatus] = useState<GameStatus>('backlog');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [favorite, setFavorite] = useState(false);
  const [notes, setNotes] = useState('');

  const [duplicateMatch, setDuplicateMatch] = useState<Game | null>(null);

  useEffect(() => {
    if (editingGame) {
      setTitle(editingGame.title);
      setCoverUrl(editingGame.coverUrl || '');
      setPlatform(editingGame.platform || 'PC 💲 (Comprado)');
      setStatus(editingGame.status);
      setRating(editingGame.rating);
      setFavorite(editingGame.favorite);
      setNotes(editingGame.notes || '');
    } else {
      setTitle('');
      setCoverUrl('');
      setPlatform('PC 💲 (Comprado)');
      setStatus('backlog');
      setRating(undefined);
      setFavorite(false);
      setNotes('');
    }
    setDuplicateMatch(null);
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

    const payload = {
      title: title.trim(),
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
      platform,
      status,
      rating,
      favorite,
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
          
          {/* Cover URL & Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-gamer-850/60 border border-slate-800">
            <div className="w-24 sm:w-28 flex-shrink-0 shadow-lg rounded-xl overflow-hidden bg-gamer-950 border border-slate-700">
              <GameCoverImage src={coverUrl} alt={title || 'Prévia'} />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-neon-cyan" />
                URL da Capa da Imagem
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/capa-do-jogo.jpg"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan text-xs"
              />
              <p className="text-[10px] text-slate-400">
                Copie e cole o link direto de qualquer imagem da internet.
              </p>
            </div>
          </div>

          {/* Nome do Jogo */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Nome do Jogo <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: God of War Ragnarök"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan text-sm font-semibold"
            />
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
