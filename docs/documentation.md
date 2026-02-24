# Documentação do Projeto: LP Dev Derico

> Esta documentação serve como guia central para entender, configurar e manter o projeto de Landing Page do desenvolvedor Derico.

---

## 📋 Visão Geral do Projeto

**LP Dev Derico** é uma Landing Page moderna e de alta performance desenvolvida para apresentar o portfólio, habilidades e diferenciais do desenvolvedor "Derico". O projeto foi criado com foco em estética premium, responsividade e interatividade, utilizando as tecnologias mais recentes do ecossistema React.

### Principais Seções da Página
O layout principal (`App.tsx`) é composto pelos seguintes blocos:
1.  **Header**: Navegação principal.
2.  **Hero Section**: Apresentação inicial impactante.
3.  **Features**: Destaque para habilidades e serviços principais.
4.  **Tech Stack**: Vitrine das tecnologias dominadas.
5.  **Projects**: Galeria de projetos realizados.
6.  **Testimonials**: Prova social e recomendações.
7.  **Differentiators**: O que torna o desenvolvedor único.
8.  **Contact**: Formulário de contato funcional.
9.  **Footer**: Informações finais e links sociais.

---

## 🛠️ Stack Tecnológica

O projeto utiliza uma stack moderna baseada em **React** e **Vite**, focada em performance e experiência de desenvolvimento (DX).

