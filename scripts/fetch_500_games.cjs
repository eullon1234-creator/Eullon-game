const fs = require('fs');
const https = require('https');

const KEY = 'c542e67aec3a4340908f9de9e86038af';
const existingTitlesList = JSON.parse(fs.readFileSync('existing_titles.json', 'utf8'));
const existingTitles = new Set(existingTitlesList.map(t => t.toLowerCase().trim()));

function fetchPage(page) {
  return new Promise((resolve) => {
    const url = `https://api.rawg.io/api/games?key=${KEY}&ordering=-added&page=${page}&page_size=40`;
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          resolve(json.results || []);
        } catch(e) { resolve([]); }
      });
    }).on('error', () => resolve([]));
  });
}

function mapCategories(genres) {
  const cats = new Set();
  for (const g of genres) {
    const n = g.name.toLowerCase();
    if (n.includes('role-playing') || n.includes('rpg')) cats.add('rpg');
    if (n.includes('action')) cats.add('action_fps');
    if (n.includes('shooter')) cats.add('action_fps');
    if (n.includes('adventure')) cats.add('open_world');
    if (n.includes('indie')) cats.add('indie');
    if (n.includes('racing')) cats.add('racing');
    if (n.includes('fighting')) cats.add('fighting');
    if (n.includes('strategy')) cats.add('strategy');
  }
  if (cats.size === 0) cats.add('steam');
  return Array.from(cats);
}

function getPlatform(platforms) {
  const names = (platforms || []).map(p => p.platform?.name || '');
  if (names.some(n => n.includes('PC'))) return 'PC';
  if (names.some(n => n.includes('PlayStation 5'))) return 'PS5';
  if (names.some(n => n.includes('Xbox Series'))) return 'Xbox Series X/S';
  if (names.some(n => n.includes('Nintendo Switch'))) return 'Nintendo Switch';
  if (names.some(n => n.includes('PlayStation 4'))) return 'PS4';
  return 'Multiplataforma';
}

function generateDescription(game) {
  const genresStr = game.genres?.map(g => g.name).join(', ') || 'Ação e Aventura';
  const meta = game.metacritic ? ` com nota Metacritic ${game.metacritic}` : '';
  return `Sucesso aclamado de ${genresStr}${meta}, oferecendo uma experiência imersiva com visual impressionante e jogabilidade marcante.`;
}

(async () => {
  console.log('Testing page 2 & 3 fetch...');
  const p2 = await fetchPage(2);
  const p3 = await fetchPage(3);
  const combined = [...p2, ...p3];
  console.log('Total raw fetched:', combined.length);

  const filtered = [];
  for (const g of combined) {
    if (!g.background_image) continue;
    const norm = g.name.toLowerCase().trim();
    if (existingTitles.has(norm)) continue;

    const play = g.playtime && g.playtime > 2 ? g.playtime : 15;
    filtered.push({
      id: g.slug || g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: g.name,
      category: mapCategories(g.genres || []),
      platform: getPlatform(g.platforms),
      rating: g.rating ? Math.round(g.rating * 20) / 10 : 8.8,
      year: g.released ? parseInt(g.released.substring(0, 4), 10) || 2022 : 2022,
      coverUrl: g.background_image,
      description: generateDescription(g),
      timeToBeat: {
        main: play,
        extra: Math.round(play * 1.5),
        completionist: Math.round(play * 2.4),
      }
    });
  }

  console.log('New unique games from pages 2-3:', filtered.length);
  console.log('Sample game:', filtered[0]);
})();
