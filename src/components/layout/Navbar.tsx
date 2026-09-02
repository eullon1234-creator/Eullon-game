import React from 'react';
import { Gamepad2, Search, Plus, Dices, Moon, Sun, Cloud, CloudOff, BookOpen } from 'lucide-react';
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

  const isDeathNote = settings.theme === 'death-note';

  const handleOpenAdd = () => {
    setEditingGame(null);
    setIsAddModalOpen(true);
  };

  const cycleTheme = () => {
    if (settings.theme === 'dark') {
      updateSettings({ theme: 'death-note' });
    } else if (settings.theme === 'death-note') {
      updateSettings({ theme: 'light' });
    } else {
      updateSettings({ theme: 'dark' });
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
      isDeathNote 
        ? 'border-death-crimson/30 bg-death-950/90 shadow-[0_4px_25px_rgba(229,9,20,0.1)]' 
        : 'border-slate-800/80 bg-gamer-950/85'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          {isDeathNote ? (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-death-crimson via-red-900 to-black p-0.5 shadow-glow-crimson group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-death-950 rounded-[14px] flex items-center justify-center text-death-crimson font-deathnote text-2xl font-bold select-none">
                𝕷
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-cyan via-blue-600 to-purple-600 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-gamer-950 rounded-[14px] flex items-center justify-center text-neon-cyan">
                <Gamepad2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-base sm:text-lg tracking-tight text-white transition-colors ${
                isDeathNote ? 'font-deathnote text-xl sm:text-2xl group-hover:text-death-crimson' : 'group-hover:text-neon-cyan'
              }`}>
                {isDeathNote ? 'DEATH NOTE' : 'GAME TRACKER'}
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border uppercase tracking-wider ${
                isDeathNote 
                  ? 'bg-death-crimson/20 text-death-crimson border-death-crimson/40 font-deathnote-sub' 
                  : 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40'
              }`}>
                {isDeathNote ? 'GAME LOG' : 'PRO'}
              </span>
            </div>
            <p className={`text-[10px] -mt-1 hidden sm:block ${isDeathNote ? 'text-death-smoke font-deathnote-sub italic' : 'text-slate-400'}`}>
              {isDeathNote ? 'Caderno de Registro de Jogos' : 'Minha Biblioteca Pessoal'}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl border text-xs transition-all shadow-inner group ${
              isDeathNote 
                ? 'bg-death-900/90 hover:bg-death-850 border-death-crimson/30 hover:border-death-crimson/60 text-death-smoke' 
                : 'bg-gamer-900/90 hover:bg-gamer-850 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'
              }`} />
              <span>{isDeathNote ? `Buscar entre os ${games.length} jogos do caderno...` : `Buscar em ${games.length} jogos...`}</span>
            </div>
            <kbd className={`px-2 py-0.5 text-[10px] font-mono rounded-md border ${
              isDeathNote 
                ? 'bg-death-850 text-death-parchment/70 border-death-crimson/30' 
                : 'bg-gamer-800 text-slate-400 border-slate-700'
            }`}>
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
                : isDeathNote 
                  ? 'bg-death-900/80 border-death-crimson/20 text-death-smoke' 
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
            className={`md:hidden p-2 rounded-xl border ${
              isDeathNote 
                ? 'bg-death-900 border-death-crimson/30 text-death-crimson' 
                : 'bg-gamer-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Buscar"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sorteador */}
          <button
            onClick={() => setIsPickerModalOpen(true)}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isDeathNote
                ? 'bg-death-crimson/15 hover:bg-death-crimson/25 border-death-crimson/40 text-death-parchment hover:text-white hover:shadow-glow-crimson'
                : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300 hover:text-white'
            }`}
            title={isDeathNote ? 'Sortear próximo jogo do caderno' : 'O que eu vou jogar?'}
          >
            {isDeathNote ? (
              <span className="text-sm leading-none">🍎</span>
            ) : (
              <Dices className="w-4 h-4 text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {isDeathNote ? 'Sortear Jogo' : 'O que jogar?'}
            </span>
          </button>

          {/* Theme Cycler (Gamer Dark -> Death Note -> Light) */}
          <button
            onClick={cycleTheme}
            className={`p-2 rounded-xl border transition-all ${
              isDeathNote
                ? 'bg-death-900 border-death-crimson/50 hover:border-death-crimson text-death-crimson shadow-glow-crimson'
                : 'bg-gamer-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={`Tema atual: ${
              settings.theme === 'death-note'
                ? 'Death Note (Clique para Claro)'
                : settings.theme === 'dark'
                ? 'Escuro Gamer (Clique para Death Note)'
                : 'Claro (Clique para Escuro)'
            }`}
          >
            {settings.theme === 'death-note' ? (
              <span className="text-sm leading-none select-none block transform hover:scale-110 transition-transform">
                🍎
              </span>
            ) : settings.theme === 'dark' ? (
              <Moon className="w-4 h-4 text-neon-cyan" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Add Game */}
          <button
            onClick={handleOpenAdd}
            className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 ${
              isDeathNote
                ? 'bg-gradient-to-r from-death-crimson via-red-600 to-red-800 text-white shadow-glow-crimson hover:brightness-110 border border-red-500/30'
                : 'bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 shadow-glow-cyan hover:brightness-110'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">
              {isDeathNote ? 'Escrever no Caderno' : 'Adicionar Jogo'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
