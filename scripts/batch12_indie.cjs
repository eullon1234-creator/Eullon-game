// scripts/batch12_indie.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'hollow-knight-indie',
    title: 'Hollow Knight',
    category: ['indie', 'platformer', 'soulslike'],
    platform: 'PC',
    rating: 10.0,
    year: 2017,
    coverUrl: steamCover('367520'),
    description: 'O Cavaleiro explora o vasto e deslumbrante reino arruinado de Hallownest com o ferrão (Nail) e encantos (Charms).',
    timeToBeat: { main: 27, extra: 42, completionist: 62 }
  },
  {
    id: 'celeste-indie',
    title: 'Celeste',
    category: ['indie', 'platformer'],
    platform: 'PC',
    rating: 9.8,
    year: 2018,
    coverUrl: steamCover('504230'),
    description: 'Madeline escala a Montanha Celeste enfrentando sua ansiedade e pânico interior com dashes de precisão e trilha de Lena Raine.',
    timeToBeat: { main: 8, extra: 14, completionist: 40 }
  },
  {
    id: 'dead-cells-indie',
    title: 'Dead Cells',
    category: ['indie', 'platformer', 'hackslash'],
    platform: 'PC',
    rating: 9.7,
    year: 2018,
    coverUrl: steamCover('588650'),
    description: 'O roguelite frenético estilo "RogueVANIA": mate, morra, aprenda e repita com centenas de armas, magias e rolagens a 60 FPS.',
    timeToBeat: { main: 14, extra: 28, completionist: 85 }
  },
  {
    id: 'hades-1-indie',
    title: 'Hades',
    category: ['indie', 'hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.9,
    year: 2020,
    coverUrl: steamCover('1145360'),
    description: 'Zagreus tenta fugir do Submundo de seu pai Hades com as bênçãos dos Deuses do Olimpo na obra-prima da Supergiant Games.',
    timeToBeat: { main: 22, extra: 48, completionist: 98 }
  },
  {
    id: 'hades-2-indie',
    title: 'Hades II',
    category: ['indie', 'hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.9,
    year: 2024,
    coverUrl: steamCover('1145350'),
    description: 'Melinoë, a Princesa do Submundo e feiticeira, desafia as forças do Tempo em pessoa (Chronos) com magias arcanas.',
    timeToBeat: { main: 25, extra: 55, completionist: 110 }
  },
  {
    id: 'stardew-valley-indie',
    title: 'Stardew Valley',
    category: ['indie', 'rpg'],
    platform: 'PC',
    rating: 9.9,
    year: 2016,
    coverUrl: steamCover('413150'),
    description: 'Herde a velha fazenda do seu avô em Pelican Town, plante safras, crie animais, explore minas e construa relacionamentos.',
    timeToBeat: { main: 53, extra: 95, completionist: 160 }
  },
  {
    id: 'cuphead-delicious-course',
    title: 'Cuphead & The Delicious Last Course',
    category: ['indie', 'platformer'],
    platform: 'PC',
    rating: 9.8,
    year: 2022,
    coverUrl: steamCover('268910'),
    description: 'Animação clássica desenhada à mão estilo anos 1930 com Xicorinho, Caneco e a Srta. Cálice contra chefes desafiadores.',
    timeToBeat: { main: 11, extra: 16, completionist: 28 }
  },
  {
    id: 'balatro-indie',
    title: 'Balatro',
    category: ['indie'],
    platform: 'PC',
    rating: 9.8,
    year: 2024,
    coverUrl: steamCover('2379780'),
    description: 'O fenômeno roguelike de pôquer hipnotizante: combine cartas de tarô, curingas com sinergias absurdas e quebre as pontuações.',
    timeToBeat: { main: 12, extra: 40, completionist: 130 }
  },
  {
    id: 'slay-the-spire-indie',
    title: 'Slay the Spire',
    category: ['indie', 'rpg'],
    platform: 'PC',
    rating: 9.8,
    year: 2019,
    coverUrl: steamCover('646570'),
    description: 'O construtor de baralhos roguelike definitivo: monte sinergias perfeitas com o Guerreiro de Ferro, a Sorrateira e o Defeito.',
    timeToBeat: { main: 12, extra: 55, completionist: 220 }
  },
  {
    id: 'undertale-indie',
    title: 'Undertale',
    category: ['indie', 'rpg', 'retro'],
    platform: 'PC',
    rating: 9.9,
    year: 2015,
    coverUrl: steamCover('391540'),
    description: 'O RPG de Toby Fox onde você não precisa destruir ninguém: converse, poupe ou lute com Sans, Papyrus e Toriel.',
    timeToBeat: { main: 6, extra: 8, completionist: 20 }
  },
  {
    id: 'deltarune-chapters',
    title: 'DELTARUNE Chapters 1 & 2',
    category: ['indie', 'rpg'],
    platform: 'PC',
    rating: 9.7,
    year: 2021,
    coverUrl: steamCover('1671210'),
    description: 'Kris, Susie e o Príncipe das Trevas Ralsei no Mundo das Trevas com o hilário e marcante Spamton G. Spamton.',
    timeToBeat: { main: 7, extra: 10, completionist: 14 }
  },
  {
    id: 'terraria-indie',
    title: 'Terraria',
    category: ['indie', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.9,
    year: 2011,
    coverUrl: steamCover('105600'),
    description: 'Cave, construa, explore e enfrente o Olho de Cthulhu e a Parede de Carne no Hardmode no sandbox 2D definitivo.',
    timeToBeat: { main: 52, extra: 90, completionist: 190 }
  },
  {
    id: 'subnautica-indie',
    title: 'Subnautica',
    category: ['indie', 'openworld', 'horror', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2018,
    coverUrl: steamCover('264710'),
    description: 'Caia no planeta oceânico 4546B: construa bases aquáticas, pilote o submarino Cyclops e mergulhe no terror dos Leviatãs.',
    timeToBeat: { main: 30, extra: 45, completionist: 60 }
  },
  {
    id: 'outer-wilds-indie',
    title: 'Outer Wilds',
    category: ['indie', 'openworld', 'scifi'],
    platform: 'PC',
    rating: 10.0,
    year: 2019,
    coverUrl: steamCover('753640'),
    description: 'Um sistema solar preso em um loop temporal de 22 minutos antes do Sol explodir em supernova: pura curiosidade e arqueologia cósmica.',
    timeToBeat: { main: 16, extra: 22, completionist: 28 }
  },
  {
    id: 'pizza-tower-indie',
    title: 'Pizza Tower',
    category: ['indie', 'platformer'],
    platform: 'PC',
    rating: 9.8,
    year: 2023,
    coverUrl: steamCover('2231450'),
    description: 'Peppino Spaghetti corre em velocidade supersônica destruindo tudo para salvar sua pizzaria na homenagem insana a Wario Land.',
    timeToBeat: { main: 6, extra: 10, completionist: 20 }
  },
  {
    id: 'vampire-survivors-indie',
    title: 'Vampire Survivors',
    category: ['indie', 'retro'],
    platform: 'PC',
    rating: 9.8,
    year: 2022,
    coverUrl: steamCover('1794680'),
    description: 'O criador da febre dos auto-shooters: sobreviva por 30 minutos a milhares de monstros com sinergias e evoluções de armas.',
    timeToBeat: { main: 14, extra: 35, completionist: 60 }
  },
  {
    id: 'dave-the-diver-indie',
    title: 'Dave the Diver',
    category: ['indie', 'rpg'],
    platform: 'PC',
    rating: 9.7,
    year: 2023,
    coverUrl: steamCover('1868140'),
    description: 'Mergulhe de dia no misterioso Poço Azul para pescar peixes exóticos e gerencie um agitado restaurante de sushi de noite.',
    timeToBeat: { main: 25, extra: 38, completionist: 55 }
  },
  {
    id: 'cult-of-the-lamb-indie',
    title: 'Cult of the Lamb',
    category: ['indie', 'hackslash'],
    platform: 'PC',
    rating: 9.5,
    year: 2022,
    coverUrl: steamCover('1313140'),
    description: 'Um cordeirinho possuído salvo da execução cria seu próprio culto leal de seguidores fofos com cruzadas roguelike sangrentas.',
    timeToBeat: { main: 14, extra: 21, completionist: 32 }
  },
  {
    id: 'disco-elysium-final-cut',
    title: 'Disco Elysium - The Final Cut',
    category: ['indie', 'rpg'],
    platform: 'PC',
    rating: 10.0,
    year: 2021,
    coverUrl: steamCover('632470'),
    description: 'O detetive amnésico Harry Du Bois e o parceiro Kim Kitsuragi investigam um enforcamento em Revachol: roteiro genial sem combate.',
    timeToBeat: { main: 22, extra: 35, completionist: 45 }
  },
  {
    id: 'stray-indie',
    title: 'Stray',
    category: ['indie', 'scifi', 'platformer'],
    platform: 'PC',
    rating: 9.5,
    year: 2022,
    coverUrl: steamCover('1332010'),
    description: 'Um gato de rua com mochila e o drone B-12 exploram os becos iluminados por neon de uma cidade cibernética decadente habitada por robôs.',
    timeToBeat: { main: 5, extra: 7, completionist: 10 }
  },
  {
    id: 'tunic-indie',
    title: 'TUNIC',
    category: ['indie', 'rpg', 'soulslike'],
    platform: 'PC',
    rating: 9.6,
    year: 2022,
    coverUrl: steamCover('553420'),
    description: 'Uma raposinha com espada e escudo decifra páginas de um manual de instruções ilustrado nostálgico cheio de segredos enigmáticos.',
    timeToBeat: { main: 12, extra: 17, completionist: 23 }
  },
  {
    id: 'hotline-miami-collection',
    title: 'Hotline Miami',
    category: ['indie', 'action_fps', 'retro'],
    platform: 'PC',
    rating: 9.7,
    year: 2012,
    coverUrl: steamCover('219150'),
    description: 'Jacket recebe recados estranhos na secretária eletrônica: coloque máscaras de animais e limpe prédios da máfia russa em Miami 1989.',
    timeToBeat: { main: 4, extra: 6, completionist: 14 }
  },
  {
    id: 'katana-zero',
    title: 'Katana ZERO',
    category: ['indie', 'platformer', 'hackslash'],
    platform: 'PC',
    rating: 9.6,
    year: 2019,
    coverUrl: steamCover('460950'),
    description: 'O samurai assassino com poder de desacelerar o tempo e rebater balas com a katana em uma distopia neo-noir frenética.',
    timeToBeat: { main: 5, extra: 7, completionist: 12 }
  },
  {
    id: 'inside-indie',
    title: 'INSIDE',
    category: ['indie', 'platformer', 'horror'],
    platform: 'PC',
    rating: 9.7,
    year: 2016,
    coverUrl: steamCover('304430'),
    description: 'Dos criadores de Limbo: um menino solitário é caçado enquanto se infiltra no coração de um projeto industrial distópico bizarro.',
    timeToBeat: { main: 4, extra: 4, completionist: 5 }
  },
  {
    id: 'little-nightmares-2',
    title: 'Little Nightmares II',
    category: ['indie', 'platformer', 'horror'],
    platform: 'PC',
    rating: 9.5,
    year: 2021,
    coverUrl: steamCover('860510'),
    description: 'Mono e a menina de capa amarela Six atravessam a sinistra Cidade Pálida distorcida pela Torre de Sinal do Homem Magro.',
    timeToBeat: { main: 6, extra: 7, completionist: 9 }
  }
];

console.log('Batch 12 (Indies) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
