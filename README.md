# Plurivo

Plataforma SaaS modular para gestao operacional, organizada em modulos independentes com uma base compartilhada de autenticacao, tipos, constantes, componentes UI e tokens visuais.

O ponto central da arquitetura atual e:

- `platform-shell` cuida do login, sessao central e portal de modulos.
- `vox-observatory` e `coop-manager` consomem o token central `platform-token`.
- Cada API valida o token no backend com Firebase Admin.
- Cada modulo web deve reutilizar `shared/auth`, `shared/ui`, `shared/design` e `shared/constants/modules`.
- A diferenca visual entre produtos deve ser a paleta de cores do tema.

## Modulos atuais

| Modulo | Web | API | Responsabilidade |
| --- | --- | --- | --- |
| Platform Shell | `http://localhost:3001` | `http://localhost:3000/api` | Login central, portal, usuarios e permissao de acesso aos modulos. |
| Pesquisas e Insights (`vox-observatory`) | `http://localhost:3003` | `http://localhost:3002` | Pesquisas, descobertas, indicadores e inteligencia organizacional. |
| Pessoas e Unidades (`coop-manager`) | `http://localhost:3005` | `http://localhost:3004/api` | Pessoas, unidades, cargos, vagas, usuarios e indicadores operacionais. |

## Stack

- Monorepo: `pnpm workspaces`
- Frontend: Next.js App Router
- Backend: Fastify
- Linguagem: TypeScript
- Validacao: Zod + Zod Type Provider
- Banco/Auth: Firebase Auth + Firestore + Firebase Admin
- UI: Tailwind CSS v4 + componentes em `shared/ui`
- Icones: `lucide-react`

## Estrutura

```txt
modules/
  platform-shell/
    api/
    web/
  vox-observatory/
    api/
    web/
  coop-manager/
    api/
    web/
  template-new-modules/
    api/
    web/

shared/
  auth/
  constants/
  design/
  firebase/
  hooks/
  lib/
  services/
  types/
  ui/
  utils/
  validations/
```

## Como rodar

Instale as dependencias:

```bash
pnpm install
```

Suba todos os servicos:

```bash
pnpm dev
```

Ou rode por produto:

```bash
pnpm dev:platform
pnpm dev:vox
pnpm dev:coop
```

Scripts por camada:

```bash
pnpm dev:platform:api
pnpm dev:platform:web
pnpm dev:vox:api
pnpm dev:vox:web
pnpm dev:coop:api
pnpm dev:coop:web
```

Verificacoes:

```bash
pnpm typecheck
pnpm build
```

Observacao: alguns pacotes ainda precisam ter scripts de `lint` padronizados. Ver a secao "Revisao atual".

## Autenticacao e SSO

A autenticacao oficial fica em `shared/auth`.

Regras obrigatorias:

- Nao criar `AuthContext`, `useAuth`, `AuthProvider` ou `PrivateRoute` locais em modulos.
- Login pertence ao `platform-shell`.
- Modulos consomem `platform-token`.
- APIs validam o token no backend usando Firebase Admin.
- Usuario inativo nao pode acessar rotas privadas.
- Usuario sem permissao de modulo deve receber `403`.
- Frontend pode esconder elementos, mas a autorizacao real deve acontecer na API.

Fluxo atual:

1. Usuario acessa `platform-shell/web`.
2. Login usa Firebase Auth.
3. Platform valida o perfil em `platform-shell/api`.
4. Token e salvo como `platform-token`.
5. Portal abre os modulos com handoff do token.
6. Vox e Coop validam `/users/me` ou `/auth/me` nas suas APIs.

Arquivos principais:

- `shared/auth/auth-provider.tsx`
- `shared/auth/auth-context.tsx`
- `shared/auth/private-route.tsx`
- `modules/platform-shell/web/src/components/login-form.tsx`
- `modules/vox-observatory/web/src/components/auth/sso-token-handoff.tsx`
- `modules/coop-manager/web/src/components/SsoTokenHandoff.tsx`

## Modulos e URLs

Toda configuracao de modulo deve vir de:

```txt
shared/constants/modules.ts
```

Usar sempre:

- `MODULE_IDS`
- `MODULE_URLS`
- `MODULE_CONFIGS`
- `ModuleId`
- `isModuleId`

Evitar strings soltas como `"vox-observatory"` ou URLs hardcoded espalhadas pelo codigo.

## Funcionalidades atuais

### Platform Shell

- Login central com Firebase Auth.
- Portal de acesso aos modulos habilitados para o usuario.
- Cadastro e edicao de usuarios por perfil administrativo.
- Controle de `role`, status, unidade e permissoes por modulo.
- Handoff seguro do `platform-token` para os modulos.

### Pessoas e Unidades (`coop-manager`)

