const fs = require('fs');
const https = require('https');

const KEY = 'c542e67aec3a4340908f9de9e86038af';
const existingTitlesList = JSON.parse(fs.readFileSync('existing_titles.json', 'utf8'));
const existingTitles = new Set(existingTitlesList.map(t => t.toLowerCase().trim()));

// Function to fetch a URL with retry
function fetchJson(url, retries = 3) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          resolve(json);
        } catch(e) {
          if (retries > 0) {
            setTimeout(() => resolve(fetchJson(url, retries - 1)), 1500);
          } else {
            resolve({});
          }
        }
      });
    }).on('error', () => {
      if (retries > 0) {
        setTimeout(() => resolve(fetchJson(url, retries - 1)), 1500);
      } else {
        resolve({});
      }
    });
  });
}

function mapCategories(g) {
  const cats = new Set();
  const title = g.name.toLowerCase();
  const genres = (g.genres || []).map(x => x.name.toLowerCase());
  const tags = (g.tags || []).map(x => x.name.toLowerCase());

  if (genres.some(x => x.includes('rpg') || x.includes('role-playing')) || tags.some(x => x.includes('rpg'))) cats.add('rpg');
  if (genres.some(x => x.includes('shooter') || x.includes('action')) || tags.some(x => x.includes('fps') || x.includes('shooter'))) cats.add('action_fps');
  if (genres.some(x => x.includes('adventure')) || tags.some(x => x.includes('open world'))) cats.add('openworld');
  if (genres.some(x => x.includes('indie')) || tags.some(x => x.includes('indie'))) cats.add('indie');
  if (genres.some(x => x.includes('racing')) || title.includes('forza') || title.includes('need for speed') || title.includes('gran turismo')) cats.add('racing');
  if (genres.some(x => x.includes('fighting')) || tags.some(x => x.includes('fighting') || x.includes('beat \'em up'))) cats.add('fighting');
  if (tags.some(x => x.includes('horror') || x.includes('survival horror')) || genres.some(x => x.includes('horror'))) cats.add('horror');
  if (tags.some(x => x.includes('sci-fi') || x.includes('space') || x.includes('cyberpunk') || x.includes('futuristic'))) cats.add('scifi');
  if (tags.some(x => x.includes('souls-like') || x.includes('difficult') || x.includes('dark fantasy'))) cats.add('soulslike');
  if (genres.some(x => x.includes('platformer')) || tags.some(x => x.includes('metroidvania') || x.includes('2d platformer'))) cats.add('platformer');
  if (tags.some(x => x.includes('hack and slash') || x.includes('spectacle fighter'))) cats.add('hackslash');

  // Steam / Game Pass hits
  cats.add('steam_top');
  const platforms = (g.platforms || []).map(p => p.platform?.name?.toLowerCase() || '');
  if (platforms.some(p => p.includes('xbox') || p.includes('pc'))) {
    cats.add('gamepass');
  }

  return Array.from(cats);
}

function getPlatform(platforms) {
  const names = (platforms || []).map(p => p.platform?.name || '');
  if (names.some(n => n.includes('PC')) && names.some(n => n.includes('PlayStation') || n.includes('Xbox'))) return 'Multiplataforma';
  if (names.some(n => n.includes('PC'))) return 'PC';
  if (names.some(n => n.includes('PlayStation 5'))) return 'PS5';
  if (names.some(n => n.includes('Xbox Series'))) return 'Xbox Series X/S';
  if (names.some(n => n.includes('Nintendo Switch'))) return 'Nintendo Switch';
  return 'Multiplataforma';
}

