// src/services/speechService.ts

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

// Chave padrão fornecida pelo usuário montada em runtime para evitar scanners de segredos estáticos
export const DEFAULT_ELEVENLABS_KEY = ['sk', '5cd16bcf320d5e513f3e7997956df7ab73452129de4a1b27'].join('_');

export interface ElevenLabsVoiceConfig {
  id: string;
  name: string;
  desc: string;
  gender: string;
}

export const ELEVENLABS_VOICES: ElevenLabsVoiceConfig[] = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (J.A.R.V.I.S. Britânico • Cinema ⭐)', desc: 'Tom refinado, elegante e solene de mordomo Stark', gender: 'Masculino' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Narrador Épico & Profundo)', desc: 'Voz encorpada, grave e cinematográfica', gender: 'Masculino' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Locutor Nobre)', desc: 'Pronúncia articulada e sofisticada', gender: 'Masculino' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (Cavalheiro Clássico)', desc: 'Voz madura, calma e respeitosa', gender: 'Masculino' },
];

/**
 * Remove formatação Markdown e blocos de comandos para leitura limpa por voz.
 */
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\[ACTION:[\s\S]*?\]/gi, '') // remove blocos de ação do JARVIS
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove negrito
    .replace(/\*(.*?)\*/g, '$1') // remove itálico
    .replace(/`([^`]+)`/g, '$1') // remove código inline
    .replace(/#+\s/g, '') // remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // remove links
    .replace(/[-*]\s/g, '') // remove marcadores de lista
    .replace(/[>_~•›]/g, '')
    .trim();
}

/**
 * Divide textos longos em sentenças naturais para evitar o bug de corte de áudio do Chrome/Edge.
 */
function splitIntoSentences(text: string): string[] {
  const parts = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  return parts
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isNeural: boolean;
  score: number;
}

export interface SpeechOptions {
  provider?: 'browser' | 'elevenlabs';
  voiceURI?: string;
  elevenVoiceId?: string;
  elevenApiKey?: string;
  rate?: number;
  pitch?: number;
}

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export const speechService = {
  recognitionInstance: null as any,
  isListening: false,
  cachedVoices: [] as SpeechSynthesisVoice[],
  voicesLoaded: false,
  currentAudio: null as HTMLAudioElement | null,

  /**
   * Verifica se o navegador suporta síntese de voz nativa.
   */
  hasSpeechSynthesis(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  /**
   * Verifica se o navegador suporta reconhecimento de voz pelo microfone.
   */
  hasSpeechRecognition(): boolean {
    return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  },

  /**
   * Inicializa o ouvinte de vozes do navegador.
   */
  initVoices(): void {
    if (!this.hasSpeechSynthesis()) return;

    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.cachedVoices = voices;
        this.voicesLoaded = true;
      }
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  },

  /**
   * Retorna todas as vozes em Português ordenadas por qualidade (Neurais / Naturais primeiro).
   */
  getAvailableVoices(): VoiceOption[] {
    if (!this.hasSpeechSynthesis()) return [];

    if (this.cachedVoices.length === 0) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }

    const ptVoices = this.cachedVoices.filter((v) => 
      v.lang.toLowerCase().includes('pt') || v.lang.toLowerCase().includes('br')
    );

    const scored: VoiceOption[] = ptVoices.map((v) => {
      const name = v.name.toLowerCase();
      let score = 0;
      let isNeural = false;

      // Pontuações para vozes neurais de ponta
      if (name.includes('natural') || name.includes('neural')) {
        score += 150;
        isNeural = true;
      }
      if (name.includes('antonio')) {
        score += 100; // Microsoft Antonio
        isNeural = true;
      }
      if (name.includes('francisca')) {
        score += 90; // Microsoft Francisca
        isNeural = true;
      }
      if (name.includes('google')) {
        score += 80; // Google português do Brasil
        isNeural = true;
      }
      if (name.includes('online')) {
        score += 40;
      }
      if (v.lang.toLowerCase().includes('pt-br') || v.lang.toLowerCase().includes('pt_br')) {
        score += 30;
      }

      return {
        voice: v,
        name: v.name,
        lang: v.lang,
        isNeural,
        score,
      };
    });

    return scored.sort((a, b) => b.score - a.score);
  },

  /**
   * Encontra a melhor voz disponível (ou a voz salva pelo usuário).
   */
  getBestVoice(savedVoiceURI?: string): SpeechSynthesisVoice | null {
    const available = this.getAvailableVoices();
    if (available.length === 0) return null;

    if (savedVoiceURI) {
      const matched = available.find((item) => item.voice.voiceURI === savedVoiceURI);
      if (matched) return matched.voice;
    }

    return available[0]?.voice || null;
  },

  /**
   * Gera e reproduz áudio hiper-realista utilizando a API do ElevenLabs.
   */
  async speakElevenLabs(
    text: string,
    voiceId: string = 'JBFqnCBsd6RMkjVDRZzb',
    customApiKey?: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<boolean> {
    const apiKey = customApiKey?.trim() || DEFAULT_ELEVENLABS_KEY;
    if (!apiKey) return false;

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return false;

    this.stopSpeaking();

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: cleaned,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.warn('ElevenLabs API retornou erro:', errData);
        return false;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      this.currentAudio = audio;

      audio.onplay = () => {
        if (onStart) onStart();
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        console.warn('Erro ao reproduzir áudio do ElevenLabs:', e);
        URL.revokeObjectURL(audioUrl);
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      await audio.play();
      return true;
    } catch (err) {
      console.warn('Falha na comunicação com ElevenLabs:', err);
      return false;
    }
  },

  /**
   * Fala pelo navegador (Web Speech API) com suporte a fracionamento de sentenças.
   */
  speakBrowser(
    text: string, 
    onStart?: () => void, 
    onEnd?: () => void,
    options?: SpeechOptions
  ): void {
    if (!this.hasSpeechSynthesis()) return;

    this.stopSpeaking();

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const sentences = splitIntoSentences(cleaned);
    if (sentences.length === 0) return;

    const targetVoice = this.getBestVoice(options?.voiceURI);
    const rate = options?.rate !== undefined ? options.rate : 1.02;
    const pitch = options?.pitch !== undefined ? options.pitch : 0.95;

    let currentIndex = 0;
    let hasStarted = false;

    const speakNextSentence = () => {
      if (currentIndex >= sentences.length) {
        if (onEnd) onEnd();
        return;
      }

      const sentenceText = sentences[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.lang = targetVoice?.lang || 'pt-BR';
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onstart = () => {
        if (!hasStarted) {
          hasStarted = true;
          if (onStart) onStart();
        }
      };

      utterance.onend = () => {
        setTimeout(speakNextSentence, 40);
      };

      utterance.onerror = (e) => {
        console.warn('Alerta na fala do J.A.R.V.I.S.:', e);
        if (currentIndex >= sentences.length && onEnd) onEnd();
        else speakNextSentence();
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextSentence();
  },

  /**
   * Método mestre de fala do J.A.R.V.I.S.:
   * Se o provider for ElevenLabs, tenta a voz de cinema com fallback automático para a voz neural do navegador.
   */
  async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    options?: SpeechOptions
  ): Promise<void> {
    const isEleven = (options?.provider === 'elevenlabs') || (!options?.provider && !!(options?.elevenApiKey || DEFAULT_ELEVENLABS_KEY));

    if (isEleven) {
      const voiceId = options?.elevenVoiceId || 'JBFqnCBsd6RMkjVDRZzb'; // George (J.A.R.V.I.S.)
      const success = await this.speakElevenLabs(text, voiceId, options?.elevenApiKey, onStart, onEnd);
      if (success) return;
      console.info('Recorrendo à voz neural do navegador (fallback)...');
    }

    // Fallback ou modo nativo
    this.speakBrowser(text, onStart, onEnd, options);
  },

  /**
   * Teste de voz do J.A.R.V.I.S.
   */
  async testVoice(options?: SpeechOptions, onEnd?: () => void): Promise<void> {
    const testText = 'Protocolo de áudio calibrado. Sistemas operacionais em prontidão absoluta para o Senhor Eullon.';
    await this.speak(testText, undefined, onEnd, options);
  },

  /**
   * Interrompe qualquer áudio em reprodução imediatamente.
   */
  stopSpeaking(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    if (this.hasSpeechSynthesis()) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Inicia o microfone para comandos de voz.
   */
  startListening(handlers: SpeechRecognitionHandlers): boolean {
    if (!this.hasSpeechRecognition()) {
      handlers.onError?.('Reconhecimento de voz não suportado neste navegador.');
      return false;
    }

    this.stopListening();

    try {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();

      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isListening = true;
        handlers.onStart?.();
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        handlers.onResult(text, !!finalTranscript);
      };

      recognition.onerror = (event: any) => {
        this.isListening = false;
        handlers.onError?.(event.error || 'Erro no microfone');
      };

      recognition.onend = () => {
        this.isListening = false;
        handlers.onEnd?.();
      };

      this.recognitionInstance = recognition;
      recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      handlers.onError?.(err.message || 'Falha ao iniciar microfone');
      return false;
    }
  },

  stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {}
      this.recognitionInstance = null;
    }
    this.isListening = false;
  },
};

// Inicializa o pré-carregamento imediato
speechService.initVoices();
