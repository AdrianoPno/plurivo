# Deploy do Plurivo

Este documento descreve a configuracao de producao dos tres frontends na Vercel e das tres APIs no Render.

## Nomes e URLs planejados

| Produto | Provedor | Nome do projeto/servico | URL planejada |
| --- | --- | --- | --- |
| Plurivo Web | Vercel | `plurivo-web` | `https://plurivo-web.vercel.app` |
| Plurivo API | Render | `plurivo-api` | `https://plurivo-api.onrender.com/api` |
| Research Web | Vercel | `plurivo-research-web` | `https://plurivo-research-web.vercel.app` |
| Research API | Render | `plurivo-research-api` | `https://plurivo-research-api.onrender.com` |
| People Web | Vercel | `plurivo-people-web` | `https://plurivo-people-web.vercel.app` |
| People API | Render | `plurivo-people-api` | `https://plurivo-people-api.onrender.com/api` |

Se o provedor atribuir uma URL diferente, use a URL efetivamente exibida no painel em todas as variaveis abaixo.

## Configuracao comum no Render

- Repository: `https://github.com/AdrianoPno/plurivo`
- Root Directory: vazio
- Runtime: Node
- Branch de producao recomendada: `main`
- Auto-Deploy: habilitado depois de validar o primeiro deploy

### O que cadastrar em cada servico

Em **cada um dos tres servicos** (`plurivo-api`, `plurivo-research-api` e `plurivo-people-api`), abra `Environment` e cadastre exatamente:

```env
NODE_VERSION=20.20.2
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/firebase-key.json
CORS_ORIGINS=https://plurivo-web.vercel.app,https://plurivo-research-web.vercel.app,https://plurivo-people-web.vercel.app
```

Resumo por servico:

| Servico Render | `NODE_VERSION` | `GOOGLE_APPLICATION_CREDENTIALS` | `CORS_ORIGINS` |
| --- | --- | --- | --- |
| `plurivo-api` | `20.20.2` | `/etc/secrets/firebase-key.json` | URLs dos tres frontends |
| `plurivo-research-api` | `20.20.2` | `/etc/secrets/firebase-key.json` | URLs dos tres frontends |
| `plurivo-people-api` | `20.20.2` | `/etc/secrets/firebase-key.json` | URLs dos tres frontends |

Depois, em **cada servico**, abra `Environment > Secret Files` e crie:

```text
Filename: firebase-key.json
Contents: conteudo completo do JSON da conta de servico Firebase
```

O nome do Secret File e o caminho de `GOOGLE_APPLICATION_CREDENTIALS` precisam corresponder. Nao cole o JSON diretamente em uma variavel, nao use prefixo `NEXT_PUBLIC_` e nao envie esse arquivo ao Git.

### CORS durante a migracao

Enquanto os frontends antigos ainda estiverem ativos, use temporariamente este valor nos tres servicos:

```env
CORS_ORIGINS=https://recicleiros-platform-web.vercel.app,https://vox-observatory-web.vercel.app,https://coop-manager-web.vercel.app,https://plurivo-web.vercel.app,https://plurivo-research-web.vercel.app,https://plurivo-people-web.vercel.app
```

Quando os tres frontends Plurivo estiverem publicados e testados, remova as URLs antigas e mantenha apenas:

```env
CORS_ORIGINS=https://plurivo-web.vercel.app,https://plurivo-research-web.vercel.app,https://plurivo-people-web.vercel.app
```

O Render injeta `PORT` automaticamente. Nao configure `PORT` em producao.

As APIs nao precisam conhecer a propria URL. Variaveis `NEXT_PUBLIC_*` pertencem somente aos frontends na Vercel.

Portanto, **nao cadastre no Render**:

```text
NEXT_PUBLIC_PLURIVO_API_URL
NEXT_PUBLIC_RESEARCH_API_URL
NEXT_PUBLIC_PEOPLE_API_URL
```

## Plurivo API no Render

