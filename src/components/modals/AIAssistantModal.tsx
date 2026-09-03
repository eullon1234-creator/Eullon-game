// src/components/modals/AIAssistantModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Sparkles, Bot, User, Trash2, RefreshCw, 
  Gamepad2, Zap, HelpCircle, Compass, Flame, Clock
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { groqService, ChatMessage } from '../../services/groqService';

const SUGGESTED_PROMPTS = [
  { icon: '🎲', label: 'O que devo jogar agora do meu backlog?' },
  { icon: '👾', label: 'Me recomende as 3 melhores joias do GBA!' },
  { icon: '⏱️', label: 'Qual jogo curto (<10h) você me recomenda?' },
  { icon: '🔥', label: 'Baseado nos meus jogos zerados, o que combina comigo?' },
];

export const AIAssistantModal: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, games, settings } = useGame();
  const isDeathNote = settings.theme === 'death-note';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'E aí, player! Sou o **Oráculo Gamer**, sua IA movida a velocidade pura no **Groq** ⚡. Conheço todos os jogos da sua biblioteca e os maiores clássicos dos videogames. Como posso te ajudar hoje?',
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

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Envia apenas o histórico da conversa (excluindo mensagens de sistema duplicadas)
      const chatHistory = updatedMessages.filter((m) => m.role === 'user' || m.role === 'assistant');
      const response = await groqService.chatWithAssistant(chatHistory, games, settings.groqApiKey);

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Ops, erro ao conectar com o Groq**: ${err.message || 'Tente novamente em instantes.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Histórico limpo! Pronto para uma nova partida. O que vamos explorar agora? 🎮',
      },
    ]);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) setIsAIAssistantOpen(false); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"
    >
      <div
        className={`relative w-full max-w-2xl h-[88vh] max-h-[720px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border animate-scaleIn ${
          isDeathNote
            ? 'bg-death-950/98 border-death-crimson/50 shadow-[0_0_50px_rgba(229,9,20,0.25)]'
            : 'bg-gamer-950/98 border-slate-700/80 shadow-[0_0_50px_rgba(0,242,254,0.15)]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isDeathNote ? 'border-red-950/80 bg-death-900/60' : 'border-slate-800 bg-gamer-900/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-md ${
                isDeathNote
                  ? 'bg-death-crimson/20 border-death-crimson/50 text-death-crimson'
                  : 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan'
              }`}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className={`text-base font-black text-white flex items-center gap-1.5 ${
                    isDeathNote ? 'font-deathnote text-lg tracking-wider' : ''
                  }`}
                >
                  <span>Oráculo Gamer</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-current" />
                    Groq Ultra-Fast
                  </span>
                </h2>
              </div>
              <p className="text-[11px] text-slate-400">
                IA especialista conectada à sua biblioteca pessoal ({games.length} jogos)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearHistory}
              title="Limpar conversa"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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
                  <div
                    className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold border mt-0.5 ${
                      isDeathNote
                        ? 'bg-death-crimson/20 border-death-crimson/50 text-death-crimson'
                        : 'bg-neon-cyan/20 border-neon-cyan/40 text-neon-cyan'
                    }`}
                  >
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed border ${
                    isBot
                      ? isDeathNote
                        ? 'bg-death-900/90 border-red-950/80 text-slate-200'
                        : 'bg-gamer-900/90 border-slate-800 text-slate-200 shadow-sm'
                      : isDeathNote
                        ? 'bg-death-crimson text-white border-death-crimson/80 shadow-glow-crimson font-medium'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-gamer-950 border-cyan-400/50 font-semibold shadow-glow-cyan'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-xs bg-slate-800 border border-slate-700 text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse pl-10">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-semibold text-neon-cyan">Oráculo Gamer pensando em velocidade LPU...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-gamer-900/30 overflow-x-auto scrollbar-none flex items-center gap-2">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(prompt.label)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isDeathNote
                  ? 'bg-death-900/80 border-red-950 text-death-smoke hover:text-white hover:border-death-crimson/50'
                  : 'bg-gamer-850/90 border-slate-800 text-slate-300 hover:text-white hover:border-neon-cyan/50 hover:bg-gamer-800'
              }`}
            >
              <span>{prompt.icon}</span>
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div
          className={`p-3 sm:p-4 border-t ${
            isDeathNote ? 'border-red-950/80 bg-death-900/90' : 'border-slate-800 bg-gamer-900/90'
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre seus jogos, recomendações, dicas ou curiosidades..."
              className={`flex-1 px-4 py-3 rounded-2xl border text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                isDeathNote
                  ? 'bg-death-950 border-red-950/80 focus:border-death-crimson focus:shadow-glow-crimson'
                  : 'bg-gamer-850 border-slate-700/80 focus:border-neon-cyan focus:shadow-glow-cyan'
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
                    : 'bg-gradient-to-r from-neon-cyan to-blue-600 text-gamer-950 hover:brightness-110 shadow-glow-cyan'
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
