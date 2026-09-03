import { TimeToBeat } from '../types/game';

// Base curada de tempos reais baseados no HowLongToBeat para clássicos
const KNOWN_GAMES_TIME: Record<string, TimeToBeat> = {
  // God of War
  'god of war (2005)': { main: 9, extra: 11, completionist: 14 },
  'god of war ii': { main: 12, extra: 14, completionist: 17 },
  'god of war iii': { main: 10, extra: 13, completionist: 18 },
  'god of war (2018)': { main: 21, extra: 33, completionist: 52 },
  'god of war ragnarök': { main: 26, extra: 43, completionist: 68 },

  // Grand Theft Auto
  'grand theft auto: san andreas': { main: 31, extra: 48, completionist: 83 },
  'grand theft auto iv': { main: 28, extra: 41, completionist: 76 },
  'grand theft auto v': { main: 32, extra: 50, completionist: 82 },

  // Soulsborne & FromSoftware
  'elden ring': { main: 58, extra: 102, completionist: 134 },
  'dark souls: remastered': { main: 29, extra: 43, completionist: 63 },
  'dark souls iii': { main: 32, extra: 48, completionist: 85 },
  'bloodborne': { main: 34, extra: 46, completionist: 77 },
  'sekiro: shadows die twice': { main: 30, extra: 43, completionist: 71 },

  // RPGs
  'the witcher 3: wild hunt': { main: 52, extra: 103, completionist: 173 },
  "baldur's gate 3": { main: 67, extra: 110, completionist: 155 },
  'the elder scrolls v: skyrim': { main: 34, extra: 110, completionist: 232 },
  'persona 5 royal': { main: 101, extra: 124, completionist: 144 },

  // PlayStation & Narrativos
  'the last of us part i': { main: 15, extra: 18, completionist: 22 },
  'the last of us part ii': { main: 24, extra: 29, completionist: 42 },
  'ghost of tsushima': { main: 25, extra: 45, completionist: 62 },
  "marvel's spider-man remastered": { main: 17, extra: 26, completionist: 35 },
  'red dead redemption 2': { main: 50, extra: 82, completionist: 182 },

  // Nintendo
  'the legend of zelda: breath of the wild': { main: 50, extra: 98, completionist: 190 },
  'the legend of zelda: tears of the kingdom': { main: 59, extra: 112, completionist: 235 },
  'super mario odyssey': { main: 13, extra: 27, completionist: 62 },
  'super mario bros. wonder': { main: 10, extra: 15, completionist: 21 },
  'metroid dread': { main: 9, extra: 12, completionist: 15 },
  'pokémon legends: arceus': { main: 25, extra: 40, completionist: 73 },

  // Clássicos PS2
  'shadow of the colossus': { main: 7, extra: 10, completionist: 22 },
  'bully': { main: 15, extra: 22, completionist: 30 },
  'def jam: fight for ny': { main: 9, extra: 14, completionist: 20 },
  'black (2006)': { main: 7, extra: 9, completionist: 13 },
  'need for speed: most wanted (2005)': { main: 16, extra: 22, completionist: 33 },
  'need for speed: underground 2': { main: 17, extra: 23, completionist: 32 },
  "devil may cry 3: dante's awakening": { main: 12, extra: 17, completionist: 36 },
  'resident evil 4': { main: 16, extra: 20, completionist: 31 },
  'silent hill 2': { main: 8, extra: 10, completionist: 16 },

  // Animes
  'dragon ball z: budokai tenkaichi 3': { main: 14, extra: 24, completionist: 48 },
  'dragon ball z: kakarot': { main: 31, extra: 43, completionist: 57 },
  'naruto shippuden: ultimate ninja storm 4': { main: 9, extra: 15, completionist: 32 },

  // Call of Duty
  'call of duty 4: modern warfare': { main: 7, extra: 9, completionist: 15 },
  'call of duty: modern warfare 2 (2009)': { main: 7, extra: 9, completionist: 16 },
  'call of duty: black ops': { main: 7, extra: 9, completionist: 15 },
};

export const timeToBeatService = {
  /**
   * Obtém ou estima o tempo para zerar baseado no título ou gênero do jogo.
   */
  getTimeToBeat(title: string, category?: string | string[], fallbackPlaytime?: number): TimeToBeat {
    const cleanTitle = title.trim().toLowerCase();

    // 1. Checa se o título bate com nossa base curada
    if (KNOWN_GAMES_TIME[cleanTitle]) {
      return KNOWN_GAMES_TIME[cleanTitle];
    }

    // Busca por substring no nome
    for (const key in KNOWN_GAMES_TIME) {
      if (cleanTitle.includes(key) || key.includes(cleanTitle)) {
        return KNOWN_GAMES_TIME[key];
      }
    }

    // 2. Se a RAWG deu playtime válido
    if (fallbackPlaytime && fallbackPlaytime >= 3) {
      return {
        main: fallbackPlaytime,
        extra: Math.round(fallbackPlaytime * 1.6),
        completionist: Math.round(fallbackPlaytime * 2.4),
      };
    }

    // 3. Estimativa heurística por categoria/gênero
    const catList = Array.isArray(category) ? category : category ? [category] : [];

    if (catList.includes('rpg') || catList.includes('pokemon')) {
      return { main: 40, extra: 75, completionist: 120 };
    }
    if (catList.includes('soulslike') || catList.includes('soulsborne')) {
      return { main: 35, extra: 55, completionist: 85 };
    }
    if (catList.includes('openworld') || catList.includes('gta')) {
      return { main: 30, extra: 50, completionist: 80 };
    }
    if (catList.includes('horror') || catList.includes('resident_evil')) {
      return { main: 11, extra: 16, completionist: 25 };
    }
    if (catList.includes('action_fps') || catList.includes('call_of_duty')) {
      return { main: 8, extra: 12, completionist: 19 };
    }
    if (catList.includes('fighting') || catList.includes('dragon_ball') || catList.includes('naruto')) {
      return { main: 8, extra: 16, completionist: 30 };
    }
    if (catList.includes('platformer') || catList.includes('indie')) {
      return { main: 12, extra: 18, completionist: 32 };
    }
    if (catList.includes('racing')) {
      return { main: 15, extra: 24, completionist: 45 };
    }

    // Padrão genérico
    return { main: 14, extra: 22, completionist: 36 };
  },

  /**
   * Formata as horas em texto legível.
   */
  formatHours(hours?: number): string {
    if (!hours || hours <= 0) return '--';
    return `${hours}h`;
  },

  /**
   * Classifica a duração do jogo (Curto, Médio, Longo, Épico).
   */
  getDurationBadge(hours?: number): { label: string; color: string } {
    if (!hours || hours <= 0) return { label: 'Indefinido', color: 'text-slate-400 bg-slate-800' };
    if (hours <= 10) return { label: 'Curto (~' + hours + 'h)', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
    if (hours <= 25) return { label: 'Médio (~' + hours + 'h)', color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' };
    if (hours <= 50) return { label: 'Longo (~' + hours + 'h)', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    return { label: 'Épico (~' + hours + 'h)', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' };
  }
};
