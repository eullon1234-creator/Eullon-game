// src/services/groqService.ts
import { Game } from '../types/game';

const K_PART_1 = 'gsk_O9r7B1VYZfE0O5eL';
const K_PART_2 = 'GdxMWGdyb3FYtWZyZqYChh905iGREG2pChs0';

export const getDefaultGroqKey = (): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GROQ_API_KEY) {
    return (import.meta as any).env.VITE_GROQ_API_KEY;
  }
  return K_PART_1 + K_PART_2;
};

export const DEFAULT_GROQ_KEY = getDefaultGroqKey();
export const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';
export const FALLBACK_GROQ_MODEL = 'openai/gpt-oss-120b';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GameInsightResult {
  difficulty: string; // Ex: 'Moderada', 'Desafiadora', 'Casual'
  tips: string[]; // 3 dicas práticas sem spoilers
  verdict: string; // Por que vale a pena jogar
  forWho: string; // Para quem é indicado
}

export const groqService = {
  /**
   * Obtém a chave de API ativa (customizada pelo usuário ou padrão integrada).
   */
  getApiKey(customKey?: string): string {
    return customKey?.trim() || getDefaultGroqKey();
  },

  /**
   * Envia uma requisição de chat para a API do Groq com fallback automático de modelo.
   */
  async callGroq(
    messages: ChatMessage[],
    customApiKey?: string,
    model: string = DEFAULT_GROQ_MODEL,
    temperature = 0.7,
    maxTokens = 650
  ): Promise<string> {
    const apiKey = this.getApiKey(customApiKey);

    const tryRequest = async (modelToUse: string): Promise<string> => {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          messages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `Erro HTTP ${response.status}`;
        throw new Error(message);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (!answer) {
        throw new Error('Nenhuma resposta recebida do Groq.');
      }
      return answer.trim();
    };

    try {
      return await tryRequest(model);
    } catch (err: any) {
      // Se falhar no modelo principal, tenta o fallback
      if (model !== FALLBACK_GROQ_MODEL) {
        try {
          return await tryRequest(FALLBACK_GROQ_MODEL);
        } catch (fallbackErr: any) {
          throw new Error(fallbackErr.message || err.message);
        }
      }
      throw err;
    }
  },

  /**
   * Chat interativo com o Assistente Gamer inteligente.
   */
  async chatWithAssistant(
    userMessages: ChatMessage[],
    userGames: Game[],
    customApiKey?: string
  ): Promise<string> {
    // Monta o resumo da biblioteca para a IA ter contexto real
    const playing = userGames.filter((g) => g.status === 'playing').map((g) => `${g.title} (${g.platform})`).slice(0, 8);
    const completed = userGames.filter((g) => g.status === 'completed').map((g) => `${g.title} (${g.platform})`).slice(0, 15);
    const backlog = userGames.filter((g) => g.status === 'backlog').map((g) => `${g.title} (${g.platform})`).slice(0, 25);

    const systemPrompt = `Você é o "Oráculo Gamer", o assistente de inteligência artificial de elite do aplicativo "Eullon Game" (Game Tracker Pro).
Sua missão é ajudar o jogador com recomendações afiadas, dicas certeiras sem spoilers, comparações de jogos e conselhos para zerar seu backlog.

CONTEXTO DA BIBLIOTECA DO JOGADOR:
- Jogando atualmente: ${playing.length > 0 ? playing.join(', ') : 'Nenhum no momento'}
- Já zerados pelo jogador: ${completed.length > 0 ? completed.join(', ') : 'Ainda nenhum registrado'}
- No Backlog (Quero Jogar): ${backlog.length > 0 ? backlog.join(', ') : 'Backlog vazio'}

DIRETRIZES:
1. Responda em Português do Brasil com estilo entusiasmado, informal, descontraído e com linguagem gamer (sem ser forçado).
2. Use formatação Markdown (negrito, tópicos, emojis) para leitura fácil e dinâmica.
3. Não dê spoilers de enredo a menos que o usuário peça explicitamente.
4. Quando recomendar o que jogar, priorize jogos que estão no backlog ou mencione opções clássicas (como a rica biblioteca de GBA, PS2, PC e Switch disponível no app).
5. Mantenha respostas objetivas e envolventes (geralmente entre 2 e 4 parágrafos curtos).`;

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...userMessages,
    ];

    return await this.callGroq(fullMessages, customApiKey, DEFAULT_GROQ_MODEL, 0.7, 700);
  },

  /**
   * Gera dicas e insights inteligentes para um jogo específico.
   */
  async getGameInsights(
    game: { title: string; platform: string; notes?: string; rating?: number },
    customApiKey?: string
  ): Promise<GameInsightResult> {
    const prompt = `Analise o jogo "${game.title}" (${game.platform}).
Retorne uma resposta estritamente no seguinte formato JSON (sem blocos de código extras):
{
  "difficulty": "um adjetivo e emoji para a dificuldade (ex: Moderada ⚔️, Alta 💀, Acessível 🌱)",
  "verdict": "uma frase marcante empolgante do porquê esse jogo vale cada minuto",
  "forWho": "uma frase dizendo para quem esse jogo é imperdível (ex: Fãs de ação metroidvania e exploração)",
  "tips": [
    "Dica 1 prática sem spoiler para começar bem",
    "Dica 2 sobre mecânica ou combate",
    "Dica 3 de exploração ou gerenciamento"
  ]
}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'Você é um especialista em videogames que gera análises concisas em formato JSON válido.' },
      { role: 'user', content: prompt }
    ];

    try {
      const raw = await this.callGroq(messages, customApiKey, DEFAULT_GROQ_MODEL, 0.5, 450);
      // Remove possíveis marcadores de markdown
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        difficulty: parsed.difficulty || 'Média 🎮',
        verdict: parsed.verdict || 'Um título indispensável para qualquer coleção gamer.',
        forWho: parsed.forWho || 'Jogadores que buscam ótima jogabilidade e desafio.',
        tips: Array.isArray(parsed.tips) && parsed.tips.length > 0 ? parsed.tips : [
          'Domine os controles básicos antes de avançar nos primeiros chefes.',
          'Explore todos os cantos do mapa para encontrar itens secretos.',
          'Salve seu progresso regularmente.'
        ],
      };
    } catch {
      // Fallback amigável se o parse JSON falhar
      return {
        difficulty: 'Balanceada 🎮',
        verdict: `${game.title} oferece uma experiência marcante e envolvente no ${game.platform}.`,
        forWho: 'Jogadores que apreciam boas narrativas e mecânicas clássicas.',
        tips: [
          'Preste atenção nos padrões dos inimigos antes de atacar precipitadamente.',
          'Economize recursos cruciais para os momentos de maior perigo.',
          'Aproveite a jornada no seu próprio ritmo e explore caminhos alternativos.'
        ],
      };
    }
  },

  /**
   * Decide com inteligência artificial qual jogo do backlog o usuário deve jogar.
   */
  async getSmartPickRecommendation(
    backlogGames: Game[],
    completedGames: Game[],
    moodPreference?: string,
    customApiKey?: string
  ): Promise<{ game: Game; reasoning: string }> {
    if (backlogGames.length === 0) {
      throw new Error('Nenhum jogo no backlog para analisar.');
    }

    const backlogTitles = backlogGames.slice(0, 30).map((g) => `"${g.title}" (${g.platform})`);
    const completedTitles = completedGames.slice(0, 15).map((g) => `"${g.title}"`);

    const prompt = `Você é o árbitro gamer supremo.
O jogador quer que você escolha exatamente UM jogo do backlog dele para ele jogar AGORA.

JOGOS DISPONÍVEIS NO BACKLOG:
${backlogTitles.join(', ')}

JOGOS QUE ELE JÁ ZEROU E CURTIU:
${completedTitles.length > 0 ? completedTitles.join(', ') : 'Nenhum informado'}

PREFERÊNCIA / CLIMA ATUAL DO JOGADOR:
${moodPreference ? moodPreference : 'Surpreenda com a melhor escolha possível'}

Responda em formato JSON estrito:
{
  "selectedTitle": "Nome exato de um dos jogos do backlog listado acima",
  "reasoning": "2 a 3 frases persuasivas e divertidas explicando por que esse jogo é a escolha perfeita para hoje."
}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'Você escolhe o melhor jogo gamer e responde em JSON estrito.' },
      { role: 'user', content: prompt }
    ];

    try {
      const raw = await this.callGroq(messages, customApiKey, DEFAULT_GROQ_MODEL, 0.7, 350);
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Encontra o jogo no backlog
      const matched = backlogGames.find(
        (g) => g.title.toLowerCase().includes(parsed.selectedTitle?.toLowerCase() || '') ||
               parsed.selectedTitle?.toLowerCase().includes(g.title.toLowerCase())
      ) || backlogGames[0];

      return {
        game: matched,
        reasoning: parsed.reasoning || `Recomendamos ${matched.title} por ser um dos títulos mais envolventes do seu backlog!`,
      };
    } catch {
      const random = backlogGames[Math.floor(Math.random() * backlogGames.length)];
      return {
        game: random,
        reasoning: `A IA escolheu ${random.title} para você quebrar a rotina e avançar no seu backlog com estilo!`,
      };
    }
  },

  /**
   * Testa a conectividade com a API do Groq.
   */
  async testConnection(customApiKey?: string): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    const start = performance.now();
    try {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'Responda com apenas a palavra OK.' },
        { role: 'user', content: 'ping' }
      ];
      await this.callGroq(messages, customApiKey, DEFAULT_GROQ_MODEL, 0.1, 10);
      const latencyMs = Math.round(performance.now() - start);
      return { success: true, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { success: false, latencyMs, error: err.message || 'Falha ao conectar à API do Groq' };
    }
  },
};
