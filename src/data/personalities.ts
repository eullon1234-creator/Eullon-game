// src/data/personalities.ts
import { AIPersonality } from '../types/game';

export interface PersonalityMeta {
  id: AIPersonality;
  name: string;
  tag: string;
  emoji: string;
  desc: string;
  voicePreset: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
}

export const PERSONALITIES: PersonalityMeta[] = [
  { 
    id: 'jarvis', 
    name: 'J.A.R.V.I.S.', 
    tag: 'PROTOCOLO STARK', 
    emoji: '⚡', 
    desc: 'Mordomo britânico analítico de Tony Stark', 
    voicePreset: 'JBFqnCBsd6RMkjVDRZzb',
    accentBorder: 'border-cyan-500/40',
    accentBg: 'bg-cyan-500/15',
    accentText: 'text-cyan-300'
  },
  { 
    id: 'lula', 
    name: 'Lula', 
    tag: 'COMPANHEIRO GAMER', 
    emoji: '🚩', 
    desc: 'Carismático, acolhedor e popular ("Companheiro Eullon")', 
    voicePreset: 'onwK4e9ZLuTAKqWW03F9',
    accentBorder: 'border-rose-500/40',
    accentBg: 'bg-rose-500/15',
    accentText: 'text-rose-300'
  },
  { 
    id: 'bolsonaro', 
    name: 'Bolsonaro', 
    tag: 'COMANDANTE TÁTICO', 
    emoji: '🇧🇷', 
    desc: 'Enérgico, patriota e direto ("Ô Eullon, talkei?")', 
    voicePreset: 'CwhRBWXzGAHq8TQ4Fs17',
    accentBorder: 'border-emerald-500/40',
    accentBg: 'bg-emerald-500/15',
    accentText: 'text-emerald-300'
  },
  { 
    id: 'galvao', 
    name: 'Galvão Bueno', 
    tag: 'HAJA CORAÇÃO!', 
    emoji: '🎙️', 
    desc: 'Narração épica e emocionante de cada vitória', 
    voicePreset: 'pNInz6obpgDQGcFmaJgB',
    accentBorder: 'border-amber-500/40',
    accentBg: 'bg-amber-500/15',
    accentText: 'text-amber-300'
  },
  { 
    id: 'gamer', 
    name: 'Gamer Pro', 
    tag: 'HARDCORE STRATEGY', 
    emoji: '🎮', 
    desc: 'Pro-player focado em platinar e zeramento rápido', 
    voicePreset: 'TX3LPaxmHKxFdv7VOQHJ',
    accentBorder: 'border-purple-500/40',
    accentBg: 'bg-purple-500/15',
    accentText: 'text-purple-300'
  },
];

export const getGreetingForPersonality = (pers: AIPersonality): string => {
  switch (pers) {
    case 'lula':
      return 'Fala, meu **Companheiro Eullon**! Veja bem, o trabalhador brasileiro tem direito de descansar e zerar seu joguinho em paz com uma picanha e cervejinha! Posso adicionar jogos, zerar, mudar notas ou sincronizar tudo na nuvem. O que vamos comandar hoje na nossa biblioteca popular? 🚩';
    case 'bolsonaro':
      return 'Ô **Eullon**, talkei? No tocante ao centro de comando gamer, missão dada é missão cumprida! Acabou a mamata de jogo parado no backlog. Manda a ordem aí que eu caneto no sistema agora mesmo! 🇧🇷';
    case 'galvao':
      return 'Bem, amigos da Rede Eullon Game! Haja coração, **Eullon**! É teste pra cardíaco, amigo! Que grande clássico vai entrar em campo hoje na decisão da sua gameplay?! Manda a ordem que a transmissão tá no ar! 🎙️';
    case 'gamer':
      return 'E aí, **Eullon**! Base gamer online. Rota de platinas ativada. Posso gerenciar qualquer jogo, alterar status, buscar ou sincronizar. Qual o próximo drop? 🎮';
    case 'jarvis':
    default:
      return 'Às suas ordens, **Senhor Eullon**. Todos os sistemas operacionais do seu centro de comando gamer estão em 100%. Tenho controle total do sistema para cadastrar jogos, alterar status, gerenciar notas ou sincronizar na nuvem. Como posso servi-lo hoje? ⚡';
  }
};

export const getQuickCommandsForPersonality = (pers: AIPersonality) => {
  switch (pers) {
    case 'lula':
      return [
        { icon: '🚩', label: 'Lula, adicione Chrono Trigger para SNES' },
        { icon: '🥩', label: 'Lula, qual o melhor jogo pra relaxar no fim de semana?' },
        { icon: '🏆', label: 'Lula, ordene meus jogos pela maior nota' },
        { icon: '☁️', label: 'Lula, sincronize todos os meus jogos com a nuvem' },
      ];
    case 'bolsonaro':
      return [
        { icon: '🇧🇷', label: 'Ô Bolsonaro, adicione God of War para PS5 com nota 10, talkei?' },
        { icon: '⚡', label: 'Bolsonaro, ordene meus jogos pela maior nota' },
        { icon: '🎯', label: 'Bolsonaro, abra o roletador inteligente pra escolher um jogo' },
        { icon: '☁️', label: 'Bolsonaro, faça o upload dos dados para a nuvem sem mimimi' },
      ];
    case 'galvao':
      return [
        { icon: '🎙️', label: 'Galvão, narre o briefing tático do meu backlog!' },
        { icon: '🏆', label: 'Galvão, qual é o jogo campeão da minha biblioteca?' },
        { icon: '⚽', label: 'Galvão, ordene meus jogos pelos mais recentes' },
        { icon: '🔥', label: 'Haja coração, Galvão! Busque por jogos de corrida' },
      ];
    case 'gamer':
      return [
        { icon: '⚡', label: 'Adicione Elden Ring para PC com 60 horas estimadas' },
        { icon: '📊', label: 'Briefing tático do backlog agora' },
        { icon: '🏆', label: 'Ordene meus jogos pela maior nota' },
        { icon: '☁️', label: 'Sincronize com a nuvem agora' },
      ];
    case 'jarvis':
    default:
      return [
        { icon: '⚡', label: 'J.A.R.V.I.S., adicione The Witcher 3 para PC com nota 10' },
        { icon: '📊', label: 'J.A.R.V.I.S., forneça um briefing tático do meu backlog' },
        { icon: '🎯', label: 'J.A.R.V.I.S., abra o roletador inteligente' },
        { icon: '☁️', label: 'J.A.R.V.I.S., sincronize meus dados com a nuvem' },
      ];
  }
};
