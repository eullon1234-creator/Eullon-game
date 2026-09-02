import React, { useState, useRef } from 'react';
import { 
  Moon, Sun, Download, Upload, Trash2, RotateCcw, 
  Database, LayoutGrid, List, Check, AlertTriangle, FileText, CheckCircle2, Cloud, RefreshCw 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { 
  exportLibraryToJSON, 
  exportLibraryToCSV, 
  exportFullBackup, 
  parseJSONFile, 
  parseCSVFile, 
  BackupData 
} from '../services/exportImport';

export const SettingsView: React.FC = () => {
  const {
    games,
    settings,
    updateSettings,
    importGames,
    restoreFullBackup,
    resetToSampleData,
    clearAllData,
    isCloudConnected,
    isSyncing,
    syncToCloudNow,
  } = useGame();

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const jsonInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleJSONUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await parseJSONFile<any>(file);
      const gamesArray = Array.isArray(data) ? data : data.games;
      if (Array.isArray(gamesArray)) {
        const count = importGames(gamesArray, 'merge');
        setImportStatus(`${count} jogos importados com sucesso!`);
      } else {
        alert('Formato de JSON inválido.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao importar arquivo JSON.');
    } finally {
      if (jsonInputRef.current) jsonInputRef.current.value = '';
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const gamesParsed = parseCSVFile(text);
      if (gamesParsed.length > 0) {
        const count = importGames(gamesParsed, 'merge');
        setImportStatus(`${count} jogos importados do arquivo CSV!`);
      } else {
        alert('Nenhum jogo encontrado no arquivo CSV.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao importar arquivo CSV.');
    } finally {
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  const handleBackupUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const backup = await parseJSONFile<BackupData>(file);
      if (backup && Array.isArray(backup.games)) {
        restoreFullBackup(backup);
        setImportStatus('Backup restaurado com sucesso!');
      } else {
        alert('Arquivo de backup inválido.');
      }
    } catch (err: any) {
      alert(err.message || 'Erro ao restaurar backup.');
    } finally {
      if (backupInputRef.current) backupInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Configurações
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Aparência, visualização e ferramentas de backup da sua biblioteca.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{importStatus}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Aparência & Visualização */}
      <section className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sun className="w-4 h-4 text-neon-cyan" />
          Aparência & Interface
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Tema */}
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold text-slate-300 block">
              Tema Visual
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'dark'
                    ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-sm ring-1 ring-neon-cyan/50'
                    : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-neon-cyan" />
                <span>Escuro (Gamer)</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'death-note' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden ${
                  settings.theme === 'death-note'
                    ? 'bg-death-crimson/25 border-death-crimson text-white shadow-glow-crimson ring-1 ring-death-crimson'
                    : 'bg-death-900 border-red-950/80 text-slate-400 hover:text-red-300 hover:border-death-crimson/40'
                }`}
              >
                <span className="text-base leading-none">🍎</span>
                <span className="font-deathnote text-sm tracking-wide">Death Note</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-death-crimson/30 text-death-crimson uppercase font-mono tracking-tighter">
                  Shinigami
                </span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.theme === 'light'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm ring-1 ring-amber-400/50'
                    : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Claro</span>
              </button>
            </div>
            {settings.theme === 'death-note' && (
              <p className="text-[11px] text-red-400/90 font-deathnote-sub italic pl-1 animate-fadeIn">
                "O humano que registrar seus jogos neste caderno viverá para finalizá-los." — Regra do Shinigami
              </p>
            )}
          </div>

          {/* Modo de Visualização Padrão */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block">
              Visualização Padrão da Biblioteca
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ viewMode: 'grid' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.viewMode === 'grid'
                    ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-sm'
                    : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4 text-neon-cyan" />
                Pôsteres (Grade)
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ viewMode: 'list' })}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  settings.viewMode === 'list'
                    ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-sm'
                    : 'bg-gamer-850 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4 text-slate-300" />
                Lista Detalhada
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Banco de Dados na Nuvem (Firebase) */}
      <section className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-neon-cyan" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Banco de Dados na Nuvem (Firebase Firestore)
              </h2>
              <p className="text-xs text-slate-400">
                Projeto: <span className="font-mono text-neon-cyan">game-historia-2026</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isCloudConnected
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {isCloudConnected ? 'Conectado em Tempo Real' : 'Modo Offline (Local)'}
            </span>

            <button
              type="button"
              onClick={syncToCloudNow}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Forçar envio de todos os jogos para o Firebase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-neon-cyan' : ''}`} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Seus jogos são sincronizados automaticamente em tempo real com a coleção <span className="font-mono text-slate-300">games</span> no Firestore. Todas as inclusões, edições e exclusões são salvas na nuvem e refletidas instantaneamente em qualquer dispositivo.
        </p>
      </section>

      {/* 3. Exportar & Importar Dados */}
      <section className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-neon-cyan" />
          Dados & Portabilidade
        </h2>

        {/* Hidden File Inputs */}
        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          onChange={handleJSONUpload}
          className="hidden"
        />
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="hidden"
        />
        <input
          ref={backupInputRef}
          type="file"
          accept=".json"
          onChange={handleBackupUpload}
          className="hidden"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-neon-cyan" />
                Exportar para JSON
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Baixe o arquivo de dados com todos os seus jogos em formato estruturado.
              </p>
            </div>
            <button
              onClick={() => exportLibraryToJSON(games)}
              className="w-full py-2 px-3 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              Baixar JSON
            </button>
          </div>

          {/* Export CSV */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Exportar para Planilha (CSV)
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Arquivo compatível com Excel, Google Sheets e LibreOffice.
              </p>
            </div>
            <button
              onClick={() => exportLibraryToCSV(games)}
              className="w-full py-2 px-3 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              Baixar CSV
            </button>
          </div>

          {/* Import JSON/CSV */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" />
                Importar Jogos
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Adicione jogos a partir de um arquivo JSON ou CSV com validação automática.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => jsonInputRef.current?.click()}
                className="flex-1 py-2 px-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700"
              >
                Abrir JSON
              </button>
              <button
                onClick={() => csvInputRef.current?.click()}
                className="flex-1 py-2 px-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700"
              >
                Abrir CSV
              </button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                Backup Completo
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Gera um arquivo único com toda a biblioteca e configurações.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportFullBackup(games, settings)}
                className="flex-1 py-2 px-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700"
              >
                Salvar Backup
              </button>
              <button
                onClick={() => backupInputRef.current?.click()}
                className="flex-1 py-2 px-2 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-200 text-xs font-bold border border-slate-700"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Manutenção e Restauração */}
      <section className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Manutenção
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Resetar Demo */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                Restaurar Dados de Demonstração
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Carrega 10 jogos clássicos de demonstração com capas reais.
              </p>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
              >
                Restaurar Demonstração
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetToSampleData();
                    setConfirmReset(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-gamer-950 text-xs font-bold"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 rounded-xl bg-gamer-800 text-slate-400 text-xs"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Limpar Tudo */}
          <div className="p-4 rounded-2xl bg-gamer-850/60 border border-rose-900/30 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                Limpar Toda a Biblioteca
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Remove permanentemente todos os jogos cadastrados no navegador.
              </p>
            </div>

            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
              >
                Limpar Todos os Jogos
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearAllData();
                    setConfirmClear(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold"
                >
                  Excluir Tudo
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-2 rounded-xl bg-gamer-800 text-slate-400 text-xs"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
