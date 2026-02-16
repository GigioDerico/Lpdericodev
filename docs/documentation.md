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
├── docs/                   # Documentação do projeto (este arquivo e outros)
├── src/
│   ├── app/                # Lógica principal da aplicação
│   │   ├── App.tsx         # Componente raiz que monta a Landing Page
│   │   └── components/     # Componentes de UI reutilizáveis e seções da LP
│   ├── assets/             # Imagens, ícones e arquivos estáticos
│   ├── lib/                # Funções utilitárias (ex: cn.ts)
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

> **Dica**: Para editar o conteúdo das seções (ex: textos do Hero, lista de projetos), navegue até o componente correspondente em `src/app/components/`.
