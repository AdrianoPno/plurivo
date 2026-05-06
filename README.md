# Vox Observatory - Web Client

[!Status do Build](https://example.com)
[!Licença: MIT](https://opensource.org/licenses/MIT)

O cliente web oficial para o **Vox Observatory**, uma plataforma para gerenciar e centralizar pesquisas e descobertas de UX, mercado e usuários.

<!-- Inserir um screenshot da tela principal aqui -->

!Dashboard do Vox Observatory

## 📖 Sobre o Projeto

O Vox Observatory é um repositório central projetado para ajudar equipes de produto, design e pesquisa a organizar, acessar e colaborar em todas as suas descobertas. Ele transforma dados brutos e insights espalhados em uma biblioteca de conhecimento estruturada e pesquisável.

Este frontend, construído com Next.js, fornece a interface de usuário para interagir com a API do Vox Observatory, permitindo que os usuários gerenciem o ciclo de vida completo de uma pesquisa.

### ✨ Principais Funcionalidades

- **Autenticação Segura:** Login e gerenciamento de sessão utilizando Firebase e tokens JWT.
- **Dashboard (Biblioteca):** Uma visão geral de todas as pesquisas cadastradas, apresentadas em cards informativos.
- **Busca e Filtragem Avançada:** Encontre pesquisas rapidamente por título, status, tags ou localização.
- **Gerenciamento Completo de Pesquisas:**
  - Crie novas descobertas através de um formulário modal intuitivo.
  - Edite informações detalhadas de pesquisas existentes.
  - Visualize todos os detalhes de uma pesquisa, incluindo metadados, objetivos, insights e artefatos.
- **Gerenciamento de Artefatos:** Adicione e gerencie links para evidências externas como protótipos no Figma, documentos, vídeos e relatórios.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza um stack moderno e robusto para entregar uma experiência de usuário de alta qualidade:

- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Componentes de UI:** shadcn/ui
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Zustand
- **Data Fetching & Cache:** TanStack Query (React Query)
- **Gerenciamento de Formulários:** React Hook Form
- **Validação de Schema:** Zod
- **Cliente HTTP:** Axios

## 🚀 Começando

Siga estas instruções para ter uma cópia do projeto rodando localmente para desenvolvimento e testes.

### Pré-requisitos

1.  **Node.js:** Garanta que você tenha o Node.js (v18 ou mais recente) instalado.
2.  **Backend API:** Este frontend requer que o backend do `packages/server` esteja em execução. Por favor, siga as instruções no README do servidor para iniciá-lo primeiro.
3.  **Credenciais do Firebase:** A aplicação usa o Firebase para autenticação. Garanta que você tenha a configuração do seu projeto Firebase disponível.

### Variáveis de Ambiente

Antes de executar a aplicação, você precisa configurar suas variáveis de ambiente. Crie um arquivo chamado `.env.local` na raiz do diretório `packages/web` e adicione as seguintes variáveis:

```bash
# URL para a API do backend
NEXT_PUBLIC_API_URL=http://localhost:3333

# Configuração do cliente Firebase (substitua pelas credenciais do seu projeto)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### Instalação e Execução

1. Navegue até a raiz do monorepo e instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```
2. Execute o servidor de desenvolvimento para o cliente web:

   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

3. Abra http://localhost:3000 no seu navegador para ver a aplicação.

## 📁 Estrutura de Pastas

A estrutura de pastas do projeto segue as convenções do Next.js App Router, com algumas adições para organização:

```
src
├── app/                # Rotas, páginas e layouts do Next.js
│   ├── (auth)/         # Grupo de rotas para autenticação
│   └── dashboard/      # Rotas protegidas do dashboard
├── components/         # Componentes de UI reutilizáveis (shadcn/ui)
│   ├── providers/      # Provedores de contexto (React Query, etc.)
│   └── ui/             # Componentes base da UI
├── lib/                # Funções utilitárias e lógicas centrais
│   └── api.ts          # Cliente Axios e todas as chamadas de API
├── store/              # Stores globais do Zustand
└── styles/             # Estilos globais
```

## 📜 Scripts Disponíveis

No diretório do projeto, você pode executar:

- `npm run dev`: Inicia a aplicação em modo de desenvolvimento.
- `npm run build`: Compila a aplicação para produção.
- `npm run start`: Inicia um servidor de produção.
- `npm run lint`: Executa o linter para verificar a qualidade do código.

## 🤝 Contribuições

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do Projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Faça o Commit de suas alterações (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request

## 📄 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.
