# 🎮 GAME TRACKER PRO

> **Sua biblioteca pessoal de jogos simples, moderna e conectada na nuvem.**

🌐 **Acesse o App Online no GitHub Pages:**  
👉 **[https://eullon1234-creator.github.io/Eullon-game/](https://eullon1234-creator.github.io/Eullon-game/)**

---

## 📸 Sobre o Projeto

O **GAME TRACKER PRO** é uma aplicação web focada em responder com rapidez e elegância às quatro perguntas essenciais de qualquer jogador:
- 🎮 **O que eu estou jogando?**
- ✅ **O que eu já zerei?**
- 📚 **O que eu quero jogar? (Backlog)**
- ❌ **O que eu desisti?**

Sem complexidades desnecessárias, o app conta com **identidade visual gamer premium (dark mode)**, sincronização em tempo real na nuvem com **Firebase Firestore** e suporte a capas personalizadas por link externo.

---

## ✨ Principais Funcionalidades

- 🎮 **Dashboard Inteligente**: Contadores visuais das 4 categorias principais e vitrine rápida dos jogos.
- 📚 **Biblioteca Visual**: Grid de pôsteres em proporção 3:4 com capas em alta resolução e modo lista detalhado.
- ⚡ **Alteração de Status em 1 Clique**: Menu rápido direto no card sem precisar abrir formulários.
- 💻 **Diferenciação de Plataformas para PC**:
  - `PC 💲 (Comprado)`: Para jogos comprados legitimamente.
  - `PC 💀 (Craqueado)`: Para jogos alternativos/piratas.
- 🎲 **"O que eu vou jogar?"**: Sorteador aleatório do seu backlog para decidir sua próxima jogatina com 1 clique.
- 🔍 **Busca Instantânea & Filtros**: Pesquise instantaneamente por título ou plataforma e filtre seus favoritos ❤️.
- 🔥 **Nuvem em Tempo Real (Firebase Firestore)**: Seus jogos salvos no banco de dados na nuvem com fallback offline automático.
- 📦 **Exportação & Backup**: Baixe e importe seus dados em formatos JSON e CSV a qualquer momento.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Animações & Efeitos**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Banco de Dados**: [Firebase Firestore](https://firebase.google.com/)
- **Hospedagem**: [GitHub Pages](https://pages.github.com/)

---

## 🚀 Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/eullon1234-creator/Eullon-game.git
   cd Eullon-game
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:5173/](http://localhost:5173/) no seu navegador.

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploy no GitHub Pages

O deploy automatizado está configurado via GitHub Actions em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Sempre que um commit for enviado para a branch `main`:
1. O GitHub Actions compila o projeto;
2. Publica automaticamente no link: **[https://eullon1234-creator.github.io/Eullon-game/](https://eullon1234-creator.github.io/Eullon-game/)**.

Também é possível realizar o deploy direto via terminal:
```bash
npm run deploy
```

---

Desenvolvido com 💜 por **Eullon**.
