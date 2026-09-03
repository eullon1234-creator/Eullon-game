// scripts/batch11_fps.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'half-life-1',
    title: 'Half-Life',
    category: ['action_fps', 'scifi', 'retro'],
    platform: 'PC',
    rating: 9.8,
    year: 1998,
    coverUrl: steamCover('70'),
    description: 'Gordon Freeman de jaleco e pé de cabra tenta escapar do laboratório subterrâneo de Black Mesa após a Cascata de Ressonância.',
    timeToBeat: { main: 12, extra: 15, completionist: 18 }
  },
  {
    id: 'half-life-2',
    title: 'Half-Life 2',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 10.0,
    year: 2004,
    coverUrl: steamCover('220'),
    description: 'A revolução da física Havok com a Gravity Gun em City 17 lutando contra os Combine ao lado de Alyx Vance.',
    timeToBeat: { main: 15, extra: 19, completionist: 24 }
  },
  {
    id: 'half-life-2-ep2',
    title: 'Half-Life 2: Episode Two',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2007,
    coverUrl: steamCover('420'),
    description: 'A corrida de carro contra Striders na base de White Forest e o suspense angustiante do final com Eli Vance.',
    timeToBeat: { main: 6, extra: 8, completionist: 11 }
  },
  {
    id: 'black-mesa',
    title: 'Black Mesa',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2020,
    coverUrl: steamCover('362890'),
    description: 'A recriação definitiva do primeiro Half-Life na Source Engine com o capítulo alienígena de Xen totalmente expandido.',
    timeToBeat: { main: 15, extra: 18, completionist: 23 }
  },
  {
    id: 'portal-1',
    title: 'Portal',
    category: ['platformer', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.8,
    year: 2007,
    coverUrl: steamCover('400'),
    description: 'Chell e a Aperture Science Handheld Portal Device sob o comando da sarcástica inteligência artificial GLaDOS: "The cake is a lie".',
    timeToBeat: { main: 3, extra: 5, completionist: 10 }
  },
  {
    id: 'portal-2',
    title: 'Portal 2',
    category: ['platformer', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 10.0,
    year: 2011,
    coverUrl: steamCover('620'),
    description: 'Wheatley, Cave Johnson e géis de propulsão nos laboratórios subterrâneos antigos com uma genial campanha coop de robôs.',
    timeToBeat: { main: 8, extra: 13, completionist: 22 }
  },
  {
    id: 'left-4-dead-2',
    title: 'Left 4 Dead 2',
    category: ['action_fps', 'horror'],
    platform: 'PC',
    rating: 9.8,
    year: 2009,
    coverUrl: steamCover('550'),
    description: 'Coach, Ellis, Nick e Rochelle contra Tank, Witch e hordas zumbis no Sul dos EUA sob a batuta do diretor de IA.',
    timeToBeat: { main: 9, extra: 25, completionist: 120 }
  },
  {
    id: 'bioshock-remastered',
    title: 'BioShock Remastered',
    category: ['action_fps', 'horror', 'scifi'],
    platform: 'PC',
    rating: 9.8,
    year: 2016,
    coverUrl: steamCover('409710'),
    description: 'A distopia submarina de Rapture criada por Andrew Ryan: Plasmídeos, Big Daddies com furadeiras gigantes e Little Sisters.',
    timeToBeat: { main: 12, extra: 16, completionist: 22 }
  },
  {
    id: 'bioshock-infinite',
    title: 'BioShock Infinite',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2013,
    coverUrl: steamCover('8870'),
    description: 'Booker DeWitt sobe à cidade flutuante de Columbia nas nuvens para resgatar Elizabeth que abre fendas dimensionais.',
    timeToBeat: { main: 11, extra: 15, completionist: 27 }
  },
  {
    id: 'doom-2016',
    title: 'DOOM (2016)',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.7,
    year: 2016,
    coverUrl: steamCover('379720'),
    description: 'O Doom Slayer desperta em Marte ao som de guitarras pesadas de Mick Gordon: Glory Kills, Super Shotgun e velocidade insana.',
    timeToBeat: { main: 12, extra: 16, completionist: 27 }
  },
  {
    id: 'doom-eternal',
    title: 'DOOM Eternal',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.8,
    year: 2020,
    coverUrl: steamCover('782330'),
    description: 'O quebra-cabeça de combate em primeira pessoa definitivo: use lança-chamas por armadura, motosserra por munição e gancho Meathook.',
    timeToBeat: { main: 14, extra: 19, completionist: 27 }
  },
  {
    id: 'wolfenstein-the-new-order',
    title: 'Wolfenstein: The New Order',
    category: ['action_fps'],
    platform: 'PC',
    rating: 9.5,
    year: 2014,
    coverUrl: steamCover('201810'),
    description: 'B.J. Blazkowicz lidera a resistência armada em uma linha temporal alternativa distópica dos anos 1960 dominada pelos nazistas.',
    timeToBeat: { main: 12, extra: 16, completionist: 27 }
  },
  {
    id: 'wolfenstein-2-new-colossus',
    title: 'Wolfenstein II: The New Colossus',
    category: ['action_fps'],
    platform: 'PC',
    rating: 9.4,
    year: 2017,
    coverUrl: steamCover('612880'),
    description: 'Blazkowicz liberta os Estados Unidos com duas escopetas automáticas pesadas empunhadas simultaneamente e narrativa cinematográfica.',
    timeToBeat: { main: 11, extra: 17, completionist: 32 }
  },
  {
    id: 'metro-2033-redux',
    title: 'Metro 2033 Redux',
    category: ['action_fps', 'horror', 'scifi'],
    platform: 'PC',
    rating: 9.3,
    year: 2014,
    coverUrl: steamCover('286690'),
    description: 'Artyom atravessa os túneis claustrofóbicos do metrô de Moscou usando balas de grau militar como moeda contra os Escuros (Dark Ones).',
    timeToBeat: { main: 9, extra: 12, completionist: 18 }
  },
  {
    id: 'metro-exodus',
    title: 'Metro Exodus',
    category: ['action_fps', 'openworld', 'horror'],
    platform: 'PC',
    rating: 9.5,
    year: 2019,
    coverUrl: steamCover('412020'),
    description: 'A bordo do trem a vapor Aurora cruzando as quatro estações da Rússia pós-nuclear em grandes áreas abertas imersivas.',
    timeToBeat: { main: 15, extra: 25, completionist: 40 }
  },
  {
    id: 'stalker-shadow-of-chernobyl',
    title: 'S.T.A.L.K.E.R.: Shadow of Chernobyl',
    category: ['action_fps', 'horror', 'openworld'],
    platform: 'PC',
    rating: 9.2,
    year: 2007,
    coverUrl: steamCover('4500'),
    description: 'O Marcado (Marked One) desbrava anomalias mortais e mutantes na Zona de Exclusão de Chernobyl em busca do Monólito.',
    timeToBeat: { main: 16, extra: 26, completionist: 45 }
  },
  {
    id: 'stalker-2-heart-of-chornobyl',
    title: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl',
    category: ['action_fps', 'horror', 'openworld'],
    platform: 'PC',
    rating: 9.4,
    year: 2024,
    coverUrl: steamCover('1643320'),
    description: 'A Zona pós-apocalíptica de Chornobyl recriada com poder fotorrealista na Unreal Engine 5 e sistema de sobrevivência A-Life 2.0.',
    timeToBeat: { main: 40, extra: 75, completionist: 120 }
  },
  {
    id: 'borderlands-2',
    title: 'Borderlands 2',
    category: ['action_fps', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.8,
    year: 2012,
    coverUrl: steamCover('49520'),
    description: '87 bazilhões de armas no planeta Pandora contra o vilão mais carismático e detestável dos jogos: Handsome Jack.',
    timeToBeat: { main: 30, extra: 55, completionist: 125 }
  },
  {
    id: 'borderlands-3',
    title: 'Borderlands 3',
    category: ['action_fps', 'rpg'],
    platform: 'PC',
    rating: 9.2,
    year: 2019,
    coverUrl: steamCover('397540'),
    description: 'Quatro novos Caçadores do Cofre viajam em sua espaçonave Sanctuary III para explorar mundos além de Pandora.',
    timeToBeat: { main: 23, extra: 45, completionist: 105 }
  },
  {
    id: 'titanfall-2',
    title: 'Titanfall 2',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.8,
    year: 2016,
    coverUrl: steamCover('1237970'),
    description: 'Jack Cooper e o titã BT-7274 na melhor campanha de FPS da década com a inesquecível fase de viagem no tempo "Effect and Cause".',
    timeToBeat: { main: 6, extra: 8, completionist: 15 }
  },
  {
    id: 'prey-2017',
    title: 'Prey (2017)',
    category: ['action_fps', 'scifi', 'horror'],
    platform: 'PC',
    rating: 9.5,
    year: 2017,
    coverUrl: steamCover('480490'),
    description: 'Morgan Yu na estação espacial Talos I contra os alienígenas Typhon que se camuflam em qualquer caneca ou objeto com a arma GLOO.',
    timeToBeat: { main: 16, extra: 27, completionist: 45 }
  },
  {
    id: 'control-ultimate-edition',
    title: 'Control Ultimate Edition',
    category: ['action_fps', 'scifi'],
    platform: 'PC',
    rating: 9.6,
    year: 2020,
    coverUrl: steamCover('870780'),
    description: 'Jesse Faden assume a diretoria do Federal Bureau of Control na Antiga Casa levitando e arremessando mesas e blocos com telecinese.',
    timeToBeat: { main: 12, extra: 20, completionist: 33 }
  },
  {
    id: 'cyberpunk-2077-phantom-liberty',
    title: 'Cyberpunk 2077: Phantom Liberty',
    category: ['scifi', 'openworld', 'rpg', 'action_fps'],
    platform: 'PC',
    rating: 9.8,
    year: 2023,
    coverUrl: steamCover('2138330'),
    description: 'Espionagem e conspiração política de alto risco em Dogtown com o agente Solomon Reed (Idris Elba) e a misteriosa Songbird.',
    timeToBeat: { main: 13, extra: 22, completionist: 35 }
  },
  {
    id: 'warhammer-space-marine-2',
    title: 'Warhammer 40,000: Space Marine 2',
    category: ['action_fps', 'scifi', 'hackslash'],
    platform: 'PC',
    rating: 9.6,
    year: 2024,
    coverUrl: steamCover('2183900'),
    description: 'O Tenente Titus dos Ultramarines esmaga enxames infinitos de Tirânidos pelo Imperador com a Chainsword e o Rifle Bolter.',
    timeToBeat: { main: 10, extra: 18, completionist: 40 }
  },
  {
    id: 'rainbow-six-siege',
    title: "Tom Clancy's Rainbow Six Siege",
    category: ['action_fps'],
    platform: 'PC',
    rating: 9.5,
    year: 2015,
    coverUrl: steamCover('359550'),
    description: 'O ápice do tiro tático em ambientes destrutíveis com drones de reconhecimento, paredes reforçadas e operadores com gadgets únicos.',
    timeToBeat: { main: 25, extra: 60, completionist: 250 }
  }
];

console.log('Batch 11 (Action & FPS) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
