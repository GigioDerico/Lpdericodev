# 👨‍💻 LP Dev Derico

> Landing Page moderna, de alta performance e totalmente gerenciável (com CMS próprio), desenvolvida para portfólio de engenharia de software e design UI/UX do Derico.

![Apresentação LP Dev Derico](https://plush-caribou-17.tiiny.site/imagem-mockup-github.webp) <!-- Altere para a imagem real que quiser do seu GitHub depois -->
🌐 **Produção (Live):** [https://www.derico.dev](https://www.derico.dev)

A aplicação foi criada com o intuito de apresentar uma vitrine robusta do trabalho realizado, contando com componentes altamente interativos, foco obstinado em métricas (LCP/CLS reduzido) e um prático **Painel Administrativo protegido por autenticação** para atualizar Projetos, Depoimentos e Pixels sem precisar re-escrever o código.

---

## 🛠️ Tecnologias Principais (Tech Stack)

### **Frontend (Client-Side)**
-   **React v18** + **Vite** (para roteamento super rápido e unificado de Client-Side Rendering em modo SPA)
-   **React Router v7** (gerenciamento de rotas e navegação fluida)
-   **Tailwind CSS v4** (estilização focada em classes, sem CSS externo inflado)
-   **Framer Motion** & **Tw-animate-css** (animações fluidas, scroll reveals com *intersection observer*)
-   **Radix UI** (componentes headless acessíveis via A11y, como modais e dropdowns)
-   **Lucide React** (biblioteca de ícones clean e svg-optimized)

### **Backend (Serverless) / Banco de Dados**
-   **Vercel Serverless Functions / API Routes** (comunicação server-side restrita para manter a segurança e credenciais ocultas)
-   **Neon Database** (Serverless PostgresSQL rápido e globalmente distribuído)
  
### **Funcionalidades do Painel Admin (CMS embutido)**
-   Gerenciamento Completo (CRUD) dos **Projetos Realizados** em tempo real usando `fetch()` no Serverless do Vercel.
-   Gerenciamento (CRUD) orgânico de **Depoimentos de Clientes** com estrelas, avatares e texto.
-   Injeção dinâmica de tags de **SEO (GA4, Pixel do Meta, Hotjar)** via banco diretamente na Head da página.
-   Login e Sessão protegidos com Tokens e Encriptado SHA-256 integrados ao banco de dados Neon.

---

## 🚀 Como Iniciar (Ambiente de Desenvolvimento)

### 1. Requisitos
-   Node.js (versão recente v18+) instalado.
-   npm, pnpm ou yarn.

### 2. Instalação e Execução
1. Faça o clone deste repositório:
```bash
git clone https://github.com/GigioDerico/Lpdericodev.git
```
2. Instale as bibliotecas:
```bash
cd Lpdericodev
npm install
```
3. Crie e preencha as suas variáveis de conexões de BD locais (renomeie/crie o arquivo `.env-dev` na raiz com o seu PostgreSQL do DB Neon):
```env
DATABASE_URL=postgresql://seu_db_aqui...
```
4. Inicie o servidor:
```bash
npm run dev
```
5. Acesse na máquina em http://localhost:5173

---

## 📂 Visão Geral da Arquitetura e Referências

O repositório está subdividido para respeitar o conceito de componentização isolada e segurança de API. O código de acesso ao banco (arquitetura restrita) reside em `/api/`, garantindo que chaves não sejam expostas em env de browser. Já em `/src/app/`, encontramos as raízes do FrontEnd moderno do LP.

Para visualizar detalhes técnicos, leia em nosso manual:
📘 **[Documentação Completa da Base (docs/documentation.md)](./docs/documentation.md)**