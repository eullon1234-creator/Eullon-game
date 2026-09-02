export type GameStatus = 'playing' | 'completed' | 'backlog' | 'abandoned';

export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  platform: string;
  status: GameStatus;
  rating?: number; // 0 a 10 (opcional)
  favorite: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'library'
  | 'playing'
  | 'completed'
  | 'backlog'
  | 'abandoned'
  | 'favorites'
  | 'settings';

export type ThemeMode = 'dark' | 'light' | 'death-note';

export interface AppSettings {
  theme: ThemeMode;
  viewMode: 'grid' | 'list';
}

export type SortOption = 
  | 'recent'
  | 'name_asc'
  | 'name_desc'
  | 'rating_desc'
  | 'rating_asc'
  | 'platform';

export interface FilterOptions {
  search: string;
  status: string; // 'all' or GameStatus
  platform: string; // 'all' or specific platform
  favoriteOnly: boolean;
  sortBy: SortOption;
}
