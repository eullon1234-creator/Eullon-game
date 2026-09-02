import { Game, AppSettings } from '../types/game';
import { INITIAL_GAMES } from '../data/initialGames';

const STORAGE_KEYS = {
  GAMES: 'game_tracker_pro_games_v2',
  SETTINGS: 'game_tracker_pro_settings_v2',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  viewMode: 'grid',
};

export interface IStorageService {
  getGames(): Game[];
  saveGames(games: Game[]): void;
  getSettings(): AppSettings;
  saveSettings(settings: AppSettings): void;
  clearAll(): void;
  resetToDefaults(): { games: Game[]; settings: AppSettings };
}

class LocalStorageService implements IStorageService {
  getGames(): Game[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (!data) {
        this.saveGames(INITIAL_GAMES);
        return INITIAL_GAMES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Erro ao ler jogos do localStorage:', e);
      return INITIAL_GAMES;
    }
  }

  saveGames(games: Game[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (e) {
      console.error('Erro ao salvar jogos no localStorage:', e);
    }
  }

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(data),
      };
    } catch (e) {
      console.error('Erro ao ler configurações do localStorage:', e);
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
    }
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.GAMES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }

  resetToDefaults(): { games: Game[]; settings: AppSettings } {
    this.saveGames(INITIAL_GAMES);
    this.saveSettings(DEFAULT_SETTINGS);
    return {
      games: INITIAL_GAMES,
      settings: DEFAULT_SETTINGS,
    };
  }
}

export const storageService: IStorageService = new LocalStorageService();
