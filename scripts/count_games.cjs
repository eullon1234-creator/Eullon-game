const fs = require('fs');

const content = fs.readFileSync('src/data/curatedGames.ts', 'utf8');
const idMatches = content.match(/id:\s*["'][^"']+["']/g) || [];
console.log('Total IDs found in curatedGames.ts:', idMatches.length);

const titles = [];
const titleRegex = /title:\s*["']([^"']+)["']/g;
let m;
while ((m = titleRegex.exec(content)) !== null) {
  titles.push(m[1].toLowerCase());
}
console.log('Total Titles found in curatedGames.ts:', titles.length);
fs.writeFileSync('existing_titles.json', JSON.stringify(titles, null, 2));
