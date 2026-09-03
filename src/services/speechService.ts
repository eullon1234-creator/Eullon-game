// src/services/speechService.ts

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

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
  voiceURI?: string;
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

  /**
   * Verifica se o navegador suporta síntese de voz.
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
        score += 100; // Microsoft Antonio (voz masculina brasileira clássica de narrador)
        isNeural = true;
      }
      if (name.includes('francisca')) {
        score += 90; // Microsoft Francisca (voz feminina neural brasileira)
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

    // Ordena da maior pontuação para a menor
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

    // Retorna a melhor voz ranqueada (com maior probabilidade de ser Neural/Natural)
    return available[0]?.voice || null;
  },

  /**
   * Faz o J.A.R.V.I.S. falar com dicção humana e controle de frases em sequência.
   */
  speak(
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
    const rate = options?.rate !== undefined ? options.rate : 1.02; // cadência natural
    const pitch = options?.pitch !== undefined ? options.pitch : 0.95; // tom refinado J.A.R.V.I.S.

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
        // Pausa sutil entre sentenças para soar como respiração humana
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
   * Teste rápido de calibração de voz do J.A.R.V.I.S.
   */
  testVoice(options?: SpeechOptions, onEnd?: () => void): void {
    const testText = 'Protocolo de voz calibrado. Sistemas operacionais em prontidão para o Senhor Eullon.';
    this.speak(testText, undefined, onEnd, options);
  },

  /**
   * Interrompe a fala imediatamente.
   */
  stopSpeaking(): void {
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
