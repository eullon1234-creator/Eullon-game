// src/services/trailerService.ts

const RAWG_KEY = 'c542e67aec3a4340908f9de9e86038af';
const CACHE_PREFIX = 'eullon_trailer_';

export interface GameTrailer {
  videoId: string;
  title: string;
  channelTitle?: string;
  thumbnailUrl?: string;
}

export const trailerService = {
  /**
   * Busca o ID real do trailer oficial do jogo no YouTube através da API do RAWG.
   */
  async getGameTrailer(gameTitle: string, customApiKey?: string): Promise<GameTrailer | null> {
    const cleanTitle = gameTitle.trim();
    if (!cleanTitle) return null;

    const cacheKey = `${CACHE_PREFIX}${cleanTitle.toLowerCase().replace(/\s+/g, '_')}`;

    // 1. Tenta recuperar do cache local para carregamento instantâneo
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}

    const key = customApiKey?.trim() || RAWG_KEY;

    try {
      // 2. Busca o ID do jogo no RAWG
      const searchRes = await fetch(
        `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(cleanTitle)}&page_size=1`
      );
      if (!searchRes.ok) return null;

      const searchData = await searchRes.json();
      const game = searchData.results?.[0];
      if (!game || !game.id) return null;

      // 3. Busca os vídeos oficiais do jogo
      const ytRes = await fetch(
        `https://api.rawg.io/api/games/${game.id}/youtube?key=${key}&page_size=10`
      );
      if (!ytRes.ok) return null;

      const ytData = await ytRes.json();
      const results = ytData.results || [];
      if (results.length === 0) return null;

      // Prioriza vídeos que tenham 'trailer', 'teaser', 'official', 'launch' ou 'gameplay' no título
      const bestVideo = 
        results.find((v: any) => /trailer|teaser|official|launch/i.test(v.name)) ||
        results.find((v: any) => /gameplay|review/i.test(v.name)) ||
        results[0];

      if (!bestVideo || !bestVideo.external_id) return null;

      const trailer: GameTrailer = {
        videoId: bestVideo.external_id,
        title: bestVideo.name,
        channelTitle: bestVideo.channel_title,
        thumbnailUrl: bestVideo.thumbnails?.high?.url || bestVideo.thumbnails?.medium?.url,
      };

      // Salva no cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(trailer));
      } catch {}

      return trailer;
    } catch (err) {
      console.warn('Erro ao localizar trailer para', cleanTitle, err);
      return null;
    }
  },
};