- Dashboard operacional com indicadores por escopo de acesso.
- Cadastro, edicao, listagem e exclusao de unidades.
- Cadastro, edicao, listagem e exclusao de cooperados.
- Cadastro, edicao, listagem e exclusao de cargos.
- Controle de vagas por cargo, com ocupacao calculada por cooperados ativos.
- Seed automatico dos cargos padrao quando a colecao ainda esta vazia.
- Validacao de CPF, datas, campos obrigatorios e normalizacao de texto.
- Escopo por unidade para usuarios que nao sao `SUPER`.

Cargos padrao:

| Cargo | Limite de vagas |
| --- | ---: |
| Presidente | 1 |
| Diretor Administrativo | 1 |
| Diretor Financeiro | 1 |
| Coordenador de Mobilizacao | 1 |
| Coordenador de Producao | 1 |
| Coordenador de Administracao | 1 |
| Conselho Fiscal | 3 |
| Operacao | 100 |

### Pesquisas e Insights (`vox-observatory`)

- Dashboard do observatorio.
- Pesquisas, analises e telas internas protegidas por SSO.
- Validacao do token no backend e redirecionamento para login central quando necessario.

## Design System

A base visual compartilhada fica em:

```txt
shared/design/
  system.css
  themes/
    platform.css
    vox.css
    coop.css

shared/ui/
  app-layout.tsx
  button.tsx
  card.tsx
  dialog.tsx
  input.tsx
  table.tsx
  data-table.tsx
  ...
```

Cada app web deve importar a base e seu tema:

```css
@import "tailwindcss";
@import "../../../../../shared/design/system.css";
@import "../../../../../shared/design/themes/platform.css";

@source "../../../../../shared";
@source "./**/*.{js,ts,jsx,tsx,mdx}";
@source "../**/*.{js,ts,jsx,tsx,mdx}";
```

Para Vox:

```css
@import "../../../../../shared/design/themes/vox.css";
```

Para Coop:

```css
@import "../../../../../shared/design/themes/coop.css";
```

Tokens obrigatorios em componentes:

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `text-muted-foreground`
- `border-border`
- `bg-primary`
- `text-primary`
- `text-primary-foreground`
- `bg-accent`
- `text-accent-foreground`
- `ring-ring`

Evitar em novas telas:

- `bg-white`
- `text-black`
- `border-gray-200`
- `text-slate-*`
- `bg-emerald-*`
- paletas fixas dentro do modulo

## Padrao de tela

Para paginas principais, usar o esqueleto compartilhado quando fizer sentido:

```tsx
import {
  AppContainer,
  AppGradient,
  AppHeader,
  AppHeaderInner,
  AppSection,
  AppShell,
} from "@shared/ui/app-layout";

export function Page() {
  return (
    <AppShell>
      <AppHeader>
        <AppHeaderInner>{/* titulo e acoes */}</AppHeaderInner>
      </AppHeader>

      <AppSection>
        <AppGradient />
        <AppContainer>{/* conteudo */}</AppContainer>
      </AppSection>
    </AppShell>
  );
}
```

## Backend e Clean Architecture

Padrao esperado para novas features de API:

```txt
src/modules/[dominio]/
  domain/
    entities/
    repositories/
  application/
    use-cases/
  infra/
    persistence/
  [dominio].controller.ts
  [dominio].routes.ts
  [dominio].schema.ts
```

Regras:

- Controller apenas orquestra entrada e saida.
- Use Case concentra regra de negocio.
- Repositorio esconde persistencia.
- Rotas fazem composicao de dependencias.
- Schemas Zod ficam proximos das rotas.
- APIs usam Fastify, nao Express.
- Rotas privadas usam `app.authenticate`.
- Autorizacao e RBAC devem ser validados no backend.

## Seguranca

Prioridades do projeto:

- Manter `.env.local` fora do Git.
- Manter `firebase-key.json` fora do Git.
- Rotacionar credenciais se alguma chave real ja tiver sido publicada.
- Nunca expor senha, hash, tokens ou secrets em respostas de API.
- Validar `moduleId` com `isModuleId` quando vier de dado externo.
- Validar permissoes por modulo no backend.
- Garantir escopo de `unidadeId` para usuarios `ADMIN`.
- Retornar `401` para token ausente/invalido e `403` para falta de permissao.

Arquivos locais de segredo esperados:

```txt
.env
firebase-key.json
modules/*/api/.env.local
modules/*/web/.env.local
```

Esses arquivos devem existir apenas no ambiente local ou em secrets do provedor de deploy.

## Variaveis e deploy

A configuracao atual usa os nomes Plurivo, Research e People. Consulte o guia completo de servicos, comandos, variaveis e ordem de migracao em [Deploy no Render e Vercel](docs/DEPLOYMENT_RENDER_VERCEL.md).

