import React from 'react';
import { 
  LayoutDashboard, Library, PlayCircle, CheckCircle2, 
  BookMarked, XCircle, Heart, Settings, ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { NavigationTab } from '../../types/game';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, games } = useGame();

  const playingCount = games.filter((g) => g.status === 'playing').length;
  const completedCount = games.filter((g) => g.status === 'completed').length;
  const backlogCount = games.filter((g) => g.status === 'backlog').length;
  const abandonedCount = games.filter((g) => g.status === 'abandoned').length;
  const favoritesCount = games.filter((g) => g.favorite).length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'library',
      label: 'Biblioteca',
      icon: <Library className="w-4 h-4" />,
      badge: games.length,
      badgeColor: 'bg-gamer-800 text-slate-300',
    },
    {
      id: 'playing',
      label: 'Jogando',
      icon: <PlayCircle className="w-4 h-4 text-neon-cyan" />,
      badge: playingCount,
      badgeColor: 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30',
    },
    {
      id: 'completed',
      label: 'Zerados',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: completedCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'backlog',
      label: 'Quero Jogar',
      icon: <BookMarked className="w-4 h-4 text-purple-300" />,
      badge: backlogCount,
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    },
    {
      id: 'abandoned',
      label: 'Desisti',
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
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-800/80 bg-gamer-950/40 p-4 space-y-6">
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Menu Principal
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-blue-600/10 text-white border border-neon-cyan/40 shadow-glow-cyan/50 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-gamer-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'scale-110' : 'text-slate-400 group-hover:text-slate-200'} transition-transform`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-neon-cyan" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
