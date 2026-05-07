# Vox Observatory - Plataforma de Inteligência de Pesquisa

## 1. Visão Geral

**Vox Observatory** é uma plataforma web full-stack projetada para ser o sistema centralizado de gerenciamento do ciclo de vida de pesquisas (UX, mercado, produto, etc.) dentro da organização Recicleiros. Ela faz parte do monorepo `recicleiros-plataform`, atuando como um módulo especializado.

O propósito principal da plataforma é capacitar pesquisadores, gerentes de produto e stakeholders a **cadastrar, acompanhar, filtrar e consultar informações sobre projetos de pesquisa** de forma organizada, colaborativa e persistente. O objetivo é transformar dados de pesquisa em inteligência acionável e facilmente acessível.

---

## 2. Arquitetura e Pilares Tecnológicos

O projeto é desenvolvido como um **monorepo** gerenciado com `pnpm workspaces`, garantindo o compartilhamento de configurações e componentes. A arquitetura é dividida em duas aplicações principais:

### 🔹 API (Backend)

Uma API RESTful robusta, responsável pela lógica de negócio, autenticação e persistência de dados.

- **Stack Principal**:
  - **Runtime**: Node.js
  - **Framework**: Fastify (para alta performance e baixo overhead)
  - **Linguagem**: TypeScript
  - **Banco de Dados**: Google Firestore (NoSQL, escalável e em tempo real)
  - **Validação**: Zod (para schemas de dados seguros e tipados)

- **Padrões de Arquitetura**:
  A API adota princípios de **Arquitetura Limpa (Clean Architecture)** e **Domain-Driven Design (DDD)**, visível na separação clara de responsabilidades:
  - `domain/`: Contém as entidades de negócio (`Research`, `User`) e suas regras intrínsecas.
  - `application/`: Orquestra as operações através de **Casos de Uso** (ex: `RegisterResearch`), que contêm a lógica da aplicação.
  - `infra/`: Implementa os detalhes técnicos, como a conexão com o banco de dados (`FirestoreResearchRepository`) e outros serviços externos.
  - `interfaces/`: Define a camada de entrada da aplicação, incluindo as rotas da API, controllers e schemas de validação.

- **Autenticação**:
  O fluxo utiliza **Firebase Authentication** no cliente para obter um `idToken`. Este token é enviado à nossa API, que o valida e o troca por um **JWT (JSON Web Token)** interno. Este JWT é então usado para proteger as rotas da API, garantindo que apenas usuários autenticados possam acessar os recursos.

### 🔸 Web (Frontend)

Uma Single-Page Application (SPA) moderna e reativa que consome a API e oferece uma experiência de usuário rica.

- **Stack Principal**:
  - **Framework**: Next.js 15+ (com App Router)
  - **Biblioteca de UI**: React 18
  - **Linguagem**: TypeScript
  - **Estilização**: Tailwind CSS (com um preset compartilhado para consistência visual)
  - **Componentes de UI**: Sistema de componentes baseado em `shadcn/ui`, promovendo reusabilidade e acessibilidade.

- **Gerenciamento de Estado**:
  - **Estado do Servidor**: **TanStack Query (React Query)** é utilizado para buscar, armazenar em cache e sincronizar os dados da API. Ele gerencia de forma eficiente os estados de carregamento, erro e sucesso das requisições.
  - **Estado do Cliente**: **Zustand** é usado para gerenciar o estado global da UI, como as informações do usuário autenticado e o estado da sessão.

- **Formulários**: A combinação de **React Hook Form** e **Zod** (`@hookform/resolvers/zod`) cria uma base sólida para formulários complexos com validação de schema, garantindo a integridade dos dados antes do envio.

---

## 3. Funcionalidades Principais

A plataforma oferece um conjunto de funcionalidades essenciais para o gerenciamento de pesquisas:

- **Autenticação Segura**: Login de usuários e gerenciamento de sessão via Firebase e JWT.
- **Gerenciamento de Perfil**: Usuários podem visualizar e atualizar suas informações.
- **Cadastro de Pesquisas**: Um formulário completo para registrar todos os detalhes de uma nova pesquisa, incluindo título, objetivos, metodologia, custos e público-alvo.
- **Listagem e Filtragem Avançada**: Uma interface para visualizar todas as pesquisas, com filtros dinâmicos por status, localização, tags e busca por título.
- **Paginação por Cursor**: Carregamento eficiente de dados na listagem, garantindo boa performance mesmo com um grande volume de pesquisas.
- **Visualização de Detalhes**: Uma visão detalhada de cada pesquisa, consolidando todas as suas informações e artefatos.
- **Edição e Exclusão**: Capacidade de atualizar informações de uma pesquisa existente ou removê-la do sistema.

---

## 4. Estrutura do Projeto

```
recicleiros-plataform/
└── modules/
    └── vox-observatory/
        ├── api/
        │   ├── src/
        │   │   ├── application/  # Casos de Uso
        │   │   ├── domain/       # Entidades e Repositórios (interfaces)
        │   │   ├── infra/        # Implementações (DB, HTTP, etc.)
        │   │   └── interfaces/   # Controllers, Rotas e Schemas
        │   └── ...
        ├── web/
        │   ├── src/
        │   │   ├── app/          # Rotas (Next.js App Router)
        │   │   ├── components/   # Componentes React
        │   │   ├── lib/          # Clientes de API, utils
        │   │   └── store/        # Lojas de estado (Zustand)
        │   └── ...
        └── README.md             # Este arquivo
```

---

## 5. Evolução Futura

Como parte de um ecossistema maior, o Vox Observatory foi construído com escalabilidade em mente. A arquitetura modular permite a fácil adição de novas funcionalidades e a integração com outros módulos da `recicleiros-plataform` no futuro. Este documento será atualizado conforme o projeto evolui.
