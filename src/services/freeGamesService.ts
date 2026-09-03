// src/services/freeGamesService.ts
import { FreeToGameItem } from '../types/game';

const FREETOGAME_BASE_URL = 'https://www.freetogame.com/api';

export const FREE_GAME_CATEGORIES = [
  'Todos',
  'Shooter',
  'MMORPG',
  'Battle Royale',
  'Strategy',
  'Action RPG',
  'Fighting',
  'Racing',
  'Survival',
  'Card Game',
];

export const freeGamesService = {
  /**
   * Busca jogos gratuitos disponíveis para jogar/resgatar.
   */
  async getFreeGames(options?: {
    platform?: 'all' | 'pc' | 'browser';
    category?: string;
    sortBy?: 'popularity' | 'release-date' | 'alphabetical' | 'relevance';
  }): Promise<FreeToGameItem[]> {
    try {
      const params = new URLSearchParams();

      if (options?.platform && options.platform !== 'all') {
        params.append('platform', options.platform);
      }
      if (options?.category && options.category !== 'Todos') {
        params.append('category', options.category.toLowerCase().replace(/\s+/g, '-'));
      }
      if (options?.sortBy) {
        params.append('sort-by', options.sortBy);
      } else {
        params.append('sort-by', 'popularity');
      }

      const url = `${FREETOGAME_BASE_URL}/games?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Falha ao carregar jogos grátis: ${response.statusText}`);
      }

      const data: FreeToGameItem[] = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Erro ao consultar FreeToGame API:', err);
      return [];
    }
  },
};
