// scripts/batch2_ps2.cjs
const steamCover = (appId) => `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
const rawgCover = (hash, ext = 'jpg') => `https://media.rawg.io/media/games/${hash}.${ext}`;

const NEW_GAMES = [
  {
    id: 'mgs-2-sons-of-liberty',
    title: 'Metal Gear Solid 2: Sons of Liberty',
    category: ['ps2', 'stealth', 'playstation', 'action_fps'],
    platform: 'PS2',
    rating: 9.7,
    year: 2001,
    coverUrl: 'https://media.rawg.io/media/games/ca9/ca9ea89255a687595874404618e983fb.jpg',
    description: 'Raiden na plataforma Big Shell e a profecia assustadoramente precisa sobre a era da informação e controle de narrativas.',
    timeToBeat: { main: 13, extra: 17, completionist: 27 }
  },
  {
    id: 'mgs-3-snake-eater',
    title: 'Metal Gear Solid 3: Snake Eater',
    category: ['ps2', 'stealth', 'playstation', 'action_fps'],
    platform: 'PS2',
    rating: 9.9,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/7a9/7a9b0851ec30f878f7dbb25bb7fb61d4.jpg',
    description: 'Naked Snake na selva soviética, sobrevivência com camuflagem e o duelo inesquecível entre as flores contra The Boss.',
    timeToBeat: { main: 16, extra: 21, completionist: 32 }
  },
  {
    id: 'gta-liberty-city-stories',
    title: 'Grand Theft Auto: Liberty City Stories',
    category: ['ps2', 'gta', 'openworld'],
    platform: 'PS2',
    rating: 8.9,
    year: 2005,
    coverUrl: 'https://media.rawg.io/media/games/618/618c204eab900f074d2ce87e07663e26.jpg',
    description: 'Toni Cipriani retorna a Liberty City para colocar a família criminosa Leone no topo do submundo mafioso.',
    timeToBeat: { main: 14, extra: 22, completionist: 38 }
  },
  {
    id: 'gta-vice-city-stories',
    title: 'Grand Theft Auto: Vice City Stories',
    category: ['ps2', 'gta', 'openworld'],
    platform: 'PS2',
    rating: 9.0,
    year: 2006,
    coverUrl: 'https://media.rawg.io/media/games/b2a/b2a8d5628c6ff11ff3ee7b2c55bdf473.jpg',
    description: 'Vic Vance constrói um império de negócios ilícitos e propriedades com a vibrante trilha oitentista em neon.',
    timeToBeat: { main: 15, extra: 24, completionist: 42 }
  },
  {
    id: 'midnight-club-3-dub-edition',
    title: 'Midnight Club 3: DUB Edition Remix',
    category: ['ps2', 'racing', 'openworld'],
    platform: 'PS2',
    rating: 9.6,
    year: 2006,
    coverUrl: 'https://media.rawg.io/media/games/432/432eec6d6d7054f0a996bc5594e9f0c2.jpg',
    description: 'Rachas noturnos em Detroit, Atlanta e San Diego, motos customizadas, carros esportivos e habilidades especiais Roar e Agro.',
    timeToBeat: { main: 19, extra: 30, completionist: 48 }
  },
  {
    id: 'burnout-3-takedown',
    title: 'Burnout 3: Takedown',
    category: ['ps2', 'racing'],
    platform: 'PS2',
    rating: 9.8,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/145/1451f22e70757a3e74360e29496f8c7b.jpg',
    description: 'A mais alta velocidade e destruição veicular: destrua seus oponentes em batidas em câmera lenta e cause o caos no Modo Crash.',
    timeToBeat: { main: 13, extra: 22, completionist: 38 }
  },
  {
    id: 'burnout-revenge-ps2',
    title: 'Burnout Revenge',
    category: ['ps2', 'racing'],
    platform: 'PS2',
    rating: 9.4,
    year: 2005,
    coverUrl: 'https://media.rawg.io/media/games/b18/b18a1a1f33f38d3886f4a3bfdb93f1bc.jpg',
    description: 'Bata em carros civis por trás para arremessá-los contra rivais e busque vingança com o medidor de Revenge.',
    timeToBeat: { main: 12, extra: 20, completionist: 34 }
  },
  {
    id: 'need-for-speed-carbon',
    title: 'Need for Speed: Carbon',
    category: ['ps2', 'racing', 'openworld'],
    platform: 'PS2',
    rating: 9.1,
    year: 2006,
    coverUrl: 'https://media.rawg.io/media/games/573/573a4fcabecbc3a2d21bfdc4ac39589d.jpg',
    description: 'Disputas territoriais de gangues de pilotos e duelos mortais descendo as curvas perigosas do Canyon de Palmont City.',
    timeToBeat: { main: 10, extra: 17, completionist: 28 }
  },
  {
    id: 'need-for-speed-underground-1',
    title: 'Need for Speed: Underground',
    category: ['ps2', 'racing'],
    platform: 'PS2',
    rating: 9.5,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/05a/05ac68b8e05c8dbe4e4efc5cb296f849.jpg',
    description: 'Get Low do Lil Jon, neon embaixo do carro, turbo nitro e a febre do tuning inspirada em Velozes e Furiosos.',
    timeToBeat: { main: 14, extra: 18, completionist: 24 }
  },
  {
    id: 'jak-and-daxter-precursor-legacy',
    title: 'Jak and Daxter: The Precursor Legacy',
    category: ['ps2', 'platformer', 'playstation'],
    platform: 'PS2',
    rating: 9.3,
    year: 2001,
    coverUrl: 'https://media.rawg.io/media/games/117/1174ee0f0e6332da7da40a02cf147814.jpg',
    description: 'Sem telas de carregamento pioneiras, Jak e o esquilo-doninha Daxter partem em busca de curar a Dark Eco.',
    timeToBeat: { main: 10, extra: 12, completionist: 15 }
  },
  {
    id: 'jak-2-ps2',
    title: 'Jak II: Renegade',
    category: ['ps2', 'openworld', 'platformer', 'playstation'],
    platform: 'PS2',
    rating: 9.2,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/ec1/ec1c19b0c79b6348bb95304b4c73ba39.jpg',
    description: 'Tom sombrio em Haven City com armas de fogo, hoverboards e a transformação animalesca Dark Jak.',
    timeToBeat: { main: 15, extra: 19, completionist: 27 }
  },
  {
    id: 'jak-3-ps2',
    title: 'Jak 3',
    category: ['ps2', 'openworld', 'platformer', 'playstation'],
    platform: 'PS2',
    rating: 9.4,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/390/39002bb57a9fefc77bf5cbe838a5ea11.jpg',
    description: 'Sobrevivência no deserto Wasteland com buggies armados, novos poderes de Light Jak e o desfecho da trilogia.',
    timeToBeat: { main: 13, extra: 17, completionist: 25 }
  },
  {
    id: 'ratchet-clank-up-your-arsenal',
    title: 'Ratchet & Clank: Up Your Arsenal',
    category: ['ps2', 'platformer', 'action_fps', 'playstation'],
    platform: 'PS2',
    rating: 9.6,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/c1a/c1a6b0c2ff1bfa3c6df51bf23ea6e0a8.jpg',
    description: 'O lombax e seu robô enfrentam o Dr. Nefarious com um arsenal colossal de armas absurdas que sobem de nível.',
    timeToBeat: { main: 12, extra: 16, completionist: 23 }
  },
  {
    id: 'sly-2-band-of-thieves',
    title: 'Sly 2: Band of Thieves',
    category: ['ps2', 'stealth', 'platformer', 'playstation'],
    platform: 'PS2',
    rating: 9.5,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/df1/df1f08cb3a2d5930ebbb92e071fe0e52.jpg',
    description: 'O guaxinim ladrão Sly, o cérebro Bentley e a força Murray em assaltos em equipe para recuperar as peças de Clockwerk.',
    timeToBeat: { main: 14, extra: 18, completionist: 24 }
  },
  {
    id: 'god-hand-ps2',
    title: 'God Hand',
    category: ['ps2', 'fighting', 'hackslash'],
    platform: 'PS2',
    rating: 9.4,
    year: 2006,
    coverUrl: 'https://media.rawg.io/media/games/d07/d07b38d39f4088a82d02cbeaa26cb3b9.jpg',
    description: 'Obra cult de Shinji Mikami e Clover Studio: socos ultrasônicos, humor sem filtros e dificuldade extrema.',
    timeToBeat: { main: 11, extra: 15, completionist: 24 }
  },
  {
    id: 'ico-ps2',
    title: 'Ico',
    category: ['ps2', 'platformer', 'playstation'],
    platform: 'PS2',
    rating: 9.4,
    year: 2001,
    coverUrl: 'https://media.rawg.io/media/games/10d/10dbd8f28d844fa0076a08436894c264.jpg',
    description: 'Um jovem com chifres segura a mão de Yorda através de castelos imensos fugindo de sombras fantasmagóricas.',
    timeToBeat: { main: 6, extra: 8, completionist: 11 }
  },
  {
    id: 'okami-ps2',
    title: 'Ōkami',
    category: ['ps2', 'rpg', 'hackslash'],
    platform: 'PS2',
    rating: 9.7,
    year: 2006,
    coverUrl: steamCover('587620'),
    description: 'A deusa do sol Amaterasu na forma de uma loba branca restaurando a natureza com o Pincel Celestial.',
    timeToBeat: { main: 34, extra: 45, completionist: 56 }
  },
  {
    id: 'mortal-kombat-shaolin-monks',
    title: 'Mortal Kombat: Shaolin Monks',
    category: ['ps2', 'fighting', 'hackslash'],
    platform: 'PS2',
    rating: 9.7,
    year: 2005,
    coverUrl: 'https://media.rawg.io/media/games/0d2/0d2c676d418640798be124376fb68266.jpg',
    description: 'Liu Kang e Kung Lao em cooperação brutal através de Outworld aplicando Fatalities e Multalities em tempo real.',
    timeToBeat: { main: 9, extra: 14, completionist: 22 }
  },
  {
    id: 'downhill-domination',
    title: 'Downhill Domination',
    category: ['ps2', 'racing'],
    platform: 'PS2',
    rating: 9.4,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/0b4/0b4e2f3d6dbfbf1ae56b9c9f4d1e2e77.jpg',
    description: 'Descidas alucinantes de mountain bike em montanhas vertiginosas socando e arremessando garrafas nos rivais.',
    timeToBeat: { main: 8, extra: 14, completionist: 25 }
  },
  {
    id: 'resident-evil-outbreak',
    title: 'Resident Evil Outbreak',
    category: ['ps2', 'horror', 'resident_evil'],
    platform: 'PS2',
    rating: 8.8,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/6bf/6bfd9ba0d15e98f069f91a7837774dc6.jpg',
    description: '8 civis comuns tentando sobreviver ao colapso infeccioso em diferentes pontos de Raccoon City.',
    timeToBeat: { main: 8, extra: 15, completionist: 30 }
  },
  {
    id: 'final-fantasy-12',
    title: 'Final Fantasy XII',
    category: ['ps2', 'rpg', 'playstation'],
    platform: 'PS2',
    rating: 9.2,
    year: 2006,
    coverUrl: steamCover('595520'),
    description: 'O mundo de Ivalice, batalhas estratégicas sem transição de tela com o sistema Gambit e a luta de Ashe pelo reino de Dalmasca.',
    timeToBeat: { main: 61, extra: 90, completionist: 150 }
  },
  {
    id: 'kingdom-hearts-1',
    title: 'Kingdom Hearts',
    category: ['ps2', 'rpg', 'hackslash'],
    platform: 'PS2',
    rating: 9.4,
    year: 2002,
    coverUrl: steamCover('2552430'),
    description: 'Sora, Pato Donald e Pateta viajam pelos mundos da Disney com a Keyblade contra os Heartless e Ansem.',
    timeToBeat: { main: 28, extra: 40, completionist: 60 }
  },
  {
    id: 'kingdom-hearts-2',
    title: 'Kingdom Hearts II',
    category: ['ps2', 'rpg', 'hackslash'],
    platform: 'PS2',
    rating: 9.7,
    year: 2005,
    coverUrl: steamCover('2552430'),
    description: 'Drive Forms em combate duplo com Keyblades, Organization XIII, Roxas e a trilha marcante de Utada Hikaru.',
    timeToBeat: { main: 32, extra: 45, completionist: 75 }
  },
  {
    id: 'silent-hill-3-ps2',
    title: 'Silent Hill 3',
    category: ['ps2', 'horror'],
    platform: 'PS2',
    rating: 9.5,
    year: 2003,
    coverUrl: 'https://media.rawg.io/media/games/606/606c4b2674e7df9ea7e5e1c4cfc43a4e.jpg',
    description: 'Heather Mason descobre sua conexão com a seita da cidade e encara horrores visuais que puxam o poder gráfico do PS2.',
    timeToBeat: { main: 6, extra: 8, completionist: 12 }
  },
  {
    id: 'silent-hill-4-the-room',
    title: 'Silent Hill 4: The Room',
    category: ['ps2', 'horror'],
    platform: 'PS2',
    rating: 9.0,
    year: 2004,
    coverUrl: 'https://media.rawg.io/media/games/c0e/c0e0b3c3b0365778844f2bb7f7d98342.jpg',
    description: 'Henry Townshend acorda preso no apartamento 302 com correntes na porta e um buraco estranho no banheiro.',
    timeToBeat: { main: 9, extra: 11, completionist: 15 }
  }
];

console.log('Batch 2 (PS2) pronto com', NEW_GAMES.length, 'jogos.');
module.exports = { NEW_GAMES };
