// src/data/daysGoneData.ts

export interface DaysGoneCharacter {
  name: string;
  role: string;
  description: string;
  quote?: string;
  badge: string;
}

export interface DaysGoneEnemy {
  name: string;
  category: 'Freakers Comuns' | 'Freakers Especiais' | 'Fauna Infectada' | 'Inimigos Humanos';
  dangerLevel: 'Baixo' | 'Médio' | 'Alto' | 'Extremo';
  description: string;
  tactic: string;
}

export interface DaysGoneTip {
  title: string;
  category: 'Moto & Estrada' | 'Combate contra Hordas' | 'NERO & Evolução' | 'Armas & Equipamento';
  icon: string;
  summary: string;
  details: string[];
}

export interface DaysGoneMedia {
  title: string;
  caption: string;
  imageUrl: string;
  tag: string;
}

export interface DaysGoneVideo {
  title: string;
  channel: string;
  description: string;
  type: 'gameplay' | 'guia' | 'lore' | 'soundtrack';
  url: string;
  duration?: string;
}

export const DAYS_GONE_INFO = {
  id: 'days-gone-special-event',
  title: 'Days Gone',
  subtitle: 'A Estrada da Sobrevivência no Noroeste Pacífico Devastado',
  tagline: 'O mundo pós-apocalíptico não perdoa quem fica sem gasolina ou sem munição.',
  developer: 'Bend Studio (PlayStation Studios)',
  publisher: 'Sony Interactive Entertainment',
  releaseYear: 2019,
  originalPlatform: 'PlayStation 4',
  platforms: ['PlayStation 4', 'PlayStation 5 (Patch 60 FPS)', 'PC (Steam / Epic Games)'],
  metacriticScore: 74,
  userScoreSteam: '92% Muito Positivas (Steam)',
  timeToBeat: {
    mainStory: 37,
    extra: 55,
    completionist: 89,
  },
  coverUrl: 'https://media.rawg.io/media/games/a79/a79d2fc90c4dbf07a8580b19600fd61d.jpg',
  bannerUrl: 'https://media.rawg.io/media/screenshots/167/167f683f9d2d69e9ffd4324e2617d903.jpg',
  synopsis: 
    'Dois anos após uma pandemia global devastar a civilização e transformar a maior parte da humanidade em criaturas ferozes e irracionais conhecidas como Freakers (Frenéticos), Deacon St. John — um motoqueiro nômade, ex-militar e mercenário de bom coração — percorre o estado do Oregon. Montado em sua Drifter Bike, Deacon sobrevive entre acampamentos humanos instáveis, emboscadas de saqueadores e hordas aterrorizantes de centenas de monstros, enquanto tenta descobrir se sua esposa Sarah realmente morreu na noite do surto.',
};

export const DAYS_GONE_CHARACTERS: DaysGoneCharacter[] = [
  {
    name: 'Deacon St. John ("Deek")',
    role: 'Protagonista / Drifter & Caçador de Recompensas',
    badge: 'Mongrels MC',
    quote: '"Essa estrada pertence a nós."',
    description: 
      'Veterano do 10º Batalhão da Guerra do Afeganistão e membro do Mongrels Motorcycle Club. Calejado pela tragédia e pelo luto, recusa-se a fixar residência em acampamentos, preferindo a liberdade perigosa das estradas abertas com sua moto customizada.',
  },
  {
    name: 'Sarah Irene Whitaker',
    role: 'Esposa de Deacon / Pesquisadora Botânica',
    badge: 'Cloverdale Research',
    quote: '"Promete que vai voltar para mim, Deek."',
    description: 
      'Cientista talentosa que trabalhava em botânica para a empresa Cloverdale. Separada de Deacon em um helicóptero de resgate da NERO durante a noite do colapso de Farewell. Sua busca incessante move toda a jornada de Deacon.',
  },
  {
    name: 'William "Boozer" Gray',
    role: 'Irmão de Estrada / Mecânico & Sargento de Armas',
    badge: 'Irmandade Mongrels',
    quote: '"Irmãos de estrada até o fim, Deek."',
    description: 
      'O melhor amigo e leal parceiro de moto de Deacon desde os tempos do motoclube. Sofre graves queimaduras nos braços causadas por cultistas Rippers logo no início da história, tornando-se a principal motivação de sobrevivência e proteção de Deacon.',
  },
  {
    name: 'Iron Mike (Michael Wilcox)',
    role: 'Líder do Acampamento de Lost Lake',
    badge: 'Pacifista / Lost Lake',
    quote: '"Se continuarmos matando uns aos outros, não somos melhores que os Freakers."',
    description: 
      'Líder veterano com forte senso de justiça que sonha em restabelecer a civilização através da cooperação e tratados de paz, evitando conflitos sangrentos mesmo quando provocado por facções hostis.',
  },
  {
    name: 'Rikki Patil',
    role: 'Engenheira Chefe de Lost Lake',
    badge: 'Técnica & Mecânica',
    quote: '"Com peças suficientes e determinação, nós podemos consertar este mundo."',
    description: 
      'Engenheira talentosa e destemida responsável por manter a barragem hidrelétrica e as instalações elétricas de Lost Lake funcionando. Amiga confiável e de raciocínio rápido para qualquer emboscada.',
  },
  {
    name: "James O'Brian",
    role: 'Pesquisador NERO (National Emergency Response Org)',
    badge: 'Traje Quarentena NERO',
    quote: '"Eles estão vindo, Deacon... e não há nada que possamos fazer."',
    description: 
      'Cientista enigmático da NERO que ajudou a embarcar Sarah no helicóptero. Deacon aceita espionar os postos de pesquisa da NERO em troca de informações confidenciais sobre o paradeiro de sua esposa, revelando verdades sinistras sobre o vírus.',
  },
  {
    name: 'Coronel Matthew Garret',
    role: 'Líder Supremo da Milícia de Wizard Island',
    badge: 'Milícia Fanática',
    quote: '"Deus nos deu uma arca sagrada para purificar a terra da praga."',
    description: 
      'Comandante militar carismático e implacável na região do Lago Crater. Governa a ilha de Wizard Island com disciplina férrea, paranoia religiosa e plano de guerra total contra os contaminados.',
  },
];

