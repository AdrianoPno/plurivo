# Coop Manager Web

Frontend Next.js do modulo Coop Manager.

Este app faz parte do monorepo Recicleiros Platform e deve ser acessado pelo fluxo de SSO do `platform-shell`. Ele nao possui login proprio.

## Responsabilidades

- Dashboard operacional do modulo de cooperados.
- Cadastro e manutencao de cooperados.
- Cadastro e manutencao de unidades.
- Cadastro e manutencao de cargos e limites de vagas.
- Exibicao de vagas disponiveis por cargo ao cadastrar ou editar cooperado.
- Consumo do token central `platform-token` via `shared/auth`.

## Rodando localmente

Na raiz do monorepo:

```bash
pnpm install
pnpm dev:coop:web
```

O app roda em:

```txt
http://localhost:3005
```

Para o fluxo completo, rode tambem:

```bash
pnpm dev:platform
pnpm dev:coop:api
```

## Variaveis de ambiente

Arquivo local recomendado:

```txt
modules/coop-manager/web/.env.local
```

Variaveis principais:

```txt
NEXT_PUBLIC_COOP_MANAGER_WEB_URL=http://localhost:3005
NEXT_PUBLIC_COOP_MANAGER_API_URL=http://localhost:3004/api
NEXT_PUBLIC_PLATFORM_SHELL_WEB_URL=http://localhost:3001

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Em producao, essas variaveis devem ser configuradas na Vercel. Toda alteracao em `NEXT_PUBLIC_*` exige novo deploy.

## Build

```bash
pnpm --filter=coop-manager-web build
```

## Deploy na Vercel

Configuracao recomendada:

- Framework Preset: `Next.js`
- Root Directory: `modules/coop-manager/web`
- Install Command: `pnpm install`
- Build Command: `pnpm build`
- Node.js: 20.x ou versao suportada pelo projeto

URL atual de producao:

```txt
https://coop-manager-web.vercel.app
```

## Padroes obrigatorios

- Autenticacao via `shared/auth`.
- Layout protegido por `PrivateRoute`.
- URLs vindas de `shared/constants/modules`.
- Componentes preferencialmente vindos de `shared/ui`.
- Tokens de tema vindos de `shared/design`.
- Sem `AuthContext`, `useAuth`, `AuthProvider` ou `PrivateRoute` locais.

## API esperada

O app consome a API do Coop Manager por:

```txt
NEXT_PUBLIC_COOP_MANAGER_API_URL
```

Rotas principais:

- `/auth/me`
- `/dashboard`
- `/cooperados`
- `/unidades`
- `/cargos`