- `NEXT_PUBLIC_*` e usado somente nos frontends da Vercel.
- APIs no Render usam `NODE_VERSION`, `CORS_ORIGINS` e `GOOGLE_APPLICATION_CREDENTIALS`.
- O Render injeta `PORT` automaticamente.
- Variaveis antigas continuam aceitas apenas como fallback temporario.

## Revisao atual do projeto

Estado positivo:

- SSO centralizado ja esta funcionando para Platform, Vox e Coop.
- `shared/auth` e a fonte principal de autenticacao no frontend.
- APIs de Vox e Coop ja validam token Firebase no backend.
- `shared/constants/modules.ts` centraliza IDs e URLs dos modulos.
- Primeira base de Design System compartilhado ja existe em `shared/design`.
- Coop e Platform ja estao mais alinhados visualmente com tokens.
- Vox esta funcional e e a base visual mais madura para evolucao fina.
- Coop Manager ja possui fluxos operacionais para unidades, cooperados e cargos.
- Coop Manager ja valida CPF, datas e disponibilidade de vagas por cargo no backend.
- Variaveis locais de deploy foram documentadas em arquivo privado e `.env` esta ignorado pelo Git.

Pontos de atencao:

- Revisar scripts de `lint` dos apps Next, pois alguns ainda usam formatos antigos e podem precisar de padronizacao futura.
- Existem estruturas legadas/adapters em Platform (`src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`) que hoje reexportam `shared/auth`; manter apenas enquanto houver compatibilidade necessaria.
- Coop API tem mistura de estilos: algumas partes seguem Clean Architecture, outras ainda usam service/controller mais direto.
- Vox API esta mais organizada em camadas, mas ainda precisa revisao fina de autorizacao por acao.
- O template de novos modulos existe, mas ainda precisa ser atualizado para o padrao SSO + Design System atual.
- A gestao de cargos do Coop esta funcional, mas ainda pode evoluir para historico de ocupacao, auditoria e movimentacoes.

Melhorias recomendadas, em ordem:

1. Testar fluxos principais dos tres produtos com usuario `SUPER`, `ADMIN` e `USER`.
2. Padronizar scripts de `lint` e `typecheck` em todos os pacotes.
3. Migrar telas internas restantes do Vox para os componentes/tokens compartilhados.
4. Consolidar tabelas do Coop usando `shared/ui/table` ou `shared/ui/data-table`.
5. Revisar RBAC por endpoint e criar testes de autorizacao.
6. Evoluir Coop Manager com historico/auditoria para mudancas de cargo, unidade e status.
7. Atualizar `template-new-modules` para servir como scaffold oficial.
8. Adicionar CI com `pnpm typecheck`, `pnpm build` e checagem de secrets.

## Checklist para novas alteracoes

Antes de finalizar uma alteracao:

- `pnpm typecheck`
- `pnpm build`
- Tela abre sem erro runtime.
- Usuario sem token vai para login central.
- Usuario com token valido acessa modulo permitido.
- Usuario sem permissao recebe `403` ou estado visual adequado.
- API nao confia em `role`, `moduleId` ou `unidadeId` vindos do frontend.
- Componentes usam `shared/ui`.
- Cores usam tokens do tema.
- Tailwind inclui `@source "../../../../../shared"`.

## Troubleshooting

Botao/modal/tabela aparece sem estilo:

- Conferir `@source "../../../../../shared"` no `globals.css`.
- Reiniciar o dev server.

Modulo redireciona para login mesmo logado:

- Conferir se `platform-token` existe no navegador.
- Conferir se a API do modulo responde `/auth/me` ou `/users/me`.
- Conferir se o usuario tem permissao para o `moduleId` correto.

API retorna `404` no modulo:

- Conferir se a chamada esta indo para a porta da API ou da web.
- Coop API local: `3004/api`.
- Coop Web local: `3005`.
- Vox API local: `3002`.
- Vox Web local: `3003`.

API retorna `401`:

- Token ausente, expirado ou invalido.
- Fazer login novamente pelo Platform Shell.

API retorna `403`:

- Usuario existe, mas esta inativo ou sem permissao para o modulo/acao.

## Comandos uteis no Windows

Encerrar processos Node travados:

```powershell
taskkill /F /IM node.exe
```

Ver arquivos alterados:

```bash
git status --short
```

Ver portas em uso:

```powershell
netstat -ano | findstr :300
```

## Regra para evolucao

Novos modulos devem nascer com:

- SSO via `shared/auth`.
- IDs e URLs em `shared/constants/modules.ts`.
- Tema em `shared/design/themes/[modulo].css`.
- Componentes vindos de `shared/ui`.
- API Fastify com Clean Architecture.
- RBAC validado no backend.
- Tailwind v4 escaneando `shared`.

Manter o monorepo simples, modular e previsivel e mais importante do que criar abstracoes genericas cedo demais.
