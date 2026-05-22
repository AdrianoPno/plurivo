# ♻️ Recicleiros Platform - Monorepo

## 📌 Visão Geral

Este é o monorepo central da plataforma Recicleiros, gerenciado via `pnpm workspaces`.

A plataforma é organizada em **módulos independentes**, cada um com sua própria API e Web App quando necessário, mas compartilhando uma base comum de tipos, autenticação, componentes de UI, padrões de arquitetura e tokens visuais.

A regra principal do projeto é:

> Todo novo módulo deve seguir o mesmo padrão arquitetural, visual e estrutural já aplicado no `platform-shell`, variando apenas a identidade visual do módulo, principalmente as cores.

### Módulos atuais

| Módulo              | Descrição                                                                                  |
| :------------------ | :----------------------------------------------------------------------------------------- |
| **Platform Shell**  | Portal principal de entrada, autenticação, gerenciamento de usuários e acesso aos módulos. |
| **Vox Observatory** | Módulo de inteligência de pesquisa e laboratório de dados.                                 |
| **Coop Manager**    | Módulo de gerenciamento de cooperados e unidades operacionais.                             |

---

## 🛠️ Stack Tecnológica Global

Para garantir interoperabilidade, reaproveitamento de código e consistência entre módulos, todos os módulos devem utilizar a stack abaixo.

| Camada                     | Tecnologia                                |
| :------------------------- | :---------------------------------------- |
| **Gerenciador de pacotes** | `pnpm` v10+                               |
| **Monorepo**               | `pnpm workspaces`                         |
| **Linguagem**              | `TypeScript` v6+                          |
| **Backend Framework**      | `Fastify`                                 |
| **Frontend Framework**     | `Next.js` v15+ com App Router             |
| **Estilização**            | `Tailwind CSS` v4+                        |
| **Componentes UI**         | Componentes compartilhados em `shared/ui` |
| **Validação / Schema**     | `Zod`                                     |
| **Formulários**            | `react-hook-form` + `zodResolver`         |
| **Data Fetching Web**      | `@tanstack/react-query`                   |
| **Banco de Dados**         | `Google Firestore` via Firebase Admin     |
| **Autenticação**           | `Firebase Auth` + JWT interno             |
| **Ícones**                 | `lucide-react`                            |

---

## 🧱 Organização do Monorepo

A estrutura geral deve seguir o padrão abaixo:

