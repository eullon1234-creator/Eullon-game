// scripts/batch7_horror.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'resident-evil-0-hd',
    title: 'Resident Evil 0 HD Remaster',
    category: ['horror', 'resident_evil'],
    platform: 'PC',
    rating: 8.9,
    year: 2016,
    coverUrl: steamCover('339340'),
    description: 'Rebecca Chambers e o prisioneiro Billy Coen investigam o trem Ecliptic Express e as origens da Umbrella.',
    timeToBeat: { main: 11, extra: 14, completionist: 23 }
  },
  {
    id: 'resident-evil-1-hd-remaster',
    title: 'Resident Evil HD Remaster',
    category: ['horror', 'resident_evil'],
    platform: 'PC',
    rating: 9.8,
    year: 2015,
    coverUrl: steamCover('304240'),
    description: 'A perfeição máxima do Survival Horror clássico com Crimson Heads, Lisa Trevor e iluminação gótica na Mansão.',
    timeToBeat: { main: 11, extra: 15, completionist: 28 }
  },
  {
    id: 'resident-evil-2-remake',
    title: 'Resident Evil 2 (Remake)',
    category: ['horror', 'resident_evil', 'action_fps'],
    platform: 'PC',
    rating: 9.9,
    year: 2019,
    coverUrl: steamCover('883710'),
    description: 'Leon e Claire na delegacia R.P.D. fugindo dos passos pesados e incessantes de Mr. X no motor RE Engine.',
    timeToBeat: { main: 9, extra: 15, completionist: 33 }
  },
  {
    id: 'resident-evil-3-remake',
    title: 'Resident Evil 3 (Remake)',
    category: ['horror', 'resident_evil', 'action_fps'],
    platform: 'PC',
    rating: 9.0,
    year: 2020,
    coverUrl: steamCover('952060'),
    description: 'Jill Valentine e Carlos Oliveira lutam para escapar de Raccoon City enquanto o Nemesis mutante explode as ruas.',
    timeToBeat: { main: 6, extra: 9, completionist: 20 }
  },
  {
    id: 'resident-evil-4-remake',
    title: 'Resident Evil 4 (Remake 2023)',
    category: ['horror', 'resident_evil', 'action_fps'],
    platform: 'PC',
    rating: 9.9,
    year: 2023,
    coverUrl: steamCover('2050650'),
    description: 'Leon S. Kennedy na Espanha rural com faca de parry, combate tático aprimorado e resgate de Ashley Graham.',
    timeToBeat: { main: 16, extra: 24, completionist: 58 }
  },
  {
    id: 'resident-evil-7-biohazard',
    title: 'Resident Evil 7: Biohazard',
    category: ['horror', 'resident_evil', 'action_fps'],
    platform: 'PC',
    rating: 9.6,
    year: 2017,
    coverUrl: steamCover('418370'),
    description: 'Ethan Winters procura sua esposa Mia na fazenda pantanosa da bizarra e aterrorizante família Baker em primeira pessoa.',
    timeToBeat: { main: 9, extra: 12, completionist: 23 }
  },
  {
    id: 'resident-evil-village',
    title: 'Resident Evil Village',
    category: ['horror', 'resident_evil', 'action_fps'],
    platform: 'PC',
    rating: 9.5,
    year: 2021,
    coverUrl: steamCover('1196590'),
    description: 'O vilarejo gótico nevado na Romênia com Lady Dimitrescu, a aterrorizante Casa Beneviento e Heisenberg.',
    timeToBeat: { main: 10, extra: 14, completionist: 36 }
  },
  {
    id: 'silent-hill-2-remake-2024',
    title: 'Silent Hill 2 (Remake 2024)',
    category: ['horror'],
    platform: 'PC',
    rating: 9.7,
    year: 2024,
    coverUrl: steamCover('2124490'),
    description: 'James Sunderland recebe uma carta de sua falecida esposa Mary e retorna ao pesadelo psicológico na névoa na Unreal Engine 5.',
    timeToBeat: { main: 14, extra: 18, completionist: 25 }
  },
  {
    id: 'dead-space-remake',
    title: 'Dead Space (Remake 2023)',
    category: ['horror', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.7,
    year: 2023,
    coverUrl: steamCover('1693980'),
    description: 'Isaac Clarke a bordo da mineradora estelar USG Ishimura usando a Cortadora de Plasma contra Necromorfos hediondos.',
    timeToBeat: { main: 12, extra: 15, completionist: 27 }
  },
  {
    id: 'dead-space-2',
    title: 'Dead Space 2',
    category: ['horror', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.8,
    year: 2011,
    coverUrl: steamCover('47780'),
    description: 'Isaac luta contra alucinações e um novo surto na colossal estação espacial The Sprawl sobre os anéis de Saturno.',
    timeToBeat: { main: 9, extra: 13, completionist: 21 }
  },
  {
    id: 'the-evil-within-1',
    title: 'The Evil Within',
    category: ['horror', 'action_fps'],
    platform: 'PC',
    rating: 9.2,
    year: 2014,
    coverUrl: steamCover('268050'),
    description: 'Dirigido por Shinji Mikami: o detetive Sebastian Castellanos é puxado para a mente deturpada e sangrenta de Ruvik.',
    timeToBeat: { main: 15, extra: 18, completionist: 34 }
  },
  {
    id: 'the-evil-within-2',
    title: 'The Evil Within 2',
    category: ['horror', 'openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.3,
    year: 2017,
    coverUrl: steamCover('601430'),
    description: 'Sebastian desce ao mundo STEM de Union para resgatar sua filha Lily encarando o fotógrafo assassino Stefano.',
    timeToBeat: { main: 14, extra: 19, completionist: 30 }
  },
  {
    id: 'alien-isolation',
    title: 'Alien: Isolation',
    category: ['horror', 'stealth', 'scifi'],
    platform: 'PC',
    rating: 9.6,
    year: 2014,
    coverUrl: steamCover('214490'),
    description: 'Amanda Ripley sobrevive na estação Sevastopol caçada por uma das inteligências artificiais de Xenomorfo mais implacáveis já criadas.',
    timeToBeat: { main: 19, extra: 24, completionist: 34 }
  },
  {
    id: 'outlast-1',
    title: 'Outlast',
    category: ['horror'],
    platform: 'PC',
    rating: 9.4,
    year: 2013,
    coverUrl: steamCover('238320'),
    description: 'Miles Upshur armado apenas com uma câmera filmadora com visão noturna no macabro Asilo Mount Massive.',
    timeToBeat: { main: 5, extra: 6, completionist: 9 }
  },
  {
    id: 'outlast-2',
    title: 'Outlast 2',
    category: ['horror'],
    platform: 'PC',
    rating: 9.0,
    year: 2017,
    coverUrl: steamCover('414700'),
    description: 'Blake Langermann investiga um vilarejo fanático no deserto do Arizona e alucinações aterrorizantes de sua infância no colégio.',
    timeToBeat: { main: 7, extra: 9, completionist: 13 }
  },
  {
    id: 'amnesia-dark-descent',
    title: 'Amnesia: The Dark Descent',
    category: ['horror', 'indie'],
    platform: 'PC',
    rating: 9.5,
    year: 2010,
    coverUrl: steamCover('57300'),
    description: 'Daniel acorda no castelo de Brennenburg sem memórias e precisa fugir da Escuridão sem nenhuma arma para se defender.',
    timeToBeat: { main: 8, extra: 10, completionist: 12 }
  },
  {
    id: 'amnesia-the-bunker',
    title: 'Amnesia: The Bunker',
    category: ['horror', 'indie'],
    platform: 'PC',
    rating: 9.3,
    year: 2023,
    coverUrl: steamCover('1944430'),
    description: 'Preso em um bunker da Primeira Guerra Mundial com gerador que apaga a luz e uma besta rondando pelas paredes.',
    timeToBeat: { main: 5, extra: 7, completionist: 10 }
  },
  {
    id: 'soma',
    title: 'SOMA',
    category: ['horror', 'scifi', 'indie'],
    platform: 'PC',
    rating: 9.6,
    year: 2015,
    coverUrl: steamCover('282140'),
    description: 'Terror filosófico existencial nas profundezas do oceano na estação PATHOS-II debatendo o que define a consciência humana.',
    timeToBeat: { main: 9, extra: 11, completionist: 13 }
  },
  {
    id: 'signalis',
    title: 'SIGNALIS',
    category: ['horror', 'indie', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2022,
    coverUrl: steamCover('1262350'),
    description: 'Homenagem retrô sublime à era de ouro do Survival Horror estrelando a replika Elster numa instalação distópica.',
    timeToBeat: { main: 9, extra: 11, completionist: 14 }
  },
  {
    id: 'alan-wake-2',
    title: 'Alan Wake 2',
    category: ['horror', 'action_fps'],
    platform: 'PC',
    rating: 9.8,
    year: 2023,
    coverUrl: 'https://media.rawg.io/media/games/a7e/a7e937fae69e46a7be783ff3fe348c59.jpg',
    description: 'A agente do FBI Saga Anderson e o escritor Alan Wake presos no Lugar Obscuro com terror cinematográfico da Remedy.',
    timeToBeat: { main: 18, extra: 24, completionist: 30 }
  },
  {
    id: 'alan-wake-remastered',
    title: 'Alan Wake Remastered',
    category: ['horror', 'action_fps'],
    platform: 'PC',
    rating: 9.2,
    year: 2021,
    coverUrl: 'https://media.rawg.io/media/games/5c0/5c0dd63002c59f6b1f961500518a3798.jpg',
    description: 'Use a luz de sua lanterna como arma contra a Presença Sombria na misteriosa cidade de Bright Falls.',
    timeToBeat: { main: 11, extra: 14, completionist: 26 }
  },
  {
    id: 'fatal-frame-2',
    title: 'Fatal Frame II: Crimson Butterfly',
    category: ['horror', 'ps2', 'retro'],
    platform: 'PS2',
    rating: 9.5,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/117/117bfd6c6e77a504a7ae995d8318381b.jpg',
    description: 'Mio e Mayu exploram a vila fantasma de Minakami armadas apenas com a mística Camera Obscura para exorcizar espíritos.',
    timeToBeat: { main: 8, extra: 11, completionist: 18 }
  },
  {
    id: 'the-callisto-protocol',
    title: 'The Callisto Protocol',
    category: ['horror', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 8.5,
    year: 2022,
    coverUrl: steamCover('1544020'),
    description: 'Jacob Lee precisa escapar da prisão de ferro Black Iron na lua morta de Júpiter contra bio-mutações sanguinolentas.',
    timeToBeat: { main: 10, extra: 13, completionist: 18 }
  },
  {
    id: 'crow-country',
    title: 'Crow Country',
    category: ['horror', 'indie', 'retro'],
    platform: 'PC',
    rating: 9.4,
    year: 2024,
    coverUrl: steamCover('1996010'),
    description: 'Survival horror com gráficos poligonais nostálgicos de PS1 num parque de diversões abandonado em 1990.',
    timeToBeat: { main: 5, extra: 7, completionist: 9 }
  },
  {
    id: 'tormented-souls',
    title: 'Tormented Souls',
    category: ['horror', 'indie'],
    platform: 'PC',
    rating: 9.1,
    year: 2021,
    coverUrl: steamCover('1367590'),
    description: 'Caroline Walker acorda numa banheira de mansão/hospital com câmeras fixas, quebra-cabeças complexos e monstros bizarros.',
    timeToBeat: { main: 9, extra: 11, completionist: 14 }
  }
];

console.log('Batch 7 (Horror) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