export const DAYS_GONE_ENEMIES: DaysGoneEnemy[] = [
  {
    name: 'Swarmers (Frenéticos Comuns)',
    category: 'Freakers Comuns',
    dangerLevel: 'Médio',
    description: 'Os infectados mais abundantes de Oregon. Hibernam em cavernas e vagões de trem durante o dia e perambulam famintos à noite em bandos ou imensas hordas.',
    tactic: 'Em pequenos números, elimine silenciosamente com faca ou besta. Se estiverem em horda (50 a 500), jamais pare de se mover e use afunilamentos com explosivos.',
  },
  {
    name: 'Bleachers (Albinos Pálidos)',
    category: 'Freakers Comuns',
    dangerLevel: 'Alto',
    description: 'Mutações mais resistentes e velozes dos Swarmers, com pele albina sem pelos e maior força física.',
    tactic: 'Exigem tiros precisos de calibre pesado na cabeça ou rajadas concentradas de armas de alta cadência como a Chicago Chopper.',
  },
  {
    name: 'Screamers (Gritadeiras)',
    category: 'Freakers Especiais',
    dangerLevel: 'Extremo',
    description: 'Fêmeas infectadas cujo grito agudo estridente atordoa Deacon, esvazia completamente a barra de estamina e atrai imediatamente todos os monstros ao redor.',
    tactic: 'Prioridade absoluta de abate! Elimine de longa distância com rifle de precisão com silenciador antes que ela aviste você.',
  },
  {
    name: 'Breakers (Destruidores)',
    category: 'Freakers Especiais',
    dangerLevel: 'Extremo',
    description: 'Colossos mutantes com musculatura grotesca. Aguentam quantidades absurdas de dano, arremessam Deacon longe e massacram outros inimigos.',
    tactic: 'Fique longe de investidas! Use virotes residuais para fazê-los lutar contra outros freakers ou tiros de BFG .50 na cabeça combinados com bombas de proximidade.',
  },
  {
    name: 'Reachers (Rastejadores)',
    category: 'Freakers Especiais',
    dangerLevel: 'Extremo',
    description: 'Criaturas com pelo no corpo e velocidade surreal. Esquivam-se de miras, atacam pelas costas e correm mais rápido que o sprint de Deacon.',
    tactic: 'Ative o modo Foco (Focus) para desacelerar o tempo e use escopetas automáticas ou metralhadoras em combate fechado.',
  },
  {
    name: 'Ragers (Ursos Contaminados)',
    category: 'Fauna Infectada',
    dangerLevel: 'Extremo',
    description: 'Ursos pardos gigantes infectados pelo vírus, cobertos de arame farpado e espinhos ósseos.',
    tactic: 'Fogo é sua maior fraqueza! Lance múltiplos Coquetéis Molotov ou Napalm para queimar sua couraça e mantenha distância usando a moto.',
  },
  {
    name: 'Runners (Lobos Infectados)',
    category: 'Fauna Infectada',
    dangerLevel: 'Alto',
    description: 'Lobos zumbis que conseguem alcançar a Drifter Bike mesmo em alta velocidade e tentar derrubar Deacon do veículo.',
    tactic: 'Use a mira assistida com a arma secundária (pistola ou SMP9) enquanto pilota para abatê-los antes que eles saltem em você.',
  },
  {
    name: 'Newts (Lagartixas / Crianças Infectadas)',
    category: 'Freakers Comuns',
    dangerLevel: 'Baixo',
    description: 'Adolescentes e crianças que se transformaram. Vivem no topo de telhados e veículos, normalmente assustados e oportunistas.',
    tactic: 'Geralmente fogem, mas atacam violentamente em bando se Deacon invadir seu território ou estiver com a barra de vida baixa.',
  },
  {
    name: 'Rippers (Rest in Peace)',
    category: 'Inimigos Humanos',
    dangerLevel: 'Médio',
    description: 'Cultistas sádicos fanáticos liderados por Carlos que veneram os Freakers, automutilam seus corpos e massacram viajantes com armadilhas e fogo.',
    tactic: 'Lute à distância usando cobertura e atire nos atiradores com fuzis. Você também pode atrair hordas de freakers até os acampamentos deles para vê-los se destruírem.',
  },
];

