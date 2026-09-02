import { Game, AppSettings } from '../types/game';

export interface BackupData {
  version: string;
  exportedAt: string;
  app: string;
  games: Game[];
  settings?: AppSettings;
}

export function exportLibraryToJSON(games: Game[]): void {
  const exportPayload = games.map((g) => ({
    id: g.id,
    title: g.title,
    coverUrl: g.coverUrl,
    platform: g.platform,
    status: g.status,
    rating: g.rating !== undefined ? g.rating : null,
    favorite: g.favorite,
    notes: g.notes || '',
  }));

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `game_tracker_pro_library_${new Date().toISOString().split('T')[0]}.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportFullBackup(games: Game[], settings: AppSettings): void {
  const backup: BackupData = {
    version: '2.1.0',
    exportedAt: new Date().toISOString(),
    app: 'Game Tracker Pro',
    games,
    settings,
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
  const downloadAnchor = document.createElement('a');
  const filename = `game_tracker_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportLibraryToCSV(games: Game[]): void {
  const headers = ['Título', 'Capa (URL)', 'Plataforma', 'Status', 'Nota', 'Favorito', 'Observações'];

  const escapeCSV = (val: unknown): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = games.map((g) => [
    escapeCSV(g.title),
    escapeCSV(g.coverUrl),
    escapeCSV(g.platform),
    escapeCSV(g.status),
    escapeCSV(g.rating !== undefined ? g.rating : ''),
    escapeCSV(g.favorite ? 'Sim' : 'Não'),
    escapeCSV(g.notes || ''),
  ].join(','));

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  const filename = `game_tracker_pro_library_${new Date().toISOString().split('T')[0]}.csv`;
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute('download', filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

export async function parseJSONFile<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        resolve(parsed);
      } catch (err) {
        reject(new Error('O arquivo JSON selecionado possui formato inválido.'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo.'));
    reader.readAsText(file);
  });
}

export function parseCSVFile(text: string): Partial<Game>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  const games: Partial<Game>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    const gameObj: Partial<Game> = {
      id: 'imported-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      platform: 'PC 💲 (Comprado)',
      favorite: false,
      status: 'backlog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    headers.forEach((hdr, idx) => {
      const val = values[idx] || '';
      if (hdr.includes('título') || hdr === 'title') gameObj.title = val;
      else if (hdr.includes('capa') || hdr.includes('cover')) gameObj.coverUrl = val;
      else if (hdr.includes('plataforma') || hdr === 'platform') gameObj.platform = val || 'PC 💲 (Comprado)';
      else if (hdr === 'status') {
        const s = val.toLowerCase();
        if (['playing', 'completed', 'backlog', 'abandoned'].includes(s)) {
          gameObj.status = s as any;
        } else if (s.includes('jogando')) gameObj.status = 'playing';
        else if (s.includes('zerado')) gameObj.status = 'completed';
        else if (s.includes('quero') || s.includes('backlog')) gameObj.status = 'backlog';
        else if (s.includes('desisti') || s.includes('abandoned')) gameObj.status = 'abandoned';
      }
      else if (hdr === 'nota' || hdr === 'rating') gameObj.rating = val ? parseFloat(val) : undefined;
      else if (hdr.includes('favorito')) gameObj.favorite = val.toLowerCase().includes('sim') || val.toLowerCase() === 'true';
      else if (hdr.includes('observações') || hdr.includes('observacoes') || hdr === 'notes') gameObj.notes = val;
    });

    if (gameObj.title) {
      if (!gameObj.coverUrl) {
        gameObj.coverUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop';
      }
      games.push(gameObj);
    }
  }

  return games;
}
