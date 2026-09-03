// src/views/DealsView.tsx
import React, { useState, useEffect } from 'react';
import { 
  Tag, Flame, Search, ExternalLink, Plus, Check, 
  RefreshCw, TrendingDown, Percent, ShoppingBag, ShieldCheck 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { dealsService, STORES } from '../services/dealsService';
import { CheapSharkDeal } from '../types/game';

export const DealsView: React.FC = () => {
  const { games, addGame, settings } = useGame();
  const { showToast } = useToast();
  const isDeathNote = settings.theme === 'death-note';

  const [deals, setDeals] = useState<CheapSharkDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [sortBy, setSortBy] = useState<'Savings' | 'Price' | 'Deal Rating'>('Savings');

  const fetchDeals = async () => {
    setLoading(true);
    const data = await dealsService.getDeals({
      storeID: selectedStore,
      title: search,
      sortBy: sortBy,
      pageSize: 48,
    });
    setDeals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, [selectedStore, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeals();
  };

  const isGameInLibrary = (title: string) => {
    const norm = title.toLowerCase().trim();
    return games.some((g) => g.title.toLowerCase().trim() === norm);
  };

  const handleAddToLibrary = (deal: CheapSharkDeal) => {
    if (isGameInLibrary(deal.title)) {
      showToast(`"${deal.title}" já está na sua biblioteca!`, 'info');
      return;
    }

    const storeName = STORES[deal.storeID]?.name || 'PC';

    addGame({
      title: deal.title,
      platform: storeName,
      status: 'backlog',
      coverUrl: deal.thumb,
      favorite: false,
      notes: `Adicionado via Radar de Ofertas. Em promoção por ${dealsService.formatPrice(deal.salePrice)} (-${Math.round(parseFloat(deal.savings))}%)`,
    });

    showToast(`"${deal.title}" adicionado à sua biblioteca!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-400 shadow-glow-amber">
              <Flame className="w-6 h-6 animate-pulse text-amber-400" />
            </span>
            <span>Radar de Ofertas & Promoções</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Descontos em tempo real da <strong>Steam</strong>, <strong>Epic Games</strong> e <strong>GOG</strong>. Monitore preços e economize!
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDeals}
          disabled={loading}
          className="self-start sm:self-center px-4 py-2 rounded-2xl bg-gamer-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-neon-cyan' : ''}`} />
          <span>Atualizar Preços</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Busca por Título */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar jogo em promoção..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-20 py-2 rounded-2xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-gamer-950 font-bold text-xs rounded-xl transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* Seleção de Loja */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Todas as Lojas', icon: '🌐' },
            { id: '1', label: 'Steam', icon: '🎮' },
            { id: '25', label: 'Epic Games', icon: '⚡' },
            { id: '7', label: 'GOG', icon: '👾' },
          ].map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => setSelectedStore(store.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedStore === store.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gamer-950 shadow-glow-cyan'
                  : 'bg-gamer-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              <span>{store.icon}</span>
              <span>{store.label}</span>
            </button>
          ))}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden lg:inline">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-gamer-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="Savings">Maior Desconto (%)</option>
            <option value="Price">Menor Preço ($)</option>
            <option value="Deal Rating">Melhor Oferta Geral</option>
          </select>
        </div>
      </div>

      {/* Grid de Ofertas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Buscando as melhores ofertas em tempo real...</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="p-12 rounded-3xl bg-gamer-900/40 border border-slate-800 text-center space-y-3">
          <Tag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhuma promoção encontrada</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tente buscar com outro nome ou selecionar "Todas as Lojas" para ver os descontos vigentes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {deals.map((deal) => {
            const savingsPercent = Math.round(parseFloat(deal.savings) || 0);
            const inLibrary = isGameInLibrary(deal.title);
            const store = STORES[deal.storeID] || { name: 'PC', icon: '🎮' };
            const buyUrl = dealsService.getDealBuyUrl(deal.dealID);

            return (
              <div
                key={deal.dealID}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  isDeathNote
                    ? 'bg-death-900/90 border-red-950/60 hover:border-death-crimson/50 hover:shadow-[0_0_25px_rgba(229,9,20,0.2)]'
                    : 'bg-gamer-900/90 border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,242,254,0.15)]'
                }`}
              >
                {/* Imagem / Capa */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={deal.thumb}
                    alt={deal.title}
                    loading="lazy"
                    draggable={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none"
                    onError={(e) => {
                      // Fallback placeholder
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Badge de Desconto */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-gamer-950 font-black text-xs shadow-lg flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>-{savingsPercent}%</span>
                  </div>

                  {/* Badge de Loja */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-bold text-white flex items-center gap-1">
                    <span>{store.icon}</span>
                    <span>{store.name}</span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1" title={deal.title}>
                      {deal.title}
                    </h3>

                    {deal.steamRatingText && (
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-sans">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Steam: {deal.steamRatingText} ({deal.steamRatingPercent}%)</span>
                      </p>
                    )}
                  </div>

                  {/* Preços e Ações */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 line-through">
                        {dealsService.formatPrice(deal.normalPrice)}
                      </span>
                      <span className="text-lg font-black text-emerald-400">
                        {dealsService.formatPrice(deal.salePrice)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Botão de Compra / Loja */}
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-gamer-800 hover:bg-gamer-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Loja</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* Botão Adicionar à Biblioteca */}
                      <button
                        type="button"
                        onClick={() => handleAddToLibrary(deal)}
                        disabled={inLibrary}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          inLibrary
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:shadow-glow-cyan'
                        }`}
                      >
                        {inLibrary ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Salvo</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Salvar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
