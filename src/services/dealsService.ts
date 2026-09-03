// src/services/dealsService.ts
import { CheapSharkDeal } from '../types/game';

export interface StoreInfo {
  id: string;
  name: string;
  icon: string;
}

export const STORES: Record<string, StoreInfo> = {
  '1': { id: '1', name: 'Steam', icon: '🎮' },
  '7': { id: '7', name: 'GOG.com', icon: '👾' },
  '25': { id: '25', name: 'Epic Games Store', icon: '⚡' },
  '11': { id: '11', name: 'Humble Store', icon: '📦' },
};

const CHEAPSHARK_BASE_URL = 'https://www.cheapshark.com/api/1.0';

export const dealsService = {
  /**
   * Busca as melhores ofertas de jogos em promoção.
   */
  async getDeals(options?: {
    storeID?: string;
    title?: string;
    sortBy?: 'Savings' | 'Price' | 'Deal Rating' | 'Title';
    pageSize?: number;
  }): Promise<CheapSharkDeal[]> {
    try {
      const params = new URLSearchParams();
      if (options?.storeID && options.storeID !== 'all') {
        params.append('storeID', options.storeID);
      } else {
        // Busca lojas principais: Steam, GOG, Epic Games
        params.append('storeID', '1,7,25');
      }

      if (options?.title) {
        params.append('title', options.title.trim());
      }

      params.append('sortBy', options?.sortBy || 'Savings');
      params.append('desc', '1');
      params.append('pageSize', String(options?.pageSize || 40));

      const response = await fetch(`${CHEAPSHARK_BASE_URL}/deals?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Falha ao carregar ofertas: ${response.statusText}`);
      }

      const data: CheapSharkDeal[] = await response.json();
      return data;
    } catch (err) {
      console.warn('Erro ao consultar CheapShark:', err);
      return [];
    }
  },

  /**
   * Retorna o link de redirecionamento para comprar na loja oficial.
   */
  getDealBuyUrl(dealID: string): string {
    return `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(dealID)}`;
  },

  /**
   * Formata preço em Dólar/Reais estimado.
   */
  formatPrice(priceUSD: string | number): string {
    const num = typeof priceUSD === 'string' ? parseFloat(priceUSD) : priceUSD;
    if (isNaN(num)) return '$0.00';
    return `$${num.toFixed(2)}`;
  },
};