### Core
-   **Runtime/Build Tool**: [Vite](https://vitejs.dev/) (v6.3.5)
-   **Framework UI**: [React](https://react.dev/) (v18.3.1)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Inferido pela configuração do Vite)
-   **Roteamento**: [React Router](https://reactrouter.com/) (v7.13.0)

### Estilização e UI
-   **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/) (v4.1.12)
-   **Utilitários de Classe**: `clsx`, `tailwind-merge`, `class-variance-authority` (CVA)
-   **Componentes Headless**: [Radix UI](https://www.radix-ui.com/) (Extensivo uso de primitivos como Dialog, Dropdown, Tabs, Accordion, etc.)
-   **Ícones**: [Lucide React](https://lucide.dev/)
-   **Animações**: `motion` (Framer Motion), `tw-animate-css`

### Funcionalidades e Utilitários
-   **Gerenciamento de Formulários**: [React Hook Form](https://react-hook-form.com/)
-   **Validação/Formatação de Datas**: `date-fns`
-   **Gráficos**: `recharts`
-   **Notificações (Toasts)**: `sonner`
-   **Carrossel**: `embla-carousel-react`, `react-slick`
-   **Drag & Drop**: `react-dnd`

---

## 📂 Estrutura do Projeto

A estrutura de diretórios segue um padrão organizado para escalabilidade e manutenção.

```bash
/
├── .agent/                 # Configurações de agentes de AI e skills
├── api/                    # Vercel Serverless Functions (Backend / API REST)
│   ├── _lib/               # Utilitários do servidor (Ex: configuração Neon DB)
│   ├── auth.ts             # Endpoints de autenticação / Sessão / Users
│   ├── projects.ts         # Endpoints CRUD de Projetos
│   ├── testimonials.ts     # Endpoints CRUD de Depoimentos
│   └── settings.ts         # Endpoints CRUD de Configurações
├── docs/                   # Documentação do projeto
├── src/
│   ├── app/                # Lógica de Frontend (React)
│   │   ├── admin/          # Rotas e Dashboard do Painel Administrativo
│   │   ├── components/     # Componentes de UI reutilizáveis e seções da LP
│   │   └── App.tsx         # Roteador principal
│   ├── assets/             # Imagens, ícones e arquivos estáticos
│   ├── lib/                # Serviços HTTP do Frontend (fetch para /api)
│   ├── styles/             # Arquivos CSS globais e configurações do Tailwind
│   └── main.tsx            # Ponto de entrada da aplicação ReactDOM
├── package.json            # Gerenciamento de dependências e scripts
└── vite.config.ts          # Configuração do bundler Vite
```

---

## 🚀 Como Iniciar

Siga os passos abaixo para rodar o projeto localmente em sua máquina.

### Pré-requisitos
-   Node.js (versão recente recomendada, ex: v18+)
-   npm ou pnpm/yarn

### Instalação

1.  Clone o repositório (caso ainda não tenha feito):
    ```bash
    git clone <url-do-repositorio>
    ```

2.  Instale as dependências:
    ```bash
    npm install
    # ou
    pnpm install
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  Acesse a aplicação em `http://localhost:5173` (ou a porta indicada no terminal).

### Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento.
-   `npm run build`: Compila o projeto para produção.
-   `npm run preview`: Visualiza a build de produção localmente.

---

## 📝 Notas de Desenvolvimento

-   **Tailwind v4**: O projeto já utiliza a versão 4 do Tailwind CSS. Atente-se à sintaxe e configuração do `@tailwindcss/vite` no `vite.config.ts`.
-   **Componentização**: Novos componentes devem ser criados preferencialmente em `src/app/components` se forem específicos da aplicação, ou em uma pasta `ui` separada se forem genéricos (ex: botões, inputs).
-   **Acessibilidade**: Graças ao uso do Radix UI, muitos componentes já possuem acessibilidade (a11y) embutida. Mantenha esse padrão ao criar novos elementos interativos.

---

> **Dica**: Para editar o conteúdo das seções (ex: textos do Hero, lista de projetos), navegue até o componente correspondente em `src/app/components/`. Caso o conteúdo seja dinâmico (como os projetos), eles podem ser gerenciados pelo Painel Administrativo.

---

## 🆕 Últimas Atualizações

O projeto recebeu uma série de melhorias focadas em performance, gestão de conteúdo e marketing:

-   **Painel Administrativo Completo:** Sistema de gestão protegido por autenticação para criação, leitura, atualização e deleção (CRUD) de **Projetos**, **Depoimentos**, bem como acesso fácil às **Configurações Gerais** e **Integrações**.
-   **Segurança Serverless (Vercel Functions):** Todo o painel de adminsitração e busca de dados foi migrado do Client-Side (Frontend) para um Serverless Backend seguro hospedado nas endpoints nativas da Vercel (`/api/*`), garantindo que senhas de bancos de dados como o Neon fiquem ocultas do cliente.
-   **SEO Dinâmico e Integrações:** Implementação nativa de um gerenciador de tags. É possível adicionar IDs para **Google Analytics 4 (GA4)**, **Meta Pixel** e **Hotjar** diretamente pelo painel administrativo, sem a necessidade de mexer no código ou instalar bibliotecas de terceiros pesadas. Configurações completas de tags Meta de SEO implementadas.
-   **Otimização de Performance Abissal:** Correções em "paint" (LCP/CLS), divisão de pacotes de JavaScript (split chunks) para melhorar o carregamento em redes lentas, e aplicação de carregamento sob demanda (*lazy loading*) para imagens e mídias pesadas.
-   **Identidade Visual e Layout Renovados:** Atualização no esquema visual, links e chamadas de ação para contato (incluindo acesso rápido via WhatsApp e Email).

---

## 🔐 Como Acessar o Painel Administrativo (Admin)

Para facilitar a gestão do portfólio sem precisar de commits novos, o LP conta com uma área administrativa separada.

### Rotas do Admin

-   **Página de Login**: Acesse `/admin/login`
-   **Dashboard (Painel Geral)**: Acesse `/admin` (requer autenticação)
-   **Gerenciar Projetos**: `/admin/projects`
-   **Gerenciar Depoimentos**: `/admin/testimonials`
-   **Gerenciar Integrações (Pixels/Tags)**: `/admin/integrations`
-   **Configurações SEO**: `/admin/settings`

### Login

O sistema de autenticação protege as rotas. Caso não esteja logado e tente acessar o `/admin` ou suas subrotas, o sistema de roteamento fará um redirecionamento automático para `/admin/login`.

Uma vez logado, todo o gerenciamento de conteúdo ficará visível e suas alterações se refletirão imediatamente na Landing Page pública.
