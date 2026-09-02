import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Game, AppSettings, GameStatus, NavigationTab, FilterOptions } from '../types/game';
import { storageService } from '../services/storage';
import { useToast } from './ToastContext';
import { BackupData } from '../services/exportImport';
import { 
  subscribeToGames, 
  saveGameToFirestore, 
  deleteGameFromFirestore, 
  batchUploadGames, 
  clearAllFirestoreGames 
} from '../services/firebase';

const DEFAULT_FILTERS: FilterOptions = {
  search: '',
  status: 'all',
  platform: 'all',
  favoriteOnly: false,
  sortBy: 'recent',
};

interface GameContextType {
  games: Game[];
  settings: AppSettings;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  filteredGames: Game[];

  // Cloud status
  isCloudConnected: boolean;
  isSyncing: boolean;

  // Modal states
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingGame: Game | null;
  setEditingGame: (game: Game | null) => void;
  isPickerModalOpen: boolean;
  setIsPickerModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Actions
  addGame: (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => Game;
  updateGame: (id: string, updates: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  quickChangeStatus: (id: string, newStatus: GameStatus) => void;
  quickToggleFavorite: (id: string) => void;
  checkDuplicate: (title: string, platform: string, excludeId?: string) => Game | null;
  importGames: (newGames: Partial<Game>[], mode: 'merge' | 'replace') => number;
  restoreFullBackup: (backup: BackupData) => boolean;
  resetToSampleData: () => void;
  clearAllData: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  syncToCloudNow: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [games, setGames] = useState<Game[]>(() => storageService.getGames());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);

  // Cloud & Sync state
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Modals
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Sync theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'death-note');
    if (settings.theme === 'light') {
      root.classList.add('light');
    } else if (settings.theme === 'death-note') {
      root.classList.add('dark', 'death-note');
    } else {
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Keep selectedGame fresh
  useEffect(() => {
    if (selectedGame) {
      const fresh = games.find((g) => g.id === selectedGame.id);
      if (fresh) setSelectedGame(fresh);
    }
  }, [games, selectedGame?.id]);

  // Connect and listen to Firestore in real-time
  useEffect(() => {
    let initialCloudSyncDone = false;

    const unsubscribe = subscribeToGames(
      (cloudGames) => {
        setIsCloudConnected(true);
        if (cloudGames.length > 0) {
          // Cloud has data: use cloud games as source of truth
          setGames(cloudGames);
          storageService.saveGames(cloudGames);
        } else if (!initialCloudSyncDone) {
          // Cloud collection is empty on first connect, seed current local games to Firestore
          const local = storageService.getGames();
          if (local.length > 0) {
            batchUploadGames(local)
              .then(() => {
                console.log('Seed inicial enviado para o Firebase com sucesso!');
              })
              .catch((err) => {
                console.error('Falha ao enviar seed inicial:', err);
              });
          }
        }
        initialCloudSyncDone = true;
      },
      (error) => {
        console.warn('Operando em modo local offline devido a erro no Firestore:', error.message);
        setIsCloudConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateAndSaveGames = useCallback((newGames: Game[]) => {
    setGames(newGames);
    storageService.saveGames(newGames);
  }, []);

  const checkDuplicate = useCallback((title: string, platform: string, excludeId?: string): Game | null => {
    const cleanTitle = title.trim().toLowerCase();
    const cleanPlatform = platform.trim().toLowerCase();
    return games.find((g) => {
      if (excludeId && g.id === excludeId) return false;
      const sameTitle = g.title.trim().toLowerCase() === cleanTitle;
      const samePlatform = g.platform.trim().toLowerCase() === cleanPlatform;
      return sameTitle && samePlatform;
    }) || null;
  }, [games]);

  const addGame = useCallback((gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Game => {
    const newGame: Game = {
      ...gameData,
      id: 'game-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newGame, ...games];
    updateAndSaveGames(updated);
    showToast('Jogo adicionado com sucesso!', newGame.title, 'success');

    // Cloud persist
    saveGameToFirestore(newGame).catch((err) => {
      console.warn('Erro ao salvar no Firestore (mantido local):', err);
    });

    return newGame;
  }, [games, updateAndSaveGames, showToast]);

  const updateGame = useCallback((id: string, updates: Partial<Game>) => {
    let updatedTarget: Game | null = null;
    const updated = games.map((g) => {
      if (g.id === id) {
        updatedTarget = {
          ...g,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        return updatedTarget;
      }
      return g;
    });

    updateAndSaveGames(updated);
    showToast('Jogo atualizado!', undefined, 'success');

    if (updatedTarget) {
      saveGameToFirestore(updatedTarget).catch((err) => {
        console.warn('Erro ao atualizar no Firestore (mantido local):', err);
      });
    }
  }, [games, updateAndSaveGames, showToast]);

  const deleteGame = useCallback((id: string) => {
    const target = games.find((g) => g.id === id);
    const updated = games.filter((g) => g.id !== id);
    updateAndSaveGames(updated);
    if (selectedGame?.id === id) setSelectedGame(null);
    showToast('Jogo removido da biblioteca.', target?.title, 'info');

    // Cloud delete
    deleteGameFromFirestore(id).catch((err) => {
      console.warn('Erro ao excluir no Firestore (mantido local):', err);
    });
  }, [games, selectedGame, updateAndSaveGames, showToast]);

  const quickChangeStatus = useCallback((id: string, newStatus: GameStatus) => {
    const target = games.find((g) => g.id === id);
    if (!target) return;
    updateGame(id, { status: newStatus });
  }, [games, updateGame]);

  const quickToggleFavorite = useCallback((id: string) => {
    const target = games.find((g) => g.id === id);
    if (!target) return;
    const newFav = !target.favorite;
    updateGame(id, { favorite: newFav });
    showToast(newFav ? 'Adicionado aos favoritos ❤️' : 'Removido dos favoritos', target.title, 'info');
  }, [games, updateGame, showToast]);

  const importGames = useCallback((importedGames: Partial<Game>[], mode: 'merge' | 'replace'): number => {
    let finalGames: Game[] = [];
    const validImported = importedGames
      .filter((g) => g.title && g.title.trim().length > 0)
      .map((g) => ({
        id: g.id || 'game-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        title: g.title!.trim(),
        coverUrl: g.coverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
        platform: g.platform || 'PC 💲 (Comprado)',
        status: (['playing', 'completed', 'backlog', 'abandoned'].includes(g.status as any) ? g.status : 'backlog') as GameStatus,
        rating: g.rating,
        favorite: !!g.favorite,
        notes: g.notes,
        createdAt: g.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

    if (mode === 'replace') {
      finalGames = validImported;
    } else {
      const existing = [...games];
      validImported.forEach((imp) => {
        const isDup = existing.some(
          (e) => e.title.toLowerCase() === imp.title.toLowerCase() &&
            e.platform.toLowerCase() === imp.platform.toLowerCase()
        );
        if (!isDup) {
          existing.push(imp);
        }
      });
      finalGames = existing;
    }

    updateAndSaveGames(finalGames);
    showToast('Importação concluída!', `${validImported.length} jogos processados`, 'success');

    // Cloud upload batch
    batchUploadGames(finalGames).catch((err) => {
      console.warn('Erro ao sincronizar importação com Firestore:', err);
    });

    return validImported.length;
  }, [games, updateAndSaveGames, showToast]);

  const restoreFullBackup = useCallback((backup: BackupData): boolean => {
    if (!backup.games || !Array.isArray(backup.games)) {
      showToast('Arquivo de backup inválido.', undefined, 'error');
      return false;
    }

    setGames(backup.games);
    storageService.saveGames(backup.games);

    if (backup.settings) {
      setSettings(backup.settings);
      storageService.saveSettings(backup.settings);
    }

    showToast('Backup restaurado com sucesso!', `${backup.games.length} jogos carregados`, 'success');

    batchUploadGames(backup.games).catch((err) => {
      console.warn('Erro ao sincronizar backup com Firestore:', err);
    });

    return true;
  }, [showToast]);

  const resetToSampleData = useCallback(() => {
    const def = storageService.resetToDefaults();
    setGames(def.games);
    setSettings(def.settings);
    showToast('Dados restaurados para demonstração!', undefined, 'info');

    batchUploadGames(def.games).catch((err) => {
      console.warn('Erro ao enviar dados de demonstração ao Firestore:', err);
    });
  }, [showToast]);

  const clearAllData = useCallback(() => {
    storageService.clearAll();
    setGames([]);
    showToast('Biblioteca completamente limpa.', undefined, 'info');

    clearAllFirestoreGames().catch((err) => {
      console.warn('Erro ao limpar Firestore:', err);
    });
  }, [showToast]);

  const syncToCloudNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      await batchUploadGames(games);
      setIsCloudConnected(true);
      showToast('Sincronizado com o Firebase!', `${games.length} jogos salvos na nuvem`, 'success');
    } catch (err: any) {
      showToast('Falha na sincronização com Firebase', err?.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  }, [games, showToast]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      storageService.saveSettings(updated);
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (filters.search.trim()) {
        const s = filters.search.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(s);
        const matchPlatform = game.platform.toLowerCase().includes(s);
        if (!matchTitle && !matchPlatform) return false;
      }

      if (filters.status !== 'all' && game.status !== filters.status) return false;
      if (filters.platform !== 'all' && game.platform !== filters.platform) return false;
      if (filters.favoriteOnly && !game.favorite) return false;

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'rating_desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating_asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'platform':
          return a.platform.localeCompare(b.platform);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [games, filters]);

  return (
    <GameContext.Provider
      value={{
        games,
        settings,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        filteredGames,
        isCloudConnected,
        isSyncing,
        selectedGame,
        setSelectedGame,
        isAddModalOpen,
        setIsAddModalOpen,
        editingGame,
        setEditingGame,
        isPickerModalOpen,
        setIsPickerModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        addGame,
        updateGame,
        deleteGame,
        quickChangeStatus,
        quickToggleFavorite,
        checkDuplicate,
        importGames,
        restoreFullBackup,
        resetToSampleData,
        clearAllData,
        updateSettings,
        syncToCloudNow,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de um GameProvider');
  }
  return context;
};
