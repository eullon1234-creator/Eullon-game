import React from 'react';
import { Gamepad2, Search, Plus, Dices, Moon, Sun, Cloud, CloudOff } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Navbar: React.FC = () => {
  const {
    setIsAddModalOpen,
    setIsPickerModalOpen,
    setIsSearchModalOpen,
    setEditingGame,
    settings,
    updateSettings,
    setActiveTab,
    games,
    isCloudConnected,
  } = useGame();

  const handleOpenAdd = () => {
    setEditingGame(null);
    setIsAddModalOpen(true);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-gamer-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-cyan via-blue-600 to-purple-600 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-gamer-950 rounded-[14px] flex items-center justify-center text-neon-cyan">
              <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-neon-cyan transition-colors">
                GAME TRACKER
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
              Minha Biblioteca Pessoal
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-gamer-900/90 hover:bg-gamer-850 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-neon-cyan group-hover:scale-110 transition-transform" />
              <span>Buscar em {games.length} jogos...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-gamer-800 border border-slate-700 rounded-md">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cloud Sync Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
              isCloudConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
            }`}
            title={isCloudConnected ? 'Conectado ao Firebase Firestore' : 'Modo local (offline)'}
          >
            {isCloudConnected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Cloud className="w-3.5 h-3.5" />
                <span>Nuvem</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Local</span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden p-2 rounded-xl bg-gamer-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sorteador */}
          <button
            onClick={() => setIsPickerModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="O que eu vou jogar?"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">O que jogar?</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-gamer-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Alternar tema"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Add Game */}
          <button
            onClick={handleOpenAdd}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 font-bold text-xs sm:text-sm shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Adicionar Jogo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
