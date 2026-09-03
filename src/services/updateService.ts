// src/services/updateService.ts

export const CURRENT_APP_VERSION = '1.2.1';
export const GITHUB_REPO = 'eullon1234-creator/Eullon-game';

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseName: string;
  releaseNotes: string;
  publishedAt: string;
  apkUrl?: string;
  apkSizeMb?: string;
  exeUrl?: string;
  exeSizeMb?: string;
  releaseUrl: string;
}

export function compareVersions(v1: string, v2: string): number {
  // Limpa prefixos como 'v'
  const clean1 = v1.replace(/^v/, '').trim();
  const clean2 = v2.replace(/^v/, '').trim();

  const parts1 = clean1.split('.').map(n => parseInt(n, 10) || 0);
  const parts2 = clean2.split('.').map(n => parseInt(n, 10) || 0);

  const len = Math.max(parts1.length, parts2.length);
  for (let i = 0; i < len; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

export const updateService = {
  async checkForUpdates(force = false): Promise<UpdateInfo> {
    const CACHE_KEY = 'eullon_last_update_check';
    const CACHE_DATA_KEY = 'eullon_update_cached_data';
    const ONE_HOUR = 60 * 60 * 1000;

    if (!force && typeof window !== 'undefined') {
      const lastCheck = localStorage.getItem(CACHE_KEY);
      const cachedData = localStorage.getItem(CACHE_DATA_KEY);
      if (lastCheck && cachedData && Date.now() - parseInt(lastCheck, 10) < ONE_HOUR) {
        try {
          return JSON.parse(cachedData);
        } catch (e) {
          // ignore cache error
        }
      }
    }

    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Falha ao buscar atualizações (Status: ${response.status})`);
      }

      const release = await response.json();
      const latestTag = release.tag_name || '';
      const hasUpdate = compareVersions(latestTag, CURRENT_APP_VERSION) > 0;

      let apkUrl: string | undefined;
      let apkSizeMb: string | undefined;
      let exeUrl: string | undefined;
      let exeSizeMb: string | undefined;

      if (Array.isArray(release.assets)) {
        const apkAsset = release.assets.find((a: any) => a.name.endsWith('.apk'));
        if (apkAsset) {
          apkUrl = apkAsset.browser_download_url;
          apkSizeMb = (apkAsset.size / (1024 * 1024)).toFixed(1) + ' MB';
        }

        const exeAsset = release.assets.find((a: any) => a.name.endsWith('.exe') && !a.name.includes('blockmap'));
        if (exeAsset) {
          exeUrl = exeAsset.browser_download_url;
          exeSizeMb = (exeAsset.size / (1024 * 1024)).toFixed(1) + ' MB';
        }
      }

      const result: UpdateInfo = {
        hasUpdate,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: latestTag.replace(/^v/, ''),
        releaseName: release.name || latestTag,
        releaseNotes: release.body || 'Melhorias de desempenho, correções e novos recursos adicionados.',
        publishedAt: release.published_at,
        apkUrl,
        apkSizeMb,
        exeUrl,
        exeSizeMb,
        releaseUrl: release.html_url,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(CACHE_KEY, Date.now().toString());
        localStorage.setItem(CACHE_DATA_KEY, JSON.stringify(result));
      }

      return result;
    } catch (error: any) {
      console.warn('Não foi possível verificar atualizações:', error.message);
      return {
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: CURRENT_APP_VERSION,
        releaseName: 'Atualizado',
        releaseNotes: '',
        publishedAt: new Date().toISOString(),
        releaseUrl: `https://github.com/${GITHUB_REPO}/releases`,
      };
    }
  },

  downloadApk(url?: string) {
    const targetUrl = url || `https://github.com/${GITHUB_REPO}/releases/latest/download/Eullon-Game.apk`;
    window.open(targetUrl, '_blank');
  },

  downloadExe(url?: string) {
    const targetUrl = url || `https://github.com/${GITHUB_REPO}/releases/latest`;
    window.open(targetUrl, '_blank');
  }
};
