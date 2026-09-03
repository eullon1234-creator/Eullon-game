// scripts/batch4_xbox.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'halo-combat-evolved',
    title: 'Halo: Combat Evolved',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2001,
    coverUrl: steamCover('976730'),
    description: 'Master Chief e Cortana descobrem a megastrutura em anel Halo e enfrentam a aliança Covenant e o terrível Flood.',
    timeToBeat: { main: 10, extra: 13, completionist: 18 }
  },
  {
    id: 'halo-2-anniversary',
    title: 'Halo 2',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.8,
    year: 2004,
    coverUrl: steamCover('976730'),
    description: 'Empunhadura dupla de armas, a defesa da Terra e a perspectiva revolucionária do Árbitro na guerra civil Covenant.',
    timeToBeat: { main: 9, extra: 13, completionist: 21 }
  },
  {
    id: 'halo-3-xbox',
    title: 'Halo 3',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'Xbox 360',
    rating: 9.9,
    year: 2007,
    coverUrl: 'https://media.rawg.io/media/games/7a2/7a2500ee8b2f0b18891f1aea86847c51.jpg',
    description: 'Finish the Fight! O ápice da trilogia original da Bungie contra o Prophet of Truth e a infestação de High Charity.',
    timeToBeat: { main: 12, extra: 16, completionist: 28 }
  },
  {
    id: 'halo-3-odst',
    title: 'Halo 3: ODST',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'Xbox 360',
    rating: 9.3,
    year: 2009,
    coverUrl: steamCover('976730'),
    description: 'O Novato (The Rookie) vaga por New Mombasa à noite com trilha sonora melancólica de saxofone de jazz.',
    timeToBeat: { main: 7, extra: 9, completionist: 16 }
  },
  {
    id: 'halo-reach',
    title: 'Halo: Reach',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.8,
    year: 2010,
    coverUrl: 'https://media.rawg.io/media/games/83b/83b63cc3d44320875e5331f8eb4f7574.jpg',
    description: 'O sacrifício heroico da equipe Noble Team na queda do planeta Reach: "Current objective: SURVIVE".',
    timeToBeat: { main: 9, extra: 12, completionist: 22 }
  },
  {
    id: 'halo-infinite',
    title: 'Halo Infinite',
    category: ['xbox', 'openworld', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.0,
    year: 2021,
    coverUrl: steamCover('1240440'),
    description: 'Master Chief explora o anel Zeta Halo com o gancho retrátil Grappleshot e a nova IA The Weapon.',
    timeToBeat: { main: 11, extra: 19, completionist: 32 }
  },
  {
    id: 'gears-of-war-1',
    title: 'Gears of War',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'Xbox 360',
    rating: 9.6,
    year: 2006,
    coverUrl: 'https://media.rawg.io/media/games/73e/73eecb042d718880367266ba9637ecdc.jpg',
    description: 'Marcus Fenix e o Esquadrão Delta usam a metralhadora com serra elétrica Lancer contra os Locust no planeta Sera.',
    timeToBeat: { main: 9, extra: 11, completionist: 17 }
  },
  {
    id: 'gears-of-war-2',
    title: 'Gears of War 2',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'Xbox 360',
    rating: 9.7,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/5eb/5eb80352ef29d0126788fc3a233b28b5.jpg',
    description: 'A descida ao subterrâneo Hollow, a emocionante busca de Dom por Maria e o nascimento do lendário Modo Horda.',
    timeToBeat: { main: 9, extra: 12, completionist: 19 }
  },
  {
    id: 'gears-of-war-3',
    title: 'Gears of War 3',
    category: ['xbox', 'action_fps', 'scifi'],
    platform: 'Xbox 360',
    rating: 9.8,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/e86/e863375c7423c72b15c92c57f7229b00.jpg',
    description: 'Brothers to the End. A batalha final contra os Lambent e a Rainha Myrrah em cooperação de 4 jogadores.',
    timeToBeat: { main: 10, extra: 13, completionist: 23 }
  },
  {
    id: 'gears-5',
    title: 'Gears 5',
    category: ['xbox', 'openworld', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.2,
    year: 2019,
    coverUrl: steamCover('1097840'),
    description: 'Kait Diaz descobre sua conexão direta com a colmeia Swarm navegando em desertos vermelhos com o esquife Skiff.',
    timeToBeat: { main: 12, extra: 19, completionist: 34 }
  },
  {
    id: 'forza-horizon-4',
    title: 'Forza Horizon 4',
    category: ['xbox', 'racing', 'openworld'],
    platform: 'PC',
    rating: 9.7,
    year: 2018,
    coverUrl: steamCover('1293830'),
    description: 'O festival automotivo mais celebrado na Grã-Bretanha com mudança dinâmica das quatro estações do ano.',
    timeToBeat: { main: 24, extra: 50, completionist: 110 }
  },
  {
    id: 'forza-horizon-5',
    title: 'Forza Horizon 5',
    category: ['xbox', 'racing', 'openworld'],
    platform: 'PC',
    rating: 9.8,
    year: 2021,
    coverUrl: steamCover('1551360'),
    description: 'Paisagens deslumbrantes do México com vulcões ativos, selvas tropicais, cidades históricas e centenas de supercarros.',
    timeToBeat: { main: 22, extra: 55, completionist: 120 }
  },
  {
    id: 'fable-anniversary',
    title: 'Fable Anniversary',
    category: ['xbox', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.3,
    year: 2014,
    coverUrl: steamCover('288470'),
    description: 'O clássico RPG de Peter Molyneux em Albion onde cada escolha moral faz crescer auréolas ou chifres de demônio.',
    timeToBeat: { main: 13, extra: 21, completionist: 32 }
  },
  {
    id: 'fable-2',
    title: 'Fable II',
    category: ['xbox', 'rpg', 'openworld'],
    platform: 'Xbox 360',
    rating: 9.5,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/6ef/6efaebfe9826f74f7626922ef6a85850.jpg',
    description: 'Acompanhado por seu fiel cachorro, case-se, compre vilas inteiras de imóveis e derrote Lord Lucien.',
    timeToBeat: { main: 13, extra: 27, completionist: 45 }
  },
  {
    id: 'starfield',
    title: 'Starfield',
    category: ['xbox', 'scifi', 'openworld', 'rpg'],
    platform: 'PC',
    rating: 8.8,
    year: 2023,
    coverUrl: steamCover('1716740'),
    description: 'A exploração estelar da Constellation em mais de 1000 planetas construindo naves customizadas.',
    timeToBeat: { main: 24, extra: 68, completionist: 150 }
  },
  {
    id: 'hi-fi-rush',
    title: 'Hi-Fi RUSH',
    category: ['xbox', 'hackslash', 'platformer'],
    platform: 'PC',
    rating: 9.6,
    year: 2023,
    coverUrl: steamCover('1817230'),
    description: 'Chai luta contra uma megacorporação robótica sincronizando cada golpe e combo com o ritmo de Nine Inch Nails.',
    timeToBeat: { main: 11, extra: 16, completionist: 28 }
  },
  {
    id: 'quantum-break',
    title: 'Quantum Break',
    category: ['xbox', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.0,
    year: 2016,
    coverUrl: steamCover('474960'),
    description: 'Jack Joyce manipula o fluxo do tempo para consertar o colapso temporal em tiroteios cinemáticos da Remedy.',
    timeToBeat: { main: 10, extra: 14, completionist: 19 }
  },
  {
    id: 'sunset-overdrive',
    title: 'Sunset Overdrive',
    category: ['xbox', 'openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.2,
    year: 2014,
    coverUrl: steamCover('847370'),
    description: 'Grinde por cabos de energia e atire em mutantes com armas insanas na comédia hiperativa e colorida da Insomniac.',
    timeToBeat: { main: 10, extra: 18, completionist: 33 }
  },
  {
    id: 'sea-of-thieves',
    title: 'Sea of Thieves',
    category: ['xbox', 'openworld'],
    platform: 'PC',
    rating: 9.1,
    year: 2018,
    coverUrl: steamCover('1172620'),
    description: 'A vida pirata definitiva da Rare navegando oceanos perigosos, enfrentando Megalodontes e caçando baús lendários.',
    timeToBeat: { main: 30, extra: 80, completionist: 250 }
  },
  {
    id: 'fallout-new-vegas',
    title: 'Fallout: New Vegas',
    category: ['xbox', 'fallout', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.9,
    year: 2010,
    coverUrl: steamCover('22380'),
    description: 'O Courier sobrevive a um tiro na cabeça para decidir o destino de New Vegas, a Legião de Caesar e a NCR.',
    timeToBeat: { main: 28, extra: 60, completionist: 130 }
  },
  {
    id: 'fallout-3-goty',
    title: 'Fallout 3: Game of the Year Edition',
    category: ['xbox', 'fallout', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.6,
    year: 2008,
    coverUrl: steamCover('22370'),
    description: 'Saia do Vault 101 para o Capital Wasteland destruído ao som nostálgico das músicas da Galaxy News Radio.',
    timeToBeat: { main: 23, extra: 53, completionist: 115 }
  },
  {
    id: 'fallout-4',
    title: 'Fallout 4',
    category: ['xbox', 'fallout', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.4,
    year: 2015,
    coverUrl: steamCover('377160'),
    description: 'O Sole Survivor busca seu filho Shaun em Boston (Commonwealth) construindo assentamentos com a armadura Power Armor.',
    timeToBeat: { main: 27, extra: 82, completionist: 160 }
  },
  {
    id: 'tes-oblivion',
    title: 'The Elder Scrolls IV: Oblivion',
    category: ['xbox', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.5,
    year: 2006,
    coverUrl: steamCover('22330'),
    description: 'Feche os portões de Oblivion na província de Cyrodiil com Patrick Stewart como o Imperador Uriel Septim.',
    timeToBeat: { main: 30, extra: 85, completionist: 185 }
  },
  {
    id: 'tes-morrowind',
    title: 'The Elder Scrolls III: Morrowind',
    category: ['xbox', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.6,
    year: 2002,
    coverUrl: steamCover('22320'),
    description: 'A ilha alienígena de Vvardenfell e a ascensão do Nerevarine no clássico RPG de liberdade irrestrita da Bethesda.',
    timeToBeat: { main: 46, extra: 104, completionist: 330 }
  },
  {
    id: 'dishonored-1',
    title: 'Dishonored',
    category: ['stealth', 'action_fps'],
    platform: 'PC',
    rating: 9.7,
    year: 2012,
    coverUrl: steamCover('205100'),
    description: 'Corvo Attano recebe a marca do Outsider e usa poderes sobrenaturais e a lâmina dobrável nas sombras de Dunwall.',
    timeToBeat: { main: 12, extra: 18, completionist: 35 }
  }
];

console.log('Batch 4 (Xbox Universe) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
