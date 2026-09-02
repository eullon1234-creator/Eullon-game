import React, { useState } from 'react';
import { 
  LayoutDashboard, Library, PlayCircle, BookMarked, 
  MoreHorizontal, Heart, CheckCircle2, XCircle, Settings, X 
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { NavigationTab } from '../../types/game';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, games, settings } = useGame();
  const isDeathNote = settings.theme === 'death-note';
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const playingCount = games.filter((g) => g.status === 'playing').length;
  const backlogCount = games.filter((g) => g.status === 'backlog').length;

  const mainTabs = [
    { id: 'dashboard' as NavigationTab, label: isDeathNote ? 'Sumário' : 'Início', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'library' as NavigationTab, label: isDeathNote ? 'Caderno' : 'Biblioteca', icon: <Library className="w-5 h-5" /> },
    { id: 'playing' as NavigationTab, label: isDeathNote ? 'Andamento' : 'Jogando', icon: <PlayCircle className="w-5 h-5" />, badge: playingCount },
    { id: 'backlog' as NavigationTab, label: isDeathNote ? 'Marcados' : 'Quero Jogar', icon: <BookMarked className="w-5 h-5" />, badge: backlogCount },
  ];

  const moreTabs = [
    { id: 'completed' as NavigationTab, label: isDeathNote ? 'Finalizados' : 'Zerados', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
    { id: 'abandoned' as NavigationTab, label: isDeathNote ? 'Desistências' : 'Desisti', icon: <XCircle className="w-5 h-5 text-rose-400" /> },
    { id: 'favorites' as NavigationTab, label: 'Favoritos', icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { id: 'settings' as NavigationTab, label: 'Configurações', icon: <Settings className="w-5 h-5 text-slate-300" /> },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden flex flex-col justify-end animate-fadeIn"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className={`border-t rounded-t-3xl p-6 space-y-4 animate-slide-up ${
              isDeathNote 
                ? 'bg-death-900 border-death-crimson/40 text-death-parchment' 
                : 'bg-gamer-900 border-slate-700/80'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDeathNote ? 'border-death-crimson/20' : 'border-slate-800'
            }`}>
              <h3 className={`text-sm font-bold ${isDeathNote ? 'text-white font-deathnote tracking-wider text-base' : 'text-white'}`}>
                {isDeathNote ? 'Outras Páginas do Caderno' : 'Outras Listas'}
              </h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {moreTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMoreOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold text-left transition-all ${
                    activeTab === tab.id
                      ? isDeathNote 
                        ? 'bg-death-850 border-death-crimson/60 text-death-crimson shadow-glow-crimson'
                        : 'bg-gamer-800 border-neon-cyan/50 text-neon-cyan shadow-sm'
                      : isDeathNote
                        ? 'bg-death-950/60 border-death-crimson/20 text-death-smoke hover:bg-death-850'
                        : 'bg-gamer-850/60 border-slate-800 text-slate-300 hover:bg-gamer-850'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className={`fixed bottom-0 inset-x-0 z-40 md:hidden backdrop-blur-xl border-t py-2 px-3 flex items-center justify-around transition-colors duration-300 ${
        isDeathNote 
          ? 'bg-death-950/95 border-death-crimson/30 shadow-[0_-4px_20px_rgba(229,9,20,0.15)]' 
          : 'bg-gamer-950/90 border-slate-800/90'
      }`}>
        {mainTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive 
                  ? isDeathNote ? 'text-death-crimson scale-105' : 'text-neon-cyan' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`absolute -top-1 -right-2 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isDeathNote ? 'bg-death-crimson text-white' : 'bg-neon-cyan text-gamer-950'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            moreTabs.some((t) => t.id === activeTab) 
              ? isDeathNote ? 'text-death-crimson' : 'text-neon-cyan' 
              : 'text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Mais</span>
        </button>
      </nav>
    </>
  );
};
