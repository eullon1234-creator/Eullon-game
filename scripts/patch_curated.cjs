const fs = require('fs');

let content = fs.readFileSync('src/data/curatedGames.ts', 'utf8');

// 1. Add import
content = content.replace(
  "import { GBA_GAMES } from './gbaGames';",
  "import { GBA_GAMES } from './gbaGames';\nimport { STEAM_GAMEPASS_GAMES } from './steamGamePassGames';"
);

// 2. Add categories
const newCategories = `  { id: 'all', name: 'Todos os Destaques', icon: '🌟', description: 'Seleção das maiores obras-primas de todos os tempos' },
  { id: 'steam_top', name: 'Steam & Blockbusters', icon: '🔥', description: 'Grandes sucessos mundiais, fenômenos e recordistas da Steam e PC Gaming' },
  { id: 'gamepass', name: 'Xbox & Game Pass', icon: '💚', description: 'Grandes franquias e sucessos consagrados do ecossistema Xbox e Game Pass' },`;

content = content.replace(
  "  { id: 'all', name: 'Todos os Destaques', icon: '🌟', description: 'Seleção das maiores obras-primas de todos os tempos' },",
  newCategories
);

// 3. Add to CURATED_GAMES
content = content.replace(
  "...GBA_GAMES,",
  "...GBA_GAMES,\n  ...STEAM_GAMEPASS_GAMES,"
);

fs.writeFileSync('src/data/curatedGames.ts', content, 'utf8');
console.log('src/data/curatedGames.ts atualizado com sucesso!');