```text
recicleiros-platform/
├── modules/
│   ├── platform-shell/
│   │   ├── api/
│   │   └── web/
│   ├── vox-observatory/
│   │   ├── api/
│   │   └── web/
│   └── coop-manager/
│       ├── api/
│       └── web/
├── shared/
│   ├── auth/
│   ├── constants/
│   ├── lib/
│   ├── types/
│   └── ui/
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

### Responsabilidades principais

| Pasta                  | Responsabilidade                                                                                    |
| :--------------------- | :-------------------------------------------------------------------------------------------------- |
| `modules/[module]/api` | API Fastify do módulo.                                                                              |
| `modules/[module]/web` | Frontend Next.js do módulo.                                                                         |
| `shared/auth`          | Contextos, providers, guards e utilitários de autenticação.                                         |
| `shared/constants`     | Configurações compartilhadas, como catálogo de módulos.                                             |
| `shared/types`         | Tipos globais, como usuário, permissões e papéis.                                                   |
| `shared/lib`           | Funções utilitárias compartilhadas, como `cn`.                                                      |
| `shared/ui`            | Componentes visuais reutilizáveis, como `Button`, `Card`, `Dialog`, `Input`, `Select`, `DataTable`. |

---

## 🏗️ Padrão Arquitetural Obrigatório para APIs

Toda nova API ou funcionalidade de backend deve seguir Clean Architecture.

O objetivo é separar regra de negócio, orquestração, persistência e camada HTTP.

### Estrutura obrigatória de um módulo API

```text
src/modules/[nome-do-modulo]/
├── domain/
│   ├── entities/
│   └── repositories/
├── application/
│   └── use-cases/
├── infra/
│   └── persistence/
├── [modulo].controller.ts
├── [modulo].routes.ts
└── [modulo].schema.ts
```

### Responsabilidade de cada camada

| Camada                  | Responsabilidade                                                                            |
| :---------------------- | :------------------------------------------------------------------------------------------ |
| `domain/entities`       | Regras de negócio puras e tipos de domínio. Não deve depender de Fastify, Firebase ou HTTP. |
| `domain/repositories`   | Contratos de persistência. Deve conter interfaces, não implementações concretas.            |
| `application/use-cases` | Casos de uso com uma responsabilidade clara. Deve receber dependências por construtor.      |
| `infra/persistence`     | Implementações concretas dos repositórios, por exemplo Firestore.                           |
| `controller`            | Traduz HTTP para caso de uso. Não deve conter regra de negócio pesada.                      |
| `routes`                | Registra rotas, schemas, autenticação e faz a composição das dependências.                  |
| `schema`                | Schemas Zod para validação de `body`, `params` e `query`.                                   |

### Regras obrigatórias

- Não instanciar persistência dentro de Use Cases.
- Não instanciar Use Cases dentro dos métodos do Controller.
- A composição de dependências deve acontecer no arquivo de rotas do módulo.
- Usar `AppError` para erros controlados.
- Usar o `errorHandler` global.
- Usar `withTypeProvider<ZodTypeProvider>()` nas rotas Fastify.
- Registrar schemas Zod nas rotas para validação e documentação.
- Não usar middlewares no estilo Express.
- Não deixar `req.user` sem tipagem.

---

## 🔐 Segurança, RBAC e Multi-tenancy

A plataforma usa RBAC por módulo e por unidade.

### Papéis globais

| Papel    | Descrição                                                                                      |
| :------- | :--------------------------------------------------------------------------------------------- |
| `SUPER`  | Acesso total a todos os módulos e unidades. Uso restrito para gerência e desenvolvedores core. |
| `ADMIN`  | Acesso administrativo dentro dos módulos permitidos, respeitando a própria `unidadeId`.        |
| `USER`   | Acesso operacional conforme permissões específicas do módulo.                                  |
| `VIEWER` | Acesso preferencialmente de leitura, quando aplicável ao módulo.                               |

### Regras obrigatórias

- Toda rota protegida deve usar autenticação.
- Toda ação sensível deve validar papel e permissão.
- Usuário `ADMIN` não deve acessar dados de outra `unidadeId`, exceto quando regra explícita permitir.
- Usuário `SUPER` pode acessar todos os módulos e unidades.
- Permissões específicas do usuário devem ser consideradas no acesso a módulos.
- O frontend pode esconder ações, mas a API sempre deve validar autorização novamente.

---

## 🎨 Padrão Visual Obrigatório para Web Apps

Todos os frontends devem seguir o mesmo padrão visual implementado no `platform-shell`.

A única diferença visual esperada entre módulos deve ser a **paleta de cores do módulo**.

### Direção visual

O visual base do projeto é:

> Plataforma enterprise, modular, limpa, com cards bem definidos, header consistente, espaçamento generoso, bordas suaves, sombras discretas e hierarquia visual clara.

### Regras de layout

Toda página principal de módulo deve seguir este padrão:

```text
main.min-h-screen.bg-background
├── header.sticky.top-0
│   └── wrapper mx-auto max-w-7xl px-6
└── section.relative.overflow-hidden
    ├── background radial-gradient
    └── wrapper mx-auto max-w-7xl px-6 py-10/py-12/py-16
