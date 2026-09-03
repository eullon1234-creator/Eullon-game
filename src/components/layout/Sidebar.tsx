import React from 'react';
import { 
  LayoutDashboard, Library, PlayCircle, CheckCircle2, 
  BookMarked, XCircle, Heart, Settings, ChevronRight, Sparkles
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { NavigationTab } from '../../types/game';
import { CURATED_GAMES } from '../../data/curatedGames';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, games, settings } = useGame();
  const isDeathNote = settings.theme === 'death-note';

  const playingCount = games.filter((g) => g.status === 'playing').length;
  const completedCount = games.filter((g) => g.status === 'completed').length;
  const backlogCount = games.filter((g) => g.status === 'backlog').length;
  const abandonedCount = games.filter((g) => g.status === 'abandoned').length;
  const favoritesCount = games.filter((g) => g.favorite).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: isDeathNote ? 'Sumário do Caderno' : 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'library',
      label: isDeathNote ? 'Todos os Registros' : 'Biblioteca',
      icon: <Library className="w-4 h-4" />,
      badge: games.length,
      badgeColor: isDeathNote ? 'bg-death-800 text-death-parchment/80 border border-death-crimson/20' : 'bg-gamer-800 text-slate-300',
    },
    {
      id: 'catalog',
      label: isDeathNote ? 'Grimório de Jogos' : 'Catálogo & Descoberta',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: CURATED_GAMES.length,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'playing',
      label: isDeathNote ? 'Em Andamento' : 'Jogando',
      icon: <PlayCircle className={`w-4 h-4 ${isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'}`} />,
      badge: playingCount,
      badgeColor: isDeathNote 
        ? 'bg-death-crimson/20 text-death-crimson border border-death-crimson/30' 
        : 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30',
    },
    {
      id: 'completed',
      label: isDeathNote ? 'Finalizados' : 'Zerados',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: completedCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'backlog',
      label: isDeathNote ? 'Marcados para Jogar' : 'Quero Jogar',
      icon: <BookMarked className={`w-4 h-4 ${isDeathNote ? 'text-red-300' : 'text-purple-300'}`} />,
      badge: backlogCount,
      badgeColor: isDeathNote 
        ? 'bg-red-950/40 text-red-300 border border-red-800/40' 
        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    },
    {
      id: 'abandoned',
      label: isDeathNote ? 'Desistências' : 'Desisti',
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
      badge: abandonedCount,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'favorites',
      label: 'Favoritos',
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      badge: favoritesCount,
      badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className={`w-64 flex-shrink-0 hidden md:flex flex-col border-r p-4 space-y-6 transition-colors duration-300 ${
      isDeathNote 
        ? 'border-death-crimson/20 bg-death-950/60' 
        : 'border-slate-800/80 bg-gamer-950/40'
    }`}>
      <nav className="space-y-1.5 flex-1">
        <div className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
          isDeathNote ? 'text-death-smoke font-deathnote-sub' : 'text-slate-500'
        }`}>
          {isDeathNote ? 'Páginas do Caderno' : 'Menu Principal'}
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? isDeathNote
                    ? 'bg-gradient-to-r from-death-crimson/25 to-red-950/20 text-white border border-death-crimson/50 shadow-glow-crimson font-bold'
                    : 'bg-gradient-to-r from-neon-cyan/20 to-blue-600/10 text-white border border-neon-cyan/40 shadow-glow-cyan/50 font-bold'
                  : isDeathNote
                    ? 'text-death-smoke hover:text-white hover:bg-death-900/60'
                    : 'text-slate-400 hover:text-white hover:bg-gamer-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'scale-110' : 'text-slate-400 group-hover:text-slate-200'} transition-transform`}>
                  {item.icon}
                </span>
                <span className={isDeathNote ? 'tracking-wide' : ''}>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className={`w-3.5 h-3.5 ${isDeathNote ? 'text-death-crimson' : 'text-neon-cyan'}`} />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
