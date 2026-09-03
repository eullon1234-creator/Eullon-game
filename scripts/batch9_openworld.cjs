// scripts/batch9_openworld.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'red-dead-redemption-1',
    title: 'Red Dead Redemption',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.8,
    year: 2010,
    coverUrl: steamCover('2668510'),
    description: 'John Marston caça seus antigos parceiros da gangue de Dutch na fronteira do México para recuperar sua família.',
    timeToBeat: { main: 18, extra: 28, completionist: 47 }
  },
  {
    id: 'rdr-undead-nightmare',
    title: 'Red Dead Redemption: Undead Nightmare',
    category: ['openworld', 'horror', 'action_fps'],
    platform: 'PC',
    rating: 9.5,
    year: 2010,
    coverUrl: 'https://media.rawg.io/media/games/6bf/6bfd9ba0d15e98f069f91a7837774dc6.jpg',
    description: 'Uma praga zumbi devasta o Velho Oeste! Monte os Quatro Cavalos do Apocalipse e limpe os cemitérios.',
    timeToBeat: { main: 7, extra: 10, completionist: 15 }
  },
  {
    id: 'batman-arkham-asylum',
    title: 'Batman: Arkham Asylum',
    category: ['superheroes', 'stealth', 'hackslash'],
    platform: 'PC',
    rating: 9.7,
    year: 2009,
    coverUrl: steamCover('35140'),
    description: 'O Coringa assume o controle do Asilo Arkham na noite que revolucionou os jogos de super-heróis com o sistema Freeflow.',
    timeToBeat: { main: 12, extra: 17, completionist: 26 }
  },
  {
    id: 'batman-arkham-city',
    title: 'Batman: Arkham City',
    category: ['superheroes', 'openworld', 'stealth', 'hackslash'],
    platform: 'PC',
    rating: 9.9,
    year: 2011,
    coverUrl: steamCover('200260'),
    description: 'Voe pela megaprissão urbana de Arkham City enfrentando Hugo Strange, Mr. Freeze e a trama chocante do Coringa.',
    timeToBeat: { main: 13, extra: 27, completionist: 47 }
  },
  {
    id: 'batman-arkham-knight',
    title: 'Batman: Arkham Knight',
    category: ['superheroes', 'openworld', 'hackslash'],
    platform: 'PC',
    rating: 9.6,
    year: 2015,
    coverUrl: steamCover('208650'),
    description: 'Gotham City evacuada na noite de Halloween, o Batmóvel tanque transformável e a aliança com o Espantalho.',
    timeToBeat: { main: 17, extra: 31, completionist: 50 }
  },
  {
    id: 'batman-arkham-origins',
    title: 'Batman: Arkham Origins',
    category: ['superheroes', 'openworld', 'hackslash'],
    platform: 'PC',
    rating: 9.1,
    year: 2013,
    coverUrl: steamCover('209000'),
    description: 'Véspera de Natal: o Máscara Negra coloca uma recompensa de 50 milhões na cabeça de um Batman jovem e agressivo.',
    timeToBeat: { main: 13, extra: 23, completionist: 44 }
  },
  {
    id: 'sleeping-dogs-definitive',
    title: 'Sleeping Dogs: Definitive Edition',
    category: ['openworld', 'fighting', 'hackslash'],
    platform: 'PC',
    rating: 9.6,
    year: 2014,
    coverUrl: steamCover('307690'),
    description: 'Wei Shen se infiltra na Tríade Sun On Yee em Hong Kong: artes marciais brutais com finalizações no cenário e tiroteios.',
    timeToBeat: { main: 14, extra: 22, completionist: 32 }
  },
  {
    id: 'mafia-definitive-edition',
    title: 'Mafia: Definitive Edition',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.4,
    year: 2020,
    coverUrl: steamCover('1030840'),
    description: 'Tommy Angelo sai do volante de táxi para a família Salieri na Lost Heaven dos anos 1930 reconstruída na Unreal.',
    timeToBeat: { main: 11, extra: 16, completionist: 28 }
  },
  {
    id: 'mafia-2-definitive',
    title: 'Mafia II: Definitive Edition',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.4,
    year: 2020,
    coverUrl: steamCover('1030830'),
    description: 'Vito Scaletta e Joe Barbaro sobem no submundo de Empire Bay nos anos 40 e 50 com atmosfera mafiosa espetacular.',
    timeToBeat: { main: 12, extra: 17, completionist: 30 }
  },
  {
    id: 'yakuza-0',
    title: 'Yakuza 0',
    category: ['openworld', 'fighting', 'rpg'],
    platform: 'PC',
    rating: 9.8,
    year: 2018,
    coverUrl: steamCover('638970'),
    description: 'Kazuma Kiryu e Goro Majima em Kamurocho e Sotenbori no auge da bolha econômica japonesa de 1988: drama e comédia épica.',
    timeToBeat: { main: 31, extra: 65, completionist: 140 }
  },
  {
    id: 'yakuza-kiwami',
    title: 'Yakuza Kiwami',
    category: ['openworld', 'fighting', 'rpg'],
    platform: 'PC',
    rating: 9.2,
    year: 2019,
    coverUrl: steamCover('834530'),
    description: 'O remake moderno do primeiro jogo: o sistema "Majima Everywhere" e os 10 bilhões de ienes roubados do Clã Tojo.',
    timeToBeat: { main: 18, extra: 33, completionist: 82 }
  },
  {
    id: 'yakuza-kiwami-2',
    title: 'Yakuza Kiwami 2',
    category: ['openworld', 'fighting', 'rpg'],
    platform: 'PC',
    rating: 9.5,
    year: 2019,
    coverUrl: steamCover('927380'),
    description: 'O Dragão de Dojima contra Ryuji Goda (o Dragão de Kansai) na tecnologia física moderna do Dragon Engine.',
    timeToBeat: { main: 19, extra: 39, completionist: 77 }
  },
  {
    id: 'yakuza-like-a-dragon',
    title: 'Yakuza: Like a Dragon',
    category: ['rpg', 'openworld'],
    platform: 'PC',
    rating: 9.7,
    year: 2020,
    coverUrl: steamCover('1235140'),
    description: 'Ichiban Kasuga em Yokohama reimagina os combates como um RPG de turnos hilário e emocionante inspirado em Dragon Quest.',
    timeToBeat: { main: 45, extra: 68, completionist: 105 }
  },
  {
    id: 'like-a-dragon-infinite-wealth',
    title: 'Like a Dragon: Infinite Wealth',
    category: ['rpg', 'openworld'],
    platform: 'PC',
    rating: 9.8,
    year: 2024,
    coverUrl: steamCover('2072450'),
    description: 'Kasuga e Kiryu se encontram no Havaí: o maior mapa da franquia, minigame Dondoko Island e combates refinados.',
    timeToBeat: { main: 55, extra: 90, completionist: 140 }
  },
  {
    id: 'assassins-creed-2',
    title: "Assassin's Creed II",
    category: ['openworld', 'stealth', 'hackslash'],
    platform: 'PC',
    rating: 9.8,
    year: 2009,
    coverUrl: steamCover('33230'),
    description: 'Ezio Auditore da Firenze na Itália Renascentista com Leonardo da Vinci e a vingança contra os Templários.',
    timeToBeat: { main: 19, extra: 26, completionist: 36 }
  },
  {
    id: 'assassins-creed-brotherhood',
    title: "Assassin's Creed: Brotherhood",
    category: ['openworld', 'stealth', 'hackslash'],
    platform: 'PC',
    rating: 9.6,
    year: 2010,
    coverUrl: steamCover('48190'),
    description: 'Ezio recruta e comanda uma irmandade de assassinos pelas ruas históricas de Roma contra a família Borgia.',
    timeToBeat: { main: 15, extra: 26, completionist: 42 }
  },
  {
    id: 'assassins-creed-4-black-flag',
    title: "Assassin's Creed IV: Black Flag",
    category: ['openworld', 'stealth', 'action_fps'],
    platform: 'PC',
    rating: 9.7,
    year: 2013,
    coverUrl: steamCover('242050'),
    description: 'Edward Kenway no navio Gralha navegando pelas ilhas do Caribe com shanties piratas e saques marítimos lendários.',
    timeToBeat: { main: 23, extra: 42, completionist: 60 }
  },
  {
    id: 'assassins-creed-origins',
    title: "Assassin's Creed Origins",
    category: ['openworld', 'rpg'],
    platform: 'PC',
    rating: 9.3,
    year: 2017,
    coverUrl: steamCover('582160'),
    description: 'Bayek de Siwa no Egito Antigo de Cleópatra e Júlio César fundando os Ocultos e os primeiros dogmas do Credo.',
    timeToBeat: { main: 30, extra: 52, completionist: 85 }
  },
  {
    id: 'assassins-creed-odyssey',
    title: "Assassin's Creed Odyssey",
    category: ['openworld', 'rpg'],
    platform: 'PC',
    rating: 9.3,
    year: 2018,
    coverUrl: steamCover('812140'),
    description: 'Kassandra com a Lança Quebrada de Leônidas nas guerras do Peloponeso na Grécia Antiga enfrentando o Culto de Kosmos.',
    timeToBeat: { main: 45, extra: 85, completionist: 145 }
  },
  {
    id: 'far-cry-3',
    title: 'Far Cry 3',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.7,
    year: 2012,
    coverUrl: steamCover('220240'),
    description: 'A definição de insanidade com o vilão Vaas Montenegro na Ilha Rook libertando postos avançados e caçando animais selvagens.',
    timeToBeat: { main: 16, extra: 25, completionist: 38 }
  },
  {
    id: 'far-cry-4',
    title: 'Far Cry 4',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.2,
    year: 2014,
    coverUrl: steamCover('298110'),
    description: 'Ajay Ghale no reino montanhoso do Himalaia de Kyrat montando elefantes e enfrentando o tirano Pagan Min.',
    timeToBeat: { main: 18, extra: 30, completionist: 46 }
  },
  {
    id: 'far-cry-5',
    title: 'Far Cry 5',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.1,
    year: 2018,
    coverUrl: steamCover('552520'),
    description: 'Enfrente o culto apocalíptico de Joseph Seed e os Irmãos Arautos no interior de Montana com companheiros humanos e animais.',
    timeToBeat: { main: 18, extra: 29, completionist: 45 }
  },
  {
    id: 'watch-dogs-2',
    title: 'Watch Dogs 2',
    category: ['openworld', 'stealth', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.2,
    year: 2016,
    coverUrl: steamCover('447040'),
    description: 'Marcus Holloway e o coletivo DedSec hackeiam a Baía de São Francisco usando drones, carrinhos RC e armas impressas em 3D.',
    timeToBeat: { main: 19, extra: 32, completionist: 45 }
  },
  {
    id: 'saints-row-the-third',
    title: 'Saints Row: The Third Remastered',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.1,
    year: 2021,
    coverUrl: steamCover('978300'),
    description: 'A comédia mais escrachada do mundo aberto: salte de aviões em queda livre, use armas absurdas e domine Steelport.',
    timeToBeat: { main: 15, extra: 25, completionist: 38 }
  },
  {
    id: 'just-cause-3',
    title: 'Just Cause 3',
    category: ['openworld', 'action_fps'],
    platform: 'PC',
    rating: 9.0,
    year: 2015,
    coverUrl: steamCover('225540'),
    description: 'Rico Rodriguez com o traje planador wingsuit e gancho duplo explodindo bases militares inteiras na ilha mediterrânea de Medici.',
    timeToBeat: { main: 16, extra: 33, completionist: 60 }
  },
  {
    id: 'mad-max-2015',
    title: 'Mad Max',
    category: ['openworld', 'action_fps', 'fighting'],
    platform: 'PC',
    rating: 9.2,
    year: 2015,
    coverUrl: steamCover('234140'),
    description: 'Construa o veículo de guerra Magnum Opus com o mecânico Chumbucket e lute mano a mano pelos ermos pós-apocalípticos.',
    timeToBeat: { main: 20, extra: 38, completionist: 62 }
  },
  {
    id: 'ghost-recon-wildlands',
    title: "Tom Clancy's Ghost Recon Wildlands",
    category: ['openworld', 'stealth', 'action_fps'],
    platform: 'PC',
    rating: 9.0,
    year: 2017,
    coverUrl: steamCover('460930'),
    description: 'Esquadrão tático Ghost desmantela o cartel Santa Blanca e El Sueño nas montanhas e salares da Bolívia.',
    timeToBeat: { main: 26, extra: 50, completionist: 85 }
  },
  {
    id: 'marvels-guardians-of-the-galaxy',
    title: "Marvel's Guardians of the Galaxy",
    category: ['superheroes', 'scifi', 'action_fps'],
    platform: 'PC',
    rating: 9.5,
    year: 2021,
    coverUrl: steamCover('1088850'),
    description: 'Senhor das Estrelas comanda Gamora, Drax, Rocket e Groot com diálogos hilários, trilha rock anos 80 e combate em equipe.',
    timeToBeat: { main: 17, extra: 21, completionist: 26 }
  },
  {
    id: 'judgment',
    title: 'Judgment',
    category: ['openworld', 'fighting'],
    platform: 'PC',
    rating: 9.5,
    year: 2022,
    coverUrl: steamCover('2058180'),
    description: 'O ex-advogado que virou detetive particular Takayuki Yagami investiga um serial killer que arranca os olhos das vítimas em Tóquio.',
    timeToBeat: { main: 28, extra: 55, completionist: 100 }
  },
  {
    id: 'lost-judgment',
    title: 'Lost Judgment',
    category: ['openworld', 'fighting'],
    platform: 'PC',
    rating: 9.6,
    year: 2022,
    coverUrl: steamCover('2058190'),
    description: 'Yagami se infiltra numa escola de ensino médio em Yokohama com skate, estilo de luta da Serpente e drama de tribunal.',
    timeToBeat: { main: 24, extra: 58, completionist: 110 }
  }
];

console.log('Batch 9 (Open World & Crime) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
