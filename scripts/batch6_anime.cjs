// scripts/batch6_anime.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'dbz-sparking-zero',
    title: 'Dragon Ball: Sparking! ZERO',
    category: ['dragon_ball', 'fighting', 'anime'],
    platform: 'PC',
    rating: 9.8,
    year: 2024,
    coverUrl: steamCover('1790600'),
    description: 'O herdeiro lendário da franquia Budokai Tenkaichi com mais de 180 lutadores, gráficos fiéis ao anime e destruição de cenário.',
    timeToBeat: { main: 15, extra: 30, completionist: 65 }
  },
  {
    id: 'dbz-budokai-3',
    title: 'Dragon Ball Z: Budokai 3',
    category: ['dragon_ball', 'ps2', 'fighting', 'anime'],
    platform: 'PS2',
    rating: 9.7,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/a7e/a7e937fae69e46a7be783ff3fe348c59.jpg',
    description: 'Dragon Universe voando pelo mapa da Terra e Namekusei, sistema Dragon Rush e as transformações em tempo real.',
    timeToBeat: { main: 10, extra: 22, completionist: 45 }
  },
  {
    id: 'dbz-infinite-world',
    title: 'Dragon Ball Z: Infinite World',
    category: ['dragon_ball', 'ps2', 'fighting', 'anime'],
    platform: 'PS2',
    rating: 9.0,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/bcf/bcf31efadbe9d9f584e038eb9f06e0fe.jpg',
    description: 'O último grande jogo da era PS2 unindo o combate técnico de Budokai com minigames e animações caprichadas.',
    timeToBeat: { main: 8, extra: 16, completionist: 30 }
  },
  {
    id: 'dbz-raging-blast-2',
    title: 'Dragon Ball: Raging Blast 2',
    category: ['dragon_ball', 'fighting', 'anime'],
    platform: 'PS3',
    rating: 9.1,
    year: 2010,
    coverUrl: 'https://media.rawg.io/media/games/d82/d8299ee8f8702bbaeaae24749f9bfcf7.jpg',
    description: 'Mais de 90 personagens, combos rápidos a 60 FPS e o modo Raging Soul para esmagar seus oponentes.',
    timeToBeat: { main: 12, extra: 24, completionist: 50 }
  },
  {
    id: 'dbz-xenoverse-2',
    title: 'Dragon Ball Xenoverse 2',
    category: ['dragon_ball', 'fighting', 'rpg', 'anime'],
    platform: 'PC',
    rating: 9.2,
    year: 2016,
    coverUrl: steamCover('454650'),
    description: 'Crie seu próprio patrulheiro do tempo saiyajin, majin ou namekuseijin e proteja a história cronológica de Conton City.',
    timeToBeat: { main: 21, extra: 45, completionist: 90 }
  },
  {
    id: 'db-fighterz',
    title: 'Dragon Ball FighterZ',
    category: ['dragon_ball', 'fighting', 'anime'],
    platform: 'PC',
    rating: 9.7,
    year: 2018,
    coverUrl: steamCover('678950'),
    description: 'A Arc System Works cria o jogo de luta competitivo definitivo de Dragon Ball em trios 3v3 com visual espetacular.',
    timeToBeat: { main: 12, extra: 25, completionist: 70 }
  },
  {
    id: 'naruto-storm-3-full-burst',
    title: 'Naruto Shippuden: Ultimate Ninja Storm 3 Full Burst',
    category: ['naruto', 'fighting', 'anime'],
    platform: 'PC',
    rating: 9.6,
    year: 2013,
    coverUrl: steamCover('234670'),
    description: 'A invasão de Pain, a reunião dos Cinco Kages e o despertar dos Jinchuurikis na Quarta Grande Guerra Ninja.',
    timeToBeat: { main: 11, extra: 18, completionist: 38 }
  },
  {
    id: 'naruto-storm-4-road-to-boruto',
    title: 'Naruto Shippuden: Ultimate Ninja Storm 4',
    category: ['naruto', 'fighting', 'anime'],
    platform: 'PC',
    rating: 9.8,
    year: 2016,
    coverUrl: steamCover('349040'),
    description: 'A batalha final épica no Vale do Fim entre Naruto e Sasuke e confrontos gigantescos de Susano\'o e Kurama.',
    timeToBeat: { main: 9, extra: 16, completionist: 35 }
  },
  {
    id: 'naruto-ultimate-ninja-5-ps2',
    title: 'Naruto Shippuden: Ultimate Ninja 5',
    category: ['naruto', 'ps2', 'fighting', 'anime'],
    platform: 'PS2',
    rating: 9.8,
    year: 2007,
    coverUrl: 'https://media.rawg.io/media/games/b89/b8935c1894d3f3f20f0117d91cb6a6b5.jpg',
    description: 'O melhor jogo de luta 2D de Naruto no PS2: explore Konoha em RPG, lute com duplas de suporte e derrote a Akatsuki.',
    timeToBeat: { main: 14, extra: 24, completionist: 45 }
  },
  {
    id: 'naruto-ultimate-ninja-3-ps2',
    title: 'Naruto: Ultimate Ninja 3',
    category: ['naruto', 'ps2', 'fighting', 'anime'],
    platform: 'PS2',
    rating: 9.5,
    year: 2005,
    coverUrl: 'https://media.rawg.io/media/games/6bf/6bf36058ca769747eed07de4d2ba85e2.jpg',
    description: 'A era clássica de Naruto com a invasão da Areia, o Exame Chunin e o torneio especial com dezenas de jutsus e itens.',
    timeToBeat: { main: 9, extra: 18, completionist: 32 }
  },
  {
    id: 'naruto-connections',
    title: 'NARUTO X BORUTO Ultimate Ninja STORM CONNECTIONS',
    category: ['naruto', 'fighting', 'anime'],
    platform: 'PC',
    rating: 9.0,
    year: 2023,
    coverUrl: steamCover('1020790'),
    description: 'A maior coleção de ninjas de toda a franquia com mais de 130 personagens e história original de Boruto.',
    timeToBeat: { main: 10, extra: 20, completionist: 40 }
  },
  {
    id: 'pokemon-emerald',
    title: 'Pokémon Emerald',
    category: ['pokemon', 'rpg', 'retro', 'nintendo_switch'],
    platform: 'GBA',
    rating: 9.9,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/025/0250ec4b9551c6b12f67645d9472e389.jpg',
    description: 'A região de Hoenn com Rayquaza descendo dos céus para apartar a guerra milenar entre Kyogre e Groudon e a Battle Frontier.',
    timeToBeat: { main: 30, extra: 50, completionist: 110 }
  },
  {
    id: 'pokemon-firered',
    title: 'Pokémon FireRed',
    category: ['pokemon', 'rpg', 'retro', 'nintendo_switch'],
    platform: 'GBA',
    rating: 9.8,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/029/0295eb48ca4e24eb626cfb08eaeb2327.jpg',
    description: 'O remake impecável dos 151 originais de Kanto com as Ilhas Sevii e o rival Blue.',
    timeToBeat: { main: 28, extra: 45, completionist: 85 }
  },
  {
    id: 'pokemon-heartgold',
    title: 'Pokémon HeartGold',
    category: ['pokemon', 'rpg', 'nintendo_switch'],
    platform: 'NDS',
    rating: 9.9,
    year: 2009,
    coverUrl: 'https://media.rawg.io/media/games/2c8/2c89fbf61a6b0c2a8b941577c9e5e7ec.jpg',
    description: 'Seu Pokémon anda atrás de você pelas duas regiões completas de Johto e Kanto até o duelo no topo do Mt. Silver contra Red.',
    timeToBeat: { main: 36, extra: 60, completionist: 125 }
  },
  {
    id: 'pokemon-platinum',
    title: 'Pokémon Platinum',
    category: ['pokemon', 'rpg', 'nintendo_switch'],
    platform: 'NDS',
    rating: 9.8,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/534/534888be6ee08f0a82b4f9956cfaec96.jpg',
    description: 'A região de Sinnoh, a Campeã Cynthia com seu temido Garchomp e a dimensão distorcida Distortion World de Giratina.',
    timeToBeat: { main: 35, extra: 55, completionist: 115 }
  },
  {
    id: 'pokemon-black-white',
    title: 'Pokémon Black & White',
    category: ['pokemon', 'rpg', 'nintendo_switch'],
    platform: 'NDS',
    rating: 9.7,
    year: 2010,
    coverUrl: 'https://media.rawg.io/media/games/44a/44aa7d930fe3ceea70d3a77d483842c9.jpg',
    description: 'A melhor narrativa da franquia na moderna região de Unova com o enigmático N e o conflito ético da Equipe Plasma.',
    timeToBeat: { main: 31, extra: 48, completionist: 90 }
  },
  {
    id: 'pokemon-black-2-white-2',
    title: 'Pokémon Black 2 & White 2',
    category: ['pokemon', 'rpg', 'nintendo_switch'],
    platform: 'NDS',
    rating: 9.8,
    year: 2012,
    coverUrl: 'https://media.rawg.io/media/games/d07/d073eeaa26cb3b9a82d02cbeaa26cb3b.jpg',
    description: 'Duas décadas de franquia celebradas no Pokémon World Tournament enfrentando líderes de ginásio e campeões de todas as gerações.',
    timeToBeat: { main: 34, extra: 60, completionist: 130 }
  },
  {
    id: 'pokemon-scarlet-violet',
    title: 'Pokémon Scarlet & Violet',
    category: ['pokemon', 'rpg', 'openworld', 'nintendo_switch'],
    platform: 'Nintendo Switch',
    rating: 9.1,
    year: 2022,
    coverUrl: 'https://media.rawg.io/media/games/6cc/6ccb27e8d60144d6b638fb121f0084fb.jpg',
    description: 'A região de Paldea em mundo aberto com montarias em Koraidon/Miraidon, fenômeno Terastal e a comovente Área Zero.',
    timeToBeat: { main: 27, extra: 45, completionist: 85 }
  },
  {
    id: 'pokemon-legends-arceus',
    title: 'Pokémon Legends: Arceus',
    category: ['pokemon', 'rpg', 'openworld', 'nintendo_switch'],
    platform: 'Nintendo Switch',
    rating: 9.6,
    year: 2022,
    coverUrl: 'https://media.rawg.io/media/games/043/043bbdb711100f9116e0be4bf5a66698.jpg',
    description: 'Arremesso de Pokébolas em tempo real na antiga região de Hisui para construir a primeira Pokédex da história.',
    timeToBeat: { main: 25, extra: 40, completionist: 73 }
  },
  {
    id: 'pokemon-mystery-dungeon-explorers',
    title: 'Pokémon Mystery Dungeon: Explorers of Sky',
    category: ['pokemon', 'rpg'],
    platform: 'NDS',
    rating: 9.7,
    year: 2009,
    coverUrl: 'https://media.rawg.io/media/games/e29/e29c017d91cb6a6b5d088b3353846618.jpg',
    description: 'Você acordou como um Pokémon! Forme uma equipe de resgate e explore masmorras misteriosas com enredo inesquecível.',
    timeToBeat: { main: 23, extra: 48, completionist: 110 }
  },
  {
    id: 'one-piece-pirate-warriors-4',
    title: 'One Piece: Pirate Warriors 4',
    category: ['anime', 'hackslash', 'fighting'],
    platform: 'PC',
    rating: 9.3,
    year: 2020,
    coverUrl: steamCover('1089090'),
    description: 'Luffy, Zoro e os Chapéus de Palha varrem milhares de marinheiros e piratas em Wano e Whole Cake com Gear 4 e 5.',
    timeToBeat: { main: 15, extra: 28, completionist: 52 }
  },
  {
    id: 'one-piece-odyssey',
    title: 'One Piece Odyssey',
    category: ['anime', 'rpg'],
    platform: 'PC',
    rating: 8.9,
    year: 2023,
    coverUrl: steamCover('1414420'),
    description: 'Um RPG com turnos dinâmicos por zonas na misteriosa ilha de Waford revisitando memórias em Alabasta e Dressrosa.',
    timeToBeat: { main: 33, extra: 48, completionist: 65 }
  },
  {
    id: 'yugioh-master-duel',
    title: 'Yu-Gi-Oh! Master Duel',
    category: ['anime'],
    platform: 'PC',
    rating: 9.4,
    year: 2022,
    coverUrl: steamCover('1449850'),
    description: 'O simulador definitivo oficial de duelos de cartas da Konami com mais de 10.000 cartas, regras oficiais e partidas ranqueadas.',
    timeToBeat: { main: 20, extra: 50, completionist: 150 }
  },
  {
    id: 'yugioh-tag-force-3',
    title: 'Yu-Gi-Oh! GX Tag Force 3',
    category: ['anime', 'retro'],
    platform: 'PSP',
    rating: 9.3,
    year: 2008,
    coverUrl: 'https://media.rawg.io/media/games/f89/f8935c1894d3f3f20f0117d91cb6a6b5.jpg',
    description: 'Duelos em duplas na Academia de Duelos da Ilha ao lado de Jaden Yuki e seus Heróis Elementares.',
    timeToBeat: { main: 25, extra: 45, completionist: 80 }
  },
  {
    id: 'bleach-rebirth-of-souls',
    title: 'Bleach: Rebirth of Souls',
    category: ['anime', 'fighting'],
    platform: 'PC',
    rating: 9.1,
    year: 2024,
    coverUrl: steamCover('1914980'),
    description: 'Ichigo Kurosaki e os Capitães do Gotei 13 com Bankai, Zanpakuto e lâminas espirituais em duelos fiéis ao anime de Tite Kubo.',
    timeToBeat: { main: 10, extra: 20, completionist: 40 }
  },
  {
    id: 'jojo-all-star-battle-r',
    title: "JoJo's Bizarre Adventure: All-Star Battle R",
    category: ['anime', 'fighting'],
    platform: 'PC',
    rating: 9.2,
    year: 2022,
    coverUrl: steamCover('1372280'),
    description: 'Jotaro, Dio, Joseph e 50 personagens de todas as 8 partes de JoJo com Stands, Hamon e poses icônicas.',
    timeToBeat: { main: 8, extra: 17, completionist: 35 }
  },
  {
    id: 'demon-slayer-hinokami',
    title: 'Demon Slayer -Kimetsu no Yaiba- The Hinokami Chronicles',
    category: ['anime', 'fighting'],
    platform: 'PC',
    rating: 9.2,
    year: 2021,
    coverUrl: steamCover('1490890'),
    description: 'Tanjiro Kamado usa a Respiração da Água e a Hinokami Kagura contra os demônios de Muzan Kibutsuji.',
    timeToBeat: { main: 8, extra: 13, completionist: 25 }
  },
  {
    id: 'attack-on-titan-2-final-battle',
    title: 'Attack on Titan 2: Final Battle',
    category: ['anime', 'hackslash', 'action_fps'],
    platform: 'PC',
    rating: 9.3,
    year: 2019,
    coverUrl: steamCover('630050'),
    description: 'Voe entre as muralhas com o equipamento de manobra tridimensional (ODM Gear) cortando a nuca de Titãs gigantescos.',
    timeToBeat: { main: 15, extra: 35, completionist: 70 }
  },
  {
    id: 'persona-4-golden',
    title: 'Persona 4 Golden',
    category: ['rpg', 'anime'],
    platform: 'PC',
    rating: 9.8,
    year: 2020,
    coverUrl: steamCover('1113000'),
    description: 'O canal da meia-noite na cidadezinha enevoada de Inaba: investigue assassinatos em série ao lado da Investigation Team.',
    timeToBeat: { main: 68, extra: 84, completionist: 138 }
  },
  {
    id: 'persona-3-reload',
    title: 'Persona 3 Reload',
    category: ['rpg', 'anime'],
    platform: 'PC',
    rating: 9.8,
    year: 2024,
    coverUrl: steamCover('2161700'),
    description: 'A Hora Sombria e a colossal torre Tartarus reconstruídas na Unreal Engine com trilha sonora repaginada da SEES.',
    timeToBeat: { main: 65, extra: 82, completionist: 105 }
  }
];

console.log('Batch 6 (Anime Legends) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
