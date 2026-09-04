// src/services/imageCacheService.ts
import { gameCoverService } from './gameCoverService';

const CACHE_NAME = 'eullon-game-covers-v1';

// Memória RAM para acesso síncrono instantâneo (evita ler disco a cada re-render)
const memoryBlobMap = new Map<string, string>();
// Controle de requisições em andamento para evitar downloads simultâneos da mesma capa
const pendingFetches = new Map<string, Promise<string>>();

export interface CacheStats {
  count: number;
  estimatedSizeMb: string;
}

export const imageCacheService = {
  /**
   * Verifica se o CacheStorage é suportado pelo ambiente (Android WebView / Browser)
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'caches' in window;
  },

  /**
   * Retorna a URL em memória RAM de forma síncrona se já estiver pronta
   */
  getMemoryUrl(originalUrl?: string): string | undefined {
    if (!originalUrl) return undefined;
    return memoryBlobMap.get(originalUrl);
  },

  /**
   * Obtém a URL da imagem em cache local permanente (disco do celular).
   * Se ainda não estiver salva, faz o download em segundo plano e salva no cache.
   */
  async getCachedCoverUrl(originalUrl?: string): Promise<string> {
    if (!originalUrl || !originalUrl.trim()) return '';
    const trimmed = originalUrl.trim();

    // Se já for data URL ou blob local, não precisa de cache
    if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
      return trimmed;
    }

    // 1. Memória RAM (instantâneo 0ms)
    if (memoryBlobMap.has(trimmed)) {
      return memoryBlobMap.get(trimmed)!;
    }

    // 2. Se já existe um download em andamento para esta mesma imagem, aguarda ele
    if (pendingFetches.has(trimmed)) {
      return pendingFetches.get(trimmed)!;
    }

    if (!this.isSupported()) {
      return trimmed;
    }

    const fetchPromise = (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Verifica se já está gravada no armazenamento local
        const cachedResponse = await cache.match(trimmed);
        
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          memoryBlobMap.set(trimmed, objectUrl);
          return objectUrl;
        }

        // Se não está no cache, tenta baixar
        let response: Response | null = null;
        try {
          // Tenta download direto
          response = await fetch(trimmed, { mode: 'cors' });
        } catch {
          // Se der erro de CORS/rede direta, tenta pelo proxy resiliente
          const proxyUrl = gameCoverService.getResilientImageUrl(trimmed);
          try {
            response = await fetch(proxyUrl, { mode: 'cors' });
          } catch {
            response = null;
          }
        }

        if (response && response.ok) {
          // Salva no cache local do dispositivo
          await cache.put(trimmed, response.clone());
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          memoryBlobMap.set(trimmed, objectUrl);
          return objectUrl;
        }

        // Se falhou o download para cache, retorna a original para o navegador tentar exibir normalmente
        return trimmed;
      } catch (err) {
        console.warn('Falha no imageCacheService:', err);
        return trimmed;
      } finally {
        pendingFetches.delete(trimmed);
      }
    })();

    pendingFetches.set(trimmed, fetchPromise);
    return fetchPromise;
  },

  /**
   * Baixa em lote uma lista de URLs de capas e grava no cache local offline.
   */
  async preloadCovers(
    urls: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<{ success: number; failed: number }> {
    if (!this.isSupported()) return { success: 0, failed: urls.length };

    // Filtra URLs únicas e válidas
    const uniqueUrls = Array.from(
      new Set(urls.map((u) => u?.trim()).filter((u): u is string => Boolean(u && (u.startsWith('http://') || u.startsWith('https://')))))
    );

    const total = uniqueUrls.length;
    let current = 0;
    let success = 0;
    let failed = 0;

    // Concorrência de 4 downloads paralelos para não sobrecarregar a rede do aparelho
    const CONCURRENCY = 4;
    const queue = [...uniqueUrls];

    const workers = Array.from({ length: Math.min(CONCURRENCY, total) }).map(async () => {
      while (queue.length > 0) {
        const url = queue.shift();
        if (!url) break;

        try {
          const res = await this.getCachedCoverUrl(url);
          if (res && res !== url && (res.startsWith('blob:') || memoryBlobMap.has(url))) {
            success++;
          } else {
            // Se retornou a própria url (ou seja, falhou no fetch), conta como falha
            failed++;
          }
        } catch {
          failed++;
        }

        current++;
        if (onProgress) {
          onProgress(current, total);
        }
      }
    });

    await Promise.all(workers);
    return { success, failed };
  },

  /**
   * Retorna estatísticas de uso do cache local de capas
   */
  async getCacheStats(): Promise<CacheStats> {
    if (!this.isSupported()) {
      return { count: 0, estimatedSizeMb: '0.0' };
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const keys = await cache.keys();
      const count = keys.length;

      // Estimativa rápida: calcula o tamanho lendo as respostas se houver poucas, ou média de ~120KB
      let totalBytes = 0;
      const sampleLimit = Math.min(keys.length, 30);
      
      for (let i = 0; i < sampleLimit; i++) {
        const response = await cache.match(keys[i]);
        if (response) {
          const blob = await response.blob();
          totalBytes += blob.size;
        }
      }

      if (sampleLimit > 0) {
        const averageSizeBytes = totalBytes / sampleLimit;
        const estimatedTotal = averageSizeBytes * count;
        const sizeMb = (estimatedTotal / (1024 * 1024)).toFixed(1);
        return { count, estimatedSizeMb: sizeMb };
      }

      return { count, estimatedSizeMb: '0.0' };
    } catch (err) {
      console.warn('Erro ao obter estatísticas de cache:', err);
      return { count: 0, estimatedSizeMb: '0.0' };
    }
  },

  /**
   * Limpa todas as capas salvas na memória do aparelho
   */
  async clearCache(): Promise<boolean> {
    // Revoga URLs de blob da memória RAM para liberar memória
    memoryBlobMap.forEach((blobUrl) => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch {
        // ignore
      }
    });
    memoryBlobMap.clear();

    if (!this.isSupported()) return true;

    try {
      const deleted = await caches.delete(CACHE_NAME);
      return deleted;
    } catch (err) {
      console.warn('Erro ao limpar cache de capas:', err);
      return false;
    }
  }
};
