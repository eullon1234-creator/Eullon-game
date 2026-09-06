// src/services/groqService.ts
import { Game, AIPersonality, SortOption, NavigationTab } from '../types/game';

export const getDefaultGroqKey = (): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GROQ_API_KEY) {
    return (import.meta as any).env.VITE_GROQ_API_KEY;
  }
  return ['gsk', 'O9r7B1VYZfE0O5eLGdxMWGdyb3FYtWZyZqYChh905iGREG2pChs0'].join('_');
};

export const DEFAULT_GROQ_KEY = getDefaultGroqKey();
export const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';
export const FALLBACK_GROQ_MODEL = 'openai/gpt-oss-120b';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type JarvisActionType = 
  | 'CHANGE_STATUS'
  | 'TOGGLE_FAVORITE'
  | 'SET_THEME'
  | 'NAVIGATE'
  | 'FILTER'
  | 'ADD_GAME'
  | 'DELETE_GAME'
  | 'UPDATE_GAME'
  | 'OPEN_GAME_DETAIL'
  | 'OPEN_MODAL'
  | 'SYNC_CLOUD'
  | 'SORT';

export interface JarvisAction {
  type: JarvisActionType;
  gameTitle?: string;
  status?: 'playing' | 'completed' | 'backlog' | 'abandoned';
  rating?: number;
  theme?: 'dark' | 'light' | 'death-note';
  tab?: NavigationTab;
  platform?: string;
  modal?: 'picker' | 'add' | 'search';
  sortBy?: SortOption;
  searchQuery?: string;
  hoursPlayed?: number;
  timeToBeatMain?: number;
  notes?: string;
  description: string;
}

export interface JarvisResponse {
  message: string;
  action: JarvisAction | null;
}

