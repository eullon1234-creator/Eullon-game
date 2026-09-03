// scripts/new_games_data.cjs
// 300+ Jogos icônicos cuidadosamente categorizados para expandir o catálogo do Game Tracker Pro

const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  // ==========================================
  // 1. CLÁSSICOS RETRÔ & PS1 (25 jogos)
  // ==========================================
  {
    id: 'mgs-1-ps1',
    title: 'Metal Gear Solid (1998)',
    category: ['stealth', 'playstation', 'retro', 'action_fps'],
    platform: 'PS1',
    rating: 9.8,
    year: 1998,
    coverUrl: 'https://media.rawg.io/media/games/9b5/9b57b77ab5e1d9ccf55a1aaae19d7d13.jpg',
    description: 'Solid Snake invade Shadow Moses no divisor de águas cinematográfico da obra de Hideo Kojima.',
    timeToBeat: { main: 11, extra: 14, completionist: 16 }
  },
  {
    id: 'ff7-original-ps1',
    title: 'Final Fantasy VII (1997)',
    category: ['rpg', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.9,
    year: 1997,
    coverUrl: steamCover('39140'),
    description: 'Cloud Strife, a espada Buster, Sephiroth e a resistência da AVALANCHE contra a megacorporação Shinra.',
    timeToBeat: { main: 37, extra: 52, completionist: 84 }
  },
  {
    id: 'resident-evil-1-1996',
    title: 'Resident Evil (1996)',
    category: ['horror', 'playstation', 'resident_evil', 'retro'],
    platform: 'PS1',
    rating: 9.3,
    year: 1996,
    coverUrl: 'https://media.rawg.io/media/games/078/0787e9142ec4cfb5c010d8ec8095cb6c.jpg',
    description: 'A Mansão Spencer em Raccoon Forest onde Chris Redfield e Jill Valentine enfrentaram o pesadelo inicial.',
    timeToBeat: { main: 7, extra: 9, completionist: 12 }
  },
  {
    id: 'resident-evil-2-1998',
    title: 'Resident Evil 2 (1998)',
    category: ['horror', 'playstation', 'resident_evil', 'retro'],
    platform: 'PS1',
    rating: 9.7,
    year: 1998,
    coverUrl: 'https://media.rawg.io/media/games/6c5/6c5b525287be1152a4be6058ca769747.jpg',
    description: 'Leon S. Kennedy em seu primeiro dia de trabalho policial e Claire Redfield na delegacia R.P.D.',
    timeToBeat: { main: 6, extra: 9, completionist: 14 }
  },
  {
    id: 'resident-evil-3-nemesis-1999',
    title: 'Resident Evil 3: Nemesis (1999)',
    category: ['horror', 'playstation', 'resident_evil', 'retro'],
    platform: 'PS1',
    rating: 9.6,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/72a/72ab38db5d71da518e382fa08d9e2ca7.jpg',
    description: 'STARS...! O monstro implacável caça Jill Valentine pelas ruas em chamas de Raccoon City.',
    timeToBeat: { main: 7, extra: 9, completionist: 13 }
  },
  {
    id: 'silent-hill-1-ps1',
    title: 'Silent Hill (1999)',
    category: ['horror', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.5,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/f48/f48b9f4477c772c5a0fb70c99f9c968f.jpg',
    description: 'Harry Mason procura desesperadamente sua filha Cheryl na cidade tomada por névoa e sirenes de rádio.',
    timeToBeat: { main: 7, extra: 9, completionist: 12 }
  },
  {
    id: 'dino-crisis-1',
    title: 'Dino Crisis',
    category: ['horror', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.2,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/935/9351e2b5b3a3bc9511115b8b9ef5e966.jpg',
    description: 'Survival horror visceral com velociraptores e T-Rex liderado pela agente Regina da equipe SORT.',
    timeToBeat: { main: 6, extra: 8, completionist: 11 }
  },
  {
    id: 'dino-crisis-2',
    title: 'Dino Crisis 2',
    category: ['action_fps', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.4,
    year: 2000,
    coverUrl: 'https://media.rawg.io/media/games/f05/f05f426e2df0fb06e6ff31a89b0997ee.jpg',
    description: 'Ação arcade e tiroteio frenético acumulando pontos e combos contra ondas de dinossauros jurássicos.',
    timeToBeat: { main: 7, extra: 9, completionist: 12 }
  },
  {
    id: 'tekken-3-ps1',
    title: 'Tekken 3',
    category: ['fighting', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.8,
    year: 1998,
    coverUrl: 'https://media.rawg.io/media/games/2e8/2e86d267878d655f4cc06cb5ecb3a246.jpg',
    description: 'O ápice da luta 3D no PS1 com Jin Kazama, Eddy Gordo, Hwoarang e o clássico modo Tekken Ball.',
    timeToBeat: { main: 2, extra: 5, completionist: 12 }
  },
  {
    id: 'crash-bandicoot-3-warped',
    title: 'Crash Bandicoot 3: Warped',
    category: ['platformer', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.6,
    year: 1998,
    coverUrl: steamCover('731490'),
    description: 'Viaje no tempo com Crash e Coco Bandicoot para impedir os planos temporais de Uka Uka e Dr. Neo Cortex.',
    timeToBeat: { main: 6, extra: 10, completionist: 16 }
  },
  {
    id: 'crash-team-racing-ps1',
    title: 'Crash Team Racing (CTR)',
    category: ['racing', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.7,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/053/05370d94eb38e0ee48b0a7c41bc90a02.jpg',
    description: 'Derrapagens perfeitas com turbo por saltos, aventura contra Nitros Oxide e batalhas de kart multiplayer.',
    timeToBeat: { main: 5, extra: 9, completionist: 18 }
  },
  {
    id: 'spyro-year-of-the-dragon',
    title: 'Spyro: Year of the Dragon',
    category: ['platformer', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.4,
    year: 2000,
    coverUrl: steamCover('996580'),
    description: 'O dragãozinho roxo resgata ovos roubados pela Feiticeira com a ajuda de Sheila, Sgt. Byrd e Bentley.',
    timeToBeat: { main: 9, extra: 13, completionist: 18 }
  },
  {
    id: 'tony-hawks-pro-skater-2',
    title: "Tony Hawk's Pro Skater 2",
    category: ['playstation', 'retro'],
    platform: 'PS1',
    rating: 9.8,
    year: 2000,
    coverUrl: 'https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg',
    description: 'Um dos jogos com maior média de avaliação da história com trilha sonora de Rage Against the Machine e Bad Religion.',
    timeToBeat: { main: 4, extra: 8, completionist: 16 }
  },
  {
    id: 'gran-turismo-2',
    title: 'Gran Turismo 2',
    category: ['racing', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.6,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/609/609712a20b2298bc68f121d51a65fdf7.jpg',
    description: 'Mais de 600 carros licenciados e testes de carteira de motorista na Bíblia das simulações de automobilismo.',
    timeToBeat: { main: 25, extra: 45, completionist: 80 }
  },
  {
    id: 'chrono-cross',
    title: 'Chrono Cross',
    category: ['rpg', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.6,
    year: 1999,
    coverUrl: steamCover('1133760'),
    description: 'Dimensões paralelas, mais de 40 personagens recrutáveis e a trilha sonora mágica de Yasunori Mitsuda.',
    timeToBeat: { main: 38, extra: 48, completionist: 68 }
  },
  {
    id: 'final-fantasy-8',
    title: 'Final Fantasy VIII',
    category: ['rpg', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.3,
    year: 1999,
    coverUrl: steamCover('1026370'),
    description: 'Squall Leonhart, a Gunblade, a feiticeira Edea e o envolvente minigame de cartas Triple Triad.',
    timeToBeat: { main: 41, extra: 55, completionist: 83 }
  },
  {
    id: 'final-fantasy-9',
    title: 'Final Fantasy IX',
    category: ['rpg', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.7,
    year: 2000,
    coverUrl: steamCover('377840'),
    description: 'Zidane Tribal, Vivi e Garnet no retorno triunfal da série às suas raízes medievais e mágicas de fantasia pura.',
    timeToBeat: { main: 40, extra: 58, completionist: 85 }
  },
  {
    id: 'syphon-filter-1',
    title: 'Syphon Filter',
    category: ['stealth', 'action_fps', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.1,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/bc9/bc947098e244cae973bc7fc95e6fb4fa.jpg',
    description: 'Gabe Logan combate o vírus biológico Syphon Filter com seu lendário Taser e tiros de precisão.',
    timeToBeat: { main: 11, extra: 13, completionist: 16 }
  },
  {
    id: 'syphon-filter-2',
    title: 'Syphon Filter 2',
    category: ['stealth', 'action_fps', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.2,
    year: 2000,
    coverUrl: 'https://media.rawg.io/media/games/0eb/0eb9e7f4c7873b429d8924b216972ef7.jpg',
    description: 'Gabe Logan e Lian Xing caçados pela própria Agência enquanto tentam expor a conspiração.',
    timeToBeat: { main: 13, extra: 16, completionist: 20 }
  },
  {
    id: 'parasite-eve-1',
    title: 'Parasite Eve',
    category: ['horror', 'rpg', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.3,
    year: 1998,
    coverUrl: 'https://media.rawg.io/media/games/efb/efbe320980ff65c0ae53e028bfe75f45.jpg',
    description: 'O RPG cinematográfico da Square onde a policial Aya Brea enfrenta mitocôndrias mutantes em Manhattan.',
    timeToBeat: { main: 10, extra: 13, completionist: 18 }
  },
  {
    id: 'parasite-eve-2',
    title: 'Parasite Eve II',
    category: ['horror', 'rpg', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.1,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/1a2/1a216256f0814bb639f75ec19859f71c.jpg',
    description: 'Aya Brea investiga o deserto de Mojave e o abrigo secreto Shelter no Novo México em estilo Survival Horror.',
    timeToBeat: { main: 12, extra: 16, completionist: 23 }
  },
  {
    id: 'medievil-ps1',
    title: 'MediEvil (1998)',
    category: ['hackslash', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.0,
    year: 1998,
    coverUrl: 'https://media.rawg.io/media/games/e23/e23adca90a3eafe1f39ad74d2843efc6.jpg',
    description: 'O cavaleiro esqueleto Sir Daniel Fortesque ganha uma segunda chance de derrotar o feiticeiro Zarok.',
    timeToBeat: { main: 8, extra: 11, completionist: 14 }
  },
  {
    id: 'twisted-metal-2',
    title: 'Twisted Metal 2: World Tour',
    category: ['racing', 'playstation', 'retro'],
    platform: 'PS1',
    rating: 9.2,
    year: 1996,
    coverUrl: 'https://media.rawg.io/media/games/4d1/4d13e313eb67a4e6988ebfa6dc5c23e6.jpg',
    description: 'Combate veicular explosivo pelas ruas de Paris, Nova York e Tóquio sob o comando do sinistro Calypso e Sweet Tooth.',
    timeToBeat: { main: 3, extra: 6, completionist: 11 }
  },
  {
    id: 'yugioh-forbidden-memories',
    title: 'Yu-Gi-Oh! Forbidden Memories',
    category: ['retro', 'playstation'],
    platform: 'PS1',
    rating: 9.6,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/6ae/6aeb632f05353ee39ce1ea2b6e16cf57.jpg',
    description: 'O clássico supremo dos camelôs: funda dragões com trovão para fazer o Twin-Headed Thunder Dragon e derrote Heishin.',
    timeToBeat: { main: 18, extra: 28, completionist: 50 }
  },
  {
    id: 'chrono-trigger-snes',
    title: 'Chrono Trigger',
    category: ['rpg', 'retro'],
    platform: 'SNES',
    rating: 10.0,
    year: 1995,
    coverUrl: steamCover('637100'),
    description: 'Obra-prima eterna desenvolvida pelo Dream Team (Sakaguchi, Horii, Toriyama): viagem no tempo e múltiplos finais.',
    timeToBeat: { main: 23, extra: 32, completionist: 45 }
  }
];

console.log('Batch 1 (Retro & PS1) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
