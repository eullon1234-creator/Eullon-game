export type GameStatus = 'playing' | 'completed' | 'backlog' | 'abandoned';

export interface TimeToBeat {
  main?: number; // horas história principal
  extra?: number; // história + extras/secundárias
  completionist?: number; // 100% / platinar
}

export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  platform: string;
  status: GameStatus;
  rating?: number; // 0 a 10 (opcional)
  favorite: boolean;
  notes?: string;
  timeToBeat?: TimeToBeat;
  hoursPlayed?: number; // horas que o jogador já jogou
  createdAt: string;
  updatedAt: string;
}

export type NavigationTab = 
  | 'dashboard'
  | 'library'
  | 'catalog'
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
  rawgApiKey?: string;
}

export type SortOption = 
  | 'recent'
  | 'name_asc'
  | 'name_desc'
  | 'rating_desc'
  | 'rating_asc'
  | 'platform'
  | 'time_asc'
  | 'time_desc';

export type DurationFilter = 'all' | 'short' | 'medium' | 'long' | 'epic';

export interface FilterOptions {
  search: string;
  status: string; // 'all' or GameStatus
  platform: string; // 'all' or specific platform
  favoriteOnly: boolean;
  sortBy: SortOption;
  duration?: DurationFilter;
}
