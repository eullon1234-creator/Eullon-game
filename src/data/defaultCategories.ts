import { GameStatus } from '../types/game';

export const DEFAULT_PLATFORMS: string[] = [
  'PC 💲 (Comprado)',
  'PC 💀 (Craqueado)',
  'PS5',
  'PS4',
  'Xbox Series',
  'Xbox One',
  'Switch',
  'Switch 2',
  'Android',
  'iOS',
  'Outra',
];

export const STATUS_CONFIG: Record<GameStatus, {
  label: string;
  emoji: string;
  color: string;
  badgeBg: string;
  dotColor: string;
}> = {
  playing: {
    label: 'Jogando',
    emoji: '🎮',
    color: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/40',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    dotColor: 'bg-neon-cyan',
  },
  completed: {
    label: 'Zerado',
    emoji: '✅',
    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
  },
  backlog: {
    label: 'Quero Jogar',
    emoji: '📚',
    color: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    dotColor: 'bg-purple-400',
  },
  abandoned: {
    label: 'Desisti',
    emoji: '❌',
    color: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    dotColor: 'bg-rose-400',
  },
};