Build Command:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm --filter=platform-shell-api... build
```

Start Command:

```bash
pnpm --filter=platform-shell-api start
```

Health check:

```text
https://plurivo-api.onrender.com/api/health
```

## Research API no Render

Build Command:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm --filter=./modules/vox-observatory/api... build
```

Start Command:

```bash
pnpm --filter=./modules/vox-observatory/api start
```

Health check:

```text
https://plurivo-research-api.onrender.com/health
```

## People API no Render

Build Command:

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm --filter=coop-manager-api... build
```

Start Command:

```bash
pnpm --filter=coop-manager-api start
```

Health check:

```text
https://plurivo-people-api.onrender.com/api/health
```

## Plurivo Web na Vercel

- Project Name: `plurivo-web`
- Framework Preset: Next.js
- Root Directory: `modules/platform-shell/web`
- Include files outside Root Directory: habilitado

```env
NEXT_PUBLIC_PLURIVO_WEB_URL=https://plurivo-web.vercel.app
NEXT_PUBLIC_PLURIVO_API_URL=https://plurivo-api.onrender.com/api
NEXT_PUBLIC_RESEARCH_WEB_URL=https://plurivo-research-web.vercel.app
NEXT_PUBLIC_RESEARCH_API_URL=https://plurivo-research-api.onrender.com
NEXT_PUBLIC_PEOPLE_WEB_URL=https://plurivo-people-web.vercel.app
NEXT_PUBLIC_PEOPLE_API_URL=https://plurivo-people-api.onrender.com/api
```

Adicione tambem todas as variaveis publicas do Firebase Client:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Research Web na Vercel

- Project Name: `plurivo-research-web`
- Framework Preset: Next.js
- Root Directory: `modules/vox-observatory/web`
- Include files outside Root Directory: habilitado

```env
NEXT_PUBLIC_PLURIVO_WEB_URL=https://plurivo-web.vercel.app
NEXT_PUBLIC_PLURIVO_API_URL=https://plurivo-api.onrender.com/api
NEXT_PUBLIC_RESEARCH_WEB_URL=https://plurivo-research-web.vercel.app
NEXT_PUBLIC_RESEARCH_API_URL=https://plurivo-research-api.onrender.com
```

Inclua as variaveis `NEXT_PUBLIC_FIREBASE_*` usadas pelo projeto.

## People Web na Vercel

- Project Name: `plurivo-people-web`
- Framework Preset: Next.js
- Root Directory: `modules/coop-manager/web`
- Include files outside Root Directory: habilitado

```env
NEXT_PUBLIC_PLURIVO_WEB_URL=https://plurivo-web.vercel.app
NEXT_PUBLIC_PLURIVO_API_URL=https://plurivo-api.onrender.com/api
NEXT_PUBLIC_PEOPLE_WEB_URL=https://plurivo-people-web.vercel.app
NEXT_PUBLIC_PEOPLE_API_URL=https://plurivo-people-api.onrender.com/api
```

Inclua as variaveis `NEXT_PUBLIC_FIREBASE_*` usadas pelo projeto.

## Ordem segura de migracao

1. Crie as tres APIs novas no Render sem excluir as antigas.
2. Configure Secret File, variaveis, build e start de cada API.
3. Valide os tres health checks.
4. Crie ou renomeie os projetos web na Vercel.
5. Cadastre as novas variaveis `NEXT_PUBLIC_*` em Production e Preview.
6. Faca redeploy dos tres frontends.
7. Teste login, troca entre modulos, CORS e operacoes de leitura e escrita.
8. Atualize dominios autorizados no Firebase Authentication, se necessario.
9. Exclua os servicos antigos somente depois dos testes de producao.

## Variaveis antigas

Durante a migracao, o codigo ainda aceita as variaveis antigas como fallback. Nao as utilize em servicos novos:

```text
NEXT_PUBLIC_PLATFORM_SHELL_*
NEXT_PUBLIC_VOX_OBSERVATORY_*
NEXT_PUBLIC_COOP_MANAGER_*
```

Depois que todos os ambientes estiverem usando os nomes novos, os fallbacks poderao ser removidos em uma versao posterior.
