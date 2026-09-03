const fs = require('fs');

const games = JSON.parse(fs.readFileSync('new_500_games.json', 'utf8'));

let tsContent = `import { CuratedGame } from './curatedGames';

export const STEAM_GAMEPASS_GAMES: CuratedGame[] = ${JSON.stringify(games, null, 2)};
`;

fs.writeFileSync('src/data/steamGamePassGames.ts', tsContent, 'utf8');
console.log(`Gerado com sucesso src/data/steamGamePassGames.ts com ${games.length} jogos!`);