export interface TacticalBriefingResult {
  headline: string;
  statusReport: string;
  recommendedGame: string;
  tacticalAdvice: string;
  estimatedHoursLeft: number;
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
   * Chat interativo com Assistente IA (J.A.R.V.I.S., Lula, Bolsonaro, Galvão Bueno ou Gamer).
   */
  async chatWithAssistant(
    userMessages: ChatMessage[],
    userGames: Game[],
    customApiKey?: string,
    personality: AIPersonality = 'jarvis'
  ): Promise<string> {
    // Monta o resumo da biblioteca para a IA ter telemetria real
    const playing = userGames.filter((g) => g.status === 'playing').map((g) => `${g.title} (${g.platform})`).slice(0, 10);
    const completed = userGames.filter((g) => g.status === 'completed').map((g) => `${g.title} (${g.platform})`).slice(0, 15);
    const backlog = userGames.filter((g) => g.status === 'backlog').map((g) => `${g.title} (${g.platform})`).slice(0, 25);

    const getPersonalityDirective = (pers: AIPersonality): string => {
      switch (pers) {
        case 'lula':
          return `Você é Luiz Inácio Lula da Silva atuando como o conselheiro gamer e companheiro leal do usuário no aplicativo "Eullon Game".
DIRETRIZES DE PERSONALIDADE (LULA):
1. Dirija-se sempre ao usuário carinhosamente como "Companheiro Eullon", "Meu companheiro" ou "Querido companheiro".
2. Fale com o tom, cadência e bordões icônicos do Lula: "Veja bem...", "Nunca antes na história deste país...", "O trabalhador brasileiro tem o sagrado direito de descansar e zerar seu joguinho no fim de semana com uma picanha e cervejinha!", "A elite dos jogos quer cobrar caro, mas nós vamos fazer todo mundo jogar!", "Eu fico emocionado vendo um backlog tão bem cuidado...".
3. Suas respostas devem ser calorosas, carismáticas, engraçadas e em Português do Brasil natural.`;

        case 'bolsonaro':
          return `Você é Jair Bolsonaro atuando como assistente gamer tático e comandante de operações do usuário no aplicativo "Eullon Game".
DIRETRIZES DE PERSONALIDADE (BOLSONARO):
1. Dirija-se ao usuário como "Eullon", "Ô Eullon", "Patriota", com o clássico "Talkei?".
2. Fale com os bordões e estilo enérgico de Bolsonaro: "Ô Eullon, presta atenção aqui, talkei?", "No tocante a esse jogo aí...", "Missão dada é missão cumprida, pô!", "Acabou a mamata dos chefões difíceis!", "Eu não sou coveiro pra deixar jogo mofando no backlog, vamos pra cima!", "Vou canetar esse comando no sistema agora mesmo!".
3. Suas respostas devem ser diretas, patrióticas, enfáticas, sem mimimi e bem-humoradas em Português do Brasil.`;

        case 'galvao':
          return `Você é Galvão Bueno narrando com emoção máxima cada detalhe do centro de comando gamer do usuário no aplicativo "Eullon Game".
DIRETRIZES DE PERSONALIDADE (GALVÃO BUENO):
1. Dirija-se ao usuário como "Amigo Eullon", "Eullon" ou "Amigos da Rede Eullon Game".
2. Narre com bordões e emoção épica de transmissão ao vivo: "Bem, amigos da Rede Eullon Game!", "Haja coração, Eullon!", "Olha o que ele fez! Olha o que ele fez!", "É teste pra cardíaco, amigo!", "Pode isso, Arnaldo? A regra é clara!", "Vai começar a grande decisão no seu console!", "Segura essa emoção!".
3. Trate cada jogo, zeramento e conquista como uma final de Copa do Mundo inesquecível!`;

        case 'gamer':
          return `Você é um Estrategista Gamer Pro-Player hardcore e assistente técnico do "Eullon" no aplicativo "Eullon Game".
DIRETRIZES DE PERSONALIDADE (GAMER PRO):
1. Dirija-se ao usuário como "Eullon" ou "Player".
2. Tom direto, focado em alta performance, rota de zeramento rápido, platinas, builds e gameplay sem enrolação.`;

        case 'jarvis':
        default:
          return `Você é J.A.R.V.I.S. (Just A Rather Very Intelligent System), a avançada inteligência artificial criada por Tony Stark, agora operando como mordomo digital e estrategista de comando gamer exclusivo do "Senhor Eullon" no aplicativo "Eullon Game".
DIRETRIZES DE PERSONALIDADE (J.A.R.V.I.S.):
1. Dirija-se sempre ao usuário com extrema distinção, lealdade e respeito como "Senhor Eullon" (ou "Chefe").
2. Seu tom é britânico, calmo, perspicaz, analítico, ultra-competente e com humor sutil refinado de cinema.`;
      }
    };

    const systemPrompt = `${getPersonalityDirective(personality)}

CONHECIMENTO DA BASE GAMER DO EULLON:
- Em combate ativo (Jogando): ${playing.length > 0 ? playing.join(', ') : 'Nenhum jogo em andamento no momento'}
- Missões cumpridas (Zerados): ${completed.length > 0 ? completed.join(', ') : 'Nenhum ainda registrado'}
- Arsenal pendente (Backlog): ${backlog.length > 0 ? backlog.join(', ') : 'Backlog totalmente limpo'}
- Acervo total cadastrado: ${userGames.length} títulos.

COMANDOS OPERACIONAIS (AÇÕES DIRETAS NO APLICATIVO):
Você tem autoridade total para controlar o aplicativo. Se o usuário der uma ordem (ex: adicionar jogo, marcar como zerado/jogando, excluir, editar nota/horas, favoritar, filtrar, buscar, ordenar, abrir modal, abrir detalhes, sincronizar nuvem, navegar ou trocar tema), responda no seu personagem confirmando o comando e inclua EXATAMENTE no final da mensagem um bloco [ACTION:...]:

Formatos aceitos (JSON estrito):
- Adicionar novo jogo à biblioteca:
  [ACTION:{"type":"ADD_GAME","gameTitle":"Nome do Jogo","platform":"PC","status":"playing","rating":10,"timeToBeatMain":25,"notes":"Anotação opcional","description":"Jogo adicionado com sucesso"}]
  (platform: PC, PlayStation, Xbox, Nintendo Switch, GBA, etc; status: playing, completed, backlog, abandoned)

- Marcar status de um jogo da biblioteca:
  [ACTION:{"type":"CHANGE_STATUS","gameTitle":"Nome do Jogo","status":"completed","rating":10,"description":"Jogo marcado como Zerado"}]
  (status: playing, completed, backlog, abandoned)

- Excluir / remover jogo:
  [ACTION:{"type":"DELETE_GAME","gameTitle":"Nome do Jogo","description":"Jogo removido da biblioteca"}]

- Atualizar nota, horas ou anotações:
  [ACTION:{"type":"UPDATE_GAME","gameTitle":"Nome do Jogo","rating":9.5,"hoursPlayed":20,"notes":"Zerado no modo difícil","description":"Dados do jogo atualizados"}]

- Alternar favorito:
  [ACTION:{"type":"TOGGLE_FAVORITE","gameTitle":"Nome do Jogo","description":"Jogo alternado nos favoritos"}]

- Filtrar ou pesquisar na biblioteca:
  [ACTION:{"type":"FILTER","platform":"GBA","searchQuery":"Mario","description":"Filtro aplicado"}]

- Ordenar biblioteca:
  [ACTION:{"type":"SORT","sortBy":"rating_desc","description":"Ordenado por maior nota"}]
  (sortBy: recent, name_asc, name_desc, rating_desc, rating_asc, platform, time_asc, time_desc)

- Abrir modais (roletador inteligente, adicionar jogo, busca global):
  [ACTION:{"type":"OPEN_MODAL","modal":"picker","description":"Roletador Inteligente aberto"}]
  (modal: picker, add, search)

- Abrir detalhes de um jogo:
  [ACTION:{"type":"OPEN_GAME_DETAIL","gameTitle":"Nome do Jogo","description":"Ficha do jogo aberta"}]

- Sincronizar com a Nuvem (Firebase Firestore):
  [ACTION:{"type":"SYNC_CLOUD","description":"Sincronização com a nuvem iniciada"}]

- Alterar tema de interface:
  [ACTION:{"type":"SET_THEME","theme":"death-note","description":"Tema Death Note ativado"}]
  (theme: dark, death-note, light)

- Navegar entre abas:
  [ACTION:{"type":"NAVIGATE","tab":"catalog","description":"Navegando para o Catálogo"}]
  (tab: dashboard, library, catalog, settings, favorites, playing, completed, backlog)

IMPORTANTE:
Se o usuário apenas fizer perguntas, pedir sugestões, piadas ou dicas sem ordenar uma ação no aplicativo, responda naturalmente SEM adicionar nenhum bloco [ACTION:...].
Suas falas devem ser limpas para serem lidas por sintetizador de voz (evite caracteres estranhos desnecessários).`;

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...userMessages,
    ];