```

### Não usar `container` como base principal de layout

Evite depender de:

```tsx
<div className="container mx-auto">
```

Preferir:

```tsx
<div className="mx-auto max-w-7xl px-6">
```

Motivo: no Tailwind v4 e na estrutura do monorepo, `max-w-7xl px-6` dá mais previsibilidade visual e evita telas desalinhadas quando a configuração de `container` não é aplicada como esperado.

---

## 🧩 Padrão de Página Principal de Módulo

Toda home ou dashboard de módulo deve ter:

1. Header fixo ou sticky.
2. Ícone do módulo em bloco visual.
3. Título claro.
4. Descrição curta.
5. Ações no canto direito.
6. Área de conteúdo com `max-w-7xl`.
7. Background sutil com radial gradients.
8. Cards com `rounded-2xl` ou `rounded-3xl`.
9. Bordas usando `border-border/70`.
10. Sombras discretas com `shadow-sm`, `hover:shadow-xl` ou `hover:shadow-2xl`.

### Exemplo recomendado

```tsx
<main className="min-h-screen bg-background">
  <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm md:flex">
          {/* Module icon */}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Nome do Módulo
          </h1>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Descrição curta do módulo.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">{/* Ações principais */}</div>
    </div>
  </header>

  <section className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />

    <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
      {/* Conteúdo da página */}
    </div>
  </section>
</main>
```

---

## 🧱 Padrão de Cards

Cards devem parecer componentes de aplicação, não caixas HTML básicas.

### Card de módulo ou recurso

```tsx
<Link
  href={module.url}
  className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-card p-7 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
>
  <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
    {/* Icon */}
  </div>

  <div className="relative mt-7 flex-1">
    <h3 className="text-xl font-semibold tracking-tight">Título</h3>
    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
      Descrição do recurso.
    </p>
  </div>
</Link>
```

### Card comum

Usar o componente compartilhado:

```tsx
<Card className="overflow-hidden shadow-sm">
  <CardContent className="p-0">{/* Conteúdo */}</CardContent>
</Card>
```

---

## 🧰 Componentes Compartilhados

Os componentes compartilhados devem estar em `shared/ui` e serem reutilizados por todos os módulos.

### Componentes esperados

- `Button`
- `Card`
- `Dialog`
- `Input`
- `Select`
- `DropdownMenu`
- `DataTable`
- `Form`
- `Badge`, quando necessário
- `Textarea`, quando necessário

### Regras

- Não criar botão local dentro de módulo se `shared/ui/button.tsx` atende.
- Não criar modal local se `shared/ui/dialog.tsx` atende.
- Não duplicar `Card`, `Input`, `Select` ou `DataTable` em módulos.
- Componentes compartilhados devem usar tokens globais como `bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary`.
- Evitar cores fixas como `text-purple-600`, `bg-blue-500`, `border-gray-200`.
- Cores específicas de módulo devem vir dos tokens CSS do tema.

---

## 🎛️ Tailwind CSS v4 e Tokens de Tema

O projeto usa Tailwind CSS v4. O tema deve ser controlado principalmente pelo `globals.css`.

### Regra crítica para monorepo

Como os componentes ficam fora do `src` do app, todo Web App deve configurar o `@source` corretamente no `globals.css`.

Exemplo para um app em:

```text
modules/platform-shell/web/src/app/globals.css
```

O caminho correto para `shared` é:

```css
@source "../../../../../shared";
```

### Exemplo de topo do `globals.css`

```css
@import "tailwindcss";

