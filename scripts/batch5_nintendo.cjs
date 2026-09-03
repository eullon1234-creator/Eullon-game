// scripts/batch5_nintendo.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'zelda-ocarina-of-time',
    title: 'The Legend of Zelda: Ocarina of Time',
    category: ['nintendo_switch', 'rpg', 'retro', 'openworld'],
    platform: 'N64',
    rating: 10.0,
    year: 1998,
    coverUrl: 'https://media.rawg.io/media/games/bf4/bf4cd09f14912a2f8546b5a32b6186b8.jpg',
    description: 'Frequentemente eleito o melhor jogo de todos os tempos: Link criança e adulto tocando canções míticas na Ocarina.',
    timeToBeat: { main: 17, extra: 26, completionist: 37 }
  },
  {
    id: 'zelda-majoras-mask',
    title: "The Legend of Zelda: Majora's Mask",
    category: ['nintendo_switch', 'rpg', 'retro'],
    platform: 'N64',
    rating: 9.8,
    year: 2000,
    coverUrl: 'https://media.rawg.io/media/games/3b9/3b9652a2656910dae9545464d26fb0a3.jpg',
    description: 'Três dias antes da Lua colidir com Termina: use máscaras de transformação e controle o fluxo do tempo.',
    timeToBeat: { main: 21, extra: 31, completionist: 42 }
  },
  {
    id: 'zelda-wind-waker',
    title: 'The Legend of Zelda: The Wind Waker HD',
    category: ['nintendo_switch', 'rpg', 'openworld'],
    platform: 'Wii U',
    rating: 9.7,
    year: 2013,
    coverUrl: 'https://media.rawg.io/media/games/806/806f1d2ce2c64b63309f7a799981beeb.jpg',
    description: 'Toon Link no barco falante King of Red Lions navegando pelo Great Sea com estética cel-shading eterna.',
    timeToBeat: { main: 24, extra: 33, completionist: 48 }
  },
  {
    id: 'zelda-twilight-princess',
    title: 'The Legend of Zelda: Twilight Princess HD',
    category: ['nintendo_switch', 'rpg', 'openworld'],
    platform: 'Wii U',
    rating: 9.6,
    year: 2016,
    coverUrl: 'https://media.rawg.io/media/games/447/44719c8d50f00b464a938c03cf8633c7.jpg',
    description: 'O Reino de Hyrule engolido pelo Crepúsculo onde Link se transforma em lobo ao lado da sarcástica Midna.',
    timeToBeat: { main: 36, extra: 46, completionist: 63 }
  },
  {
    id: 'zelda-echoes-of-wisdom',
    title: 'The Legend of Zelda: Echoes of Wisdom',
    category: ['nintendo_switch', 'rpg', 'platformer'],
    platform: 'Nintendo Switch',
    rating: 9.3,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/f38/f38bbfceecfe46b38c227cb922be150e.jpg',
    description: 'A Princesa Zelda é a protagonista! Crie réplicas mágicas (ecos) de monstros e objetos para salvar Link e Hyrule.',
    timeToBeat: { main: 15, extra: 22, completionist: 30 }
  },
  {
    id: 'super-mario-64',
    title: 'Super Mario 64',
    category: ['nintendo_switch', 'platformer', 'retro'],
    platform: 'N64',
    rating: 9.9,
    year: 1996,
    coverUrl: 'https://media.rawg.io/media/games/ec8/ec8a2359f892a82d0f7f802079463d27.jpg',
    description: 'A invenção da câmera 3D nos videogames: pule dentro das pinturas no Castelo da Peach para coletar as Power Stars.',
    timeToBeat: { main: 12, extra: 17, completionist: 24 }
  },
  {
    id: 'super-mario-sunshine',
    title: 'Super Mario Sunshine',
    category: ['nintendo_switch', 'platformer', 'retro'],
    platform: 'GameCube',
    rating: 9.3,
    year: 2002,
    coverUrl: 'https://media.rawg.io/media/games/8c4/8c460b5220c8e27c199859f5188f5835.jpg',
    description: 'Limpe a ensolarada Ilha Delfino com a mochila d\'água inteligente F.L.U.D.D. e derrote Shadow Mario.',
    timeToBeat: { main: 16, extra: 23, completionist: 35 }
  },
  {
    id: 'super-mario-galaxy-1',
    title: 'Super Mario Galaxy',
    category: ['nintendo_switch', 'platformer'],
    platform: 'Wii',
    rating: 9.9,
    year: 2007,
    coverUrl: 'https://media.rawg.io/media/games/b4e/b4e4c44d5da4649f7da48f6779314010.jpg',
    description: 'Física gravitacional por planetóides esféricos, trilha sonora orquestrada de arrepiar e a estreia de Rosalina.',
    timeToBeat: { main: 14, extra: 22, completionist: 40 }
  },
  {
    id: 'super-mario-galaxy-2',
    title: 'Super Mario Galaxy 2',
    category: ['nintendo_switch', 'platformer'],
    platform: 'Wii',
    rating: 9.9,
    year: 2010,
    coverUrl: 'https://media.rawg.io/media/games/b80/b805ec68615b39ad34b0cfab67bfa3ff.jpg',
    description: 'Mario se junta a Yoshi no espaço com power-ups de nuvem e broca em um dos melhores designs de fases já feitos.',
    timeToBeat: { main: 14, extra: 23, completionist: 43 }
  },
  {
    id: 'super-mario-3d-world-bowsers-fury',
    title: "Super Mario 3D World + Bowser's Fury",
    category: ['nintendo_switch', 'platformer'],
    platform: 'Nintendo Switch',
    rating: 9.6,
    year: 2021,
    coverUrl: 'https://media.rawg.io/media/games/131/131b79f64bf71e3d360f9eebe6c5075c.jpg',
    description: 'Mario Gato em multiplayer de 4 pessoas e uma aventura colossal em mundo aberto enfrentando Fury Bowser.',
    timeToBeat: { main: 10, extra: 17, completionist: 28 }
  },
  {
    id: 'paper-mario-thousand-year-door',
    title: 'Paper Mario: The Thousand-Year Door (Remake)',
    category: ['nintendo_switch', 'rpg'],
    platform: 'Nintendo Switch',
    rating: 9.7,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/d7a/d7afec9ad4a2ff447814fe04db31d102.jpg',
    description: 'Rogueport, comédia refinada em papel e combates teatrais em auditório no melhor RPG do encanador.',
    timeToBeat: { main: 31, extra: 41, completionist: 63 }
  },
  {
    id: 'super-mario-rpg-remake',
    title: 'Super Mario RPG (Remake)',
    category: ['nintendo_switch', 'rpg'],
    platform: 'Nintendo Switch',
    rating: 9.2,
    year: 2023,
    coverUrl: 'https://media.rawg.io/media/games/596/5967ee3fe9c68ea7378c82a514d35221.jpg',
    description: 'Mario, Bowser e Peach se aliam a Geno e Mallow contra a Smithy Gang com visual moderno 3D adorável.',
    timeToBeat: { main: 12, extra: 15, completionist: 18 }
  },
  {
    id: 'mario-kart-double-dash',
    title: 'Mario Kart: Double Dash!!',
    category: ['nintendo_switch', 'racing', 'retro'],
    platform: 'GameCube',
    rating: 9.5,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/9b5/9b5da438a32bb41416e6d5e771c99f9c.jpg',
    description: 'Dois pilotos no mesmo kart! Um no volante e o outro atirando cascos gigantes de Bowser e ovos de Yoshi.',
    timeToBeat: { main: 4, extra: 8, completionist: 14 }
  },
  {
    id: 'mario-kart-wii',
    title: 'Mario Kart Wii',
    category: ['nintendo_switch', 'racing'],
    platform: 'Wii',
    rating: 9.5,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/609/60980cf7520e79ecb001d2da2ef1240c.jpg',
    description: 'A introdução de motos com empinada Wheelie, o volante Wii Wheel e a lendária pista Coconut Mall.',
    timeToBeat: { main: 5, extra: 11, completionist: 25 }
  },
  {
    id: 'super-smash-bros-melee',
    title: 'Super Smash Bros. Melee',
    category: ['nintendo_switch', 'fighting', 'retro'],
    platform: 'GameCube',
    rating: 9.9,
    year: 2001,
    coverUrl: 'https://media.rawg.io/media/games/698/69894e63e7935748f86f7b196417d41f.jpg',
    description: 'O clássico competitivo eterno com Wavedash, velocidade insana e o controle mais ergonômico da história.',
    timeToBeat: { main: 2, extra: 15, completionist: 60 }
  },
  {
    id: 'super-smash-bros-brawl',
    title: 'Super Smash Bros. Brawl',
    category: ['nintendo_switch', 'fighting'],
    platform: 'Wii',
    rating: 9.4,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/e86/e86ce45b23eaef21c6258c736e65a6c3.jpg',
    description: 'Solid Snake e Sonic entram no combate com a imensa campanha cinematográfica Subspace Emissary.',
    timeToBeat: { main: 11, extra: 26, completionist: 90 }
  },
  {
    id: 'super-smash-bros-ultimate',
    title: 'Super Smash Bros. Ultimate',
    category: ['nintendo_switch', 'fighting'],
    platform: 'Nintendo Switch',
    rating: 9.9,
    year: 2018,
    coverUrl: 'https://media.rawg.io/media/games/9fa/9fa197ef58514e10ab91e4cc37d66f61.jpg',
    description: 'Everyone is Here! Mais de 80 lutadores de toda a história dos videogames reunidos na maior celebração gamer já criada.',
    timeToBeat: { main: 24, extra: 60, completionist: 95 }
  },
  {
    id: 'metroid-prime-remastered',
    title: 'Metroid Prime Remastered',
    category: ['nintendo_switch', 'action_fps', 'platformer', 'scifi'],
    platform: 'Nintendo Switch',
    rating: 9.8,
    year: 2023,
    coverUrl: 'https://media.rawg.io/media/games/8ea/8eac0e0600a9446d32aa68c07e0b5be8.jpg',
    description: 'Samus Aran em Tallon IV reconstruída com gráficos magníficos: escaneie lore, isole-se e explore o planeta.',
    timeToBeat: { main: 14, extra: 17, completionist: 21 }
  },
  {
    id: 'super-metroid-snes',
    title: 'Super Metroid',
    category: ['platformer', 'retro', 'scifi'],
    platform: 'SNES',
    rating: 10.0,
    year: 1994,
    coverUrl: 'https://media.rawg.io/media/games/864/8645062a74c43ab8798bf1ab151af900.jpg',
    description: 'A obra fundadora do gênero Metroidvania em Zebes: atmosfera isolada impecável e progressão sem palavras.',
    timeToBeat: { main: 8, extra: 10, completionist: 13 }
  },
  {
    id: 'metroid-fusion',
    title: 'Metroid Fusion',
    category: ['platformer', 'scifi', 'horror'],
    platform: 'GBA',
    rating: 9.6,
    year: 2002,
    coverUrl: 'https://media.rawg.io/media/games/2e8/2e84c980302fa2d2a45a6c1e550ba95a.jpg',
    description: 'O parasita X infecta a estação BSL e Samus é perseguida pelo clone aterrorizante SA-X armado com Ice Beam.',
    timeToBeat: { main: 6, extra: 7, completionist: 9 }
  },
  {
    id: 'donkey-kong-country-2',
    title: "Donkey Kong Country 2: Diddy's Kong Quest",
    category: ['platformer', 'retro'],
    platform: 'SNES',
    rating: 9.8,
    year: 1995,
    coverUrl: 'https://media.rawg.io/media/games/1e9/1e967a6d7162fa9c6c21e649080e7d5c.jpg',
    description: 'Diddy Kong e Dixie na Crocodile Isle com a trilha sonora mágica Stickerbrush Symphony de David Wise.',
    timeToBeat: { main: 6, extra: 8, completionist: 11 }
  },
  {
    id: 'donkey-kong-country-tropical-freeze',
    title: 'Donkey Kong Country: Tropical Freeze',
    category: ['nintendo_switch', 'platformer'],
    platform: 'Nintendo Switch',
    rating: 9.6,
    year: 2018,
    coverUrl: 'https://media.rawg.io/media/games/3f7/3f707604f3237190f7d5402095f9d22c.jpg',
    description: 'Invasores vikings congelam a Ilha DK no jogo de plataforma com o level design mais refinado dos últimos anos.',
    timeToBeat: { main: 11, extra: 19, completionist: 38 }
  },
  {
    id: 'luigis-mansion-3',
    title: "Luigi's Mansion 3",
    category: ['nintendo_switch', 'platformer'],
    platform: 'Nintendo Switch',
    rating: 9.5,
    year: 2019,
    coverUrl: 'https://media.rawg.io/media/games/ec7/ec74bb81604a80fb48c4fa04a7424177.jpg',
    description: 'Luigi treme de medo explorando um hotel assombrado de 15 andares com o aspirador Poltergust G-00 e Gooigi.',
    timeToBeat: { main: 14, extra: 18, completionist: 25 }
  },
  {
    id: 'kirby-and-the-forgotten-land',
    title: 'Kirby and the Forgotten Land',
    category: ['nintendo_switch', 'platformer'],
    platform: 'Nintendo Switch',
    rating: 9.4,
    year: 2022,
    coverUrl: 'https://media.rawg.io/media/games/a23/a2386bbd7e004663ec4d74a2ff42337d.jpg',
    description: 'A primeira grande aventura 3D da bolinha rosa engolindo carros, escadas e máquinas com o Mouthful Mode.',
    timeToBeat: { main: 9, extra: 15, completionist: 27 }
  },
  {
    id: 'xenoblade-chronicles-definitive',
    title: 'Xenoblade Chronicles: Definitive Edition',
    category: ['nintendo_switch', 'rpg', 'openworld'],
    platform: 'Nintendo Switch',
    rating: 9.7,
    year: 2020,
    coverUrl: 'https://media.rawg.io/media/games/288/288e2c0e86b994df587c4f4a30e87d65.jpg',
    description: 'Shulk empunha a espada Monado nos corpos colossais dos titãs Bionis e Mechonis com visões do futuro em combate.',
    timeToBeat: { main: 70, extra: 98, completionist: 140 }
  },
  {
    id: 'xenoblade-chronicles-2',
    title: 'Xenoblade Chronicles 2',
    category: ['nintendo_switch', 'rpg', 'openworld'],
    platform: 'Nintendo Switch',
    rating: 9.4,
    year: 2017,
    coverUrl: 'https://media.rawg.io/media/games/175/175c5e8fa79240fa5e347713e7382d5e.jpg',
    description: 'Rex e a Blade Pyra/Mythra navegam por um mar de nuvens em busca do paraíso de Elysium e a Árvore do Mundo.',
    timeToBeat: { main: 65, extra: 110, completionist: 250 }
  },
  {
    id: 'xenoblade-chronicles-3',
    title: 'Xenoblade Chronicles 3',
    category: ['nintendo_switch', 'rpg', 'openworld'],
    platform: 'Nintendo Switch',
    rating: 9.7,
    year: 2022,
    coverUrl: 'https://media.rawg.io/media/games/9b1/9b19e992982d62ea09e99392cbe307b2.jpg',
    description: 'Noah e Mio de nações inimigas unem seus grupos para quebrar o ciclo de guerra de 10 anos em Aionios.',
    timeToBeat: { main: 62, extra: 100, completionist: 175 }
  },
  {
    id: 'fire-emblem-three-houses',
    title: 'Fire Emblem: Three Houses',
    category: ['nintendo_switch', 'rpg'],
    platform: 'Nintendo Switch',
    rating: 9.7,
    year: 2019,
    coverUrl: 'https://media.rawg.io/media/games/86c/86c99ee699f1c79a83ebfc48d9ffb4b4.jpg',
    description: 'Ensine em Garreg Mach escolhendo entre Águias Negras, Leões Azuis ou Cervos Dourados antes da guerra civil.',
    timeToBeat: { main: 48, extra: 90, completionist: 190 }
  },
  {
    id: 'fire-emblem-engage',
    title: 'Fire Emblem Engage',
    category: ['nintendo_switch', 'rpg'],
    platform: 'Nintendo Switch',
    rating: 9.1,
    year: 2023,
    coverUrl: 'https://media.rawg.io/media/games/3cf/3cf20bf84251cbbe9e97ee79d6778f6c.jpg',
    description: 'Invoque heróis lendários como Marth, Roy e Byleth através de anéis místicos em combates táticos refinados.',
    timeToBeat: { main: 40, extra: 65, completionist: 95 }
  },
  {
    id: 'animal-crossing-new-horizons',
    title: 'Animal Crossing: New Horizons',
    category: ['nintendo_switch'],
    platform: 'Nintendo Switch',
    rating: 9.5,
    year: 2020,
    coverUrl: 'https://media.rawg.io/media/games/55c/55c70b8c66e2c342f7c004d1efc6ca93.jpg',
    description: 'Construa e decore sua própria ilha paradisíaca do zero no fenômeno mundial da Nintendo e Tom Nook.',
    timeToBeat: { main: 60, extra: 140, completionist: 400 }
  },
  {
    id: 'bayonetta-2',
    title: 'Bayonetta 2',
    category: ['nintendo_switch', 'hackslash'],
    platform: 'Nintendo Switch',
    rating: 9.6,
    year: 2014,
    coverUrl: 'https://media.rawg.io/media/games/181/1819d9b626ec236b2ba9c991e4be812d.jpg',
    description: 'A bruxa de Umbra desce às profundezas do Inferno para salvar a alma de Jeanne com Witch Time e Climax Umbrana.',
    timeToBeat: { main: 10, extra: 15, completionist: 40 }
  },
  {
    id: 'bayonetta-3',
    title: 'Bayonetta 3',
    category: ['nintendo_switch', 'hackslash'],
    platform: 'Nintendo Switch',
    rating: 9.3,
    year: 2022,
    coverUrl: 'https://media.rawg.io/media/games/099/09951be1e36c2e30fa27f426002f2323.jpg',
    description: 'Controle demônios invocados em tamanho real como Godzilla pelas ruas de Tóquio ao lado da novata Viola.',
    timeToBeat: { main: 15, extra: 20, completionist: 35 }
  },
  {
    id: 'astral-chain',
    title: 'Astral Chain',
    category: ['nintendo_switch', 'hackslash', 'scifi'],
    platform: 'Nintendo Switch',
    rating: 9.4,
    year: 2019,
    coverUrl: 'https://media.rawg.io/media/games/c0e/c0e1dbf3df0ad562ca6c8eaec124f1dc.jpg',
    description: 'Controle dois combatentes ao mesmo tempo: um policial da força especial Neuron e sua criatura viva Legião.',
    timeToBeat: { main: 21, extra: 30, completionist: 58 }
  },
  {
    id: 'pikmin-4',
    title: 'Pikmin 4',
    category: ['nintendo_switch'],
    platform: 'Nintendo Switch',
    rating: 9.5,
    year: 2023,
    coverUrl: 'https://media.rawg.io/media/games/a57/a5713437fae98cfebfb70ff4f777c8e9.jpg',
    description: 'Resgate tripulantes perdidos com a ajuda dos Pikmins coloridos e do adorável cãozinho de resgate espacial Oatchi.',
    timeToBeat: { main: 16, extra: 28, completionist: 40 }
  },
  {
    id: 'super-mario-world',
    title: 'Super Mario World',
    category: ['platformer', 'retro'],
    platform: 'SNES',
    rating: 10.0,
    year: 1990,
    coverUrl: 'https://media.rawg.io/media/games/311/311680d738f6153922da19f2a0b7b12d.jpg',
    description: 'A estreia de Yoshi, a capa de vôo amarela e o Star World no jogo de plataforma definitivo da era 16-bits.',
    timeToBeat: { main: 5, extra: 8, completionist: 11 }
  }
];

console.log('Batch 5 (Nintendo Universe) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
