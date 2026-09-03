// scripts/batch13_racing_fighting.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'street-fighter-6',
    title: 'Street Fighter 6',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.8,
    year: 2023,
    coverUrl: steamCover('1364780'),
    description: 'A nova era da luta da Capcom com a mecânica Drive System, o modo World Tour em mundo aberto e o dinâmico Battle Hub.',
    timeToBeat: { main: 18, extra: 35, completionist: 80 }
  },
  {
    id: 'street-fighter-3-third-strike',
    title: 'Street Fighter III: 3rd Strike',
    category: ['fighting', 'retro'],
    platform: 'Arcade',
    rating: 9.9,
    year: 1999,
    coverUrl: 'https://media.rawg.io/media/games/6ef/6efaebfe9826f74f7626922ef6a85850.jpg',
    description: 'Animações artesanais fluidas lendárias e a mecânica épica de Parry que imortalizou o "Evo Moment #37" de Daigo.',
    timeToBeat: { main: 2, extra: 6, completionist: 20 }
  },
  {
    id: 'ultra-street-fighter-4',
    title: 'Ultra Street Fighter IV',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.6,
    year: 2014,
    coverUrl: steamCover('45760'),
    description: 'O ressurgimento dos jogos de luta: 44 lutadores, Focus Attack, Red Focus e Ultra Combos duplos.',
    timeToBeat: { main: 2, extra: 8, completionist: 35 }
  },
  {
    id: 'tekken-8',
    title: 'Tekken 8',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.7,
    year: 2024,
    coverUrl: steamCover('1778820'),
    description: 'Jin Kazama contra Kazuya Mishima com a nova mecânica agressiva Heat System e gráficos fotorrealistas na Unreal Engine 5.',
    timeToBeat: { main: 4, extra: 11, completionist: 30 }
  },
  {
    id: 'tekken-7',
    title: 'Tekken 7',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.5,
    year: 2017,
    coverUrl: steamCover('389730'),
    description: 'A conclusão do conflito da família Mishima com a introdução do Rage Art, Power Crush e a participação de Akuma.',
    timeToBeat: { main: 4, extra: 10, completionist: 28 }
  },
  {
    id: 'tekken-5-ps2',
    title: 'Tekken 5',
    category: ['fighting', 'ps2'],
    platform: 'PS2',
    rating: 9.8,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/960/960b601d9541cec776c5fa42a00bf6c4.jpg',
    description: 'Jinpachi Mishima, customização de lutadores, minigame Devil Within e os três primeiros Tekken de arcade inclusos no disco.',
    timeToBeat: { main: 3, extra: 7, completionist: 22 }
  },
  {
    id: 'mortal-kombat-1-2023',
    title: 'Mortal Kombat 1 (2023)',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.3,
    year: 2023,
    coverUrl: steamCover('1971870'),
    description: 'O Deus do Fogo Liu Kang recria o universo: novas origens para Scorpion e Sub-Zero e o sistema de parceiros Kameo Fighters.',
    timeToBeat: { main: 7, extra: 15, completionist: 45 }
  },
  {
    id: 'mortal-kombat-11-ultimate',
    title: 'Mortal Kombat 11 Ultimate',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.6,
    year: 2020,
    coverUrl: steamCover('976310'),
    description: 'Manipulação do tempo por Kronika, Fatal Blows cinemáticos e elenco com Spawn, Coringa, Rambo e Exterminador do Futuro.',
    timeToBeat: { main: 6, extra: 18, completionist: 65 }
  },
  {
    id: 'mortal-kombat-9',
    title: 'Mortal Kombat (2011 / MK9)',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.7,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/2e8/2e86d267878d655f4cc06cb5ecb3a246.jpg',
    description: 'Raiden envia uma mensagem para o passado no torneio original: o retorno da violência 2D sangrenta com o ataque X-Ray.',
    timeToBeat: { main: 8, extra: 14, completionist: 35 }
  },
  {
    id: 'kof-98-ultimate',
    title: "The King of Fighters '98 Ultimate Match",
    category: ['fighting', 'retro'],
    platform: 'PC',
    rating: 9.8,
    year: 2014,
    coverUrl: steamCover('222420'),
    description: 'O Dream Match definitivo da SNK: Kyo Kusanagi, Iori Yagami, Rugal e mais de 60 lutadores com equilíbrio de torneio irrepreensível.',
    timeToBeat: { main: 2, extra: 5, completionist: 15 }
  },
  {
    id: 'kof-2002-unlimited-match',
    title: 'The King of Fighters 2002 Unlimited Match',
    category: ['fighting', 'retro'],
    platform: 'PC',
    rating: 9.8,
    year: 2015,
    coverUrl: steamCover('222440'),
    description: 'Combos MAX Mode e cancelamentos rápidos no jogo mais jogado e amado da SNK no Brasil e América Latina.',
    timeToBeat: { main: 2, extra: 6, completionist: 18 }
  },
  {
    id: 'guilty-gear-strive',
    title: 'Guilty Gear -Strive-',
    category: ['fighting', 'anime'],
    platform: 'PC',
    rating: 9.7,
    year: 2021,
    coverUrl: steamCover('1384390'),
    description: 'A Arc System Works com animações 3D parecendo anime desenhado, mecânica de quebra de parede Wall Break e trilha rock pesada.',
    timeToBeat: { main: 5, extra: 12, completionist: 40 }
  },
  {
    id: 'marvel-vs-capcom-2',
    title: 'Marvel vs. Capcom 2: New Age of Heroes',
    category: ['fighting', 'retro'],
    platform: 'Arcade',
    rating: 9.9,
    year: 2000,
    coverUrl: 'https://media.rawg.io/media/games/a03/a038bf3e7b2ffae7c9fb32338c366ff5.jpg',
    description: 'I Wanna Take You for a Ride! 56 personagens em trios insanos com combos aéreos infinitos e assistência rápida.',
    timeToBeat: { main: 2, extra: 6, completionist: 25 }
  },
  {
    id: 'ultimate-marvel-vs-capcom-3',
    title: 'Ultimate Marvel vs. Capcom 3',
    category: ['fighting'],
    platform: 'PC',
    rating: 9.6,
    year: 2017,
    coverUrl: steamCover('357190'),
    description: 'Vergil, Wolverine, Dante e Deadpool em lutas supersônicas com X-Factor e ataques especiais triplos.',
    timeToBeat: { main: 2, extra: 8, completionist: 30 }
  },
  {
    id: 'need-for-speed-heat',
    title: 'Need for Speed Heat',
    category: ['racing', 'openworld'],
    platform: 'PC',
    rating: 9.2,
    year: 2019,
    coverUrl: steamCover('1222680'),
    description: 'Corridas autorizadas durante o dia no circuito Speedhunters e rachas ilegais underground à noite fugindo da polícia corrupta de Palm City.',
    timeToBeat: { main: 15, extra: 28, completionist: 48 }
  },
  {
    id: 'need-for-speed-unbound',
    title: 'Need for Speed Unbound',
    category: ['racing', 'openworld'],
    platform: 'PC',
    rating: 9.0,
    year: 2022,
    coverUrl: steamCover('1846380'),
    description: 'Estética visual que mistura carros fotorrealistas com efeitos de grafite de rua animados e o evento final The Grand.',
    timeToBeat: { main: 22, extra: 35, completionist: 55 }
  },
  {
    id: 'need-for-speed-hot-pursuit-remastered',
    title: 'Need for Speed: Hot Pursuit Remastered',
    category: ['racing'],
    platform: 'PC',
    rating: 9.4,
    year: 2020,
    coverUrl: steamCover('1328660'),
    description: 'Pilote como corredor com nitro ou como policial de elite do Condado de Seacrest usando bloqueios, helicópteros e IEMs.',
    timeToBeat: { main: 13, extra: 20, completionist: 30 }
  },
  {
    id: 'burnout-paradise-remastered',
    title: 'Burnout Paradise Remastered',
    category: ['racing', 'openworld'],
    platform: 'PC',
    rating: 9.4,
    year: 2018,
    coverUrl: steamCover('1238080'),
    description: 'Bem-vindo a Paradise City! O mundo aberto onde cada cruzamento é um evento de corrida, Road Rage ou Showtime.',
    timeToBeat: { main: 11, extra: 25, completionist: 52 }
  },
  {
    id: 'assetto-corsa',
    title: 'Assetto Corsa',
    category: ['racing'],
    platform: 'PC',
    rating: 9.6,
    year: 2014,
    coverUrl: steamCover('244210'),
    description: 'A simulação automobilística mais precisa com suporte para volantes force feedback, telemetria real e comunidade massiva de mods.',
    timeToBeat: { main: 25, extra: 60, completionist: 150 }
  },
  {
    id: 'wreckfest',
    title: 'Wreckfest',
    category: ['racing'],
    platform: 'PC',
    rating: 9.3,
    year: 2018,
    coverUrl: steamCover('228380'),
    description: 'Derby de demolição com motor de física de deformação de lataria em tempo real: colida ônibus, cortadores de grama e muscle cars.',
    timeToBeat: { main: 14, extra: 24, completionist: 45 }
  },
  {
    id: 'f1-24',
    title: 'F1 24',
    category: ['racing'],
    platform: 'PC',
    rating: 9.0,
    year: 2024,
    coverUrl: steamCover('2488620'),
    description: 'O jogo oficial da Fórmula 1 com física de dirigibilidade dinâmica EA SPORTS Dynamic Handling e modo carreira de piloto completo.',
    timeToBeat: { main: 15, extra: 35, completionist: 75 }
  },
  {
    id: 'dirt-rally-2',
    title: 'DiRT Rally 2.0',
    category: ['racing'],
    platform: 'PC',
    rating: 9.4,
    year: 2019,
    coverUrl: steamCover('690790'),
    description: 'O simulador definitivo de rali em pistas de cascalho, lama e asfalto da Nova Zelândia, Argentina, Espanha e Polônia.',
    timeToBeat: { main: 18, extra: 40, completionist: 90 }
  },
  {
    id: 'split-second',
    title: 'Split/Second',
    category: ['racing'],
    platform: 'PC',
    rating: 9.2,
    year: 2010,
    coverUrl: steamCover('578330'),
    description: 'Corridas dentro de um reality show explosivo onde você aciona Power Plays para derrubar pontes, aviões e prédios sobre os rivais.',
    timeToBeat: { main: 9, extra: 14, completionist: 22 }
  },
  {
    id: 'injustice-2',
    title: 'Injustice 2',
    category: ['fighting', 'superheroes'],
    platform: 'PC',
    rating: 9.4,
    year: 2017,
    coverUrl: steamCover('627270'),
    description: 'Batman contra o regime do Superman: sistema de equipamentos com armaduras customizáveis e a invasão cósmica de Brainiac.',
    timeToBeat: { main: 6, extra: 18, completionist: 55 }
  },
  {
    id: 'flatout-2',
    title: 'FlatOut 2',
    category: ['racing', 'retro'],
    platform: 'PC',
    rating: 9.3,
    year: 2006,
    coverUrl: steamCover('2990'),
    description: 'Rachas caóticos e minigames insanos arremessando o piloto pelo para-brisa em dardos, boliche e salto em altura.',
    timeToBeat: { main: 11, extra: 18, completionist: 30 }
  }
];

console.log('Batch 13 (Racing & Fighting) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