@source "../../../../../shared";
@source "./**/*.{js,ts,jsx,tsx,mdx}";
@source "../**/*.{js,ts,jsx,tsx,mdx}";
```

Se esse caminho estiver errado, o Tailwind não gera classes usadas em `shared/ui`. Os sintomas são:

- Botões com aparência nativa do navegador.
- Modais fora do centro da tela.
- Inputs desalinhados.
- Tabelas sem espaçamento.
- Cards sem borda, sombra ou padding corretos.
- Layout com aparência de HTML cru.

### `tailwind.config.ts`

Quando existir `tailwind.config.ts`, garantir que o `content` também inclua `shared` corretamente.

Para um app em:

```text
modules/platform-shell/web/tailwind.config.ts
```

Usar:

```ts
content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "../../../shared/**/*.{js,ts,jsx,tsx,mdx}",
],
```

---

## 🎨 Cores por Módulo

A estrutura visual é a mesma entre módulos. O que muda é a paleta.

### Tokens obrigatórios

Todo módulo Web deve definir estes tokens em `:root`:

```css
:root {
  --background: 240 8% 97%;
  --foreground: 240 10% 12%;

  --card: 0 0% 100%;
  --card-foreground: 240 10% 12%;

  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 12%;

  --primary: 251 35% 24%;
  --primary-foreground: 0 0% 100%;

  --secondary: 240 7% 94%;
  --secondary-foreground: 240 10% 12%;

  --muted: 240 7% 94%;
  --muted-foreground: 240 5% 43%;

  --accent: 258 85% 64%;
  --accent-foreground: 0 0% 100%;

  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;

  --border: 240 8% 88%;
  --input: 240 8% 88%;
  --ring: 258 85% 64%;
}
```

### O que muda de módulo para módulo

Preferencialmente mudar apenas:

```css
--primary
--primary-foreground
--accent
--accent-foreground
--ring
```

Também pode mudar tons auxiliares se necessário, mas a base de layout, espaçamento, componentes e estrutura não deve mudar.

---

## 🧭 Platform Shell

O `platform-shell` é o portal de entrada e referência visual principal do projeto.

Ele deve conter:

- Login.
- Controle de autenticação.
- Portal de módulos.
- Gerenciamento de usuários.
- Guards de rota privada.
- Controle de sessão.
- Integração com `shared/auth`.
- Integração com `shared/ui`.

### Padrão visual do portal de módulos

- Header sticky.
- Saudação do usuário.
- Badge de permissão.
- Botões de ação no topo.
- Cards de módulos com hover.
- Grid responsivo.
- Fundo sutil com radial gradients.
- Layout com `mx-auto max-w-7xl px-6`.

### Padrão visual do gerenciamento de usuários

- Header sticky.
- Botão de voltar.
- Botão de criar usuário.
- Área explicativa no topo.
- `DataTable` dentro de `Card`.
- Modal centralizado usando `Dialog`.
- Formulário com ícones, labels, validação e espaçamento consistente.

---

## 🧾 Formulários e Modais

Formulários devem usar:

- `react-hook-form`
- `zod`
- `zodResolver`
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` de `shared/ui/form`
- `Input`, `Select`, `Dialog` de `shared/ui`

### Modal padrão

Todo modal deve ser baseado em `Dialog` de `shared/ui/dialog`.

Visual esperado:

```text
DialogContent
├── DialogHeader com borda inferior e fundo muted/40
├── Form com padding interno
├── campos com espaçamento vertical
└── DialogFooter com borda superior
```

### Regras

- Modal deve abrir centralizado.
- `DialogContent` deve usar `fixed`, `left-1/2`, `top-1/2`, `translate-x-[-50%]` e `translate-y-[-50%]` no componente base.
- Se o modal aparecer no canto da tela, verificar primeiro se o Tailwind está lendo `shared/ui`.
- Inputs devem ter altura consistente, borda, foco e padding.
- Quando usar ícones dentro de inputs, aplicar `pl-9`.
- Em edição de usuário, não enviar senha vazia para a API.
- Ao abrir modal para editar dados diferentes, usar `form.reset` dentro de `useEffect`.

---

## 📊 Tabelas

Tabelas devem usar `DataTable` compartilhado.

### Regras

- A tabela deve ficar dentro de um `Card`.
- `CardContent` pode usar `p-0` para a tabela ocupar o espaço corretamente.
- Filtro principal deve ser claro, por exemplo: `Filtrar por nome...`.
- Estados vazios devem ser tratados com texto legível.
- Ações devem ficar na última coluna.
- Evitar tabela sem borda, sem espaçamento ou com header colado.

Exemplo:

```tsx
<Card className="overflow-hidden shadow-sm">
  <CardContent className="p-0">
    <DataTable
      columns={columns}
      data={items}
      isLoading={isLoading}
      filterColumn="nome"
      filterPlaceholder="Filtrar por nome..."
    />
  </CardContent>
</Card>
```

---

## 🧭 Protocolo para Novos Módulos

Ao criar um novo módulo, seguir este checklist.

### 1. Registro no shared