export const DAYS_GONE_TIPS: DaysGoneTip[] = [
  {
    title: 'A Drifter Bike é a Sua Vida',
    category: 'Moto & Estrada',
    icon: 'Bike',
    summary: 'Sua moto é seu ponto de salvamento móvel, transporte e armazém de munição.',
    details: [
      'Nunca deixe a gasolina abaixo de 50%. Postos de gasolina têm combustível infinito (basta parar ao lado da bomba e segurar o botão).',
      'Galões vermelhos de combustível estão sempre próximos a postos de controle NERO, guinchos e túneis abandonados.',
      'Colete sempre peças de Sucata (Scrap) de capôs abertos de carros da polícia e veículos civis para consertar a moto após quedas.',
      'Prioridade de Upgrades de Mecânico: Tanque de Combustível Maior > Pneus de Aderência > Alforje de Munição.',
    ],
  },
  {
    title: 'Estratégia Suprema para Destruir Hordas',
    category: 'Combate contra Hordas',
    icon: 'Flame',
    summary: 'Destruir centenas de freakers exige planejamento tático e uso letal do ambiente.',
    details: [
      'Faça reconhecimento durante o dia enquanto a horda dorme em cavernas ou vagões ferroviários.',
      'Plante bombas de proximidade (Proximity Bombs) e minas detonadoras remotas ao longo do caminho de fuga planejado.',
      'Atraia a horda para afunilamentos naturais (pontes estreitas, corredores de madeira ou túneis) e jogue Napalm Molotov.',
      'Atire nos tambores vermelhos de combustível e caminhões-tanque no momento em que o grosso da horda passar por perto.',
      'Use o Foco (Focus) para alinhar tiros na cabeça com a Chicago Chopper enquanto recupera o fôlego da corrida.',
    ],
  },
  {
    title: 'Injetores NERO: Evolua seus Atributos',
    category: 'NERO & Evolução',
    icon: 'Shield',
    summary: 'Os injetores NERO encontrados em postos de quarentena melhoram Vida, Estamina e Foco.',
    details: [
      'Regra Nº 1 em Postos NERO: CORTE TODOS OS ALTO-FALANTES com sua faca antes de ligar o gerador! Caso contrário, o alarme tocará e atrairá todos os freakers do mapa.',
      'Ordem recomendada de evolução dos atributos: Estamina (essencial para fugir de hordas) > Foco (mira precisa em câmera lenta) > Vida.',
      'Sítios de Pesquisa NERO em cavernas e montanhas frequentemente exigem saltos de moto com Nitro para serem acessados.',
    ],
  },
  {
    title: 'O Arsenal Definitivo de Deacon',
    category: 'Armas & Equipamento',
    icon: 'Crosshair',
    summary: 'Escolha as armas certas para cada tipo de missão e horda.',
    details: [
      'Arma Primária: Chicago Chopper (Nível 3 de Confiança em Wizard Island) - Tambor gigante com centenas de balas, a melhor arma do jogo.',
      'Arma Especial: BFG .50 (Rifle antimaterial de elite) para eliminar snipers e Breakers de longe, ou a Besta Drifter com virotes residuais para infiltração furtiva.',
      'Arma Secundária: SMP9 Militar (adquirida destruindo 4 Hordas no mapa) - taxa de tiro avassaladora com mira estável.',
      'Compre a melhoria de Alforje na moto: permite recarregar TODA a sua munição no meio do nada quando acabar.',
    ],
  },
];

