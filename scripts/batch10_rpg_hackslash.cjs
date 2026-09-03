// scripts/batch10_rpg_hackslash.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'ff7-remake-intergrade',
    title: 'Final Fantasy VII Remake Intergrade',
    category: ['rpg', 'hackslash', 'playstation'],
    platform: 'PC',
    rating: 9.7,
    year: 2021,
    coverUrl: steamCover('1462040'),
    description: 'A reinvenção magistral de Midgar com sistema híbrido de ação e turnos táticos, além do episódio especial da ninja Yuffie.',
    timeToBeat: { main: 33, extra: 43, completionist: 86 }
  },
  {
    id: 'ff7-rebirth',
    title: 'Final Fantasy VII Rebirth',
    category: ['rpg', 'openworld', 'hackslash', 'playstation'],
    platform: 'PS5',
    rating: 9.9,
    year: 2024,
    coverUrl: 'https://media.rawg.io/media/games/6cc/6ccb27e8d60144d6b638fb121f0084fb.jpg',
    description: 'Cloud e seus aliados exploram o vasto planeta além de Midgar com chocobos, o minigame Queen\'s Blood e o destino de Aerith.',
    timeToBeat: { main: 46, extra: 90, completionist: 155 }
  },
  {
    id: 'final-fantasy-16',
    title: 'Final Fantasy XVI',
    category: ['rpg', 'hackslash', 'playstation'],
    platform: 'PC',
    rating: 9.5,
    year: 2023,
    coverUrl: steamCover('2515020'),
    description: 'Clive Rosfield canaliza os poderes dos Eikons em Valisthea com batalhas colossais no estilo kaiju dirigidas por Ryota Suzuki.',
    timeToBeat: { main: 36, extra: 58, completionist: 90 }
  },
  {
    id: 'final-fantasy-10-hd',
    title: 'Final Fantasy X/X-2 HD Remaster',
    category: ['rpg', 'playstation', 'ps2'],
    platform: 'PC',
    rating: 9.8,
    year: 2016,
    coverUrl: steamCover('359870'),
    description: 'Tidus e Yuna na peregrinação em Spira para derrotar Sin: o Sphere Grid, a canção To Zanarkand e o esporte Blitzball.',
    timeToBeat: { main: 46, extra: 75, completionist: 145 }
  },
  {
    id: 'crisis-core-reunion',
    title: 'Crisis Core -Final Fantasy VII- Reunion',
    category: ['rpg', 'hackslash'],
    platform: 'PC',
    rating: 9.2,
    year: 2022,
    coverUrl: steamCover('1608070'),
    description: 'A história emocionante de Zack Fair como SOLDIER de 1ª Classe empunhando a Buster Sword antes dos eventos de Cloud.',
    timeToBeat: { main: 15, extra: 28, completionist: 75 }
  },
  {
    id: 'nier-automata',
    title: 'NieR:Automata',
    category: ['rpg', 'hackslash', 'scifi'],
    platform: 'PC',
    rating: 9.9,
    year: 2017,
    coverUrl: steamCover('524220'),
    description: '2B e 9S na guerra de androides contra máquinas na Terra abandonada: múltiplos finais reflexivos e trilha de Keiichi Okabe.',
    timeToBeat: { main: 21, extra: 37, completionist: 63 }
  },
  {
    id: 'nier-replicant',
    title: 'NieR Replicant ver.1.22474487139...',
    category: ['rpg', 'hackslash'],
    platform: 'PC',
    rating: 9.4,
    year: 2021,
    coverUrl: steamCover('1113560'),
    description: 'Um jovem determinado tenta curar sua irmãzinha Yonah da doença Black Scrawl acompanhado pelo sarcástico livro Grimoire Weiss.',
    timeToBeat: { main: 19, extra: 38, completionist: 68 }
  },
  {
    id: 'monster-hunter-world',
    title: 'Monster Hunter: World',
    category: ['rpg', 'openworld', 'hackslash'],
    platform: 'PC',
    rating: 9.8,
    year: 2018,
    coverUrl: steamCover('582010'),
    description: 'O Novo Mundo com ecossistemas vivos: cace Rathalos, Nergigante e Anjanath forjando armaduras colossais em equipe de 4 caçadores.',
    timeToBeat: { main: 48, extra: 105, completionist: 380 }
  },
  {
    id: 'monster-hunter-rise',
    title: 'Monster Hunter Rise',
    category: ['rpg', 'hackslash', 'nintendo_switch'],
    platform: 'PC',
    rating: 9.5,
    year: 2022,
    coverUrl: steamCover('1446780'),
    description: 'Locomoção vertical com os insetos-fio Cabrípteros, montaria nos cães Amicães e combate rápido na temática folclórica japonesa.',
    timeToBeat: { main: 22, extra: 68, completionist: 210 }
  },
  {
    id: 'monster-hunter-wilds',
    title: 'Monster Hunter Wilds',
    category: ['rpg', 'openworld', 'hackslash'],
    platform: 'PC',
    rating: 9.7,
    year: 2025,
    coverUrl: steamCover('2246340'),
    description: 'As Terras Proibidas com manadas dinâmicas de monstros, clima tempestuoso que transforma os biomas e a montaria Seikret.',
    timeToBeat: { main: 35, extra: 85, completionist: 250 }
  },
  {
    id: 'dragon-quest-11-s',
    title: 'Dragon Quest XI S: Echoes of an Elusive Age',
    category: ['rpg'],
    platform: 'PC',
    rating: 9.8,
    year: 2020,
    coverUrl: steamCover('1295510'),
    description: 'A mais pura essência do JRPG clássico: o Luminar caçado como um demônio viaja pelo reino de Erdrea com seus companheiros.',
    timeToBeat: { main: 57, extra: 90, completionist: 135 }
  },
  {
    id: 'dragon-quest-8-ps2',
    title: 'Dragon Quest VIII: Journey of the Cursed King',
    category: ['rpg', 'ps2'],
    platform: 'PS2',
    rating: 9.7,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/68c/68c07e0b5be88ea9446d32aa68c07e0b.jpg',
    description: 'Arte de Akira Toriyama, orquestra sinfônica de Koichi Sugiyama e o sistema de tensão Psycho Up para quebrar a maldição de Dhoulmagus.',
    timeToBeat: { main: 63, extra: 85, completionist: 115 }
  },
  {
    id: 'smt-5-vengeance',
    title: 'Shin Megami Tensei V: Vengeance',
    category: ['rpg', 'anime'],
    platform: 'PC',
    rating: 9.7,
    year: 2024,
    coverUrl: steamCover('1875830'),
    description: 'O Nahobino na Tóquio pós-apocalíptica Da\'at fundindo demônios e decidindo a nova ordem divina entre Lei e Caos.',
    timeToBeat: { main: 50, extra: 85, completionist: 130 }
  },
  {
    id: 'metaphor-refantazio',
    title: 'Metaphor: ReFantazio',
    category: ['rpg', 'anime'],
    platform: 'PC',
    rating: 9.9,
    year: 2024,
    coverUrl: steamCover('262060'),
    description: 'Dos criadores de Persona 3, 4 e 5: concorra ao trono do Reino Unido de Euchronia despertando o poder dos Arquétipos heroicos.',
    timeToBeat: { main: 68, extra: 95, completionist: 140 }
  },
  {
    id: 'devil-may-cry-5',
    title: 'Devil May Cry 5',
    category: ['hackslash', 'action_fps'],
    platform: 'PC',
    rating: 9.8,
    year: 2019,
    coverUrl: steamCover('601150'),
    description: 'Dante com a moto Cavalier, Nero com braços mecânicos Devil Breakers e o misterioso V no ápice técnico do Hack and Slash.',
    timeToBeat: { main: 11, extra: 17, completionist: 65 }
  },
  {
    id: 'dmc-devil-may-cry-3-special',
    title: "Devil May Cry 3: Special Edition",
    category: ['hackslash', 'ps2'],
    platform: 'PC',
    rating: 9.9,
    year: 2006,
    coverUrl: steamCover('631510'),
    description: 'Swordmaster, Gunslinger, Trickster e Royalguard: o duelo lendário entre os filhos gêmeos de Sparda, Dante e Vergil.',
    timeToBeat: { main: 12, extra: 17, completionist: 36 }
  },
  {
    id: 'kingdom-hearts-3',
    title: 'Kingdom Hearts III + Re Mind',
    category: ['rpg', 'hackslash'],
    platform: 'PC',
    rating: 9.1,
    year: 2021,
    coverUrl: steamCover('2552450'),
    description: 'Sora viaja pelos mundos de Toy Story, Monstros S.A., Frozen e Piratas do Caribe no clímax da saga Dark Seeker contra Xehanort.',
    timeToBeat: { main: 29, extra: 43, completionist: 65 }
  },
  {
    id: 'tales-of-arise',
    title: 'Tales of Arise',
    category: ['rpg', 'anime'],
    platform: 'PC',
    rating: 9.4,
    year: 2021,
    coverUrl: steamCover('740130'),
    description: 'Alphen da máscara de ferro e Shionne que fere quem a toca unem forças para libertar o povo escravizado de Dahna.',
    timeToBeat: { main: 41, extra: 60, completionist: 75 }
  },
  {
    id: 'octopath-traveler-2',
    title: 'Octopath Traveler II',
    category: ['rpg', 'nintendo_switch'],
    platform: 'PC',
    rating: 9.6,
    year: 2023,
    coverUrl: steamCover('1971650'),
    description: 'Visual HD-2D deslumbrante contando as trajetórias entrelaçadas de oito viajantes no continente de Solistia.',
    timeToBeat: { main: 60, extra: 85, completionist: 110 }
  },
  {
    id: 'triangle-strategy',
    title: 'Triangle Strategy',
    category: ['rpg', 'nintendo_switch'],
    platform: 'PC',
    rating: 9.3,
    year: 2022,
    coverUrl: steamCover('1850510'),
    description: 'Serenoa de Wolffort decide os rumos da Guerra do Sal e Ferro pesando votos na Balança da Convicção entre Moralidade, Lucro e Liberdade.',
    timeToBeat: { main: 34, extra: 55, completionist: 90 }
  },
  {
    id: 'sea-of-stars',
    title: 'Sea of Stars',
    category: ['rpg', 'indie', 'retro'],
    platform: 'PC',
    rating: 9.6,
    year: 2023,
    coverUrl: steamCover('1244090'),
    description: 'Valere e Zale combinam os poderes do Sol e da Lua contra as monstruosidades do Fleshmancer com música do compositor de Chrono Trigger.',
    timeToBeat: { main: 26, extra: 35, completionist: 45 }
  },
  {
    id: 'chained-echoes',
    title: 'Chained Echoes',
    category: ['rpg', 'indie', 'retro'],
    platform: 'PC',
    rating: 9.5,
    year: 2022,
    coverUrl: steamCover('1229240'),
    description: 'Uma carta de amor aos JRPGs da era SNES/PS1 com mechas pilotáveis (Sky Armors) e o medidor de Overdrive em combate.',
    timeToBeat: { main: 33, extra: 45, completionist: 60 }
  },
  {
    id: 'ys-8-lacrimosa-of-dana',
    title: 'Ys VIII: Lacrimosa of DANA',
    category: ['rpg', 'hackslash'],
    platform: 'PC',
    rating: 9.5,
    year: 2018,
    coverUrl: steamCover('579180'),
    description: 'Adol Christin naufraga na ilha amaldiçoada de Seiren construindo uma vila de náufragos e sonhando com a donzela do passado Dana.',
    timeToBeat: { main: 37, extra: 52, completionist: 68 }
  },
  {
    id: 'darksiders-warmastered',
    title: 'Darksiders Warmastered Edition',
    category: ['hackslash', 'rpg'],
    platform: 'PC',
    rating: 9.1,
    year: 2016,
    coverUrl: steamCover('462780'),
    description: 'Guerra (War), o primeiro Cavaleiro do Apocalipse, empunha a espada Chaoseater no meio do conflito entre Céu e Inferno.',
    timeToBeat: { main: 17, extra: 21, completionist: 28 }
  },
  {
    id: 'darksiders-2-deathinitive',
    title: 'Darksiders II Deathinitive Edition',
    category: ['hackslash', 'rpg', 'openworld'],
    platform: 'PC',
    rating: 9.3,
    year: 2015,
    coverUrl: steamCover('388410'),
    description: 'Morte (Death) com foices duplas e a montaria Desespero viaja através de reinos ancestrais para limpar o nome de seu irmão Guerra.',
    timeToBeat: { main: 21, extra: 32, completionist: 52 }
  },
  {
    id: 'dragons-dogma-2',
    title: "Dragon's Dogma 2",
    category: ['rpg', 'openworld', 'hackslash'],
    platform: 'PC',
    rating: 9.3,
    year: 2024,
    coverUrl: steamCover('2054970'),
    description: 'O Nascido do Dragão (Arisen) e seus fiéis Peões (Pawns) escalam grifos, ciclopes e dragões gigantescos no combate físico da Capcom.',
    timeToBeat: { main: 29, extra: 55, completionist: 90 }
  },
  {
    id: 'dragons-dogma-dark-arisen',
    title: "Dragon's Dogma: Dark Arisen",
    category: ['rpg', 'openworld', 'hackslash'],
    platform: 'PC',
    rating: 9.4,
    year: 2016,
    coverUrl: steamCover('367500'),
    description: 'Explore o labirinto sombrio da Ilha Bitterblack enfrentando a própria Morte em um dos melhores sistemas de combate de RPG de ação.',
    timeToBeat: { main: 33, extra: 58, completionist: 115 }
  },
  {
    id: 'granblue-fantasy-relink',
    title: 'Granblue Fantasy: Relink',
    category: ['rpg', 'hackslash', 'anime'],
    platform: 'PC',
    rating: 9.3,
    year: 2024,
    coverUrl: steamCover('881020'),
    description: 'Navegue pelos céus no navio voador Grandcypher executando combos em cadeia Link Attack e Full Burst com sua tripulação.',
    timeToBeat: { main: 16, extra: 38, completionist: 120 }
  },
  {
    id: 'divinity-original-sin-2',
    title: 'Divinity: Original Sin 2 - Definitive Edition',
    category: ['rpg'],
    platform: 'PC',
    rating: 9.9,
    year: 2017,
    coverUrl: steamCover('435150'),
    description: 'A obra-prima da Larian Studios antes de Baldur\'s Gate 3: interações elementais revolucionárias e liberdade tática sem precedentes em Rivellon.',
    timeToBeat: { main: 60, extra: 100, completionist: 155 }
  },
  {
    id: 'pillars-of-eternity-2',
    title: 'Pillars of Eternity II: Deadfire',
    category: ['rpg'],
    platform: 'PC',
    rating: 9.3,
    year: 2018,
    coverUrl: steamCover('560130'),
    description: 'O Observador persegue o deus gigante de adra Eothas através do arquipélago de Deadfire comandando navios e tripulações.',
    timeToBeat: { main: 42, extra: 75, completionist: 120 }
  }
];

console.log('Batch 10 (RPG & HackSlash) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