- Registrar o módulo em `shared/constants/modules.ts`.
- Definir ID, nome, descrição, URL e ícone.
- Definir permissões específicas em `shared/types/user.ts`, quando necessário.
- Garantir que `SUPER` enxergue o módulo no Platform Shell.
- Garantir que usuários comuns só vejam módulos permitidos.

### 2. API

- Criar `modules/[novo-modulo]/api`.
- Seguir Clean Architecture.
- Usar Fastify + Zod Type Provider.
- Usar `AppError` e `errorHandler`.
- Implementar autenticação e RBAC.
- Respeitar `unidadeId` quando aplicável.
- Documentar rotas via schemas.

### 3. Web

- Criar `modules/[novo-modulo]/web`.
- Usar Next.js App Router.
- Usar `Providers` com React Query quando houver consumo de API.
- Usar `PrivateRoute` quando a tela for protegida.
- Configurar `globals.css` com `@source` apontando para `shared`.
- Configurar tokens de tema.
- Reutilizar `shared/ui`.
- Seguir o layout padrão com `main`, `header sticky`, `section`, `max-w-7xl`, cards e radial gradients.
- Mudar somente a paleta do módulo, principalmente `--primary`, `--accent` e `--ring`.

### 4. Scripts

- Adicionar scripts no `package.json` raiz:

```json
{
  "scripts": {
    "dev:novo:api": "pnpm --filter ./modules/novo-modulo/api dev",
    "dev:novo:web": "pnpm --filter ./modules/novo-modulo/web dev",
    "dev:novo": "pnpm --stream --filter ./modules/novo-modulo/api --filter ./modules/novo-modulo/web run dev"
  }
}
```

---

## 📝 Guia de Estilo e Padronização de Código

### Imports

Sempre utilizar extensões `.js` em imports relativos quando o projeto exigir compatibilidade com saída ESM:

```ts
import { createUserSchema } from "./user.schema.js";
```

Para aliases configurados, usar o alias do projeto:

```ts
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";
```

### Nomenclatura

| Item                | Padrão                                  |
| :------------------ | :-------------------------------------- |
| Pastas e arquivos   | `kebab-case`                            |
| Classes             | `PascalCase`                            |
| Interfaces          | Prefixo `I`, exemplo `IUserRepository`  |
| Componentes React   | `PascalCase`                            |
| Funções e variáveis | `camelCase`                             |
| Constantes globais  | `UPPER_SNAKE_CASE` quando fizer sentido |

### Schemas Zod

Exportar schemas como objetos nomeados contendo `body`, `params` ou `query`.

Exemplo:

```ts
export const createUserSchema = {
  body: z.object({
    nome: z.string().min(2),
    email: z.string().email(),
  }),
};
```

---

## ✅ Checklist de Revisão para IA e Assistentes de Código

Ao revisar, corrigir ou criar código neste projeto, a IA deve verificar obrigatoriamente:

### Arquitetura

- A funcionalidade respeita Clean Architecture?
- Use Case está livre de framework e persistência concreta?
- Controller está apenas orquestrando?
- Rotas fazem composição de dependência?
- Schemas Zod estão na rota?

### Segurança

- A rota exige autenticação quando necessário?
- Existe validação de papel/permissão?
- `ADMIN` respeita `unidadeId`?
- API não confia apenas no frontend?
- `req.user` está tipado?

### Frontend

- A página segue o padrão visual do `platform-shell`?
- Usa `main min-h-screen bg-background`?
- Usa `header sticky top-0`?
- Usa wrappers com `mx-auto max-w-7xl px-6`?
- Usa background com radial gradients?
- Usa `shared/ui` em vez de componentes duplicados?
- Usa tokens (`bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`)?
- Evita cores fixas?
- Botões, cards, modais e tabelas estão consistentes?
- O `globals.css` inclui `@source` correto para `shared`?
- Se um modal ou botão parecer cru, o Tailwind está escaneando `shared/ui`?

### UX