export const DAYS_GONE_GALLERY: DaysGoneMedia[] = [
  {
    title: 'Deacon St. John & Sua Fiel Drifter Bike',
    caption: 'A moto customizada é o único meio seguro de cruzar as estradas infestadas de Oregon.',
    imageUrl: 'https://media.rawg.io/media/screenshots/d16/d1624ea26f29b604400244980cb0f9e8.jpg',
    tag: 'Protagonista',
  },
  {
    title: 'O Pesadelo das Hordas em Massa',
    caption: 'Centenas de Freakers se movem como uma onda orgânica implacável através de florestas e rios.',
    imageUrl: 'https://media.rawg.io/media/screenshots/13c/13ccc479deb5ba11e19469af5f985993.jpg',
    tag: 'Horda',
  },
  {
    title: 'As Florestas Desoladas do Oregon',
    caption: 'Clima dinâmico com chuva, lama e nevascas que afetam a dirigibilidade da moto e a agressividade dos monstros.',
    imageUrl: 'https://media.rawg.io/media/screenshots/95d/95d863d3a8c32c678bef3aca785eeec2.jpg',
    tag: 'Ambiente',
  },
  {
    title: 'Combate Tático e Furtividade',
    caption: 'Armadilhas, tiros silenciados e uso da vegetação são vitais para emboscar acampamentos de saqueadores.',
    imageUrl: 'https://media.rawg.io/media/screenshots/e6a/e6acca940023249bedd169a0c926666d_VTodzdV.jpg',
    tag: 'Combate',
  },
  {
    title: 'A Serraria Antiga (Old Sawmill)',
    caption: 'O palco da horda mais lendária e aterrorizante de todo o jogo com mais de 500 monstros.',
    imageUrl: 'https://media.rawg.io/media/screenshots/f64/f64d0ae9988a55edfc3db331ef72d4d1.jpg',
    tag: 'Horda Lendária',
  },
  {
    title: 'Postos de Controle Abandonados da NERO',
    caption: 'Contêineres médicos secretos guardando injetores biológicos e gravações confidenciais do governo.',
    imageUrl: 'https://media.rawg.io/media/screenshots/eb6/eb62a90b62e1ab18aef1c70da7d91b3a.jpg',
    tag: 'NERO',
  },
  {
    title: 'Mira em Foco e Precisão Fatal',
    caption: 'A habilidade de desacelerar o tempo salva vidas quando Breakers e Screamers atacam sem aviso.',
    imageUrl: 'https://media.rawg.io/media/screenshots/a6c/a6ce935ed73e322404566fa81f983278.jpg',
    tag: 'Ação',
  },
  {
    title: 'Pilotando Sob Tempestades e Chuva',
    caption: 'À noite e sob chuva torrencial, os Freakers ficam mais fortes, rápidos e imprevisíveis.',
    imageUrl: 'https://media.rawg.io/media/screenshots/664/664ea396ae706532612570337bb7c007.jpg',
    tag: 'Estrada',
  },
];

export const DAYS_GONE_VIDEOS: DaysGoneVideo[] = [
  {
    title: 'Days Gone Vale a Pena? Análise Completa e Sincera',
    channel: 'Análise Gamer',
    type: 'gameplay',
    description: 'Uma visão abrangente de por que Days Gone se tornou um clássico cult aclamado pelos jogadores de PC e PS5 após os patches.',
    url: 'https://www.youtube.com/results?search_query=days+gone+vale+a+pena+analise',
    duration: '18 min',
  },
  {
    title: 'Como Derrotar a Maior Horda do Jogo (Old Sawmill 500 Freakers)',
    channel: 'Guia Estratégico',
    type: 'guia',
    description: 'Guia tático passo a passo de como planejar o terreno, usar armadilhas e aniquilar os 500 frenéticos da Serraria Antiga.',
    url: 'https://www.youtube.com/results?search_query=days+gone+old+sawmill+horde+guide',
    duration: '12 min',
  },
  {
    title: "A História Completa de Days Gone & O Final Secreto NERO de O'Brian",
    channel: 'Lore & Enredo',
    type: 'lore',
    description: 'Todos os detalhes da trama, o destino de Sarah, a cura do vírus e a estarrecedora reviravolta secreta pós-créditos.',
    url: 'https://www.youtube.com/results?search_query=days+gone+historia+completa+final+secreto',
    duration: '28 min',
  },
  {
    title: "Soldier's Eyes - Jack Savoretti (A Trilha Sonora Lendária da Viagem)",
    channel: 'Trilha Sonora Oficial',
    type: 'soundtrack',
    description: 'A memorável música acústica que toca quando Deacon pilota a moto rumo ao sul para o território desconhecido.',
    url: 'https://www.youtube.com/results?search_query=days+gone+soldiers+eyes+jack+savoretti',
    duration: '3:30 min',
  },
];
