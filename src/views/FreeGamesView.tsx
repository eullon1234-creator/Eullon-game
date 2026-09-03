// src/views/FreeGamesView.tsx
import React, { useState, useEffect } from 'react';
import { 
  Gift, Sparkles, Search, ExternalLink, Plus, Check, 
  RefreshCw, Monitor, Globe, Filter 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { freeGamesService, FREE_GAME_CATEGORIES } from '../services/freeGamesService';
import { FreeToGameItem } from '../types/game';

export const FreeGamesView: React.FC = () => {
  const { games, addGame, settings } = useGame();
  const { showToast } = useToast();
  const isDeathNote = settings.theme === 'death-note';

  const [freeGames, setFreeGames] = useState<FreeToGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'pc' | 'browser'>('all');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const fetchFreeGames = async () => {
    setLoading(true);
    const data = await freeGamesService.getFreeGames({
      platform: selectedPlatform,
      category: selectedCategory,
    });
    setFreeGames(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFreeGames();
  }, [selectedPlatform, selectedCategory]);

  const isGameInLibrary = (title: string) => {
    const norm = title.toLowerCase().trim();
    return games.some((g) => g.title.toLowerCase().trim() === norm);
  };

  const handleAddToLibrary = (item: FreeToGameItem) => {
    if (isGameInLibrary(item.title)) {
      showToast(`"${item.title}" já está na sua biblioteca!`, 'info');
      return;
    }

    addGame({
      title: item.title,
      platform: item.platform.includes('PC') ? 'PC' : 'Web',
      status: 'backlog',
      coverUrl: item.thumbnail,
      favorite: false,
      notes: `Jogo Gratuito (${item.genre}). ${item.short_description}`,
    });

    showToast(`"${item.title}" adicionado à sua biblioteca!`, 'success');
  };

  const filteredGames = freeGames.filter((g) => 
    g.title.toLowerCase().includes(search.toLowerCase().trim()) ||
    g.short_description.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              <Gift className="w-6 h-6 animate-bounce text-purple-400" />
            </span>
            <span>Radar de Jogos Grátis</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Jogos completos e gratuitos para PC e Navegador. Resgate e jogue sem pagar nada!
          </p>
        </div>

        <button
          type="button"
          onClick={fetchFreeGames}
          disabled={loading}
          className="self-start sm:self-center px-4 py-2 rounded-2xl bg-gamer-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          <span>Atualizar Jogos</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="p-4 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nome ou tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-400 transition-all"
          />
        </div>

        {/* Plataforma */}
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'Todas Plataformas' },
            { id: 'pc', label: 'PC Windows', icon: <Monitor className="w-3.5 h-3.5" /> },
            { id: 'browser', label: 'Navegador Web', icon: <Globe className="w-3.5 h-3.5" /> },
          ].map((plat) => (
            <button
              key={plat.id}
              type="button"
              onClick={() => setSelectedPlatform(plat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedPlatform === plat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-gamer-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {plat.icon}
              <span>{plat.label}</span>
            </button>
          ))}
        </div>

        {/* Categoria */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gamer-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
          >
            {FREE_GAME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Jogos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Carregando catálogo de jogos gratuitos...</p>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="p-12 rounded-3xl bg-gamer-900/40 border border-slate-800 text-center space-y-3">
          <Gift className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Nenhum jogo grátis encontrado</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Tente mudar a categoria ou limpar o campo de busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGames.map((item) => {
            const inLibrary = isGameInLibrary(item.title);

            return (
              <div
                key={item.id}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                  isDeathNote
                    ? 'bg-death-900/90 border-red-950/60 hover:border-death-crimson/50 hover:shadow-[0_0_25px_rgba(229,9,20,0.2)]'
                    : 'bg-gamer-900/90 border-slate-800 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badge Free */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-[11px] shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>GRÁTIS</span>
                  </div>

                  {/* Categoria */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-300">
                    {item.genre}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1" title={item.title}>
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>

                  {/* Rodapé e Ações */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.platform}</span>
                      <span className="text-emerald-400 font-bold">100% Free</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Link Oficial de Resgate */}
                      <a
                        href={item.game_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-gamer-800 hover:bg-gamer-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Resgatar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* Botão Adicionar à Biblioteca */}
                      <button
                        type="button"
                        onClick={() => handleAddToLibrary(item)}
                        disabled={inLibrary}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          inLibrary
                            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                            : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
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
