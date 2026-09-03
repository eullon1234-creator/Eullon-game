// src/services/speechService.ts

// Declaração de tipos para navegadores que suportam SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

/**
 * Remove formatação Markdown (negrito, links, asteriscos, código) para leitura limpa por voz.
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
    .replace(/[>_~]/g, '')
    .trim();
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
   * Faz o J.A.R.V.I.S. falar um texto em voz alta.
   */
  speak(text: string, onStart?: () => void, onEnd?: () => void): void {
    if (!this.hasSpeechSynthesis()) return;

    this.stopSpeaking();

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05; // ritmo fluente e articulado
    utterance.pitch = 0.95; // tom ligeiramente grave e elegante

    // Busca vozes disponíveis para priorizar voz em português de alta qualidade
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.includes('pt-BR') || v.lang.includes('pt_BR') || v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = (e) => {
      console.warn('Erro na síntese de voz do JARVIS:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
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
   * Inicia a escuta pelo microfone para comandos de voz do usuário.
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

  /**
   * Para a escuta do microfone.
   */
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
