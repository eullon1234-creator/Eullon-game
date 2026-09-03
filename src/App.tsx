import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './views/DashboardView';
import { LibraryView } from './views/LibraryView';
import { CatalogView } from './views/CatalogView';
import { StatusFilteredView } from './views/StatusFilteredView';
import { SettingsView } from './views/SettingsView';
import { GameFormModal } from './components/modals/GameFormModal';
import { GameDetailModal } from './components/modals/GameDetailModal';
import { SmartPickerModal } from './components/modals/SmartPickerModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { AIAssistantModal } from './components/modals/AIAssistantModal';

const AppContent: React.FC = () => {
  const { activeTab, settings } = useGame();
  const isDeathNote = settings.theme === 'death-note';

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'library':
        return <LibraryView />;
      case 'catalog':
        return <CatalogView />;
      case 'playing':
        return <StatusFilteredView statusFilter="playing" />;
      case 'completed':
        return <StatusFilteredView statusFilter="completed" />;
      case 'backlog':
        return <StatusFilteredView statusFilter="backlog" />;
      case 'abandoned':
        return <StatusFilteredView statusFilter="abandoned" />;
      case 'favorites':
        return <StatusFilteredView isFavorites />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans gamer-grid-bg transition-colors duration-300 ${
      isDeathNote 
        ? 'bg-death-950 text-death-parchment selection:bg-death-crimson selection:text-white' 
        : 'bg-gamer-950 text-slate-100 selection:bg-neon-cyan selection:text-gamer-950'
    }`}>
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-20 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      <BottomNav />

      {/* Simplified Modals */}
      <GameFormModal />
      <GameDetailModal />
      <SmartPickerModal />
      <GlobalSearchModal />
      <AIAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ToastProvider>
  );
}