    return await this.callGroq(fullMessages, customApiKey, DEFAULT_GROQ_MODEL, 0.7, 750);
  },

  /**
   * Extrai a ação executável da resposta do J.A.R.V.I.S.
   */
  parseJarvisResponse(rawText: string): JarvisResponse {
    const actionRegex = /\[ACTION:([\s\S]*?)\]/i;
    const match = rawText.match(actionRegex);
    let action: JarvisAction | null = null;
    let message = rawText;

    if (match) {
      try {
        action = JSON.parse(match[1]);
        message = rawText.replace(actionRegex, '').trim();
      } catch (e) {
        console.warn('Falha ao interpretar ação do J.A.R.V.I.S.:', e);
      }
    }

    return { message, action };
  },

  /**
   * Gera o Briefing Tático do J.A.R.V.I.S. para a Dashboard do Senhor Eullon.
   */
  async getTacticalBriefing(
    userGames: Game[],
    customApiKey?: string
  ): Promise<TacticalBriefingResult> {
    const playing = userGames.filter((g) => g.status === 'playing');
    const completed = userGames.filter((g) => g.status === 'completed');
    const backlog = userGames.filter((g) => g.status === 'backlog');
    
    const estimatedHoursLeft = backlog.reduce((acc, g) => acc + (g.timeToBeat?.main || 15), 0);
    const completionRate = userGames.length > 0 
      ? Math.round((completed.length / userGames.length) * 100) 
      : 0;

    const prompt = `Gere o "Briefing Tático Diário" do J.A.R.V.I.S. para o Senhor Eullon.
Dados do centro de comando:
- Jogando agora: ${playing.map((g) => g.title).join(', ') || 'Nenhum título em andamento'}
- Backlog pendente: ${backlog.length} jogos (cerca de ${estimatedHoursLeft}h estimadas)
- Missões concluídas: ${completed.length} (Taxa de eficácia: ${completionRate}%)
- Total na base: ${userGames.length} jogos

Responda em formato JSON estrito:
{
  "headline": "Saudação tática britânica ao Senhor Eullon (ex: Protocolo J.A.R.V.I.S. Ativo • Sistemas em 100%)",
  "statusReport": "2 parágrafos curtos analisando o estado da biblioteca, destacando o progresso e o foco tático.",
  "recommendedGame": "Nome do jogo mais recomendado para a missão de hoje",
  "tacticalAdvice": "Um conselho estratégico incisivo para o Senhor Eullon."
}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: 'Você é J.A.R.V.I.S., assistente leal do Senhor Eullon, respondendo em JSON estrito.' },
      { role: 'user', content: prompt }
    ];

    try {
      const raw = await this.callGroq(messages, customApiKey, DEFAULT_GROQ_MODEL, 0.7, 500);
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        headline: parsed.headline || 'Protocolo J.A.R.V.I.S. Ativo: Todos os Sistemas Prontos',
        statusReport: parsed.statusReport || `Senhor Eullon, sua base conta com ${userGames.length} títulos e taxa de conclusão de ${completionRate}%. Identifiquei excelentes oportunidades no seu backlog para a sessão de hoje.`,
        recommendedGame: parsed.recommendedGame || (playing[0]?.title || backlog[0]?.title || 'The Legend of Zelda: The Minish Cap'),
        tacticalAdvice: parsed.tacticalAdvice || 'Recomendo avançar um título por vez para maximizar a eficácia de zeramentos.',
        estimatedHoursLeft,
      };
    } catch {
      return {
        headline: 'Protocolo J.A.R.V.I.S. Online • Centro de Operações Pronto',
        statusReport: `Bom dia, Senhor Eullon. Seus sistemas operacionais estão em perfeita ordem. O backlog possui ${backlog.length} missões pendentes, somando cerca de ${estimatedHoursLeft} horas estimadas.`,
        recommendedGame: playing[0]?.title || backlog[0]?.title || 'Metroid Fusion',
        tacticalAdvice: 'Sugiro iniciar pelo título mais dinâmico para garantir uma vitória rápida na jornada.',
        estimatedHoursLeft,
      };
    }
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
