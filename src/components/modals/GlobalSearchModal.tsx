import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GameCoverImage } from '../common/GameCoverImage';
import { GameStatusBadge } from '../common/GameStatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    games,
    setSelectedGame,
  } = useGame();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const handleClose = () => {
    setIsSearchModalOpen(false);
  };

  const normalizeText = (text: string) => {
    return (text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const q = normalizeText(query);
  const results = q.length > 0
    ? games
        .filter((g) => {
          const t = normalizeText(g.title);
          const p = normalizeText(g.platform);
          return t.includes(q) || p.includes(q);
        })
        .sort((a, b) => {
          const getScore = (g: (typeof games)[0]) => {
            const t = normalizeText(g.title);
            if (t === q) return 1000;
            if (t.startsWith(q)) return 800;
            if (t.includes(` ${q}`) || t.includes(`:${q}`) || t.includes(`- ${q}`)) return 600;
            if (t.includes(q)) return 400;
            return 100;
          };
          return getScore(b) - getScore(a);
        })
    : [];

  const handleSelectGame = (game: (typeof games)[0]) => {
    setSelectedGame(game);
    handleClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 p-2 sm:p-4 bg-black/80 backdrop-blur-md safe-top safe-bottom animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-gamer-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-scaleIn flex flex-col max-h-[88vh]">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-800 bg-gamer-950/70">
          <Search className="w-5 h-5 text-neon-cyan flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            placeholder="Pesquisar por nome do jogo ou plataforma..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-gamer-800 border border-slate-700 rounded-md mr-2">
              ESC
            </kbd>
          )}
          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {query.trim().length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Digite para buscar rapidamente qualquer jogo da sua biblioteca.
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400">
                {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </div>
              {results.map((game) => (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gamer-850/50 hover:bg-gamer-800 border border-slate-800/80 hover:border-neon-cyan/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow">
                      <GameCoverImage src={game.coverUrl} alt={game.title} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors truncate">
                        {game.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {game.platform}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <GameStatusBadge status={game.status} size="sm" />
                        {game.rating !== undefined && (
                          <span className="text-[10px] text-amber-300 font-mono font-bold">
                            ⭐ {game.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Nenhum jogo encontrado para "<strong>{query}</strong>".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
