// scripts/batch8_souls.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'elden-ring-shadow-of-the-erdtree',
    title: 'Elden Ring: Shadow of the Erdtree',
    category: ['soulsborne', 'soulslike', 'openworld', 'rpg'],
    platform: 'PC',
    rating: 9.9,
    year: 2024,
    coverUrl: steamCover('2778580'),
    description: 'Siga os passos de Miquella na Terra das Sombras encarando Messmer o Impalador na maior expansão da FromSoftware.',
    timeToBeat: { main: 25, extra: 45, completionist: 65 }
  },
  {
    id: 'black-myth-wukong',
    title: 'Black Myth: Wukong',
    category: ['soulslike', 'hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.8,
    year: 2024,
    coverUrl: steamCover('2358720'),
    description: 'O Destinado (Sun Wukong) empunha o bastão mágico e 72 transformações lendárias da mitologia chinesa de Jornada ao Oeste.',
    timeToBeat: { main: 34, extra: 50, completionist: 90 }
  },
  {
    id: 'lies-of-p',
    title: 'Lies of P',
    category: ['soulslike', 'rpg'],
    platform: 'PC',
    rating: 9.7,
    year: 2023,
    coverUrl: steamCover('1627720'),
    description: 'Pinóquio luta na cidade caída de Krat com braço mecânico Legion e armas montáveis decidindo entre mentir ou ser humano.',
    timeToBeat: { main: 30, extra: 42, completionist: 60 }
  },
  {
    id: 'dark-souls-remastered',
    title: 'Dark Souls: Remastered',
    category: ['soulsborne', 'soulslike', 'rpg'],
    platform: 'PC',
    rating: 9.8,
    year: 2018,
    coverUrl: steamCover('570940'),
    description: 'Toque o sino do despertar em Lordran, acenda a fogueira e desafie Ornstein & Smough no marco cultural de Hidetaka Miyazaki.',
    timeToBeat: { main: 29, extra: 43, completionist: 63 }
  },
  {
    id: 'dark-souls-2-scholar',
    title: 'Dark Souls II: Scholar of the First Sin',
    category: ['soulsborne', 'soulslike', 'rpg'],
    platform: 'PC',
    rating: 9.2,
    year: 2015,
    coverUrl: steamCover('335300'),
    description: 'O reino amaldiçoado de Drangleic com as três coroas perdidas dos DLCs e o sistema Power Stance de empunhadura dupla.',
    timeToBeat: { main: 36, extra: 58, completionist: 110 }
  },
  {
    id: 'dark-souls-3-ringed-city',
    title: 'Dark Souls III: The Ringed City',
    category: ['soulsborne', 'soulslike', 'rpg'],
    platform: 'PC',
    rating: 9.9,
    year: 2017,
    coverUrl: steamCover('506971'),
    description: 'O fim da Era do Fogo no fim do mundo contra o Cavaleiro Escravo Gael e Darkeater Midir.',
    timeToBeat: { main: 10, extra: 15, completionist: 22 }
  },
  {
    id: 'nioh-complete-edition',
    title: 'Nioh: Complete Edition',
    category: ['soulslike', 'hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.3,
    year: 2017,
    coverUrl: steamCover('485510'),
    description: 'O samurai inglês William Adams no Japão feudal contra demônios Yokai alternando entre posturas Alta, Média e Baixa com Ki Pulse.',
    timeToBeat: { main: 35, extra: 65, completionist: 105 }
  },
  {
    id: 'nioh-2-complete-edition',
    title: 'Nioh 2: Complete Edition',
    category: ['soulslike', 'hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.6,
    year: 2021,
    coverUrl: steamCover('1325200'),
    description: 'Crie seu próprio guerreiro meio-humano e meio-Yokai usando habilidades de espíritos guardiões e o contra-ataque Burst Counter.',
    timeToBeat: { main: 45, extra: 80, completionist: 130 }
  },
  {
    id: 'wo-long-fallen-dynasty',
    title: 'Wo Long: Fallen Dynasty',
    category: ['soulslike', 'hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.0,
    year: 2023,
    coverUrl: steamCover('1448440'),
    description: 'A era dos Três Reinos na China infestada por demônios onde cada golpe é repelido com artes marciais chinesas e parries precisos.',
    timeToBeat: { main: 26, extra: 40, completionist: 65 }
  },
  {
    id: 'lords-of-the-fallen-2023',
    title: 'Lords of the Fallen (2023)',
    category: ['soulslike', 'rpg', 'horror'],
    platform: 'PC',
    rating: 9.0,
    year: 2023,
    coverUrl: steamCover('1501750'),
    description: 'Navegue simultaneamente entre o reino dos vivos (Axiom) e o mundo dos mortos (Umbral) usando a lanterna mágica.',
    timeToBeat: { main: 32, extra: 48, completionist: 75 }
  },
  {
    id: 'remnant-2',
    title: 'Remnant II',
    category: ['soulslike', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.5,
    year: 2023,
    coverUrl: steamCover('1282100'),
    description: 'O chamado "Dark Souls com armas": mundos gerados proceduralmente, quebra-cabeças arcanos e cooperação excelente.',
    timeToBeat: { main: 19, extra: 35, completionist: 75 }
  },
  {
    id: 'remnant-from-the-ashes',
    title: 'Remnant: From the Ashes',
    category: ['soulslike', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.1,
    year: 2019,
    coverUrl: steamCover('617290'),
    description: 'Viaje através da Pedra do Mundo para combater a corrupção Root em dimensões hostis.',
    timeToBeat: { main: 14, extra: 23, completionist: 45 }
  },
  {
    id: 'the-surge-2',
    title: 'The Surge 2',
    category: ['soulslike', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.0,
    year: 2019,
    coverUrl: steamCover('644830'),
    description: 'Corte braços e pernas de inimigos em Jericho City para roubar seus exoesqueletos, implantes e armas industriais.',
    timeToBeat: { main: 21, extra: 32, completionist: 48 }
  },
  {
    id: 'mortal-shell',
    title: 'Mortal Shell',
    category: ['soulslike', 'rpg'],
    platform: 'PC',
    rating: 8.8,
    year: 2020,
    coverUrl: steamCover('1110910'),
    description: 'Habite as carcaças de guerreiros mortos (Shells) e endureça seu corpo como pedra sólida (Harden) para absorver qualquer impacto.',
    timeToBeat: { main: 11, extra: 16, completionist: 24 }
  },
  {
    id: 'blasphemous-1',
    title: 'Blasphemous',
    category: ['soulslike', 'platformer', 'indie', 'horror'],
    platform: 'PC',
    rating: 9.5,
    year: 2019,
    coverUrl: steamCover('774361'),
    description: 'O Penitente empunha a espada Mea Culpa na terra amaldiçoada de Cvstodia inspirada no folclore e arte sacra andaluza.',
    timeToBeat: { main: 14, extra: 20, completionist: 30 }
  },
  {
    id: 'blasphemous-2',
    title: 'Blasphemous 2',
    category: ['soulslike', 'platformer', 'indie'],
    platform: 'PC',
    rating: 9.6,
    year: 2023,
    coverUrl: steamCover('2114740'),
    description: 'Três novas armas com estilos únicos de combate e plataformas para quebrar o ciclo de penitência do Milagre.',
    timeToBeat: { main: 14, extra: 19, completionist: 27 }
  },
  {
    id: 'salt-and-sanctuary',
    title: 'Salt and Sanctuary',
    category: ['soulslike', 'platformer', 'rpg', 'indie'],
    platform: 'PC',
    rating: 9.2,
    year: 2016,
    coverUrl: steamCover('283640'),
    description: 'Um Souls clássico magistralmente adaptado para 2D com árvore de habilidades imensa, esquivas e chefes impiedosos.',
    timeToBeat: { main: 16, extra: 23, completionist: 38 }
  },
  {
    id: 'ender-lilies',
    title: 'ENDER LILIES: Quietus of the Knights',
    category: ['soulslike', 'platformer', 'rpg', 'indie'],
    platform: 'PC',
    rating: 9.4,
    year: 2021,
    coverUrl: steamCover('1369630'),
    description: 'A sacerdotisa Lily e almas de cavaleiros purificam um reino devastado pela Chuva da Morte com trilha sonora mágica de Mili.',
    timeToBeat: { main: 15, extra: 20, completionist: 27 }
  },
  {
    id: 'code-vein',
    title: 'Code Vein',
    category: ['soulslike', 'anime', 'rpg'],
    platform: 'PC',
    rating: 8.9,
    year: 2019,
    coverUrl: steamCover('678960'),
    description: 'O soulslike com estética anime e vampiros pós-apocalípticos (Revenants) com personalização de Blood Veils e companheiros de IA.',
    timeToBeat: { main: 26, extra: 38, completionist: 60 }
  },
  {
    id: 'thymesia',
    title: 'Thymesia',
    category: ['soulslike', 'rpg'],
    platform: 'PC',
    rating: 8.8,
    year: 2022,
    coverUrl: steamCover('1343240'),
    description: 'Corvus rouba armas de peste dos inimigos com garras afiadas em combates com ritmo acelerado reminiscente de Bloodborne e Sekiro.',
    timeToBeat: { main: 7, extra: 11, completionist: 17 }
  }
];

console.log('Batch 8 (Soulsborne) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
