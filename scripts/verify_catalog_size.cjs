const fs = require('fs');

const curated = fs.readFileSync('src/data/curatedGames.ts', 'utf8');
const gba = fs.readFileSync('src/data/gbaGames.ts', 'utf8');
const steam = fs.readFileSync('src/data/steamGamePassGames.ts', 'utf8');

function getIds(str) {
  const matches = [];
  const regex = /["']?id["']?:\s*["']([^"']+)["']/g;
  let m;
  while ((m = regex.exec(str)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

const gbaIds = getIds(gba);
const steamIds = getIds(steam);
// In curated, exclude categories
const allCuratedIds = getIds(curated);

console.log('GBA games count:', gbaIds.length);
console.log('Steam & Game Pass games count:', steamIds.length);
console.log('Base curated IDs (excl gba & steam):', allCuratedIds.length);

const allIds = new Set([...gbaIds, ...steamIds, ...allCuratedIds]);
console.log('\nTOTAL UNIQUE GAME IDS IN APP:', allIds.size);
