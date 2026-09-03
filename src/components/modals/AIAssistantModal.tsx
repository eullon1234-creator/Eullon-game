// src/components/modals/AIAssistantModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Trash2, Mic, MicOff, Volume2, VolumeX, 
  Zap, Shield, Terminal, CheckCircle2, Sparkles, Activity, SlidersHorizontal, Play
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import { groqService, ChatMessage, JarvisAction } from '../../services/groqService';
import { speechService, VoiceOption, ELEVENLABS_VOICES } from '../../services/speechService';
import { ArcReactor } from '../common/ArcReactor';
import { CURATED_GAMES } from '../../data/curatedGames';

const JARVIS_QUICK_COMMANDS = [
  { icon: '📊', label: 'J.A.R.V.I.S., forneça um briefing tático do meu backlog.' },
  { icon: '👾', label: 'J.A.R.V.I.S., quais são os 3 melhores clássicos de GBA para hoje?' },
  { icon: '⚡', label: 'J.A.R.V.I.S., qual a rota mais rápida para zerar meu próximo jogo?' },
  { icon: '🎮', label: 'J.A.R.V.I.S., mostre apenas os meus jogos de GBA na biblioteca.' },
];

export const AIAssistantModal: React.FC = () => {
  const { 
    isAIAssistantOpen, 
    setIsAIAssistantOpen, 
    games, 
    settings,
    quickChangeStatus,
    quickToggleFavorite,
    updateSettings,
    setActiveTab,
    filters,
    setFilters,
    addGame
  } = useGame();
  
  const { showToast } = useToast();
  const isDeathNote = settings.theme === 'death-note';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [lastExecutedAction, setLastExecutedAction] = useState<string | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [testingVoice, setTestingVoice] = useState(false);

  // Carrega vozes neurais assim que o modal abre ou vozes são detectadas
  useEffect(() => {
    if (isAIAssistantOpen) {
      const load = () => {
        setAvailableVoices(speechService.getAvailableVoices());
      };
      load();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }, [isAIAssistantOpen]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Às suas ordens, **Senhor Eullon**. Todos os sistemas operacionais do seu centro de comando gamer estão em 100%. Posso analisar seu backlog, recomendar sua próxima conquista ou executar comandos operacionais no sistema. Como posso servi-lo hoje?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIAssistantOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      speechService.stopSpeaking();
      speechService.stopListening();
      setIsSpeaking(false);
      setIsListening(false);
    }
  }, [isAIAssistantOpen, messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAIAssistantOpen) {
        setIsAIAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAIAssistantOpen]);

  if (!isAIAssistantOpen) return null;

  /**
   * Executa uma ação ordenada pelo J.A.R.V.I.S. no ecossistema do app.
   */
  const executeJarvisAction = (action: JarvisAction) => {
    try {
      if (action.type === 'CHANGE_STATUS') {
        const query = action.gameTitle?.toLowerCase().trim() || '';
        let targetGame = games.find((g) => g.title.toLowerCase().includes(query) || query.includes(g.title.toLowerCase()));

        if (!targetGame) {
          // Procura no catálogo curado para adicionar automaticamente
          const curatedMatch = CURATED_GAMES.find((g) => g.title.toLowerCase().includes(query) || query.includes(g.title.toLowerCase()));
          if (curatedMatch) {
            targetGame = addGame({
              title: curatedMatch.title,
              platform: curatedMatch.platform,
              status: action.status || 'playing',
              coverUrl: curatedMatch.coverUrl,
              rating: action.rating || curatedMatch.rating,
              notes: curatedMatch.description || '',
              favorite: false,
              timeToBeat: curatedMatch.timeToBeat,
            });
          }
        }

        if (targetGame && action.status) {
          quickChangeStatus(targetGame.id, action.status);
          showToast(`⚡ J.A.R.V.I.S.: ${targetGame.title} definido como ${action.status.toUpperCase()}`, 'success');
          setLastExecutedAction(`Protocolo: "${targetGame.title}" marcado como ${action.status.toUpperCase()}`);
        }
      } else if (action.type === 'TOGGLE_FAVORITE') {
        const query = action.gameTitle?.toLowerCase().trim() || '';
        const targetGame = games.find((g) => g.title.toLowerCase().includes(query) || query.includes(g.title.toLowerCase()));
        if (targetGame) {
          quickToggleFavorite(targetGame.id);
          showToast(`⚡ J.A.R.V.I.S.: Favorito de "${targetGame.title}" alternado`, 'success');
          setLastExecutedAction(`Protocolo: Favorito de "${targetGame.title}" alternado`);
        }
      } else if (action.type === 'SET_THEME') {
        if (action.theme) {
          updateSettings({ theme: action.theme });
          showToast(`⚡ J.A.R.V.I.S.: Interface alterada para ${action.theme.toUpperCase()}`, 'info');
          setLastExecutedAction(`Protocolo: Tema alterado para ${action.theme.toUpperCase()}`);
        }
      } else if (action.type === 'NAVIGATE') {
        if (action.tab) {
          setActiveTab(action.tab as any);
          showToast(`⚡ J.A.R.V.I.S.: Navegando para ${action.tab.toUpperCase()}`, 'info');
          setLastExecutedAction(`Protocolo: Aba alterada para ${action.tab.toUpperCase()}`);
        }
      } else if (action.type === 'FILTER') {
        if (action.platform) {
          setFilters({ ...filters, platform: action.platform });
          setActiveTab('library');
          showToast(`⚡ J.A.R.V.I.S.: Filtro de plataforma "${action.platform}" ativado`, 'info');
          setLastExecutedAction(`Protocolo: Filtro de plataforma "${action.platform}" aplicado`);
        }
      }
    } catch (err) {
      console.warn('Falha ao executar ação de comando do J.A.R.V.I.S.:', err);
    }
  };

  /**
   * Envia uma mensagem para o J.A.R.V.I.S. e orquestra a resposta por texto, voz e execução de comandos.
   */
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    speechService.stopSpeaking();
    setIsSpeaking(false);

    const userMsg: ChatMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = updatedMessages.filter((m) => m.role === 'user' || m.role === 'assistant');
      const rawResponse = await groqService.chatWithAssistant(chatHistory, games, settings.groqApiKey);

      // Interpreta se há ação de comando no sistema
      const { message: cleanMessage, action } = groqService.parseJarvisResponse(rawResponse);

      if (action) {
        executeJarvisAction(action);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: cleanMessage }]);

      // Falar a resposta em voz alta se voz estiver ativada
      if (voiceEnabled) {
        speechService.speak(
          cleanMessage,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false),
          {
            provider: settings.voiceProvider || 'elevenlabs',
            voiceURI: settings.jarvisVoiceURI,
            elevenVoiceId: settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb',
            elevenApiKey: settings.elevenLabsApiKey,
            rate: settings.jarvisVoiceRate,
            pitch: settings.jarvisVoicePitch,
          }
        );
      }
    } catch (err: any) {
      const errorMessage = `Senhor Eullon, nossos canais de telemetria com o Groq apresentaram uma oscilação temporária: ${err.message || 'Verifique a conexão.'}`;
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage }]);

      if (voiceEnabled) {
        speechService.speak(
          errorMessage,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false),
          {
            provider: settings.voiceProvider || 'elevenlabs',
            voiceURI: settings.jarvisVoiceURI,
            elevenVoiceId: settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb',
            elevenApiKey: settings.elevenLabsApiKey,
            rate: settings.jarvisVoiceRate,
            pitch: settings.jarvisVoicePitch,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alterna a escuta pelo microfone.
   */
  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    speechService.stopSpeaking();
    setIsSpeaking(false);

    const started = speechService.startListening({
      onStart: () => setIsListening(true),
      onResult: (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal && transcript.trim()) {
          setIsListening(false);
          handleSendMessage(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        showToast(`Microfone: ${err}`, 'error');
      },
      onEnd: () => setIsListening(false),
    });

    if (!started) {
      showToast('Reconhecimento de voz indisponível no navegador.', 'warning');
    }
  };

  const handleToggleVoice = () => {
    if (voiceEnabled) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      setVoiceEnabled(false);
      showToast('Voz do J.A.R.V.I.S. desativada.', 'info');
    } else {
      setVoiceEnabled(true);
      showToast('Voz do J.A.R.V.I.S. ativada.', 'success');
      speechService.speak(
        'Sistemas de voz reativados, Senhor Eullon.',
        undefined,
        undefined,
        {
          provider: settings.voiceProvider || 'elevenlabs',
          voiceURI: settings.jarvisVoiceURI,
          elevenVoiceId: settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb',
          elevenApiKey: settings.elevenLabsApiKey,
          rate: settings.jarvisVoiceRate,
          pitch: settings.jarvisVoicePitch,
        }
      );
    }
  };

  const handleTestVoice = () => {
    if (testingVoice) return;
    setTestingVoice(true);
    speechService.testVoice(
      {
        provider: settings.voiceProvider || 'elevenlabs',
        voiceURI: settings.jarvisVoiceURI,
        elevenVoiceId: settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb',
        elevenApiKey: settings.elevenLabsApiKey,
        rate: settings.jarvisVoiceRate,
        pitch: settings.jarvisVoicePitch,
      },
      () => setTestingVoice(false)
    );
  };

  const handleClearHistory = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setLastExecutedAction(null);
    setMessages([
      {
        role: 'assistant',
        content: 'Registros de telemetria limpos. Canal seguro redefinido para novas ordens, Senhor Eullon. ⚡',
      },
    ]);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) setIsAIAssistantOpen(false); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl safe-top safe-bottom animate-fadeIn"
    >
      <div
        className={`relative w-full max-w-2xl h-[94vh] sm:h-[88vh] max-h-[750px] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border animate-scaleIn ${
          isDeathNote
            ? 'bg-death-950/98 border-death-crimson/50 shadow-[0_0_60px_rgba(229,9,20,0.3)]'
            : 'bg-gamer-950/98 border-cyan-500/40 shadow-[0_0_60px_rgba(0,242,254,0.2)]'
        }`}
      >
        {/* Top Header • Stark Industries HUD */}
        <div
          className={`flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 border-b backdrop-blur-md flex-shrink-0 ${
            isDeathNote ? 'border-red-950/80 bg-death-900/80' : 'border-cyan-900/50 bg-gamer-900/80'
          }`}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ArcReactor size="md" pulse={isSpeaking || isListening} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white flex items-center gap-2 tracking-wide">
                  <span className="font-mono text-cyan-400">J.A.R.V.I.S.</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-pulse text-cyan-400" />
                    PROTOCOLO STARK
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE • A serviço exclusivo do Senhor Eullon</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Calibração de Voz Neural */}
            <button
              type="button"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              title="Calibrar voz neural do J.A.R.V.I.S."
              className={`p-2 rounded-xl border transition-all ${
                showVoiceSettings
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                  : 'p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Toggle Voz Falada */}
            <button
              type="button"
              onClick={handleToggleVoice}
              title={voiceEnabled ? 'Voz ativada (clique para mutar)' : 'Voz mutada (clique para ativar)'}
              className={`p-2 rounded-xl border transition-all ${
                voiceEnabled
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500'
              }`}
            >
              {voiceEnabled ? (
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-cyan-400' : ''}`} />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Limpar Histórico */}
            <button
              type="button"
              onClick={handleClearHistory}
              title="Limpar telemetria"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Fechar */}
            <button
              type="button"
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Painel Expansível de Calibração de Voz Neural */}
        {showVoiceSettings && (
          <div className="px-5 py-4 bg-gamer-950/98 border-b border-cyan-500/30 space-y-3.5 animate-fadeIn font-sans text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Calibração de Voz do J.A.R.V.I.S.</span>
              </span>
              <button
                type="button"
                onClick={() => setShowVoiceSettings(false)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                Concluir
              </button>
            </div>

            {/* Alternador de Motor de Voz (ElevenLabs vs Navegador) */}
            <div className="flex items-center gap-2 p-1 bg-gamer-900/90 rounded-2xl border border-slate-800">
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
              /* Configuração do ElevenLabs */
              <div className="space-y-2.5 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block text-[11px]">
                    Voz de Estúdio do J.A.R.V.I.S. (ElevenLabs):
                  </label>
                  <select
                    value={settings.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb'}
                    onChange={(e) => updateSettings({ elevenLabsVoiceId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gamer-900 border border-cyan-500/40 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    {ELEVENLABS_VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400">
                  ⚡ Conectado à sua conta ElevenLabs (10.000 caracteres mensais gratuitos com voz real de Hollywood).
                </p>
              </div>
            ) : (
              /* Configuração do Navegador */
              <div className="space-y-3 animate-fadeIn">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block text-[11px]">
                    Voz Neural Detectada no Navegador:
                  </label>
                  <select
                    value={settings.jarvisVoiceURI || ''}
                    onChange={(e) => updateSettings({ jarvisVoiceURI: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-gamer-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans"
                  >
                    {availableVoices.length === 0 ? (
                      <option value="">Voz padrão do sistema</option>
                    ) : (
                      availableVoices.map((item, idx) => (
                        <option key={idx} value={item.voice.voiceURI}>
                          {item.isNeural ? '⭐ [NEURAL] ' : ''}{item.name} ({item.lang})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block text-[11px]">
                      Cadência / Velocidade:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[
                        { label: 'Ponderado', val: 0.92 },
                        { label: 'Padrão', val: 1.02 },
                        { label: 'Ágil', val: 1.15 },
                      ].map((preset) => {
                        const currentRate = settings.jarvisVoiceRate !== undefined ? settings.jarvisVoiceRate : 1.02;
                        const isSelected = Math.abs(currentRate - preset.val) < 0.05;
                        return (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => updateSettings({ jarvisVoiceRate: preset.val })}
                            className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                                : 'bg-gamer-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block text-[11px]">
                      Timbre do J.A.R.V.I.S.:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[
                        { label: 'Grave Stark', val: 0.90 },
                        { label: 'Natural', val: 0.98 },
                        { label: 'Claro', val: 1.05 },
                      ].map((preset) => {
                        const currentPitch = settings.jarvisVoicePitch !== undefined ? settings.jarvisVoicePitch : 0.95;
                        const isSelected = Math.abs(currentPitch - preset.val) < 0.05;
                        return (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => updateSettings({ jarvisVoicePitch: preset.val })}
                            className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                                : 'bg-gamer-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Teste */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <p className="text-[10px] text-slate-400">
                {settings.voiceProvider !== 'browser'
                  ? '🎙️ Reproduzindo via síntese neural ElevenLabs em alta definição.'
                  : '💡 Vozes neurais locais com zero consumo de dados.'}
              </p>
              <button
                type="button"
                disabled={testingVoice}
                onClick={handleTestVoice}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-gamer-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{testingVoice ? 'Falando...' : 'Testar Voz'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Notificação de Ação Executada em Tempo Real */}
        {lastExecutedAction && (
          <div className="px-4 py-1.5 bg-gradient-to-r from-cyan-950/80 via-blue-950/80 to-gamer-950 border-b border-cyan-500/30 flex items-center justify-between text-xs text-cyan-300 font-mono animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{lastExecutedAction}</span>
            </div>
            <button
              type="button"
              onClick={() => setLastExecutedAction(null)}
              className="text-[10px] text-cyan-400/70 hover:text-cyan-200"
            >
              dispensar
            </button>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
          {messages.map((msg, index) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={index}
                className={`flex gap-3 animate-fadeIn ${isBot ? 'items-start' : 'items-end justify-end'}`}
              >
                {isBot && (
                  <div className="shrink-0 mt-0.5">
                    <ArcReactor size="sm" pulse={isSpeaking && index === messages.length - 1} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed border ${
                    isBot
                      ? isDeathNote
                        ? 'bg-death-900/90 border-red-950/80 text-slate-200 shadow-sm'
                        : 'bg-gamer-900/95 border-cyan-900/50 text-slate-200 shadow-[0_2px_12px_rgba(0,242,254,0.05)]'
                      : isDeathNote
                        ? 'bg-death-crimson text-white border-death-crimson/80 shadow-glow-crimson font-medium'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gamer-950 border-cyan-300/50 font-semibold shadow-glow-cyan'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs bg-slate-800 border border-slate-700 text-slate-300">
                    <span className="font-mono font-bold text-[10px] text-cyan-400">SE</span>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse pl-9">
              <ArcReactor size="sm" pulse />
              <div className="flex items-center gap-1.5 font-mono text-cyan-400">
                <span>J.A.R.V.I.S. processando telemetria em LPU...</span>
              </div>
            </div>
          )}

          {isSpeaking && (
            <div className="flex gap-2 items-center text-[11px] text-cyan-300 font-mono pl-9 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>J.A.R.V.I.S. falando...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Protocol Commands */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-gamer-900/40 overflow-x-auto scrollbar-none flex items-center gap-2">
          {JARVIS_QUICK_COMMANDS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading || isListening}
              onClick={() => handleSendMessage(prompt.label)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isDeathNote
                  ? 'bg-death-900/80 border-red-950 text-death-smoke hover:text-white hover:border-death-crimson/50'
                  : 'bg-gamer-850/90 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-gamer-800'
              }`}
            >
              <span>{prompt.icon}</span>
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Input Field & Microphone */}
        <div
          className={`p-2.5 sm:p-4 border-t flex-shrink-0 ${
            isDeathNote ? 'border-red-950/80 bg-death-900/90' : 'border-cyan-950/80 bg-gamer-900/95'
          }`}
        >
          {isListening && (
            <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between font-mono animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>Ouvindo sua voz, Senhor Eullon... (Fale seu comando)</span>
              </div>
              <button
                type="button"
                onClick={handleToggleListening}
                className="text-[10px] underline hover:text-white"
              >
                Parar
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Botão de Microfone / Comando de Voz */}
            <button
              type="button"
              onClick={handleToggleListening}
              title={isListening ? 'Parar gravação' : 'Falar com J.A.R.V.I.S. por voz'}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                  : 'bg-gamer-800 hover:bg-gamer-750 text-cyan-400 border-cyan-500/40 hover:border-cyan-400 shadow-glow-cyan'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Ouvindo...' : 'Comande o J.A.R.V.I.S. por texto ou use o microfone...'}
              className={`flex-1 px-4 py-3 rounded-2xl border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-sans ${
                isDeathNote
                  ? 'bg-death-950 border-red-950/80 focus:border-death-crimson focus:shadow-glow-crimson'
                  : 'bg-gamer-850 border-slate-700/80 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,242,254,0.25)]'
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md shrink-0 ${
                !input.trim() || loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : isDeathNote
                    ? 'bg-death-crimson text-white hover:brightness-110 shadow-glow-crimson'
                    : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-gamer-950 font-black hover:brightness-110 shadow-glow-cyan'
              }`}
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline text-xs">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
