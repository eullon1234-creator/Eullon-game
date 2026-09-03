export interface GameCoverSearchResult {
  id: number;
  title: string;
  coverUrl: string;
  year?: string;
  rating?: number;
  platforms?: string[];
  playtime?: number;
  timeToBeat?: {
    main: number;
    extra: number;
    completionist: number;
  };
}

// Chave pública gratuita para consultas
const DEFAULT_RAWG_KEY = 'c542e67aec3a4340908f9de9e86038af';

export const gameCoverService = {
  /**
   * Busca capas e informações oficiais de jogos por título.
   */
  async searchCovers(query: string, customApiKey?: string): Promise<GameCoverSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    const apiKey = customApiKey?.trim() || DEFAULT_RAWG_KEY;
    const url = `https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(trimmed)}&page_size=6`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro na busca de capas: status ${response.status}`);
      }

      const data = await response.json();
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results
        .filter((game: any) => game.background_image) // Apenas jogos com imagem
        .map((game: any): GameCoverSearchResult => {
          const mainHours = game.playtime && game.playtime > 2 ? game.playtime : undefined;
          const timeToBeat = mainHours ? {
            main: mainHours,
            extra: Math.round(mainHours * 1.6),
            completionist: Math.round(mainHours * 2.4),
          } : undefined;

          return {
            id: game.id,
            title: game.name,
            coverUrl: game.background_image,
            year: game.released ? game.released.substring(0, 4) : undefined,
            rating: game.rating ? Math.round(game.rating * 20) / 10 : undefined, // converte 0-5 para 0-10
            platforms: game.platforms?.map((p: any) => p.platform.name) || [],
            playtime: mainHours,
            timeToBeat,
          };
        });
    } catch (err) {
      console.warn('Falha ao consultar capas de jogos:', err);
      return [];
    }
  },

  /**
   * Constrói uma URL resiliente de proxy contra bloqueios de CORS/hotlink.
   */
  getResilientImageUrl(originalUrl: string, width = 600, height = 800): string {
    if (!originalUrl) return '';
    // Se já é RAWG, Cloudflare ou Unsplash, costuma funcionar diretamente
    if (originalUrl.includes('rawg.io') || originalUrl.includes('unsplash.com') || originalUrl.includes('steamstatic.com')) {
      return originalUrl;
    }
    // Para URLs externas gerais propensas a 403 / CORS
    const cleanUrl = originalUrl.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&h=${height}&fit=cover&output=webp`;
  }
};