- Há estado vazio?
- Há loading state?
- Erros são tratados com `toast` ou mensagem clara?
- Ações perigosas pedem confirmação?
- Formulários exibem validações?
- Modal fecha corretamente após sucesso?
- React Query invalida a query correta após mutações?

---

## 🤖 Nota para IA e Assistentes de Código

Ao ler o contexto deste projeto, priorize sempre:

1. A arquitetura Clean Architecture para APIs.
2. A validação com Zod e Zod Type Provider.
3. A autenticação e autorização por RBAC.
4. O uso de componentes compartilhados de `shared/ui`.
5. O padrão visual implementado no `platform-shell`.
6. A configuração correta do Tailwind v4 em monorepo.
7. A criação de novos módulos seguindo a mesma estrutura visual e técnica.

### Regra mais importante para novas telas

Se o usuário pedir para criar, revisar ou corrigir uma tela, a IA deve ajustar para o padrão visual atual:

- Header sticky.
- Wrapper `mx-auto max-w-7xl px-6`.
- Background com radial gradients.
- Cards com `rounded-2xl` ou `rounded-3xl`.
- Botões usando `shared/ui/button`.
- Modais usando `shared/ui/dialog`.
- Tabelas usando `shared/ui/data-table`.
- Tokens de tema em vez de cores fixas.

### Regra mais importante para novos módulos

Se o usuário pedir para criar um novo módulo, a IA deve implementar como os módulos atuais, mantendo:

- Mesma arquitetura.
- Mesma estrutura de pastas.
- Mesmo padrão de layout.
- Mesmos componentes compartilhados.
- Mesmo sistema de autenticação e RBAC.
- Mesmo padrão de tokens CSS.

A única alteração visual esperada entre módulos deve ser a paleta de cores:

```css
--primary
--primary-foreground
--accent
--accent-foreground
--ring
```

Não sugerir Services genéricos, middlewares Express, CSS isolado fora dos tokens, componentes duplicados de UI ou telas com visual diferente do padrão consolidado.

---

## 🚀 Comandos Úteis

### Instalar dependências

```bash
pnpm install
```

### Iniciar Platform Shell

```bash
pnpm run dev:platform
```

### Iniciar todos os serviços

```bash
pnpm run dev:all
```

### Build geral

```bash
pnpm run build
```

### Typecheck geral

```bash
pnpm run typecheck
```

### Matar processos Node travados no Windows

```bash
taskkill /F /IM node.exe
```

---

## 🧪 Solução de Problemas

### Botões, modais, inputs ou tabela aparecem sem estilo

Verificar se o `globals.css` do app contém o `@source` correto para `shared`.

Para `modules/platform-shell/web/src/app/globals.css`:

```css
@source "../../../../../shared";
```

Também verificar `tailwind.config.ts`:

```ts
"../../../shared/**/*.{js,ts,jsx,tsx,mdx}";
```

Depois reiniciar o servidor:

```bash
pnpm dev:platform
```

### Modal aparece no canto da tela

Causa mais provável: classes do `Dialog` em `shared/ui/dialog.tsx` não foram geradas pelo Tailwind.

Corrigir `@source` e reiniciar o servidor.

### Layout parece colado na esquerda

Evitar `container` como dependência principal e usar:

```tsx
<div className="mx-auto max-w-7xl px-6">
```

### Alterações de tema não aparecem

Verificar:

- `globals.css` com `@theme`.
- Tokens em `:root`.
- Classe `bg-background text-foreground` no `body`.
- Reinício do servidor após mexer em `@source`.

---

## 5. Evolução Futura

A plataforma Recicleiros deve evoluir como um ecossistema modular.

Novos módulos devem ser adicionados sem quebrar o padrão visual, técnico e arquitetural existente. A escalabilidade do projeto depende de manter:

- Contratos compartilhados.
- Componentes reutilizáveis.
- Tokens visuais por módulo.
- APIs desacopladas por Clean Architecture.
- RBAC consistente.
- Configuração correta do Tailwind no monorepo.

Este documento deve ser atualizado sempre que um novo padrão estrutural, visual ou arquitetural for consolidado no projeto.
