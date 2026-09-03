// scripts/batch3_playstation.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'tlou-part-1-remake',
    title: 'The Last of Us Part I',
    category: ['playstation', 'horror', 'action_fps'],
    platform: 'PS5',
    rating: 9.8,
    year: 2022,
    coverUrl: steamCover('1888930'),
    description: 'A jornada comovente de Joel e Ellie pelos Estados Unidos pós-apocalíptico reconstruída do zero para PS5 e PC.',
    timeToBeat: { main: 15, extra: 18, completionist: 22 }
  },
  {
    id: 'tlou-part-2-remastered',
    title: 'The Last of Us Part II Remastered',
    category: ['playstation', 'horror', 'action_fps'],
    platform: 'PS5',
    rating: 9.7,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/909/909974d8a78430310042790f5380eddd.jpg',
    description: 'O ciclo brutal de ódio e vingança entre Ellie e Abby em Seattle com o tenso modo roguelike No Return.',
    timeToBeat: { main: 24, extra: 29, completionist: 42 }
  },
  {
    id: 'uncharted-2-among-thieves',
    title: 'Uncharted 2: Among Thieves',
    category: ['playstation', 'action_fps', 'openworld'],
    platform: 'PS3',
    rating: 9.8,
    year: 2009,
    coverUrl: 'https://media.rawg.io/media/games/13a/13a52fd03d2e43b324a35da9a65fb1c8.jpg',
    description: 'Nathan Drake pendurado no trem descarrilado e a busca épica pela mística pedra Cintamani em Shambhala.',
    timeToBeat: { main: 10, extra: 13, completionist: 20 }
  },
  {
    id: 'uncharted-3-drakes-deception',
    title: "Uncharted 3: Drake's Deception",
    category: ['playstation', 'action_fps'],
    platform: 'PS3',
    rating: 9.4,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/603/6033c46e3d237190d7c2f0f4ba3e5ea7.jpg',
    description: 'A fuga espetacular do avião de carga e a travessia pelo deserto de Rub\' al Khali atrás da Atlântida das Areias.',
    timeToBeat: { main: 9, extra: 12, completionist: 19 }
  },
  {
    id: 'uncharted-lost-legacy',
    title: 'Uncharted: The Lost Legacy',
    category: ['playstation', 'action_fps'],
    platform: 'PS4',
    rating: 9.2,
    year: 2017,
    coverUrl: steamCover('1659420'),
    description: 'Chloe Frazer e Nadine Ross formam uma aliança inesperada nas cordilheiras da Índia em busca da Presa de Ganesha.',
    timeToBeat: { main: 7, extra: 9, completionist: 16 }
  },
  {
    id: 'horizon-forbidden-west',
    title: 'Horizon Forbidden West',
    category: ['playstation', 'openworld', 'rpg', 'scifi'],
    platform: 'PS5',
    rating: 9.5,
    year: 2022,
    coverUrl: steamCover('2420110'),
    description: 'Aloy explora o Oeste Proibido enfrentando máquinas colossais, ruínas subaquáticas e tribos perigosas.',
    timeToBeat: { main: 29, extra: 60, completionist: 88 }
  },
  {
    id: 'ghost-of-tsushima-directors-cut',
    title: 'Ghost of Tsushima: Director\'s Cut',
    category: ['playstation', 'openworld', 'hackslash'],
    platform: 'PS5',
    rating: 9.8,
    year: 2021,
    coverUrl: steamCover('2215430'),
    description: 'Jin Sakai abandona o código samurai para se tornar o Fantasma e libertar Tsushima e a Ilha Iki dos mongóis.',
    timeToBeat: { main: 25, extra: 45, completionist: 62 }
  },
  {
    id: 'marvels-spider-man-2',
    title: "Marvel's Spider-Man 2",
    category: ['playstation', 'superheroes', 'openworld', 'hackslash'],
    platform: 'PS5',
    rating: 9.7,
    year: 2023,
    coverUrl: 'https://media.rawg.io/media/games/4e9/4e92a83e05a5a1f28b43abf9ef971bfd.jpg',
    description: 'Peter Parker com o uniforme simbionte e Miles Morales unem forças contra Kraven, o Caçador, e o temível Venom.',
    timeToBeat: { main: 17, extra: 23, completionist: 28 }
  },
  {
    id: 'astro-bot-2024',
    title: 'Astro Bot',
    category: ['playstation', 'platformer'],
    platform: 'PS5',
    rating: 9.8,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/668/6689d020d5921855a805ca3a88bb3e1d.jpg',
    description: 'Vencedor unânime de aclamação crítica: criatividade infinita de plataforma homenageando os 30 anos de PlayStation.',
    timeToBeat: { main: 10, extra: 14, completionist: 18 }
  },
  {
    id: 'returnal-ps5',
    title: 'Returnal',
    category: ['playstation', 'scifi', 'horror', 'action_fps'],
    platform: 'PS5',
    rating: 9.3,
    year: 2021,
    coverUrl: steamCover('1649240'),
    description: 'Selene cai no planeta mutável Átropos e fica presa num ciclo de morte e renascimento com tiroteio bullet-hell em 3D.',
    timeToBeat: { main: 19, extra: 32, completionist: 58 }
  },
  {
    id: 'demons-souls-ps5',
    title: "Demon's Souls (PS5)",
    category: ['playstation', 'soulsborne', 'soulslike', 'rpg'],
    platform: 'PS5',
    rating: 9.6,
    year: 2020,
    coverUrl: 'https://media.rawg.io/media/games/844/84411131a3a5bf29a502a371714360ab.jpg',
    description: 'O remake audiovisual impressionante da Bluepoint Games para o clássico da FromSoftware no reino sombrio de Boletaria.',
    timeToBeat: { main: 24, extra: 36, completionist: 58 }
  },
  {
    id: 'days-gone',
    title: 'Days Gone',
    category: ['playstation', 'openworld', 'horror', 'action_fps'],
    platform: 'PS4',
    rating: 9.1,
    year: 2019,
    coverUrl: steamCover('1259420'),
    description: 'Deacon St. John pilota sua moto no Oregon pós-apocalíptico enfrentando hordas massivas de centenas de Freakers.',
    timeToBeat: { main: 36, extra: 54, completionist: 65 }
  },
  {
    id: 'death-stranding-directors-cut',
    title: 'Death Stranding Director\'s Cut',
    category: ['playstation', 'openworld', 'scifi'],
    platform: 'PS5',
    rating: 9.4,
    year: 2021,
    coverUrl: steamCover('1850570'),
    description: 'Sam Porter Bridges reconecta as Cidades Unidas da América carregando o fardo da humanidade isolada sob a chuva temporal.',
    timeToBeat: { main: 40, extra: 65, completionist: 115 }
  },
  {
    id: 'stellar-blade-ps5',
    title: 'Stellar Blade',
    category: ['playstation', 'hackslash', 'scifi', 'action_fps'],
    platform: 'PS5',
    rating: 9.3,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/3eb/3eb62f33c3f918e7e1e67c8585618b76.jpg',
    description: 'Eve desce dos céus para salvar a Terra devastada em combates rápidos, parries milimétricos e visual impressionante.',
    timeToBeat: { main: 21, extra: 32, completionist: 45 }
  },
  {
    id: 'gran-turismo-7',
    title: 'Gran Turismo 7',
    category: ['playstation', 'racing'],
    platform: 'PS5',
    rating: 9.3,
    year: 2022,
    coverUrl: 'https://media.rawg.io/media/games/84d/84da8e19d2f24c3df07fcf83259e4b78.jpg',
    description: 'A celebração definitiva da cultura automotiva, física hiper-realista, pistas históricas e o retorno do Gran Turismo Café.',
    timeToBeat: { main: 26, extra: 48, completionist: 95 }
  },
  {
    id: 'infamous-second-son',
    title: 'inFAMOUS: Second Son',
    category: ['playstation', 'superheroes', 'openworld', 'action_fps'],
    platform: 'PS4',
    rating: 9.1,
    year: 2014,
    coverUrl: 'https://media.rawg.io/media/games/f8c/f8c6aedb10b93e3233c8c733fb0401f8.jpg',
    description: 'Delsin Rowe absorve poderes de Fumaça, Neon, Vídeo e Concreto nas ruas de Seattle contra o D.U.P.',
    timeToBeat: { main: 10, extra: 15, completionist: 21 }
  },
  {
    id: 'infamous-2-ps3',
    title: 'inFAMOUS 2',
    category: ['playstation', 'superheroes', 'openworld', 'action_fps'],
    platform: 'PS3',
    rating: 9.3,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/3e9/3e9ff76216c5b058da6f2360580918c5.jpg',
    description: 'Cole MacGrath aprimora seus raios elétricos com fogo ou gelo em New Marais para enfrentar a Fera que destruiu Empire City.',
    timeToBeat: { main: 12, extra: 17, completionist: 24 }
  },
  {
    id: 'ratchet-clank-rift-apart',
    title: 'Ratchet & Clank: Em Uma Outra Dimensão',
    category: ['playstation', 'platformer', 'scifi', 'action_fps'],
    platform: 'PS5',
    rating: 9.5,
    year: 2021,
    coverUrl: steamCover('1895840'),
    description: 'Salte entre dimensões instantâneas com o SSD veloz do PS5 controlando Ratchet e a corajosa Rivet.',
    timeToBeat: { main: 11, extra: 15, completionist: 18 }
  },
  {
    id: 'bloodborne-the-old-hunters',
    title: 'Bloodborne: The Old Hunters',
    category: ['playstation', 'soulsborne', 'soulslike', 'horror'],
    platform: 'PS4',
    rating: 9.9,
    year: 2015,
    coverUrl: 'https://media.rawg.io/media/games/214/2143a53e4b77d6ee09405d45d8b7ea8f.jpg',
    description: 'O Pesadelo do Caçador revela os segredos obscuros de Yharnam com Ludwig, Lady Maria e o Órfão de Kos.',
    timeToBeat: { main: 8, extra: 12, completionist: 16 }
  },
  {
    id: 'killzone-2',
    title: 'Killzone 2',
    category: ['playstation', 'action_fps', 'scifi'],
    platform: 'PS3',
    rating: 9.2,
    year: 2009,
    coverUrl: 'https://media.rawg.io/media/games/4e4/4e48b81232c96c46eeae06ec4a02c984.jpg',
    description: 'A invasão visceral de Helghan com peso nas armas, física de impacto pioneira e os olhos alaranjados dos Helghasts.',
    timeToBeat: { main: 9, extra: 12, completionist: 18 }
  },
  {
    id: 'killzone-3',
    title: 'Killzone 3',
    category: ['playstation', 'action_fps', 'scifi'],
    platform: 'PS3',
    rating: 9.0,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/1e9/1e967a6d7162fa9c6c21e649080e7d5c.jpg',
    description: 'Jetpacks, batalhas no gelo polar e brutal melee executando a ofensiva da ISA na capital de Helghan.',
    timeToBeat: { main: 8, extra: 11, completionist: 16 }
  },
  {
    id: 'resistance-fall-of-man',
    title: 'Resistance: Fall of Man',
    category: ['playstation', 'action_fps', 'scifi'],
    platform: 'PS3',
    rating: 8.9,
    year: 2006,
    coverUrl: 'https://media.rawg.io/media/games/4cf/4cfd6b8b05fc13b483be217a61d803ce.jpg',
    description: 'Nathan Hale lidera a resistência britânica contra a invasão mutante alienígena Quimera nos anos 1950.',
    timeToBeat: { main: 11, extra: 14, completionist: 19 }
  },
  {
    id: 'resistance-3',
    title: 'Resistance 3',
    category: ['playstation', 'action_fps', 'scifi'],
    platform: 'PS3',
    rating: 9.1,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/9b1/9b1f24c3df71217e923e3cb8ee95305f.jpg',
    description: 'Joseph Capelli atravessa uma América em ruínas até Nova York armado com o Bullseye e o Mutator da Insomniac.',
    timeToBeat: { main: 8, extra: 11, completionist: 15 }
  },
  {
    id: 'the-last-guardian',
    title: 'The Last Guardian',
    category: ['playstation', 'platformer'],
    platform: 'PS4',
    rating: 9.2,
    year: 2016,
    coverUrl: 'https://media.rawg.io/media/games/53b/53b53f66341d334547926b48526554ad.jpg',
    description: 'A cumplicidade emocionante entre um menino e a gigantesca criatura alada Trico para escapar de ruínas antigas.',
    timeToBeat: { main: 12, extra: 15, completionist: 21 }
  },
  {
    id: 'until-dawn-ps4',
    title: 'Until Dawn',
    category: ['playstation', 'horror'],
    platform: 'PS4',
    rating: 9.1,
    year: 2015,
    coverUrl: 'https://media.rawg.io/media/games/25c/25c17eb753f7f48037b567b57b9899f8.jpg',
    description: '8 amigos isolados na montanha Blackwood onde cada decisão com efeito borboleta decide quem viverá até o amanhecer.',
    timeToBeat: { main: 8, extra: 10, completionist: 17 }
  },
  {
    id: 'detroit-become-human',
    title: 'Detroit: Become Human',
    category: ['playstation', 'scifi'],
    platform: 'PS4',
    rating: 9.5,
    year: 2018,
    coverUrl: steamCover('1222140'),
    description: 'Connor, Markus e Kara: androides desenvolvendo consciência humana num futuro distópico com dezenas de finais.',
    timeToBeat: { main: 12, extra: 18, completionist: 31 }
  },
  {
    id: 'heavy-rain',
    title: 'Heavy Rain',
    category: ['playstation'],
    platform: 'PS3',
    rating: 9.2,
    year: 2010,
    coverUrl: steamCover('960910'),
    description: 'Quatro protagonistas correm contra o tempo para descobrir a identidade do Assassino do Origami e salvar Shaun.',
    timeToBeat: { main: 10, extra: 13, completionist: 23 }
  },
  {
    id: 'metal-gear-solid-4',
    title: 'Metal Gear Solid 4: Guns of the Patriots',
    category: ['playstation', 'stealth', 'action_fps'],
    platform: 'PS3',
    rating: 9.7,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/55e/55e348f9ec26ec89f8162e08e64c2975.jpg',
    description: 'Old Snake na sua última missão para liquidar Liquid Ocelot e o sistema de inteligência artificial The Patriots.',
    timeToBeat: { main: 18, extra: 23, completionist: 35 }
  },
  {
    id: 'metal-gear-rising-revengeance',
    title: 'Metal Gear Rising: Revengeance',
    category: ['hackslash', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.6,
    year: 2013,
    coverUrl: steamCover('235460'),
    description: 'Corte tudo em pedaços com Raiden ciborgue, a katana de alta frequência e duelos épicos contra Armstrong e Sam.',
    timeToBeat: { main: 7, extra: 11, completionist: 28 }
  },
  {
    id: 'littlebigplanet-2',
    title: 'LittleBigPlanet 2',
    category: ['playstation', 'platformer'],
    platform: 'PS3',
    rating: 9.4,
    year: 2011,
    coverUrl: 'https://media.rawg.io/media/games/e29/e2925b4104d49a46351b8c8d8b67161b.jpg',
    description: 'Sackboy em uma plataforma de criação infinita onde jogadores do mundo todo criaram milhões de fases completas.',
    timeToBeat: { main: 8, extra: 13, completionist: 26 }
  },
  {
    id: 'motorstorm-pacific-rift',
    title: 'MotorStorm: Pacific Rift',
    category: ['playstation', 'racing'],
    platform: 'PS3',
    rating: 9.1,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/4ce/4ce0251da4a0a73d328328bfb4eb5c62.jpg',
    description: 'Corridas brutais em uma ilha vulcânica havaiana dividida em pistas de Fogo, Água, Terra e Ar.',
    timeToBeat: { main: 15, extra: 25, completionist: 45 }
  },
  {
    id: 'driveclub-ps4',
    title: 'Driveclub',
    category: ['playstation', 'racing'],
    platform: 'PS4',
    rating: 8.9,
    year: 2014,
    coverUrl: 'https://media.rawg.io/media/games/04c/04cb3b772c679901ae4f3a7eb6d95da5.jpg',
    description: 'A física de clima e chuva dinâmica mais impressionante da geração em pistas na Escócia, Chile e Japão.',
    timeToBeat: { main: 16, extra: 28, completionist: 52 }
  },
  {
    id: 'helldivers-2',
    title: 'Helldivers 2',
    category: ['playstation', 'action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.5,
    year: 2024,
    coverUrl: steamCover('553850'),
    description: 'Espalhe a Democracia Gerenciada em equipe pela Super Terra contra hordas de Terminídios e Autômatos.',
    timeToBeat: { main: 25, extra: 50, completionist: 100 }
  },
  {
    id: 'rise-of-the-ronin',
    title: 'Rise of the Ronin',
    category: ['playstation', 'openworld', 'hackslash', 'rpg'],
    platform: 'PS5',
    rating: 9.0,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/45c/45cf2a5ff50b86a8ba613cfb4009eaeb.jpg',
    description: 'O Team Ninja recria o Japão no fim do xogunato Tokugawa durante a guerra Bakumatsu com combate rápido e planador.',
    timeToBeat: { main: 22, extra: 45, completionist: 75 }
  },
  {
    id: 'sackboy-a-big-adventure',
    title: 'Sackboy: A Big Adventure',
    category: ['playstation', 'platformer'],
    platform: 'PS5',
    rating: 9.2,
    year: 2020,
    coverUrl: steamCover('1599660'),
    description: 'Aventura cooperativa encantadora para até 4 jogadores com fases musicais no ritmo de Uptown Funk e Bruno Mars.',
    timeToBeat: { main: 11, extra: 17, completionist: 26 }
  }
];

console.log('Batch 3 (PlayStation) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
