# ♻️ Recicleiros Platform - Monorepo

## 📌 Visão Geral

Este é o monorepo central da organização Recicleiros, gerenciado via `pnpm workspaces`. A plataforma é composta por módulos independentes que compartilham uma base tecnológica comum e uma arquitetura padronizada.

### Módulos Atuais:

- **Platform Shell**: Portal de entrada e orquestrador de login.
- **Vox Observatory**: Inteligência de pesquisa e laboratório.
- **Coop Manager**: Gerenciamento de cooperados e unidades operacionais.

---

## 🛠️ Stack Tecnológica Global

Para garantir a interoperabilidade e o compartilhamento de tipos (`shared`), todos os módulos **devem** utilizar:

| Camada                     | Tecnologia                          |
| :------------------------- | :---------------------------------- |
| **Gerenciador de Pacotes** | `pnpm` (v10+)                       |
| **Linguagem**              | `TypeScript` (v6+)                  |
| **Backend Framework**      | `Fastify` (v4+)                     |
| **Frontend Framework**     | `Next.js` (v15+) com App Router     |
| **Estilização**            | `Tailwind CSS` (v4+)                |
| **Validação / Schema**     | `Zod`                               |
| **Banco de Dados**         | `Google Firestore` (Firebase Admin) |
| **Autenticação**           | `Firebase Auth` + Internal JWT      |

---

## 🏗️ Padrão Arquitetural Obrigatório (Clean Architecture)

Toda nova API ou funcionalidade deve seguir a divisão em camadas para garantir testabilidade e independência de framework.

### Estrutura de Pastas de um Módulo API:

```text
src/modules/[nome-do-modulo]/
├── domain/
│   ├── entities/       # Regras de negócio puras e tipos de domínio
│   └── repositories/   # Definição de contratos (interfaces) de acesso a dados
├── application/
│   └── use-cases/      # Classes de Caso de Uso (Single Responsibility Principle)
├── infra/
│   └── persistence/    # Implementações concretas (Ex: FirestoreRepository)
├── [modulo].controller.ts # Orquestrador da requisição HTTP
├── [modulo].routes.ts     # Definição de rotas Fastify
└── [modulo].schema.ts     # Schemas Zod para validação e Swagger
```

---

## 🚦 Protocolo para Novos Módulos (Mandatório)

Ao criar um novo módulo, o desenvolvedor deve seguir este checklist:

### 1. Identidade e Permissões (Shared)

- Registrar o novo ID do módulo em `shared/constants/modules.ts`.
- Definir as permissões específicas do módulo no `shared/types/user.ts`.

### 2. Infraestrutura de API

- **Fastify Type Provider**: Usar obrigatoriamente `withTypeProvider<ZodTypeProvider>()`.
- **Swagger**: Registrar schemas Zod no objeto `schema` da rota para geração automática da documentação em `/docs`.
- **Autenticação**: Registrar o plugin global de autenticação e usar o hook `app.authenticate` e `app.checkRoles(['ROLE'])`.
- **Erros**: Utilizar a classe `AppError` do `shared` e o `errorHandler` global.

### 3. Injeção de Dependência

- **Não instanciar** persistência dentro de Use Cases.
- **Não instanciar** Use Cases dentro de métodos do Controller.
- A instanciação deve ocorrer no arquivo de **Rotas** do módulo, injetando as dependências via construtor.

---

## 🛡️ Segurança e RBAC

A plataforma utiliza um sistema de RBAC (Role-Based Access Control) por módulo:

1.  **SUPER**: Acesso total a todos os módulos e unidades (exclusivo para gerência e desenvolvedores core).
2.  **ADMIN**: Acesso total às funcionalidades de um módulo, porém restrito aos dados da sua própria `unidadeId` (Multi-tenancy).
3.  **USER/VIEWER**: Acesso restrito a visualização ou operações simples conforme definido nas permissões do módulo.

---

## 📝 Guia de Estilo e Padronização de Código

- **Imports**: Sempre utilizar extensões `.js` em imports relativos (ex: `import { x } from "./y.js"`).
- **Nomenclatura**:
  - Pastas e arquivos: `kebab-case`.
  - Classes: `PascalCase`.
  - Interfaces: Iniciadas com `I` (Ex: `IUserRepository`).
- **Schemas Zod**: Exportar como objetos nomeados contendo as chaves `body`, `params` ou `query` para facilitar o spread nas rotas do Fastify.

---

## 🚀 Comandos Úteis (Raiz)

```bash
# Instalar dependências em todos os módulos
pnpm install

# Iniciar todos os serviços em modo desenvolvimento (Portas 3000, 3002, 3003, 3004, 3006)
pnpm run dev:all

# Matar processos travados no Windows (Portas ocupadas)
taskkill /F /IM node.exe
```

---

## 🤖 Nota para IA e Assistentes de Código

Ao ler o contexto deste projeto, priorize sempre a padronização baseada no módulo `vox-observatory` ou na versão refatorada do `coop-manager`. Qualquer sugestão de código que introduza Services genéricos, falta de tipagem no `req.user` ou middlewares de estilo Express deve ser evitada. O objetivo é manter a integridade da **Clean Architecture** e da validação via **Zod Type Provider**.

---

## 5. Evolução Futura

Como parte de um ecossistema maior, o Vox Observatory foi construído com escalabilidade em mente. A arquitetura modular permite a fácil adição de novas funcionalidades e a integração com outros módulos da `recicleiros-plataform` no futuro. Este documento será atualizado conforme o projeto evolui.
