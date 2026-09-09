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
  | 'zelda'
  | 'playing'
  | 'completed'
  | 'backlog'
  | 'abandoned'
  | 'favorites'
  | 'settings';

export type ThemeMode = 'dark' | 'light' | 'death-note' | 'zelda';

export type ZeldaTimelineBranch = 
  | 'origins'          // Era da Criação & Céus (Skyward Sword, Minish Cap, Four Swords, OoT)
  | 'fallen_hero'      // Linha do Herói Caído (ALttP, Oracle, Link's Awakening, ALBW, Zelda 1, 2)
  | 'child_timeline'  // Linha de Link Criança (Majora's Mask, Twilight Princess, Four Swords Adv)
  | 'adult_timeline'  // Linha de Link Adulto / Grande Mar (Wind Waker, Phantom Hourglass, Spirit Tracks)
  | 'wild_era'        // Era Selvagem & Cataclismo (Breath of the Wild, Tears of the Kingdom, Echoes of Wisdom)
  | 'spinoff';         // Spinoffs e Clássicos de Ação

export interface ZeldaGameEntry {
  id: string;
  title: string;
  subtitle?: string;
  japaneseTitle?: string;
  releaseYear: number;
  originalPlatform: string;
  platforms: string[];
  timelineBranch: ZeldaTimelineBranch;
  timelineEraName: string;
  coverUrl: string;
  bannerUrl?: string;
  lore: string;
  iconicItems: string[];
  triForceAspect: 'Coragem' | 'Sabedoria' | 'Poder' | 'Completa';
  timeToBeat: {
    mainStory: number;
    extra: number;
    completionist: number;
  };
  developer: string;
  rating: number; // 0-100 ou 0-10
}

export type AIPersonality = 'jarvis' | 'lula' | 'bolsonaro' | 'galvao' | 'gamer';

export interface AppSettings {
  theme: ThemeMode;
  viewMode: 'grid' | 'list';
  rawgApiKey?: string;
  groqApiKey?: string;
  groqModel?: string;
  jarvisVoiceURI?: string;
  jarvisVoiceRate?: number;
  jarvisVoicePitch?: number;
  voiceProvider?: 'browser' | 'elevenlabs';
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
  aiPersonality?: AIPersonality;
  customVoiceId?: string;
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