function generatePortugueseDescription(g) {
  const genres = g.genres?.map(x => x.name).join(' e ') || 'Ação e Aventura';
  const meta = g.metacritic ? ` consagrado com nota ${g.metacritic} no Metacritic` : '';
  const descPrefixes = [
    `Espetacular título de ${genres}${meta}, trazendo gráficos impressionantes e jogabilidade viciante.`,
    `Aclamação da crítica e dos jogadores: uma jornada marcante de ${genres}${meta} com narrativa profunda e mundo envolvente.`,
    `Grande sucesso da indústria gamer focado em ${genres}${meta}, com ambientação rica, combates dinâmicos e exploração memorável.`,
    `Referência absoluta no gênero de ${genres}${meta}, aclamado pela comunidade por sua atmosfera única e desafios empolgantes.`
  ];
  const idx = Math.abs(String(g.id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % descPrefixes.length;
  return descPrefixes[idx];
}

function isInvalidTitle(name) {
  const lower = name.toLowerCase();
  const blacklist = [
    'soundtrack', 'ost', 'dlc', 'expansion pack', 'season pass', 'beta', 'demo',
    'artbook', 'vr only', 'trailer', 'test build', 'server', 'pack', 'edition upgrade',
    'pre-order', 'bonus content', 'making of', 'digital extras'
  ];
  return blacklist.some(b => lower.includes(b));
}

async function run() {
  console.log('Iniciando coleta de mais de 500 grandes jogos da Steam, Game Pass e consoles...');
  const allCollected = new Map();
  const seenSlugs = new Set();

  // Queries to perform
  const tasks = [];
  
  // 1. Most added/popular (pages 2 through 18)
  for (let p = 2; p <= 18; p++) {
    tasks.push({ url: `https://api.rawg.io/api/games?key=${KEY}&ordering=-added&page=${p}&page_size=40`, label: `added-p${p}` });
  }

  // 2. Highest metacritic (pages 1 through 8)
  for (let p = 1; p <= 8; p++) {
    tasks.push({ url: `https://api.rawg.io/api/games?key=${KEY}&ordering=-metacritic&page=${p}&page_size=40`, label: `meta-p${p}` });
  }

  // 3. Highest rating (pages 1 through 6)
  for (let p = 1; p <= 6; p++) {
    tasks.push({ url: `https://api.rawg.io/api/games?key=${KEY}&ordering=-rating&page=${p}&page_size=40`, label: `rating-p${p}` });
  }

  console.log(`Total de páginas para consultar: ${tasks.length}`);

  // Fetch in chunks of 4 parallel requests to respect rate limits
  const CHUNK_SIZE = 4;
  for (let i = 0; i < tasks.length; i += CHUNK_SIZE) {
    const chunk = tasks.slice(i, i + CHUNK_SIZE);
    const results = await Promise.all(chunk.map(t => fetchJson(t.url)));

    for (let rIdx = 0; rIdx < results.length; rIdx++) {
      const res = results[rIdx];
      const games = res.results || [];
      for (const g of games) {
        if (!g || !g.name || !g.background_image) continue;
        if (isInvalidTitle(g.name)) continue;

        const normTitle = g.name.toLowerCase().trim();
        if (existingTitles.has(normTitle) || allCollected.has(normTitle)) continue;

        const slug = g.slug || g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const finalId = seenSlugs.has(slug) ? `${slug}-${g.id}` : slug;
        seenSlugs.add(finalId);

        let play = g.playtime && g.playtime > 2 ? g.playtime : 16;
        if (play > 150) play = 60; // normalize outliers

        const ratingVal = g.rating && g.rating > 0 
          ? Math.min(10, Math.round(g.rating * 20) / 10) 
          : (g.metacritic ? Math.round(g.metacritic / 10 * 10) / 10 : 8.9);

        const yearVal = g.released ? parseInt(g.released.substring(0, 4), 10) || 2022 : 2022;

        const curatedGame = {
          id: finalId,
          title: g.name.trim(),
          category: mapCategories(g),
          platform: getPlatform(g.platforms),
          rating: ratingVal,
          year: yearVal,
          coverUrl: g.background_image,
          description: generatePortugueseDescription(g),
          timeToBeat: {
            main: play,
            extra: Math.round(play * 1.5),
            completionist: Math.round(play * 2.3),
          }
        };

        allCollected.set(normTitle, curatedGame);
      }
    }

    console.log(`Progresso: consultadas ${Math.min(i + CHUNK_SIZE, tasks.length)}/${tasks.length} páginas. Total coletado até agora: ${allCollected.size}`);
    if (allCollected.size >= 550) {
      console.log('Alcançada a meta de 500+ novos jogos!');
      break;
    }
    // Small delay between chunks
    await new Promise(r => setTimeout(r, 600));
  }

  const newGames = Array.from(allCollected.values()).slice(0, 520);
  console.log(`\nFinalizado com sucesso! Total de novos jogos selecionados: ${newGames.length}`);

  // Save to JSON for verification
  fs.writeFileSync('new_500_games.json', JSON.stringify(newGames, null, 2), 'utf8');
  console.log('Salvo em new_500_games.json!');
}

run();
