import React, { useState, useRef } from 'react';
import { 
  Moon, Sun, Download, Upload, Trash2, RotateCcw, 
  Database, LayoutGrid, List, Check, AlertTriangle, FileText, CheckCircle2, Cloud, RefreshCw,
  Image as ImageIcon, Sparkles, Key, ExternalLink, Bot, Zap, Volume2, SlidersHorizontal, Play,
  ArrowUpCircle, Smartphone, Monitor
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { groqService, DEFAULT_GROQ_KEY } from '../services/groqService';
import { speechService, VoiceOption, ELEVENLABS_VOICES } from '../services/speechService';
import { updateService, CURRENT_APP_VERSION, UpdateInfo } from '../services/updateService';
import { UpdateModal } from '../components/modals/UpdateModal';
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

  const isDeathNote = settings.theme === 'death-note';

  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [testingGroq, setTestingGroq] = useState(false);
  const [groqTestResult, setGroqTestResult] = useState<{ success: boolean; latencyMs: number; error?: string } | null>(null);

  const handleTestGroq = async () => {
    setTestingGroq(true);
    setGroqTestResult(null);
    try {
      const result = await groqService.testConnection(settings.groqApiKey);
      setGroqTestResult(result);
    } catch (err: any) {
      setGroqTestResult({ success: false, latencyMs: 0, error: err.message });
    } finally {
      setTestingGroq(false);
    }
  };

  const [updateChecking, setUpdateChecking] = useState(false);
  const [updateResult, setUpdateResult] = useState<UpdateInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleCheckUpdate = async () => {
    setUpdateChecking(true);
    try {
      const info = await updateService.checkForUpdates(true);
      setUpdateResult(info);
      if (info.hasUpdate) {
        setShowUpdateModal(true);
      }
    } catch (err) {
      // ignore
    } finally {
      setUpdateChecking(false);
    }
  };

  const [settingsVoiceList, setSettingsVoiceList] = useState<VoiceOption[]>(() => speechService.getAvailableVoices());
  const [testingVoiceSettings, setTestingVoiceSettings] = useState(false);

  React.useEffect(() => {
    const updateVoices = () => {
      setSettingsVoiceList(speechService.getAvailableVoices());
    };
    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTestVoiceSettings = () => {
    if (testingVoiceSettings) return;
    setTestingVoiceSettings(true);
    speechService.testVoice(
      {
        provider: settings.voiceProvider || 'elevenlabs',
        voiceURI: settings.jarvisVoiceURI,
        elevenVoiceId: settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb',
        elevenApiKey: settings.elevenLabsApiKey,
        rate: settings.jarvisVoiceRate,
        pitch: settings.jarvisVoicePitch,
      },
      () => setTestingVoiceSettings(false)
    );
  };

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

      {/* 2. Busca Automática de Capas (RAWG API) */}
      <section className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Busca Automática de Capas (RAWG Games API)
              </h2>
              <p className="text-xs text-slate-400">
                Sugestões oficiais de pôsteres em alta resolução em 1 clique ao cadastrar jogos.
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Ativo e Gratuito
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-neon-cyan" />
              Chave de API Personalizada (Opcional)
            </label>
            <a
              href="https://rawg.io/apidocs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Gerar chave gratuita na RAWG (20.000 req/mês)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Chave pública padrão já inclusa. Cole aqui caso deseje usar sua chave própria..."
              value={settings.rawgApiKey || ''}
              onChange={(e) => updateSettings({ rawgApiKey: e.target.value })}
              className="flex-1 px-3.5 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan text-xs font-mono"
            />
            {settings.rawgApiKey && (
              <button
                type="button"
                onClick={() => updateSettings({ rawgApiKey: undefined })}
                className="px-3 py-2 rounded-xl bg-gamer-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
              >
                Restaurar Padrão
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            O aplicativo já conta com uma chave global gratuita integrada para você não precisar configurar nada. Você pode pesquisar capas de qualquer plataforma (PC, PlayStation, Xbox, Switch, etc.) diretamente no formulário de jogos.
          </p>
        </div>
      </section>

      {/* Seção da Inteligência Artificial (Groq) */}
      <section className="p-6 rounded-3xl bg-gamer-900/80 border border-slate-800 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Inteligência Artificial (Groq LPU)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  Ultra-Fast
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Alimenta o Oráculo Gamer, dicas inteligentes de jogos e recomendações do backlog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={testingGroq}
              onClick={handleTestGroq}
              className="px-3.5 py-1.5 rounded-xl bg-gamer-800 hover:bg-gamer-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingGroq ? 'animate-spin text-neon-cyan' : ''}`} />
              <span>{testingGroq ? 'Testando...' : 'Testar Conexão'}</span>
            </button>
          </div>
        </div>

        {/* Resultado do Teste */}
        {groqTestResult && (
          <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 animate-fadeIn ${
            groqTestResult.success
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {groqTestResult.success ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Conexão bem-sucedida!</strong> A API do Groq respondeu em <strong>{groqTestResult.latencyMs}ms</strong>. Modelo pronto para uso.
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  <strong>Falha na conexão:</strong> {groqTestResult.error}
                </span>
              </>
            )}
          </div>
        )}

        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <label className="font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-neon-cyan" />
              Chave de API do Groq
            </label>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Console da Groq Cloud (Chave Grátis)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Chave padrão já configurada e ativa..."
              value={settings.groqApiKey || ''}
              onChange={(e) => updateSettings({ groqApiKey: e.target.value })}
              className="flex-1 px-3.5 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan text-xs font-mono"
            />
            {settings.groqApiKey && (
              <button
                type="button"
                onClick={() => updateSettings({ groqApiKey: undefined })}
                className="px-3 py-2 rounded-xl bg-gamer-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
                title="Restaurar chave padrão fornecida"
              >
                Restaurar Padrão
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Sua chave está ativa! O aplicativo utiliza os modelos de ponta <strong>Qwen 3.8 27B</strong> e <strong>GPT-OSS 120B</strong> rodando nos chips LPU do Groq para respostas quase instantâneas.
          </p>
        </div>

        {/* Calibração de Voz do J.A.R.V.I.S. (ElevenLabs & Navegador) */}
        <div className="pt-4 border-t border-slate-800 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voz do J.A.R.V.I.S. (Síntese Neural)</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={testingVoiceSettings}
                onClick={handleTestVoiceSettings}
                className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{testingVoiceSettings ? 'Falando...' : 'Testar Voz'}</span>
              </button>
            </div>
          </div>

          {/* Motor de Voz: ElevenLabs vs Navegador */}
          <div className="flex items-center gap-2 p-1 bg-gamer-800/90 rounded-2xl border border-slate-700">
            <button
              type="button"
              onClick={() => updateSettings({ voiceProvider: 'elevenlabs' })}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                settings.voiceProvider !== 'browser'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gamer-950 shadow-glow-cyan font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ElevenLabs (Cinema ⭐)</span>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ voiceProvider: 'browser' })}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                settings.voiceProvider === 'browser'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🌐 Navegador Neural</span>
            </button>
          </div>

          {settings.voiceProvider !== 'browser' ? (
            <div className="space-y-3 animate-fadeIn">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-[11px]">
                  Voz de Estúdio (ElevenLabs):
                </label>
                <select
                  value={settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb'}
                  onChange={(e) => updateSettings({ elevenLabsVoiceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gamer-800 border border-cyan-500/40 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans"
                >
                  {ELEVENLABS_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="text-slate-300 font-semibold">
                    Chave de API do ElevenLabs:
                  </label>
                  <a
                    href="https://elevenlabs.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <span>Painel ElevenLabs (10k Caracteres Grátis)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Chave padrão já configurada e ativa..."
                    value={settings.elevenLabsApiKey || ''}
                    onChange={(e) => updateSettings({ elevenLabsApiKey: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-mono"
                  />
                  {settings.elevenLabsApiKey && (
                    <button
                      type="button"
                      onClick={() => updateSettings({ elevenLabsApiKey: undefined })}
                      className="px-3 py-2 rounded-xl bg-gamer-800 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 text-xs font-bold border border-slate-700 transition-colors"
                      title="Restaurar chave padrão fornecida"
                    >
                      Restaurar Padrão
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sua chave do ElevenLabs está ativa! O J.A.R.V.I.S. utilizará a voz de estúdio de cinema com entonação humana e respiração realista. Se seus caracteres mensais se esgotarem, o app reverterá automaticamente para a voz neural do navegador.
              </p>
            </div>
          ) : (
            <div className="space-y-2 animate-fadeIn">
              <label className="text-slate-300 font-semibold block text-[11px]">
                Voz Neural Detectada no Navegador:
              </label>
              <select
                value={settings.jarvisVoiceURI || ''}
                onChange={(e) => updateSettings({ jarvisVoiceURI: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-gamer-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans"
              >
                {settingsVoiceList.length === 0 ? (
                  <option value="">Voz padrão do sistema operacional</option>
                ) : (
                  settingsVoiceList.map((item, idx) => (
                    <option key={idx} value={item.voice.voiceURI}>
                      {item.isNeural ? '⭐ [NEURAL] ' : ''}{item.name} ({item.lang})
                    </option>
                  ))
                )}
              </select>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Dica: Vozes com <strong className="text-cyan-300">⭐ [NEURAL]</strong> (como <em>Microsoft Antonio Online Natural</em> ou <em>Google português</em>) possuem entonação humana ultra-realista gerada por inteligência artificial local.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Banco de Dados na Nuvem (Firebase) */}
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

      {/* Seção Atualizações do Aplicativo */}
      <section className={`p-6 rounded-2xl border ${
        isDeathNote
          ? 'bg-death-900 border-death-crimson/30 shadow-death-crimson/5'
          : 'bg-gamer-900 border-slate-800 shadow-xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isDeathNote ? 'bg-death-crimson/20 text-death-crimson' : 'bg-neon-cyan/15 text-neon-cyan'
            }`}>
              <ArrowUpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Atualizações do Sistema</h2>
              <p className="text-xs text-slate-400">Verifique e baixe novas versões do APK ou PC diretamente pelo app</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            v{CURRENT_APP_VERSION}
          </span>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDeathNote ? 'bg-death-950/60 border-death-parchment/10' : 'bg-gamer-950/60 border-slate-800/80'
        }`}>
          <div className="text-xs text-slate-300">
            {updateChecking ? (
              <span className="flex items-center gap-2 text-slate-300 font-medium">
                <RefreshCw className="w-4 h-4 animate-spin text-neon-cyan" />
                Consultando o GitHub por atualizações...
              </span>
            ) : updateResult ? (
              updateResult.hasUpdate ? (
                <div className="space-y-1">
                  <div className="font-bold text-neon-cyan flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Nova versão v{updateResult.latestVersion} disponível!
                  </div>
                  <div className="text-slate-400">Clique para abrir os detalhes e baixar o novo APK.</div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Você está na versão mais recente (v{CURRENT_APP_VERSION})!
                </div>
              )
            ) : (
              <div>
                O aplicativo verifica atualizações via <strong>GitHub Releases</strong>.
                Ao atualizar pelo APK baixado, seus dados e jogos salvos continuam intactos.
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {updateResult?.hasUpdate && (
              <button
                type="button"
                onClick={() => setShowUpdateModal(true)}
                className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gamer-950 text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Baixar v{updateResult.latestVersion}
              </button>
            )}

            <button
              type="button"
              onClick={handleCheckUpdate}
              disabled={updateChecking}
              className={`flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                isDeathNote
                  ? 'bg-death-950 border-death-crimson/40 hover:bg-death-crimson hover:text-white text-death-parchment'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
              } disabled:opacity-50`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${updateChecking ? 'animate-spin' : ''}`} />
              {updateChecking ? 'Verificando...' : 'Verificar Atualização'}
            </button>
          </div>
        </div>
      </section>

      <UpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        updateInfo={updateResult}
      />
    </div>
  );
};
