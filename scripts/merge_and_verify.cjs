// scripts/merge_and_verify.cjs
const fs = require('fs');
const path = require('path');

// 1. Carrega dados existentes
const cleanData = JSON.parse(fs.readFileSync('clean_existing_games.json', 'utf8'));
const existingIds = new Set(cleanData.ids);
const existingTitles = new Set(cleanData.titles);

console.log(`Curated games existentes no arquivo original: ${existingIds.size}`);

// 2. Carrega todos os batches
const batches = [
  require('./batch1_retro.cjs'),
  require('./batch2_ps2.cjs'),
  require('./batch3_playstation.cjs'),
  require('./batch4_xbox.cjs'),
  require('./batch5_nintendo.cjs'),
  require('./batch6_anime.cjs'),
  require('./batch7_horror.cjs'),
  require('./batch8_souls.cjs'),
  require('./batch9_openworld.cjs'),
  require('./batch10_rpg_hackslash.cjs'),
  require('./batch11_fps.cjs'),
  require('./batch12_indie.cjs'),
  require('./batch13_racing_fighting.cjs'),
  require('./batch14_extra.cjs'),
];

const allNewGames = [];
const seenIds = new Set();
const seenTitles = new Set();

let duplicatesFiltered = 0;

for (let i = 0; i < batches.length; i++) {
  const batchGames = batches[i].NEW_GAMES;
  for (const game of batchGames) {
    const normTitle = game.title.trim().toLowerCase();
    
    // Checa duplicação de ID
    if (existingIds.has(game.id) || seenIds.has(game.id)) {
      console.warn(`[AVISO] ID duplicado encontrado e ajustado: ${game.id}`);
      game.id = `${game.id}-extra`;
    }
    
    // Checa se já existe o título no arquivo original
    if (existingTitles.has(normTitle) || seenTitles.has(normTitle)) {
      console.warn(`[AVISO] Título duplicado ignorado: ${game.title}`);
      duplicatesFiltered++;
      continue;
    }

    seenIds.add(game.id);
    seenTitles.add(normTitle);
    allNewGames.push(game);
  }
}

console.log(`\nNovos jogos válidos prontos para inserção: ${allNewGames.length}`);
if (allNewGames.length < 300) {
  console.error(`ERRO: Menos de 300 jogos gerados (${allNewGames.length}).`);
  process.exit(1);
}

// 3. Atualiza o arquivo curatedGames.ts
const targetFile = 'src/data/curatedGames.ts';
let sourceCode = fs.readFileSync(targetFile, 'utf8');

// Adiciona novas categorias se não existirem
const newCategories = [
  { id: 'xbox', name: 'Universo Xbox & Halo', icon: '🟢', description: 'O legado do Xbox: Master Chief, Gears of War, Forza e o poder verde' },
  { id: 'superheroes', name: 'Super-Heróis & Quadrinhos', icon: '🦇', description: 'Arkham, Homem-Aranha, Guardiões da Galáxia e aventuras heroicas' },
  { id: 'stealth', name: 'Furtividade & Espionagem', icon: '🥷', description: 'Metal Gear Solid, Splinter Cell, Dishonored e ação tática das sombras' },
  { id: 'retro', name: 'Lendas Retrô (PS1 & SNES)', icon: '🕹️', description: 'Os clássicos lendários dos anos 90 que fundaram a indústria dos games' }
];

for (const cat of newCategories) {
  if (!sourceCode.includes(`id: '${cat.id}'`)) {
    const catInsert = `  { id: '${cat.id}', name: '${cat.name}', icon: '${cat.icon}', description: '${cat.description}' },\n`;
    sourceCode = sourceCode.replace('export const CATALOG_CATEGORIES: GameCategory[] = [\n', `export const CATALOG_CATEGORIES: GameCategory[] = [\n${catInsert}`);
    console.log(`Categoria '${cat.name}' adicionada a CATALOG_CATEGORIES.`);
  }
}

// Formata o bloco dos novos jogos
const gamesCodeStrings = allNewGames.map(g => {
  return `  {
    id: ${JSON.stringify(g.id)},
    title: ${JSON.stringify(g.title)},
    category: ${JSON.stringify(g.category)},
    platform: ${JSON.stringify(g.platform)},
    rating: ${g.rating},
    year: ${g.year},
    coverUrl: ${JSON.stringify(g.coverUrl)},
    description: ${JSON.stringify(g.description)},
    timeToBeat: ${JSON.stringify(g.timeToBeat)},
  },`;
}).join('\n');

const expansionComment = `\n  // ==========================================\n  // === EXPANSÃO DO CATÁLOGO (+${allNewGames.length} NOVOS JOGOS) ===\n  // ==========================================\n`;

// Inserir antes do fechamento do array CURATED_GAMES: ];
const lastBracketIndex = sourceCode.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.error('ERRO: Não encontrou o fechamento ]; de CURATED_GAMES no arquivo.');
  process.exit(1);
}

const updatedCode = sourceCode.slice(0, lastBracketIndex) + expansionComment + gamesCodeStrings + '\n' + sourceCode.slice(lastBracketIndex);

fs.writeFileSync(targetFile, updatedCode, 'utf8');
console.log(`\nSucesso! Inseridos ${allNewGames.length} novos jogos em ${targetFile}.`);
console.log(`Total final estimado de jogos no catálogo: ${existingIds.size + allNewGames.length}`);
